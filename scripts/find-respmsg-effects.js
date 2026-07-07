/* eslint-disable */
/**
 * Find useEffects that display a reducer ResponseMessage via show()/notify().
 * Classify each as:
 *   PURE  - body only shows the message (+ dispatch clear) -> safe to delete whole effect
 *   MIXED - also does other work (navigate/setState/etc.)  -> needs manual handling
 *
 *   node scripts/find-respmsg-effects.js
 */
const fs = require("fs");
const path = require("path");
const parser = require("@babel/parser");
const traverseMod = require("@babel/traverse");
const traverse = traverseMod.default || traverseMod;

const ROOT = path.resolve(__dirname, "..");
const SRC = path.join(ROOT, "src");
const PLUGINS = ["jsx","classProperties","classPrivateProperties","classPrivateMethods","objectRestSpread","optionalChaining","nullishCoalescingOperator","dynamicImport","optionalCatchBinding","numericSeparator","logicalAssignment","exportDefaultFrom","exportNamespaceFrom","topLevelAwait"];

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
const isClearName = (n) => /clear|cleare/i.test(n);

// is this a ResponseMessage show call?  show(<non-t()-expr>, ...)
function isRespMsgShow(node) {
  if (node.type !== "CallExpression") return false;
  if (node.callee.type !== "Identifier" || !isShowName(node.callee.name)) return false;
  const a0 = node.arguments[0];
  if (!a0) return false;
  if (a0.type === "CallExpression" && a0.callee.type === "Identifier" && a0.callee.name === "t") return false; // t("...") = local literal
  if (a0.type === "StringLiteral" || a0.type === "TemplateLiteral") return false;
  return true; // Identifier / MemberExpression / etc.
}

// classify a statement list; returns {toast, clear, other:[descr]}
function classify(stmts, src) {
  const res = { toast: 0, clear: 0, other: [] };
  const handleExpr = (expr, node) => {
    if (isRespMsgShow(expr)) { res.toast++; return; }
    // dispatch(clearX())
    if (expr.type === "CallExpression" && expr.callee.type === "Identifier" && expr.callee.name === "dispatch") {
      const inner = expr.arguments[0];
      if (inner && inner.type === "CallExpression" && inner.callee.type === "Identifier" && isClearName(inner.callee.name)) { res.clear++; return; }
    }
    // a plain show(t(...)) local toast counts as "other" (keep it)
    res.other.push(src.slice(node.start, node.end).split("\n")[0].slice(0, 70));
  };
  const walkStmt = (st) => {
    if (!st) return;
    switch (st.type) {
      case "ExpressionStatement": handleExpr(st.expression, st); break;
      case "IfStatement":
        // guard condition ignored; recurse branches
        if (st.consequent) walkStmt(st.consequent);
        if (st.alternate) walkStmt(st.alternate);
        break;
      case "TryStatement":
        if (st.block) walkStmt(st.block);
        if (st.handler && st.handler.body) walkStmt(st.handler.body);
        if (st.finalizer) walkStmt(st.finalizer);
        break;
      case "BlockStatement": st.body.forEach(walkStmt); break;
      case "EmptyStatement": break;
      default: res.other.push(st.type + ": " + src.slice(st.start, st.end).split("\n")[0].slice(0, 60));
    }
  };
  stmts.forEach(walkStmt);
  return res;
}

const out = { pure: [], mixed: [], files: new Set() };

for (const file of walk(SRC)) {
  const relCheck = path.relative(ROOT, file).replace(/\\/g, "/");
  if (/snack_bar\/(useSnackbar|GlobalSnackbar)\.js$/.test(relCheck)) continue;
  const src = fs.readFileSync(file, "utf8");
  if (!/(show|notify)\(/.test(src)) continue;
  let ast;
  try { ast = parser.parse(src, { sourceType: "module", plugins: PLUGINS }); } catch { continue; }
  const rel = path.relative(ROOT, file);
  traverse(ast, {
    CallExpression(p) {
      if (p.node.callee.type !== "Identifier" || p.node.callee.name !== "useEffect") return;
      const cb = p.node.arguments[0];
      if (!cb || !(cb.type === "ArrowFunctionExpression" || cb.type === "FunctionExpression")) return;
      const body = cb.body.type === "BlockStatement" ? cb.body.body : [cb.body && cb.body.type === "ExpressionStatement" ? cb.body : null].filter(Boolean);
      // does this effect contain a respmsg show?
      let hasResp = false;
      traverse(cb, { CallExpression(q){ if (isRespMsgShow(q.node)) hasResp = true; } }, p.scope);
      if (!hasResp) return;
      const c = classify(body, src);
      const line = src.slice(0, p.node.start).split("\n").length;
      const entry = { rel, line, toast: c.toast, clear: c.clear, other: c.other };
      out.files.add(rel);
      if (c.other.length === 0) out.pure.push(entry);
      else out.mixed.push(entry);
    },
  });
}

console.log(`\n=== ResponseMessage-showing useEffects ===`);
console.log(`Files: ${out.files.size}`);
console.log(`PURE (safe to delete whole effect): ${out.pure.length}`);
console.log(`MIXED (has other side-effects): ${out.mixed.length}\n`);
console.log("--- PURE ---");
out.pure.forEach((e) => console.log(`  ${e.rel}:${e.line}  toasts=${e.toast} clears=${e.clear}`));
console.log("\n--- MIXED (other statements shown) ---");
out.mixed.forEach((e) => {
  console.log(`  ${e.rel}:${e.line}  toasts=${e.toast} clears=${e.clear} other=${e.other.length}`);
  e.other.slice(0, 3).forEach((o) => console.log(`        · ${o}`));
});
console.log("");
