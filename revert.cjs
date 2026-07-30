const fs = require('fs');
const path = require('path');

const replacements = [
  { from: /bg-slate-50/g, to: 'bg-slate-950' },
  { from: /bg-white/g, to: 'bg-slate-900' },
  { from: /bg-slate-100/g, to: 'bg-slate-800' },
  { from: /border-slate-200/g, to: 'border-slate-800' },
  { from: /border-slate-300/g, to: 'border-slate-700' },
  { from: /text-slate-800/g, to: 'text-slate-200' },
  { from: /text-slate-700/g, to: 'text-slate-300' },
  { from: /text-slate-500/g, to: 'text-slate-400' },
  { from: /text-slate-900/g, to: 'text-white' },
];

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let original = content;
      
      for (const rule of replacements) {
        content = content.replace(rule.from, rule.to);
      }
      
      if (content !== original) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Reverted ${fullPath}`);
      }
    }
  }
}

processDirectory(path.join(__dirname, 'src'));
console.log('Reversion complete!');
