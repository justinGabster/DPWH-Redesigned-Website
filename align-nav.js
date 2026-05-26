const fs = require('fs');

let css = fs.readFileSync('main.css', 'utf8');

css = css.replace(/\.nav-inner\s*\{([^}]+)\}/, (match, content) => {
    // Remove max-width and change padding
    let newContent = content.replace(/max-width:\s*1200px;/, 'max-width: 100%;');
    // We can just redefine padding at the end of the block so it overrides
    newContent += `\n    padding-left: 110px;\n    padding-right: 32px;\n`;
    return `.nav-inner {${newContent}}`;
});

fs.writeFileSync('main.css', css);
console.log('Nav-inner alignment updated');
