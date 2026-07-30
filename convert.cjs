const fs = require('fs');
const path = require('path');

const replacements = [
  { from: /bg-slate-950/g, to: 'bg-slate-50' },
  { from: /bg-slate-900/g, to: 'bg-white' },
  { from: /bg-slate-800/g, to: 'bg-slate-100' },
  { from: /border-slate-800/g, to: 'border-slate-200' },
  { from: /border-slate-700/g, to: 'border-slate-300' },
  { from: /text-slate-200/g, to: 'text-slate-800' },
  { from: /text-slate-300/g, to: 'text-slate-700' },
  { from: /text-slate-400/g, to: 'text-slate-500' },
  { from: /text-white/g, to: 'text-slate-900' },
  // Ensure we don't ruin primary/accent buttons that need white text:
  // We'll run a post-replacement to fix buttons that were changed to text-slate-900
  { from: /bg-primary-600(.*?)text-slate-900/g, to: 'bg-primary-600$1text-white' },
  { from: /bg-rose-600(.*?)text-slate-900/g, to: 'bg-rose-600$1text-white' },
  { from: /bg-emerald-600(.*?)text-slate-900/g, to: 'bg-emerald-600$1text-white' },
  { from: /bg-rose-500 text-slate-900/g, to: 'bg-rose-500 text-white' }
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
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

processDirectory(path.join(__dirname, 'src'));
console.log('Conversion complete!');
