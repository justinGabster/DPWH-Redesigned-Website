const fs = require('fs');

// 1. Fix main.css
let css = fs.readFileSync('main.css', 'utf8');
css = css.replace(/\.nav-inner\s*\{([^}]+)\}/, (match, content) => {
    return `.nav-inner {${content.replace('justify-content: center;', 'justify-content: flex-start;')}}`;
});
fs.writeFileSync('main.css', css);

// 2. Fix index4.html nav items order
let html = fs.readFileSync('index4.html', 'utf8');

// We can just extract the inner HTML of .nav-inner and reorder the blocks.
// The easiest way is to match all <div class="nav-item">...</div> 
// But the nav items contain nested divs, so regex is tricky.
// Let's use simple string splitting based on "    <div class=\"nav-item\">"

const navStartToken = '<div class="nav-inner">';
const navEndToken = '    </div>\n  </div>\n</nav>';

let startIdx = html.indexOf(navStartToken);
let endIdx = html.indexOf('</nav>', startIdx);

if (startIdx !== -1 && endIdx !== -1) {
    let navContent = html.substring(startIdx + navStartToken.length, endIdx);
    
    // Split by `<div class="nav-item">`
    let items = navContent.split('<div class="nav-item">');
    // The first element is just whitespace/newline before the first item
    let prefix = items.shift();
    
    // Now we have the items. We need to identify 'About' and 'Contact Us'
    let aboutItem = null;
    let contactItem = null;
    let otherItems = [];
    
    for (let item of items) {
        if (item.includes("showPage('about')")) {
            aboutItem = item;
        } else if (item.includes("showPage('contact')")) {
            contactItem = item;
        } else {
            // Wait, is there an empty item?
            // "    </div>\n  " at the very end
            if (item.trim() === '</div>\n  </div>') {
                 // Ignore
            } else {
                 otherItems.push(item);
            }
        }
    }
    
    // Reconstruct
    let newNavContent = prefix;
    for (let item of otherItems) {
        newNavContent += '<div class="nav-item">' + item;
    }
    
    // Add margin-left: auto to About
    if (aboutItem) {
        newNavContent += '<div class="nav-item" style="margin-left: auto;">' + aboutItem;
    }
    if (contactItem) {
        newNavContent += '<div class="nav-item">' + contactItem;
    }
    
    // The end tags
    newNavContent += '  </div>\n';
    
    html = html.substring(0, startIdx + navStartToken.length) + newNavContent + html.substring(endIdx);
    
    fs.writeFileSync('index4.html', html);
    console.log("Nav fixed.");
} else {
    console.log("Could not find nav bounds.");
}
