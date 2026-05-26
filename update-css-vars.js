const fs = require('fs');
let css = fs.readFileSync('main.css', 'utf8');

// Update Variables
css = css.replace(/--orange:\s*#FF8A5C;/, '--orange: #F97216;');
css = css.replace(/--font-sans:\s*'Outfit',\s*'DM Sans',\s*sans-serif;/, "--font-sans: 'DM Sans', sans-serif;\n    --gray-blue: #5A6A9A;\n    --gold: #C5A85A;");

// Add global heading font-family rule if not present
if (!css.includes('h1, h2, h3, h4, h5, h6')) {
    // Add right after body
    css = css.replace(/body\s*\{[^}]+\}/, match => {
        return match + '\n\n  h1, h2, h3, h4, h5, h6 {\n    font-family: var(--font-serif);\n  }';
    });
}

// Write back
fs.writeFileSync('main.css', css);
console.log('CSS Variables and Typography updated.');
