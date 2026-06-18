/* eslint-disable */
/**
 * Ensure each reducer's initialState declares `errorSeverity: null`.
 * Only touches reducers that actually use errorSeverity somewhere (so pure-UI
 * reducers are left alone). Inserts after `ResponseMessage` if present, else
 * after the last property.
 *
 * Dry-run:  node scripts/reducer-initstate.js
 * Apply:    node scripts/reducer-initstate.js --write
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

const hasSeverity = (obj) =>
  obj.properties.some(
    (p) =>
      (p.type === "ObjectProperty" || p.type === "Property") &&
      p.key &&
      ((p.key.type === "Identifier" && p.key.name === "errorSeverity") ||
        (p.key.type === "StringLiteral" && p.key.value === "errorSeverity")),
  );
const findProp = (obj, name) =>
  obj.properties.find(
    (p) =>
      (p.type === "ObjectProperty" || p.type === "Property") &&
      p.key &&
      ((p.key.type === "Identifier" && p.key.name === name) ||
        (p.key.type === "StringLiteral" && p.key.value === name)),
  );

const report = { added: [], alreadyHas: [], skippedNoUse: [], noInitial: [] };

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

  const usesSeverity = /errorSeverity/.test(src);

  // find the initialState ObjectExpression: either `const initialState = {…}`
  // or a reducer function default param `(state = {…}, action)`.
  let initObj = null;
  traverse(ast, {
    VariableDeclarator(p) {
      if (
        p.node.id.type === "Identifier" &&
        /^initial/i.test(p.node.id.name) &&
        p.node.init &&
        p.node.init.type === "ObjectExpression"
      ) {
        if (!initObj) initObj = p.node.init;
      }
    },
    AssignmentPattern(p) {
      if (
        p.node.left.type === "Identifier" &&
        p.node.left.name === "state" &&
        p.node.right.type === "ObjectExpression"
      ) {
        if (!initObj) initObj = p.node.right;
      }
    },
  });

  if (!initObj) {
    report.noInitial.push(rel);
    return;
  }
  if (hasSeverity(initObj)) {
    report.alreadyHas.push(rel);
    return;
  }
  const initHasMessage = !!(
    findProp(initObj, "ResponseMessage") || findProp(initObj, "responseMessage")
  );
  if (!usesSeverity && !initHasMessage) {
    report.skippedNoUse.push(rel);
    return;
  }

  // choose insertion anchor: ResponseMessage prop if present, else last prop
  const anchor = findProp(initObj, "ResponseMessage") || findProp(initObj, "responseMessage") ||
    (initObj.properties.length ? initObj.properties[initObj.properties.length - 1] : null);
  if (!anchor) {
    report.noInitial.push(rel + " (empty initialState)");
    return;
  }
  const lineStart = src.lastIndexOf("\n", anchor.start) + 1;
  const indent = src.slice(lineStart, anchor.start).match(/^\s*/)[0];
  const afterAnchor = src.slice(anchor.end, initObj.end);
  const hasComma = /^\s*,/.test(afterAnchor);
  const insertAt = hasComma ? anchor.end + afterAnchor.indexOf(",") + 1 : anchor.end;
  const text = (hasComma ? "" : ",") + `\n${indent}errorSeverity: null,`;

  if (WRITE) {
    const out = src.slice(0, insertAt) + text + src.slice(insertAt);
    fs.writeFileSync(file, out, "utf8");
  }
  report.added.push(rel);
}

for (const f of fs.readdirSync(REDUCERS)) {
  if (/\.(js|jsx)$/.test(f) && f !== "index.js") processFile(path.join(REDUCERS, f));
}

console.log(`\n=== ${WRITE ? "APPLIED" : "DRY-RUN"} — initialState errorSeverity ===`);
console.log(`Added errorSeverity: null (${report.added.length}):`);
report.added.forEach((x) => console.log("  + " + x));
console.log(`\nAlready had it (${report.alreadyHas.length})`);
console.log(`Skipped — reducer never uses errorSeverity (${report.skippedNoUse.length}):`);
report.skippedNoUse.forEach((x) => console.log("  - " + x));
console.log(`No initialState object found (${report.noInitial.length}):`);
report.noInitial.forEach((x) => console.log("  ? " + x));
console.log("");
