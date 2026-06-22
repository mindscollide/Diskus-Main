/* eslint-disable */
/**
 * Codemod: convert manual `showMessage(msg, sev, setOpen)` usage to the
 * `useSnackbar` hook ( const [show, SnackBar] = useSnackbar() + {SnackBar} ).
 *
 * Usage:
 *   node scripts/snackbar-codemod.js            # dry-run, prints report
 *   node scripts/snackbar-codemod.js --write    # apply edits
 *   node scripts/snackbar-codemod.js --file <relpath> [--write]
 *
 * Strategy: Babel parses for analysis only; edits are applied as offset-based
 * string splices so original formatting is preserved and diffs stay clean.
 * Any file that doesn't match the expected shape is reported and left untouched.
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
const ONLY_FILE = fileArgIdx !== -1 ? process.argv[fileArgIdx + 1] : null;

// Files that must never be auto-converted.
const EXCLUDE = new Set(
  [
    "src/components/elements/snack_bar/utill.js",
    "src/components/elements/snack_bar/useSnackbar.js",
    "src/components/elements/snack_bar/GlobalSnackbar.js",
    "src/App.js",
  ].map((p) => p.replace(/\//g, path.sep)),
);

const PARSER_PLUGINS = [
  "jsx",
  "classProperties",
  "classPrivateProperties",
  "classPrivateMethods",
  "objectRestSpread",
  "optionalChaining",
  "nullishCoalescingOperator",
  "dynamicImport",
  "optionalCatchBinding",
  "numericSeparator",
  "logicalAssignment",
  "exportDefaultFrom",
  "exportNamespaceFrom",
  "topLevelAwait",
];

function walk(dir, out = []) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const st = fs.statSync(full);
    if (st.isDirectory()) {
      if (name === "node_modules" || name === "build") continue;
      walk(full, out);
    } else if (/\.(js|jsx)$/.test(name)) {
      out.push(full);
    }
  }
  return out;
}

function leadingIndent(src, offset) {
  let i = offset;
  while (i > 0 && src[i - 1] !== "\n") i--;
  let ws = "";
  while (i < src.length && (src[i] === " " || src[i] === "\t")) {
    ws += src[i];
    i++;
  }
  return ws;
}

function processFile(file) {
  const rel = path.relative(ROOT, file);
  const src = fs.readFileSync(file, "utf8");

  if (!/snack_bar\/utill/.test(src) || !/showMessage/.test(src)) return null;

  let ast;
  try {
    ast = parser.parse(src, { sourceType: "module", plugins: PARSER_PLUGINS });
  } catch (e) {
    return { rel, status: "PARSE_ERROR", reason: e.message };
  }

  const edits = [];
  const notes = [];

  // ---- 1. import swap ------------------------------------------------------
  let importNode = null;
  let importPathSource = null;
  let otherSpecifiers = [];
  let importsNotification = false;

  // ---- collectors ----
  const showMessageCalls = [];
  const setterNames = new Set();
  let snackUseStateNodes = [];
  let componentFn = null; // enclosing fn of the snackbar useState / first call

  traverse(ast, {
    ImportDeclaration(p) {
      const s = p.node.source.value;
      if (/snack_bar\/utill$/.test(s)) {
        importNode = p.node;
        importPathSource = s;
        for (const spec of p.node.specifiers) {
          if (
            spec.type === "ImportSpecifier" &&
            spec.imported &&
            spec.imported.name !== "showMessage"
          ) {
            otherSpecifiers.push(spec.imported.name);
          }
        }
      }
      // detect Notification named import (from elements)
      for (const spec of p.node.specifiers) {
        if (
          spec.type === "ImportSpecifier" &&
          spec.imported &&
          spec.imported.name === "Notification"
        ) {
          importsNotification = true;
        }
      }
    },
    CallExpression(p) {
      const callee = p.node.callee;
      if (callee.type === "Identifier" && callee.name === "showMessage") {
        showMessageCalls.push(p.node);
        const third = p.node.arguments[2];
        if (third && third.type === "Identifier") setterNames.add(third.name);
        if (!componentFn) {
          const fnPath = p.getFunctionParent();
          if (fnPath) componentFn = fnPath.node;
        }
      }
    },
    VariableDeclaration(p) {
      // const [x, setX] = useState({ open: false, ... })
      if (p.node.declarations.length !== 1) return;
      const d = p.node.declarations[0];
      if (
        d.id &&
        d.id.type === "ArrayPattern" &&
        d.init &&
        d.init.type === "CallExpression" &&
        d.init.callee.type === "Identifier" &&
        d.init.callee.name === "useState" &&
        d.init.arguments.length === 1 &&
        d.init.arguments[0].type === "ObjectExpression"
      ) {
        const hasOpen = d.init.arguments[0].properties.some(
          (pr) =>
            pr.type === "ObjectProperty" &&
            pr.key &&
            ((pr.key.type === "Identifier" && pr.key.name === "open") ||
              (pr.key.type === "StringLiteral" && pr.key.value === "open")),
        );
        if (hasOpen) {
          snackUseStateNodes.push({ node: p.node, declarator: d, path: p });
        }
      }
    },
  });

  if (!importNode) return { rel, status: "NO_IMPORT", reason: "no utill import" };

  // Determine enclosing component fn from the snackbar useState if available
  if (snackUseStateNodes.length && snackUseStateNodes[0].path.getFunctionParent) {
    const fp = snackUseStateNodes[0].path.getFunctionParent();
    if (fp) componentFn = fp.node;
  }

  // ---- build import replacement -------------------------------------------
  const newSource = importPathSource.replace(
    /snack_bar\/utill$/,
    "snack_bar/useSnackbar",
  );
  let importText = `import useSnackbar from "${newSource}";`;
  if (otherSpecifiers.length) {
    importText =
      `import { ${otherSpecifiers.join(", ")} } from "${importPathSource}";\n` +
      importText;
  }
  edits.push({ start: importNode.start, end: importNode.end, text: importText });

  // ---- showMessage(...) -> show(...) (drop 3rd arg) -----------------------
  for (const call of showMessageCalls) {
    const a0 = call.arguments[0];
    const a1 = call.arguments[1];
    let txt;
    if (a0 && a1) {
      txt = `show(${src.slice(a0.start, a0.end)}, ${src.slice(a1.start, a1.end)})`;
    } else if (a0) {
      txt = `show(${src.slice(a0.start, a0.end)})`;
    } else {
      txt = `show()`;
    }
    edits.push({ start: call.start, end: call.end, text: txt });
  }

  // ---- useState snackbar -> useSnackbar() ----------------------------------
  if (snackUseStateNodes.length === 0) {
    notes.push("no snackbar useState found (setter may be a prop)");
  } else {
    // Replace the FIRST matching one with the hook; remove any extras.
    snackUseStateNodes.forEach((entry, idx) => {
      if (idx === 0) {
        edits.push({
          start: entry.node.start,
          end: entry.node.end,
          text: "const [show, SnackBar] = useSnackbar();",
        });
      } else {
        // duplicate snackbar state: remove it
        edits.push({ start: entry.node.start, end: entry.node.end, text: "" });
        notes.push("removed duplicate snackbar useState");
      }
    });
  }

  // ---- inject {SnackBar} into the component's main return JSX --------------
  let injected = false;
  if (componentFn) {
    const returns = [];
    traverse(
      ast,
      {
        ReturnStatement(p) {
          // only returns belonging to componentFn (not nested fns)
          const fp = p.getFunctionParent();
          if (fp && fp.node === componentFn) {
            const arg = p.node.argument;
            if (
              arg &&
              (arg.type === "JSXElement" || arg.type === "JSXFragment")
            ) {
              returns.push(arg);
            }
          }
        },
      },
      // scope/state — traverse whole ast but filter by fn parent
    );
    if (returns.length) {
      // pick the largest JSX return (main UI)
      returns.sort((a, b) => b.end - b.start - (a.end - a.start));
      const root = returns[0];
      let closeStart = null;
      if (root.type === "JSXFragment" && root.closingFragment) {
        closeStart = root.closingFragment.start;
      } else if (
        root.type === "JSXElement" &&
        root.closingElement
      ) {
        closeStart = root.closingElement.start;
      }
      if (closeStart != null) {
        const indent = leadingIndent(src, closeStart);
        edits.push({
          start: closeStart,
          end: closeStart,
          text: `{SnackBar}\n${indent}`,
        });
        injected = true;
      }
    }
  }
  if (!injected) notes.push("could NOT inject {SnackBar} — needs manual render");

  // ---- apply edits ---------------------------------------------------------
  edits.sort((a, b) => b.start - a.start);
  // guard against overlaps
  for (let i = 1; i < edits.length; i++) {
    if (edits[i].end > edits[i - 1].start) {
      return {
        rel,
        status: "OVERLAP",
        reason: `edit overlap near ${edits[i].start}`,
      };
    }
  }
  let out = src;
  for (const e of edits) {
    out = out.slice(0, e.start) + e.text + out.slice(e.end);
  }

  const status = injected && snackUseStateNodes.length ? "OK" : "FLAGGED";
  if (WRITE && out !== src) fs.writeFileSync(file, out, "utf8");

  return {
    rel,
    status,
    notes,
    calls: showMessageCalls.length,
    injected,
    hadUseState: snackUseStateNodes.length > 0,
  };
}

// ---- run --------------------------------------------------------------------
let files = walk(SRC);
if (ONLY_FILE) {
  const target = path.resolve(ROOT, ONLY_FILE);
  files = files.filter((f) => f === target);
}
files = files.filter((f) => {
  const rel = path.relative(ROOT, f);
  return !EXCLUDE.has(rel);
});

const results = [];
for (const f of files) {
  const r = processFile(f);
  if (r) results.push(r);
}

const ok = results.filter((r) => r.status === "OK");
const flagged = results.filter((r) => r.status === "FLAGGED");
const errored = results.filter(
  (r) => !["OK", "FLAGGED"].includes(r.status),
);

console.log(`\n=== ${WRITE ? "APPLIED" : "DRY-RUN"} ===`);
console.log(`Total touched: ${results.length}`);
console.log(`  OK:       ${ok.length}`);
console.log(`  FLAGGED:  ${flagged.length}`);
console.log(`  ERRORED:  ${errored.length}`);

if (flagged.length) {
  console.log(`\n--- FLAGGED (need manual attention) ---`);
  for (const r of flagged)
    console.log(`  ${r.rel}  [calls:${r.calls} useState:${r.hadUseState} injected:${r.injected}] ${r.notes.join("; ")}`);
}
if (errored.length) {
  console.log(`\n--- ERRORED ---`);
  for (const r of errored) console.log(`  ${r.rel}  ${r.status}: ${r.reason}`);
}
console.log("");
