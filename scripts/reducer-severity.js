/* eslint-disable */
/**
 * Audit/fix `errorSeverity` in reducer switch cases:
 *   - any case whose action type ends in _SUCCESS  -> errorSeverity: "success"
 *   - any case whose action type ends in _FAIL/_FAILURE/_ERROR -> errorSeverity: "error"
 *
 * Dry-run:  node scripts/reducer-severity.js
 * Apply:    node scripts/reducer-severity.js --write
 */
const fs = require("fs");
const path = require("path");
const parser = require("@babel/parser");
const traverseMod = require("@babel/traverse");
const traverse = traverseMod.default || traverseMod;

const ROOT = path.resolve(__dirname, "..");
const REDUCERS = path.join(ROOT, "src", "store", "reducers");
const WRITE = process.argv.includes("--write");

const PLUGINS = ["jsx", "objectRestSpread", "optionalChaining", "nullishCoalescingOperator", "classProperties"];

function caseName(test) {
  if (!test) return null; // default case
  if (test.type === "MemberExpression" && test.property)
    return test.property.name || (test.property.value ?? null);
  if (test.type === "Identifier") return test.name;
  if (test.type === "StringLiteral") return test.value;
  return null;
}

function categoryOf(name) {
  if (!name) return null;
  if (/_SUCCESS$/.test(name)) return "success";
  if (/_(FAIL|FAILURE|ERROR)$/.test(name)) return "error";
  return null;
}

function findReturnedObjects(consequentNodes) {
  // collect ObjectExpression args of ReturnStatements directly in this case
  const objs = [];
  const walk = (node) => {
    if (!node || typeof node !== "object") return;
    if (node.type === "ReturnStatement" && node.argument && node.argument.type === "ObjectExpression") {
      objs.push(node.argument);
    }
    // don't descend into nested functions
    if (/Function/.test(node.type)) return;
    for (const k of Object.keys(node)) {
      const v = node[k];
      if (Array.isArray(v)) v.forEach(walk);
      else if (v && typeof v.type === "string") walk(v);
    }
  };
  consequentNodes.forEach(walk);
  return objs;
}

function getSeverityProp(objExpr) {
  return objExpr.properties.find(
    (p) =>
      (p.type === "ObjectProperty" || p.type === "Property") &&
      p.key &&
      ((p.key.type === "Identifier" && p.key.name === "errorSeverity") ||
        (p.key.type === "StringLiteral" && p.key.value === "errorSeverity")),
  );
}
function valOf(node) {
  if (!node) return "<none>";
  if (node.type === "StringLiteral") return JSON.stringify(node.value);
  if (node.type === "NullLiteral") return "null";
  if (node.type === "Identifier") return node.name;
  return node.type;
}

const report = { wrong: [], missing: [], ok: 0, files: 0 };

function processFile(file) {
  const rel = path.relative(ROOT, file);
  const src = fs.readFileSync(file, "utf8");
  let ast;
  try {
    ast = parser.parse(src, { sourceType: "module", plugins: PLUGINS });
  } catch (e) {
    console.log("PARSE ERROR", rel, e.message.split("\n")[0]);
    return;
  }
  const edits = [];
  traverse(ast, {
    SwitchCase(p) {
      const name = caseName(p.node.test);
      const cat = categoryOf(name);
      if (!cat) return;
      const want = cat === "success" ? "success" : "error";
      const objs = findReturnedObjects(p.node.consequent);
      if (!objs.length) return; // nothing returned as object literal here
      for (const obj of objs) {
        const prop = getSeverityProp(obj);
        if (!prop) {
          report.missing.push(`${rel}  ${name}  (no errorSeverity; want "${want}")`);
          // ADD: insert after last property
          if (obj.properties.length) {
            const last = obj.properties[obj.properties.length - 1];
            const lineStart = src.lastIndexOf("\n", last.start) + 1;
            const indent = src.slice(lineStart, last.start).match(/^\s*/)[0];
            // does last prop already have a trailing comma in source?
            const afterLast = src.slice(last.end, obj.end);
            const hasComma = /^\s*,/.test(afterLast);
            const insertAt = hasComma ? last.end + afterLast.indexOf(",") + 1 : last.end;
            const text = (hasComma ? "" : ",") + `\n${indent}errorSeverity: "${want}",`;
            edits.push({ start: insertAt, end: insertAt, text });
          }
        } else {
          const v = prop.value;
          const isStr = v.type === "StringLiteral";
          if (!isStr || v.value !== want) {
            report.wrong.push(`${rel}  ${name}  errorSeverity: ${valOf(v)} -> "${want}"`);
            edits.push({ start: v.start, end: v.end, text: `"${want}"` });
          } else {
            report.ok++;
          }
        }
      }
    },
  });
  if (WRITE && edits.length) {
    edits.sort((a, b) => b.start - a.start);
    for (let i = 1; i < edits.length; i++)
      if (edits[i].end > edits[i - 1].start) {
        console.log("OVERLAP skip", rel);
        return;
      }
    let out = src;
    for (const e of edits) out = out.slice(0, e.start) + e.text + out.slice(e.end);
    fs.writeFileSync(file, out, "utf8");
  }
  report.files++;
}

for (const f of fs.readdirSync(REDUCERS)) {
  if (/\.(js|jsx)$/.test(f) && f !== "index.js") processFile(path.join(REDUCERS, f));
}

console.log(`\n=== ${WRITE ? "APPLIED" : "DRY-RUN"} — errorSeverity audit ===`);
console.log(`Files scanned: ${report.files}`);
console.log(`Already correct: ${report.ok}`);
console.log(`\nWRONG value (${report.wrong.length}):`);
report.wrong.forEach((x) => console.log("  " + x));
console.log(`\nMISSING errorSeverity (${report.missing.length}):`);
report.missing.forEach((x) => console.log("  " + x));
console.log("");
