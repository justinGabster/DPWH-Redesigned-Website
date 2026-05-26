const fs = require('fs');
let lines = fs.readFileSync('c:/redesignV1/redesignV1/main.css', 'utf8').split(/\r?\n/);

let startIndex = -1;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('.ref-nav-item {')) {
    startIndex = i;
    break;
  }
}

let endIndex = -1;
for (let i = startIndex; i < lines.length; i++) {
  if (lines[i].includes('.ref-nav-name {')) {
    endIndex = i;
    break;
  }
}

const newCss = `    .ref-nav-item {
      display: flex;
      align-items: center;
      gap: 11px;
      padding: 11px 16px;
      cursor: pointer;
      border-left: 3px solid transparent;
      transition: all 0.18s ease;
      position: relative;
    }
    .ref-nav-item:hover {
      background: rgba(255,255,255,0.06);
      border-left-color: rgba(201,151,61,0.5);
    }
    .ref-nav-item.active {
      background: rgba(76,110,245,0.18);
      border-left-color: #C9973D;
    }
    .ref-nav-icon {
      width: 32px; height: 32px;
      border-radius: 8px;
      background: rgba(255,255,255,0.07);
      border: 1px solid rgba(255,255,255,0.10);
      display: flex; align-items: center; justify-content: center;
      font-size: 14px;
      flex-shrink: 0;
      transition: background 0.18s;
      color: var(--white);
    }
    .ref-nav-item.active .ref-nav-icon {
      background: rgba(201,151,61,0.2);
      border-color: rgba(201,151,61,0.4);
    }
    .ref-nav-item:hover .ref-nav-icon {
      background: rgba(255,255,255,0.11);
    }
    .ref-nav-text {
      flex: 1;
      min-width: 0;
    }
    .ref-nav-name {`;

lines.splice(startIndex, endIndex - startIndex + 1, newCss);

fs.writeFileSync('c:/redesignV1/redesignV1/main.css', lines.join('\n'));
console.log('Fixed main.css for real!');
