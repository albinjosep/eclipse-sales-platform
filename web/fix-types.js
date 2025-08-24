const fs = require('fs');
const path = require('path');

// Common TypeScript fixes
const fixes = [
  // Fix implicit any parameters
  { pattern: /\((\w+)\) => {/g, replacement: '($1: any) => {' },
  { pattern: /\((\w+), (\w+)\) => {/g, replacement: '($1: any, $2: any) => {' },
  { pattern: /\((\w+), (\w+), (\w+)\) => {/g, replacement: '($1: any, $2: any, $3: any) => {' },
  
  // Fix common event handlers
  { pattern: /\(e\) => {/g, replacement: '(e: any) => {' },
  { pattern: /\(event\) => {/g, replacement: '(event: any) => {' },
  { pattern: /\(value\) => {/g, replacement: '(value: any) => {' },
  { pattern: /\(item\) => {/g, replacement: '(item: any) => {' },
  { pattern: /\(index\) => {/g, replacement: '(index: number) => {' },
  { pattern: /\(id\) => {/g, replacement: '(id: string) => {' },
];

function fixFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    fixes.forEach(fix => {
      const newContent = content.replace(fix.pattern, fix.replacement);
      if (newContent !== content) {
        content = newContent;
        modified = true;
      }
    });
    
    if (modified) {
      fs.writeFileSync(filePath, content);
      console.log(`Fixed: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error fixing ${filePath}:`, error.message);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
      walkDir(filePath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      fixFile(filePath);
    }
  });
}

console.log('Starting TypeScript fixes...');
walkDir('./app');
walkDir('./components');
walkDir('./hooks');
console.log('TypeScript fixes completed!');