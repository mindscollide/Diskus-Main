/* eslint-disable */
/**
 * Remove useEffects that only display a reducer ResponseMessage (now handled by
 * the global snackbar). Effects with real side-effects are NOT touched — they
 * are reported so the toast line can be stripped manually.
 *
 *   node scripts/remove-respmsg-effects.js            # dry-run
 *   node scripts/remove-respmsg-effects.js --write    # apply
 */
const fs = require("fs");
const path = require("path");
const parser = require("@babel/parser");
const traverseMod = require("@babel/traverse");
const traverse = traverseMod.default || traverseMod;

const ROOT = path.resolve(__dirname, "..");
const SRC = path.join(ROOT, "src");
const WRITE = process.argv.includes("--write");
const fileArgIdx = process.argv.indexOf("--file");
const ONLY = fileArgIdx !== -1 ? path.resolve(ROOT, process.argv[fileArgIdx + 1]) : null;
const PLUGINS = ["jsx","classProperties","classPrivateProperties","classPrivateMethods","objectRestSpread","optionalChaining","nullishCoalescingOperator","dynamicImport","optionalCatchBinding","numericSeparator","logicalAssignment","exportDefaultFrom","exportNamespaceFrom","topLevelAwait"];
const LABEL_RE = /response|message|===|toast|snack|notif|intimation/i;

function walk(dir, out = []) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const st = fs.statSync(full);
    if (st.isDirectory()) { if (name === "node_modules" || name === "build") continue; walk(full, out); }
    else if (/\.(js|jsx)$/.test(name)) out.push(full);
  }
  return out;
}

const isShowName = (n) => n === "show" || n === "notify";
const isClearName = (n) => /(^clear|^cleare|clearmessage|clearresponse|removeresponsemessage|remove.*message|reset.*message)/i.test(n);

function isRespMsgShow(node) {
  if (!node || node.type !== "CallExpression") return false;
  if (node.callee.type !== "Identifier" || !isShowName(node.callee.name)) return false;
  const a0 = node.arguments[0];
  if (!a0) return false;
  if (a0.type === "CallExpression" && a0.callee.type === "Identifier" && a0.callee.name === "t") return false;
  if (a0.type === "StringLiteral" || a0.type === "TemplateLiteral") return false;
  return true;
}
function isSafeExpr(expr) {
  if (isRespMsgShow(expr)) return true;
  if (expr.type === "CallExpression" && expr.callee.type === "Identifier" && expr.callee.name === "dispatch") {
    const inner = expr.arguments[0];
    if (inner && inner.type === "CallExpression" && inner.callee.type === "Identifier" && isClearName(inner.callee.name)) return true;
  }
  // console.log(...) / console.error(...)
  if (expr.type === "CallExpression" && expr.callee.type === "MemberExpression" &&
      expr.callee.object.type === "Identifier" && expr.callee.object.name === "console") return true;
  return false;
}
// returns true if every statement is "safe" (only respmsg-show / clear / console)
function allSafe(stmts) {
  let ok = true;
  const walkStmt = (st) => {
    if (!ok || !st) return;
    switch (st.type) {
      case "ExpressionStatement": if (!isSafeExpr(st.expression)) ok = false; break;
      case "IfStatement": walkStmt(st.consequent); if (st.alternate) walkStmt(st.alternate); break;
      case "TryStatement": walkStmt(st.block); if (st.handler) walkStmt(st.handler.body); if (st.finalizer) walkStmt(st.finalizer); break;
      case "BlockStatement": st.body.forEach(walkStmt); break;
      case "EmptyStatement": break;
      default: ok = false;
    }
  };
  stmts.forEach(walkStmt);
  return ok;
}

const report = { removed: [], flagged: [], filesChanged: new Set() };

for (const file of walk(SRC)) {
  if (ONLY && path.resolve(file) !== ONLY) continue;
  const relCheck = path.relative(ROOT, file).replace(/\\/g, "/");
  if (/snack_bar\/(useSnackbar|GlobalSnackbar)\.js$/.test(relCheck)) continue;
  let src = fs.readFileSync(file, "utf8");
  if (!/(show|notify)\(/.test(src)) continue;
  let ast;
  try { ast = parser.parse(src, { sourceType: "module", plugins: PLUGINS }); } catch { continue; }
  const rel = path.relative(ROOT, file);
  const edits = [];

  traverse(ast, {
    CallExpression(p) {
      if (p.node.callee.type !== "Identifier" || p.node.callee.name !== "useEffect") return;
      const cb = p.node.arguments[0];
      if (!cb || !(cb.type === "ArrowFunctionExpression" || cb.type === "FunctionExpression")) return;
      let hasResp = false;
      traverse(cb, { CallExpression(q){ if (isRespMsgShow(q.node)) hasResp = true; } }, p.scope);
      if (!hasResp) return;
      const body = cb.body.type === "BlockStatement" ? cb.body.body : [cb.body];
      const line = src.slice(0, p.node.start).split("\n").length;
      if (!allSafe(body)) { report.flagged.push(`${rel}:${line}`); return; }

      // whole-effect removal: ExpressionStatement parent
      const stmt = p.parentPath && p.parentPath.node;
      if (!stmt || stmt.type !== "ExpressionStatement") { report.flagged.push(`${rel}:${line} (not a statement)`); return; }
      let start = src.lastIndexOf("\n", stmt.start - 1) + 1; // line start
      // pull in preceding label comment lines
      while (true) {
        const pe = start - 1;
        if (pe < 0) break;
        const pls = src.lastIndexOf("\n", pe - 1) + 1;
        const prevLine = src.slice(pls, pe);
        if (/^\s*\/\//.test(prevLine) && LABEL_RE.test(prevLine)) start = pls;
        else break;
      }
      let end = stmt.end;
      if (src[end] === "\r") end++;
      if (src[end] === "\n") end++;
      // consume a paired trailing "// === End ===" style closing comment
      while (true) {
        const le = src.indexOf("\n", end);
        const lineEnd = le === -1 ? src.length : le + 1;
        const nextLine = src.slice(end, lineEnd);
        if (/^\s*\/\//.test(nextLine) && /===/.test(nextLine) && /end/i.test(nextLine)) end = lineEnd;
        else break;
      }
      edits.push({ start, end, line });
    },
  });

  if (!edits.length) continue;
  edits.sort((a, b) => b.start - a.start);
  for (const e of edits) report.removed.push(`${rel}:${e.line}`);
  report.filesChanged.add(rel);
  if (WRITE) {
    let out = src;
    for (const e of edits) out = out.slice(0, e.start) + out.slice(e.end);
    out = out.replace(/(\r?\n){3,}/g, "$1$1"); // collapse blank lines (CRLF-safe)
    fs.writeFileSync(file, out, "utf8");
  }
}

console.log(`\n=== ${WRITE ? "APPLIED" : "DRY-RUN"} — remove ResponseMessage useEffects ===`);
console.log(`Effects removed: ${report.removed.length}  (files: ${report.filesChanged.size})`);
console.log(`Flagged (real side-effects, NOT removed): ${report.flagged.length}`);
report.flagged.forEach((x) => console.log("  ! " + x));
console.log("");
