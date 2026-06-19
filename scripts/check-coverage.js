/* eslint-disable */
/**
 * For every changed file, compare HEAD vs current: which reducer message fields
 * were shown inside a useEffect in HEAD but are no longer shown now (removed),
 * and of those, which are NOT watched by GlobalSnackbar (=> toast now broken).
 *
 *   node scripts/check-coverage.js
 */
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const parser = require("@babel/parser");
const traverseMod = require("@babel/traverse");
const traverse = traverseMod.default || traverseMod;

const ROOT = path.resolve(__dirname, "..");
const PLUGINS = ["jsx","classProperties","classPrivateProperties","classPrivateMethods","objectRestSpread","optionalChaining","nullishCoalescingOperator","dynamicImport","optionalCatchBinding","numericSeparator","logicalAssignment","exportDefaultFrom","exportNamespaceFrom","topLevelAwait"];

function parse(src) { try { return parser.parse(src, { sourceType: "module", plugins: PLUGINS }); } catch { return null; } }

// ---- watched set from GlobalSnackbar ----
const watched = new Set();
{
  const gs = fs.readFileSync(path.join(ROOT, "src/components/elements/snack_bar/GlobalSnackbar.js"), "utf8");
  const re = /\(s\)\s*=>\s*s\.([A-Za-z0-9_]+)\.([A-Za-z0-9_]+)/g;
  let m; while ((m = re.exec(gs))) watched.add(`${m[1]}.${m[2]}`);
}

function statePath(node, root) {
  if (!node) return null;
  if (node.type === "Identifier") return node.name === root ? [] : null;
  if (node.type === "MemberExpression" || node.type === "OptionalMemberExpression") {
    const base = statePath(node.object, root);
    if (base === null) return null;
    const prop = node.property && (node.property.name || node.property.value);
    return prop ? [...base, prop] : null;
  }
  return null;
}

function buildVarMap(ast) {
  const map = {};
  traverse(ast, {
    VariableDeclarator(p) {
      if (!p.node.id || p.node.id.type !== "Identifier") return;
      const init = p.node.init;
      if (!init || init.type !== "CallExpression" || !init.callee || init.callee.name !== "useSelector") return;
      const cb = init.arguments[0];
      if (!cb || !cb.params || !cb.params[0]) return;
      const root = cb.params[0].name;
      let expr = cb.body;
      if (expr.type === "BlockStatement") {
        const ret = expr.body.find((s) => s.type === "ReturnStatement");
        expr = ret && ret.argument;
      }
      const pth = statePath(expr, root);
      if (pth && pth.length) map[p.node.id.name] = pth;
    },
  });
  return map;
}

function argToKey(arg, varMap) {
  if (!arg) return null;
  if (arg.type === "Identifier") {
    const p = varMap[arg.name];
    if (p && p.length >= 2) return `${p[p.length - 2]}.${p[p.length - 1]}`;
    return null;
  }
  if (arg.type === "MemberExpression" || arg.type === "OptionalMemberExpression") {
    const obj = arg.object;
    const prop = arg.property && (arg.property.name || arg.property.value);
    if (obj.type === "Identifier" && varMap[obj.name]) {
      const p = [...varMap[obj.name], prop];
      return `${p[p.length - 2]}.${p[p.length - 1]}`;
    }
    if (obj.type === "Identifier" && prop) return `${obj.name}.${prop}`; // e.g. Authreducer.FieldX
  }
  return null;
}

// set of slice.field shown inside a useEffect
function effectShows(src) {
  const ast = parse(src);
  if (!ast) return new Set();
  const varMap = buildVarMap(ast);
  const keys = new Set();
  traverse(ast, {
    CallExpression(p) {
      if (!p.node.callee || p.node.callee.name !== "useEffect") return;
      const cb = p.node.arguments[0];
      if (!cb) return;
      traverse(cb, {
        CallExpression(q) {
          const n = q.node.callee && q.node.callee.name;
          if (n === "show" || n === "notify" || n === "showMessage") {
            const a0 = q.node.arguments[0];
            if (a0 && a0.type === "CallExpression" && a0.callee && a0.callee.name === "t") return;
            const k = argToKey(a0, varMap);
            if (k) keys.add(k);
          }
        },
      }, p.scope);
    },
  });
  return keys;
}

const files = execSync('git diff --name-only -- "*.js" "*.jsx"', { encoding: "utf8" }).split("\n").filter(Boolean);
const broken = [];
for (const f of files) {
  let headSrc;
  try { headSrc = execSync(`git show HEAD:"${f}"`, { encoding: "utf8" }); } catch { continue; }
  const curSrc = fs.existsSync(f) ? fs.readFileSync(f, "utf8") : "";
  const head = effectShows(headSrc);
  const cur = effectShows(curSrc);
  for (const k of head) {
    if (!cur.has(k) && !watched.has(k)) broken.push(`${f}  ->  ${k}`);
  }
}

console.log(`\n=== Coverage check: removed effect-shows NOT watched by GlobalSnackbar ===`);
console.log(`Watched slice.field count: ${watched.size}`);
console.log(`BROKEN (field shown in HEAD effect, removed, and not watched): ${broken.length}\n`);
broken.forEach((b) => console.log("  ✗ " + b));
console.log("");
