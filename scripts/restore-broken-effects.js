/* eslint-disable */
/**
 * Restore the ResponseMessage useEffects that were wrongly removed — i.e. those
 * showing a reducer field that GlobalSnackbar does NOT watch. Conservative rule:
 * an effect is restored unless EVERY message it shows positively resolves to a
 * watched `.ResponseMessage` (so destructured/unresolved selectors are restored).
 * The restored effect is migrated to the file's hook var (show/notify) and
 * inserted just before the component's return.
 *
 *   node scripts/restore-broken-effects.js            # dry-run
 *   node scripts/restore-broken-effects.js --write
 */
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const parser = require("@babel/parser");
const traverseMod = require("@babel/traverse");
const traverse = traverseMod.default || traverseMod;

const ROOT = path.resolve(__dirname, "..");
const WRITE = process.argv.includes("--write");
const PLUGINS = ["jsx","classProperties","classPrivateProperties","classPrivateMethods","objectRestSpread","optionalChaining","nullishCoalescingOperator","dynamicImport","optionalCatchBinding","numericSeparator","logicalAssignment","exportDefaultFrom","exportNamespaceFrom","topLevelAwait"];
const parse = (src) => { try { return parser.parse(src, { sourceType: "module", plugins: PLUGINS }); } catch { return null; } };

const watched = new Set();
{
  const gs = fs.readFileSync(path.join(ROOT, "src/components/elements/snack_bar/GlobalSnackbar.js"), "utf8");
  let m; const re = /\(s\)\s*=>\s*s\.([A-Za-z0-9_]+)\.([A-Za-z0-9_]+)/g;
  while ((m = re.exec(gs))) watched.add(`${m[1]}.${m[2]}`);
}

function statePath(node, root) {
  if (!node) return null;
  if (node.type === "Identifier") return node.name === root ? [] : null;
  if (node.type === "MemberExpression" || node.type === "OptionalMemberExpression") {
    const base = statePath(node.object, root); if (base === null) return null;
    const prop = node.property && (node.property.name || node.property.value);
    return prop ? [...base, prop] : null;
  }
  return null;
}
function buildVarMap(ast) {
  const map = {};
  traverse(ast, { VariableDeclarator(p) {
    if (!p.node.id || p.node.id.type !== "Identifier") return;
    const init = p.node.init;
    if (!init || init.type !== "CallExpression" || !init.callee || init.callee.name !== "useSelector") return;
    const cb = init.arguments[0]; if (!cb || !cb.params || !cb.params[0]) return;
    const root = cb.params[0].name; let expr = cb.body;
    if (expr.type === "BlockStatement") { const r = expr.body.find((s) => s.type === "ReturnStatement"); expr = r && r.argument; }
    const pth = statePath(expr, root); if (pth && pth.length) map[p.node.id.name] = pth;
  }});
  return map;
}
function argToKey(arg, varMap) {
  if (!arg) return null;
  if (arg.type === "Identifier") { const p = varMap[arg.name]; return p && p.length >= 2 ? `${p[p.length-2]}.${p[p.length-1]}` : null; }
  if (arg.type === "MemberExpression" || arg.type === "OptionalMemberExpression") {
    const obj = arg.object, prop = arg.property && (arg.property.name || arg.property.value);
    if (obj.type === "Identifier" && varMap[obj.name]) { const p = [...varMap[obj.name], prop]; return `${p[p.length-2]}.${p[p.length-1]}`; }
    if (obj.type === "Identifier" && prop) return `${obj.name}.${prop}`;
  }
  return null;
}
const isMsgShow = (n) => { const nm = n.callee && n.callee.name; return nm === "show" || nm === "notify" || nm === "showMessage"; };
const firstArgLocal = (n) => { const a = n.arguments[0]; return a && a.type === "CallExpression" && a.callee && a.callee.name === "t"; };

function hookVarOf(src) { const m = src.match(/const\s*\[\s*([A-Za-z0-9_]+)\s*,\s*SnackBar\s*\]\s*=\s*useSnackbar\(/); return m ? m[1] : "show"; }

function curDepsAndReturn(src) {
  const ast = parse(src); const deps = new Set(); let retStart = null; let hookFnRetIndent = "  ";
  if (!ast) return { deps, retStart, indent: hookFnRetIndent };
  // find function containing the useSnackbar hook
  let hookFn = null;
  traverse(ast, { VariableDeclarator(p) {
    if (p.node.init && p.node.init.type === "CallExpression" && p.node.init.callee && p.node.init.callee.name === "useSnackbar") {
      const fp = p.getFunctionParent(); if (fp) hookFn = fp.node;
    }
  }});
  traverse(ast, {
    CallExpression(p) {
      if (p.node.callee && p.node.callee.name === "useEffect") {
        const d = p.node.arguments[1]; if (d) deps.add(src.slice(d.start, d.end).replace(/\s+/g, ""));
      }
    },
    ReturnStatement(p) {
      const fp = p.getFunctionParent();
      if (hookFn && fp && fp.node === hookFn && p.node.argument && (p.node.argument.type === "JSXElement" || p.node.argument.type === "JSXFragment")) {
        if (retStart === null || p.node.start < retStart) {
          retStart = p.node.start;
          const ls = src.lastIndexOf("\n", retStart - 1) + 1; hookFnRetIndent = src.slice(ls, retStart).match(/^\s*/)[0];
        }
      }
    },
  });
  return { deps, retStart, indent: hookFnRetIndent };
}

const files = execSync('git diff --name-only -- "*.js" "*.jsx"', { encoding: "utf8" }).split("\n").filter(Boolean);
const report = [];

for (const f of files) {
  let headSrc; try { headSrc = execSync(`git show HEAD:"${f}"`, { encoding: "utf8" }); } catch { continue; }
  const abs = path.join(ROOT, f); if (!fs.existsSync(abs)) continue;
  const curSrc = fs.readFileSync(abs, "utf8");
  const headAst = parse(headSrc); if (!headAst) continue;
  const varMap = buildVarMap(headAst);
  const { deps: curDeps, retStart, indent } = curDepsAndReturn(curSrc);
  if (retStart === null) continue;
  const hookvar = hookVarOf(curSrc);

  const toRestore = [];
  traverse(headAst, {
    CallExpression(p) {
      if (!p.node.callee || p.node.callee.name !== "useEffect") return;
      const cb = p.node.arguments[0]; const depsNode = p.node.arguments[1];
      if (!cb || !depsNode) return;
      const calls = [];
      let showsMsg = false; let allWatched = true;
      traverse(cb, { CallExpression(q) {
        if (isMsgShow(q.node) && !firstArgLocal(q.node) && q.node.arguments[0] &&
            q.node.arguments[0].type !== "StringLiteral" && q.node.arguments[0].type !== "TemplateLiteral") {
          showsMsg = true; calls.push(q.node);
          const k = argToKey(q.node.arguments[0], varMap);
          if (!k || !watched.has(k)) allWatched = false;
        }
      }}, p.scope);
      if (!showsMsg || allWatched) return; // only broken (non-watched) effects
      const depsText = headSrc.slice(depsNode.start, depsNode.end).replace(/\s+/g, "");
      if (curDeps.has(depsText)) return; // still present -> not removed
      const stmt = p.parentPath && p.parentPath.node;
      if (!stmt || stmt.type !== "ExpressionStatement") return;
      // build migrated text
      let text = headSrc.slice(stmt.start, stmt.end);
      const edits = calls.map((c) => {
        const a0 = c.arguments[0], a1 = c.arguments[1];
        const rep = `${hookvar}(${headSrc.slice(a0.start, a0.end)}${a1 ? `, ${headSrc.slice(a1.start, a1.end)}` : ""})`;
        return { s: c.start - stmt.start, e: c.end - stmt.start, rep };
      }).sort((x, y) => y.s - x.s);
      for (const e of edits) text = text.slice(0, e.s) + e.rep + text.slice(e.e);
      toRestore.push({ depsText, text });
    },
  });

  if (!toRestore.length) continue;
  report.push(`${f}  (+${toRestore.length})`);
  if (WRITE) {
    const block = toRestore.map((r) => indent + "// Restored: reducer field not watched by GlobalSnackbar\n" + indent + r.text.replace(/\n/g, "\n")).join("\n\n");
    const out = curSrc.slice(0, retStart) + block + "\n\n" + indent + curSrc.slice(retStart);
    fs.writeFileSync(abs, out, "utf8");
  }
}

console.log(`\n=== ${WRITE ? "APPLIED" : "DRY-RUN"} — restore non-watched ResponseMessage effects ===`);
console.log(`Files restored: ${report.length}`);
report.forEach((r) => console.log("  + " + r));
console.log("");
