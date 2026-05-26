const fs = require('fs');
let css = fs.readFileSync('main.css', 'utf8');

// WCAG Contrast fix
css = css.replace(/--textlt:\s*#[0-9a-fA-F]{6};/g, '--textlt: #4A5A8A;');

// Enforce 8px grid spacing for margins, paddings, and gaps.
// Map common non-8px values to nearest 8px multiple
const spacingMap = {
    '5px': '8px',
    '10px': '8px',
    '12px': '16px',
    '14px': '16px',
    '15px': '16px',
    '18px': '16px',
    '20px': '24px',
    '22px': '24px',
    '28px': '32px',
    '30px': '32px',
    '36px': '32px',
    '40px': '48px',
    '50px': '48px'
};

const regexProps = /(margin|padding|gap|margin-top|margin-bottom|margin-left|margin-right|padding-top|padding-bottom|padding-left|padding-right):\s*([^;]+);/g;

css = css.replace(regexProps, (match, prop, val) => {
    let newVal = val;
    for (const [oldSp, newSp] of Object.entries(spacingMap)) {
        const r = new RegExp(`\\b${oldSp}\\b`, 'g');
        newVal = newVal.replace(r, newSp);
    }
    return `${prop}: ${newVal};`;
});

// Add transitions to cards, rows, anchors
// We can append a general transition rule to major interactive selectors
css += `
/* --- Refactored Transitions & Table Polish --- */
.region-card, .stat-card, .news-card, .card, .req-card, .step-card, .doc-card, .contact-card {
    border-radius: 8px !important;
    transition: transform 0.2s ease-in-out, box-shadow 0.2s ease, background-color 0.2s ease !important;
}

.region-card:hover, .stat-card:hover, .news-card:hover, .card:hover, .req-card:hover, .step-card:hover, .doc-card:hover, .contact-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(11,26,74,0.1) !important;
}

/* Tables Polish */
table tr, .dir-row, .road-item {
    transition: background-color 0.2s ease !important;
}
table tr:hover, .dir-row:hover, .road-item:hover {
    background-color: #F5F7FF;
}
table th {
    border-bottom: 2px solid var(--border) !important;
}
table td {
    border-bottom: 1px solid var(--border) !important;
    vertical-align: middle !important;
}

a {
    transition: color 0.2s ease, background-color 0.2s ease !important;
}
`;

fs.writeFileSync('main.css', css);
console.log('CSS Refactored');
