/* eslint-disable */
/**
 * Rolls out the PSO_LOGO swap (already done in SignInUserManagement.js and
 * Header2.js) to every remaining screen that renders the Diskus logo:
 *   1. Flat logo: `lang==="ar" ? DiskusLogoArabic : <defaultLogo>`
 *      becomes   `PSO_LOGO ? PSOLogo : lang==="ar" ? DiskusLogoArabic : <defaultLogo>`
 *   2. Round icon (DiskusAuthPageLogo): unchanged, but a "Powered by Diskus"
 *      badge is rendered next to it when PSO_LOGO is true (same as
 *      SignInUserManagement.js), positioned via inline style so no existing
 *      CSS module needs to be touched.
 *
 *   node scripts/pso-logo-codemod.js            # dry-run
 *   node scripts/pso-logo-codemod.js --write
 */
const fs = require("fs");
const path = require("path");
const parser = require("@babel/parser");
const traverseMod = require("@babel/traverse");
const traverse = traverseMod.default || traverseMod;

const ROOT = path.resolve(__dirname, "..");
const WRITE = process.argv.includes("--write");
const PLUGINS = ["jsx", "classProperties", "objectRestSpread", "optionalChaining", "nullishCoalescingOperator", "optionalCatchBinding"];

const FILES = [
  "src/container/pages/organizationRegister/2FA/VerficationCodeThree/VerificationCodeThree.js",
  "src/container/pages/UserMangement/PasswordVerification/PasswordVerification.js",
  "src/container/pages/UserMangement/PasswordCreationUM/PasswordCreationUM.js",
  "src/container/pages/UserMangement/ForgotPasswordVerification/ForgotPasswordVerificationUM.js",
  "src/container/pages/UserMangement/ForgotPassword/ForgotPasswordUM.js",
  "src/container/pages/UserMangement/2FA Verification/VerificationEmailAndNumber/VerificationEmailAndNumber.js",
  "src/container/pages/UserMangement/2FA Verification/TwoFactorMultipleDevices/TwoFactorMultipleDevices.js",
  "src/container/authentication/UpdatedPasswordSuccessfully/UpdatePasswordSuccessfully.js",
  "src/container/authentication/ForgotpasswordVerification/ForgotPasswordVerification.js",
  "src/container/pages/organizationRegister/2FA/VerificationIphone/VerificationIphone.js",
  "src/container/pages/onBoard/welcomescreen/WelcomeScreen.js",
  "src/container/pages/UserMangement/VerifyOTPUM/VerifyOTPUM.js",
  "src/container/pages/UserMangement/2FA Verification/VerifyDeniedUM/VerifyDeniedUM.js",
  "src/container/pages/UserMangement/2FA Verification/TwoFactorVerifyUM.js",
  "src/container/pages/UserMangement/2FA Verification/DevicesFor2FAVerify/DeviceFor2FAVerify.js",
  "src/container/pages/UserMangement/2FA Verification/2FA Tap Options/TapOptions.js",
];

const report = { ok: [], skipped: [] };

function processFile(relPath) {
  const file = path.join(ROOT, relPath);
  if (!fs.existsSync(file)) {
    report.skipped.push(`${relPath} -- FILE NOT FOUND`);
    return;
  }
  let src = fs.readFileSync(file, "utf8");
  let ast;
  try {
    ast = parser.parse(src, { sourceType: "module", plugins: PLUGINS });
  } catch (e) {
    report.skipped.push(`${relPath} -- PARSE ERROR: ${e.message.split("\n")[0]}`);
    return;
  }

  // ---- find the DiskusLogoArabic import to derive the path prefix ----------
  let arabicImportNode = null;
  let arabicLocalName = null;
  let defaultLogoLocalName = null;
  let authIconImportNode = null;
  let authIconLocalName = null;

  traverse(ast, {
    ImportDeclaration(p) {
      const src = p.node.source.value;
      if (/Diskus Arabic Logo/.test(src)) {
        arabicImportNode = p.node;
        arabicLocalName = p.node.specifiers[0]?.local.name;
      }
      if (/Diskus_newRoundIcon\.svg$/.test(src)) {
        authIconImportNode = p.node;
        authIconLocalName = p.node.specifiers[0]?.local.name;
      }
      if (/Diskus_newLogo\.svg$/.test(src)) {
        defaultLogoLocalName = p.node.specifiers[0]?.local.name;
      }
    },
  });

  if (!arabicImportNode || !arabicLocalName) {
    report.skipped.push(`${relPath} -- no DiskusLogoArabic import found`);
    return;
  }
  if (!defaultLogoLocalName) {
    report.skipped.push(`${relPath} -- no Diskus_newLogo.svg import found (default logo local name unknown)`);
    return;
  }

  // derive the shared "<prefix>assets/..." -> "<prefix>" string
  const arabicSrcPath = arabicImportNode.source.value; // e.g. "../../../../assets/images/Diskus Arabic Logo/Diskus Arabic Logo.png"
  const m = arabicSrcPath.match(/^(.*?)assets\/images\/Diskus Arabic Logo\/Diskus Arabic Logo\.png$/);
  if (!m) {
    report.skipped.push(`${relPath} -- could not derive path prefix from "${arabicSrcPath}"`);
    return;
  }
  const prefix = m[1]; // e.g. "../../../../" or "./../../../../"

  const psoLogoImportSrc = `${prefix}assets/images/Logos/PSO_Logo.png`;
  const featureFlagsImportSrc = `${prefix}commen/featureFlags`;
  const psoPowerdByImportSrc = `${prefix}assets/images/Logos/PowerdByDiskus.png`;

  // ---- find the ternary: X === "ar" ? DiskusLogoArabic : <defaultLogo> -----
  let ternaryNode = null;
  traverse(ast, {
    ConditionalExpression(p) {
      const n = p.node;
      if (
        n.consequent.type === "Identifier" &&
        n.consequent.name === arabicLocalName &&
        n.alternate.type === "Identifier" &&
        n.alternate.name === defaultLogoLocalName
      ) {
        ternaryNode = n;
      }
    },
  });
  if (!ternaryNode) {
    report.skipped.push(`${relPath} -- could not find the logo ternary (lang==="ar"?${arabicLocalName}:${defaultLogoLocalName})`);
    return;
  }

  // ---- find <img ... src={DiskusAuthPageLogo} ... /> (optional) ------------
  let authIconJSXNode = null;
  if (authIconLocalName) {
    traverse(ast, {
      JSXElement(p) {
        if (authIconJSXNode) return;
        const opening = p.node.openingElement;
        if (opening.name.type !== "JSXIdentifier" || opening.name.name !== "img") return;
        const hasSrc = opening.attributes.some(
          (a) =>
            a.type === "JSXAttribute" &&
            a.name.name === "src" &&
            a.value &&
            a.value.type === "JSXExpressionContainer" &&
            a.value.expression.type === "Identifier" &&
            a.value.expression.name === authIconLocalName,
        );
        if (hasSrc) authIconJSXNode = p.node;
      },
    });
  }

  // ============================================================
  // apply edits (string-splice, offset-based, largest offset first)
  // ============================================================
  const edits = [];

  // 1. new imports, right after the DiskusLogoArabic import line
  const importInsertAt = arabicImportNode.end;
  let importText = `\nimport PSOLogo from "${psoLogoImportSrc}";\nimport { PSO_LOGO } from "${featureFlagsImportSrc}";`;
  if (authIconJSXNode) {
    importText += `\nimport PSOPowerdBy from "${psoPowerdByImportSrc}";`;
  }
  edits.push({ start: importInsertAt, end: importInsertAt, text: importText });

  // 2. ternary -> PSO_LOGO ? PSOLogo : (original ternary)
  const origTernaryText = src.slice(ternaryNode.start, ternaryNode.end);
  const newTernaryText = `PSO_LOGO ? PSOLogo : ${origTernaryText}`;
  edits.push({ start: ternaryNode.start, end: ternaryNode.end, text: newTernaryText });

  // 3. badge after the round-icon <img/>
  if (authIconJSXNode) {
    const afterIcon = authIconJSXNode.end;
    const lineStart = src.lastIndexOf("\n", authIconJSXNode.start - 1) + 1;
    const indent = src.slice(lineStart, authIconJSXNode.start).match(/^\s*/)[0];
    const badgeText =
      `\n${indent}{PSO_LOGO && (\n` +
      `${indent}  <img\n` +
      `${indent}    src={PSOPowerdBy}\n` +
      `${indent}    alt=""\n` +
      `${indent}    draggable="false"\n` +
      `${indent}    style={{ position: "absolute", bottom: 10, right: 10, width: 110, zIndex: 2 }}\n` +
      `${indent}  />\n` +
      `${indent})}`;
    edits.push({ start: afterIcon, end: afterIcon, text: badgeText });
  }

  edits.sort((a, b) => b.start - a.start);
  let out = src;
  for (const e of edits) out = out.slice(0, e.start) + e.text + out.slice(e.end);

  if (WRITE) fs.writeFileSync(file, out, "utf8");
  report.ok.push(`${relPath}${authIconJSXNode ? " (+ badge)" : " (logo only)"}`);
}

for (const f of FILES) processFile(f);

console.log(`\n=== ${WRITE ? "APPLIED" : "DRY-RUN"} — PSO logo rollout ===`);
console.log(`OK (${report.ok.length}):`);
report.ok.forEach((x) => console.log("  + " + x));
console.log(`\nSKIPPED (${report.skipped.length}):`);
report.skipped.forEach((x) => console.log("  ! " + x));
console.log("");
