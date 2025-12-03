// remove-consoles.js
const fs = require('fs');
const path = require('path');

const excludeFile = 'Dashboard.js';
const srcDir = path.join(process.cwd(), 'src');

// Recursively get all .js files in src except Dashboard.js and node_modules
function getJSFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      // Skip node_modules directory
      if (file === 'node_modules') return;
      results = results.concat(getJSFiles(filePath));
    } else if (
      file.endsWith('.js') &&
      path.basename(file).toLowerCase() !== excludeFile.toLowerCase()
    ) {
      results.push(filePath);
    }
  });
  return results;
}

// Remove all console.log statements from a file
function removeConsoleStatements(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  // Regex to match only console.log statements (single or multiline)
  const cleaned = content.replace(/console\.log\s*\(([\s\S]*?)\);?/g, '');
  fs.writeFileSync(filePath, cleaned, 'utf8');
  console.log(`Processed: ${filePath}`);
}

// Main execution
if (fs.existsSync(srcDir)) {
  const jsFiles = getJSFiles(srcDir);
  console.log(`Found ${jsFiles.length} JS files in src (excluding ${excludeFile})`);
  jsFiles.forEach(removeConsoleStatements);
  console.log('console.log statements removed from all files in src except Dashboard.js.');
} else {
  console.log('src directory not found.');
}