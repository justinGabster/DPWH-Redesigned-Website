const fs = require('fs');
let css = fs.readFileSync('main.css', 'utf8');

css = css.replace(/\.header-search\s*\{([^}]+)\}/, (match, content) => {
    let newContent = content.replace(/background:\s*[^;]+;/, 'background: var(--gray-blue);');
    newContent = newContent.replace(/border:\s*[^;]+;/, 'border: none;');
    newContent = newContent.replace(/border-radius:\s*[^;]+;/, 'border-radius: 999px;');
    // Ensure padding is updated to be a bit thicker for a pill shape
    newContent = newContent.replace(/padding:\s*[^;]+;/, 'padding: 8px 16px;');
    return `.header-search {${newContent}}`;
});

// Update SVG inside .header-search to be white
if (!css.includes('.header-search svg path')) {
    css += `\n.header-search svg circle, .header-search svg path { stroke: var(--white); }\n`;
    css += `.header-search input::placeholder { color: rgba(255,255,255,0.7); }\n`;
}

fs.writeFileSync('main.css', css);
console.log('Search bar updated.');
