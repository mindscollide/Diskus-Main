/**
 * generate-folder-docs.js
 * ------------------------------------------------------------------
 * Walks the src/ tree and writes a README.md into EVERY folder.
 *
 * Each README is generated from the *actual* source it describes:
 *   - JS/JSX files: default export (component), named exports, the
 *     leading block/line comment, and notable dependencies (context,
 *     redux, api, mqtt, router).
 *   - CSS / asset files: counted and listed by type.
 *   - Subfolders: linked to their own README.md.
 *
 * Re-running is safe: it overwrites the generated READMEs in place.
 * Hand-written docs (root README.md, docs/*.md) are never touched.
 *
 * Usage:  node scripts/generate-folder-docs.js
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const SRC = path.join(ROOT, "src");

const CODE_EXT = new Set([".js", ".jsx", ".ts", ".tsx"]);
const STYLE_EXT = new Set([".css", ".scss", ".less", ".module.css"]);
const IMG_EXT = new Set([".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp", ".ico", ".bmp"]);
const FONT_EXT = new Set([".ttf", ".otf", ".woff", ".woff2", ".eot"]);

let folderCount = 0;
let fileDocCount = 0;

/** Relative posix path from repo root. */
function rel(p) {
  return path.relative(ROOT, p).split(path.sep).join("/");
}

/** Extract a short description from the first comment block in a JS file. */
function leadingComment(src) {
  // JSDoc / block comment
  const block = src.match(/\/\*\*?([\s\S]*?)\*\//);
  if (block) {
    const lines = block[1]
      .split("\n")
      .map((l) => l.replace(/^\s*\*?\s?/, "").trim())
      .filter(Boolean);
    // Prefer an @description line, else the first @component, else first prose line
    const desc = lines.find((l) => /^@description/i.test(l));
    if (desc) return desc.replace(/^@description\s*/i, "").trim();
    const prose = lines.find((l) => l && !l.startsWith("@"));
    if (prose) return prose;
  }
  // Top-of-file line comments
  const lineComments = [];
  for (const line of src.split("\n")) {
    const m = line.match(/^\s*\/\/\s?(.*)$/);
    if (m) {
      lineComments.push(m[1].trim());
    } else if (line.trim() === "" && lineComments.length === 0) {
      continue;
    } else {
      break;
    }
  }
  if (lineComments.length) return lineComments.join(" ");
  return "";
}

/** Pull export / dependency signals out of a JS source file. */
function analyzeJs(src) {
  const info = { defaultExport: null, named: [], deps: new Set(), hooks: false };

  // default export: `export default Foo`  | `export default function Foo` | `export default class Foo`
  let m = src.match(/export\s+default\s+(?:function|class)?\s*([A-Za-z0-9_]+)/);
  if (m) info.defaultExport = m[1];

  // named function/const/class exports
  const namedRe = /export\s+(?:const|function|class|let|var)\s+([A-Za-z0-9_]+)/g;
  let nm;
  while ((nm = namedRe.exec(src))) info.named.push(nm[1]);

  // export { a, b as c }
  const braceRe = /export\s*\{([^}]+)\}/g;
  let bm;
  while ((bm = braceRe.exec(src))) {
    bm[1]
      .split(",")
      .map((s) => s.trim().split(/\s+as\s+/).pop().trim())
      .filter((s) => s && s !== "default")
      .forEach((s) => info.named.push(s));
  }

  // dependency signals
  if (/from\s+["'].*context/i.test(src) || /useContext\s*\(/.test(src)) info.deps.add("React Context");
  if (/useSelector|useDispatch|from\s+["'].*store/i.test(src)) info.deps.add("Redux");
  if (/axiosInstance|Api_ends_points|Api_config|axios/i.test(src)) info.deps.add("API");
  if (/mqtt|paho|MQTTJson/i.test(src)) info.deps.add("MQTT");
  if (/useNavigate|useParams|react-router|<Route/i.test(src)) info.deps.add("Router");
  if (/i18n|useTranslation|react-i18next/i.test(src)) info.deps.add("i18n");
  if (/socket\.io|getSocketConnection|io\(/i.test(src)) info.deps.add("Socket.io");
  if (/useEffect|useState|=>\s*{[\s\S]*return\s*\(/.test(src) && /react/i.test(src)) info.hooks = true;

  // de-dup named, drop obvious noise
  info.named = [...new Set(info.named)].filter((n) => n !== info.defaultExport);
  return info;
}

function humanizeFolder(name) {
  // Insert spaces in camelCase / PascalCase for the human title
  return name
    .replace(/[_-]+/g, " ")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/\s+/g, " ")
    .trim();
}

function buildBreadcrumb(dir) {
  const relDir = rel(dir);
  const parts = relDir.split("/");
  const crumbs = [];
  for (let i = 0; i < parts.length; i++) {
    const up = "../".repeat(parts.length - 1 - i) || "./";
    if (i === parts.length - 1) {
      crumbs.push(`**${parts[i]}**`);
    } else {
      crumbs.push(`[${parts[i]}](${up}README.md)`);
    }
  }
  return crumbs.join(" / ");
}

function generate(dir) {
  folderCount++;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const subdirs = entries.filter((e) => e.isDirectory()).map((e) => e.name).sort();
  const files = entries
    .filter((e) => e.isFile() && e.name !== "README.md")
    .map((e) => e.name)
    .sort();

  const relDir = rel(dir);
  const folderName = path.basename(dir);
  const title = humanizeFolder(folderName);

  const code = [];
  const styles = [];
  const images = [];
  const fonts = [];
  const others = [];

  for (const f of files) {
    const ext = path.extname(f).toLowerCase();
    if (CODE_EXT.has(ext)) code.push(f);
    else if (f.endsWith(".module.css") || STYLE_EXT.has(ext)) styles.push(f);
    else if (IMG_EXT.has(ext)) images.push(f);
    else if (FONT_EXT.has(ext)) fonts.push(f);
    else others.push(f);
  }

  let md = `# \`${relDir}/\`\n\n`;
  md += `${buildBreadcrumb(dir)}\n\n`;

  // Summary line
  const bits = [];
  if (code.length) bits.push(`${code.length} code file${code.length > 1 ? "s" : ""}`);
  if (styles.length) bits.push(`${styles.length} stylesheet${styles.length > 1 ? "s" : ""}`);
  if (images.length) bits.push(`${images.length} image${images.length > 1 ? "s" : ""}`);
  if (fonts.length) bits.push(`${fonts.length} font${fonts.length > 1 ? "s" : ""}`);
  if (subdirs.length) bits.push(`${subdirs.length} subfolder${subdirs.length > 1 ? "s" : ""}`);
  md += `> ${bits.length ? bits.join(" · ") : "Empty folder"}\n\n`;

  // Code files table
  if (code.length) {
    md += `## Code files\n\n`;
    md += `| File | Exports | Description | Uses |\n`;
    md += `|------|---------|-------------|------|\n`;
    for (const f of code) {
      let src = "";
      try {
        src = fs.readFileSync(path.join(dir, f), "utf8");
      } catch {
        /* ignore */
      }
      const a = analyzeJs(src);
      let exp = a.defaultExport ? `\`${a.defaultExport}\`` : "";
      const namedShown = a.named.slice(0, 6);
      if (namedShown.length) {
        const namedStr = namedShown.map((n) => `\`${n}\``).join(", ");
        exp = exp ? `${exp} · ${namedStr}` : namedStr;
      }
      if (a.named.length > 6) exp += ` …(+${a.named.length - 6})`;
      if (!exp) exp = "—";
      let desc = leadingComment(src).replace(/\|/g, "\\|").replace(/\n/g, " ");
      if (desc.length > 160) desc = desc.slice(0, 157) + "…";
      if (!desc) desc = "—";
      const uses = [...a.deps].join(", ") || "—";
      fileDocCount++;
      md += `| \`${f}\` | ${exp} | ${desc} | ${uses} |\n`;
    }
    md += `\n`;
  }

  // Styles
  if (styles.length) {
    md += `## Stylesheets\n\n`;
    md += styles.map((s) => `- \`${s}\``).join("\n") + "\n\n";
  }

  // Assets
  if (images.length || fonts.length) {
    md += `## Assets\n\n`;
    if (images.length) md += `- **${images.length} image asset(s)**: ${images.slice(0, 12).map((i) => `\`${i}\``).join(", ")}${images.length > 12 ? ` …(+${images.length - 12} more)` : ""}\n`;
    if (fonts.length) md += `- **${fonts.length} font file(s)**: ${fonts.map((i) => `\`${i}\``).join(", ")}\n`;
    md += `\n`;
  }

  // Other files
  if (others.length) {
    md += `## Other files\n\n`;
    md += others.map((o) => `- \`${o}\``).join("\n") + "\n\n";
  }

  // Subfolders
  if (subdirs.length) {
    md += `## Subfolders\n\n`;
    for (const sd of subdirs) {
      md += `- [\`${sd}/\`](${sd}/README.md)\n`;
    }
    md += `\n`;
  }

  md += `---\n_Auto-generated by \`scripts/generate-folder-docs.js\`. Folder docs describe the files physically present in this directory._\n`;

  fs.writeFileSync(path.join(dir, "README.md"), md, "utf8");

  for (const sd of subdirs) {
    generate(path.join(dir, sd));
  }
}

generate(SRC);
console.log(`Generated READMEs for ${folderCount} folders, documented ${fileDocCount} code files.`);
