const fs = require('fs');
let lines = fs.readFileSync('c:/redesignV1/redesignV1/main.css', 'utf8').split('\n');

const correctNavbar = `  /*  NAVBAR  */
  nav {
    background: var(--royal);
    position: sticky; top: 0; z-index: 100;
    box-shadow: 0 2px 12px rgba(11,26,74,0.25);
  }
  .nav-inner {
    max-width: 100%;
    margin: 0 auto;
    padding: 0 24px;
    display: flex;
    justify-content: flex-start;
    align-items: stretch;
    padding-left: 110px;
    padding-right: 32px;
  }
  .nav-item { position: relative; }
  .nav-link {
    display: flex; align-items: center; gap: 8px;
    padding: 13px 16px;
    color: rgba(255,255,255,0.9);
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    white-space: nowrap;
    border-bottom: 3px solid transparent;
    transition: all 0.18s ease;
    user-select: none;
    letter-spacing: 0.01em;
  }
  .nav-link:hover, .nav-link.active {
    color: var(--white);
    background: rgba(255,255,255,0.1);
    border-bottom-color: var(--orange);
  }
  .nav-link .caret {
    font-size: 14px;
    opacity: 0.8;
    margin-top: 1px;
    transition: transform 0.18s;
  }
  .nav-item:hover .caret { transform: rotate(180deg); }
  .nav-item:hover .dropdown { display: block; }

  /* DROPDOWN */
  .dropdown {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    background: var(--white);
    min-width: 220px;
    border-radius: 0 0 8px 8px;
    box-shadow: 0 8px 30px rgba(11,26,74,0.18);
    z-index: 200;
    border-top: 3px solid var(--orange);
    overflow: hidden;
  }
  .dropdown a {
    display: flex; align-items: center; gap: 8px;
    padding: 11px 16px;
    color: var(--text);
    font-size: 13px;
    text-decoration: none;
    border-bottom: 1px solid var(--border);
    transition: all 0.15s;`;

// Find start and end indices of the mangled section
let startIndex = lines.findIndex(l => l.includes('/*  NAVBAR  */'));
let endIndex = startIndex;
for(let i = startIndex + 1; i < lines.length; i++) {
  if (lines[i].includes('cursor: pointer;') && lines[i+1] && lines[i+1].includes('}')) {
    endIndex = i;
    break;
  }
}

lines.splice(startIndex, endIndex - startIndex + 1, correctNavbar);
fs.writeFileSync('c:/redesignV1/redesignV1/main.css', lines.join('\n'));
console.log('Fixed main.css!');
