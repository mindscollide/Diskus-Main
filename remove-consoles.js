// remove-consoles.js

const fs = require("fs");
const path = require("path");

const srcDir = path.join(process.cwd(), "src");

/**
 * Excluded files
 */
const excludeFiles = [
  "Dashboard.js",
  "App.js",
];

/**
 * Excluded directories
 * Paths are relative to src/
 */
const excludeDirectories = [
  "node_modules",
  "build",
  "dist",
  "coverage",
  "assets",

  // Exclude complete talk module
  "components/layout/talk",
];

/**
 * Allowed file extensions
 */
const allowedExtensions = [
  ".js",
  ".jsx",
  ".ts",
  ".tsx",
];

/**
 * Recursively get files
 */
function getFiles(dir) {
  let results = [];

  const list = fs.readdirSync(dir);

  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    /**
     * Handle directories
     */
    if (stat.isDirectory()) {
      const relativePath = path
        .relative(srcDir, filePath)
        .replace(/\\/g, "/");

      const shouldExclude = excludeDirectories.some(
        (excludedDir) =>
          relativePath.startsWith(excludedDir)
      );

      if (shouldExclude) {
        console.log(`Skipped Directory: ${relativePath}`);
        return;
      }

      results = results.concat(getFiles(filePath));
      return;
    }

    /**
     * Check extension
     */
    const ext = path.extname(file);

    if (!allowedExtensions.includes(ext)) {
      return;
    }

    /**
     * Exclude files
     */
    const shouldExcludeFile = excludeFiles.some(
      (excludedFile) =>
        excludedFile.toLowerCase() === file.toLowerCase()
    );

    if (shouldExcludeFile) {
      console.log(`Skipped File: ${file}`);
      return;
    }

    results.push(filePath);
  });

  return results;
}

/**
 * Remove console statements
 */
function removeConsoleStatements(filePath) {
  try {
    const content = fs.readFileSync(filePath, "utf8");

    /**
     * Removes:
     * console.log()
     * console.warn()
     * console.error()
     * console.info()
     * console.debug()
     */
    const cleaned = content.replace(
      /console\.(log|warn|error|info|debug)\s*\(([\s\S]*?)\);?/g,
      ""
    );

    fs.writeFileSync(filePath, cleaned, "utf8");

    console.log(`Processed: ${filePath}`);
  } catch (error) {
    console.error(`Error processing: ${filePath}`, error);
  }
}

/**
 * Main Execution
 */
if (fs.existsSync(srcDir)) {
  const files = getFiles(srcDir);

  console.log(`\nFound ${files.length} files to process\n`);

  files.forEach(removeConsoleStatements);

  console.log(
    "\nConsole statements removed successfully.\n"
  );
} else {
  console.log("src directory not found.");
}