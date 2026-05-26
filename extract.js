const fs = require('fs');
let html = fs.readFileSync('index4.html', 'utf8');

let cssOut = '';
let jsOut = '';

// Extract styles
const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
html = html.replace(styleRegex, (match, content) => {
    cssOut += content + '\n\n';
    return '';
});

// Extract scripts (excluding those with src attribute, as those are external)
const scriptRegex = /<script(?![^>]*src=)[^>]*>([\s\S]*?)<\/script>/gi;
html = html.replace(scriptRegex, (match, content) => {
    jsOut += content + '\n\n';
    return '';
});

// Insert link to main.css in head
if (html.indexOf('</head>') !== -1) {
    html = html.replace('</head>', '  <link rel="stylesheet" href="main.css">\n</head>');
} else {
    // If no head, just prepend
    html = '<link rel="stylesheet" href="main.css">\n' + html;
}

// Insert script tag before body ends
if (html.indexOf('</body>') !== -1) {
    html = html.replace('</body>', '  <script src="app.js"></script>\n</body>');
} else {
    html += '\n<script src="app.js"></script>';
}

fs.writeFileSync('main.css', cssOut);
fs.writeFileSync('app.js', jsOut);
fs.writeFileSync('index4.html', html);

console.log('Extraction complete. CSS size:', cssOut.length, 'JS size:', jsOut.length);
