const fs = require('fs');
let html = fs.readFileSync('index4.html', 'utf8');

const navEmojis = {
  'DPWH ATLAS': '🗺️',
  'Road &amp; Bridge Inventory': '🛣️',
  'StreaMS': '🌊',
  'Laws, Codes &amp; Orders': '⚖️',
  'Guidelines &amp; Manuals': '📖',
  'Standard Design': '📐',
  'Reports': '📊',
  'Issuances': '📣'
};

const regexNav = /<div class="ref-nav-icon">(?:<svg.*?>.*?<\/svg>|.*?)<\/div>(\s*<div class="ref-nav-text">\s*<div class="ref-nav-name">([^<]+)<\/div>)/g;
html = html.replace(regexNav, (match, suffix, title) => {
    const emoji = navEmojis[title.trim()] || '📄';
    return `<div class="ref-nav-icon" style="font-size: 16px;">${emoji}</div>${suffix}`;
});

const cardEmojis = {
  'List of ROs / DEOs': '🏢',
  'Roads and Bridge Statistics Archive': '📁'
};

const regexCard = /<div class="doc-card-icon">(?:<svg.*?>.*?<\/svg>|.*?)<\/div>(\s*<div class="doc-card-meta">[\s\S]*?<span class="doc-card-title">([^<]+)<\/span>)/g;
html = html.replace(regexCard, (match, suffix, title) => {
    const emoji = cardEmojis[title.trim()] || '📄';
    return `<div class="doc-card-icon">${emoji}</div>${suffix}`;
});

// Also replace any generic fallback that didn't match the title
html = html.replace(/<div class="doc-card-icon"><svg.*?>.*?<\/svg><\/div>/g, '<div class="doc-card-icon">📄</div>');

fs.writeFileSync('index4.html', html);
console.log('Emojis applied!');
