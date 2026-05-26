const fs = require('fs');
let css = fs.readFileSync('main.css', 'utf8');

// Update .btn-primary border-radius
css = css.replace(/\.btn-primary\s*\{[^}]+\}/, match => match.replace(/border-radius:\s*\d+px;/, 'border-radius: 8px;'));
// Update .btn-outline border-radius
css = css.replace(/\.btn-outline\s*\{[^}]+\}/, match => match.replace(/border-radius:\s*\d+px;/, 'border-radius: 8px;'));
// Update .subpage-tab border-radius
css = css.replace(/\.subpage-tab\s*\{[^}]+\}/, match => match.replace(/border-radius:\s*\d+px;/, 'border-radius: 8px;'));

// Update pagination buttons (.page-btn) to match moodboard
css = css.replace(/\.page-btn\s*\{([^}]+)\}/, (match, content) => {
    let newContent = content.replace(/border-radius:\s*\d+px;/, 'border-radius: 8px;');
    newContent = newContent.replace(/background:\s*var\(--white\);/, 'background: var(--light);');
    newContent = newContent.replace(/border:\s*1px\s*solid\s*var\(--border\);/, 'border: none;');
    return `.page-btn {${newContent}}`;
});

// Write changes back
fs.writeFileSync('main.css', css);
console.log('Components updated.');
