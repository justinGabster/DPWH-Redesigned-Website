const fs = require('fs');

let html = fs.readFileSync('index4.html', 'utf8');

// Read the new SVG paths
const svgStr = fs.readFileSync('ph-generated-simplified.svg', 'utf8');
// Extract only the <g> elements inside the <svg> tag
const match = svgStr.match(/<svg[^>]*>([\s\S]*?)<\/svg>/);
if (!match) throw new Error("Could not parse generated SVG");
const newPaths = match[1];

// Replace the <svg> internals in index4.html
const htmlMatch = html.match(/(<svg id="ph-map"[^>]*>)([\s\S]*?)(<\/svg>)/);
if (!htmlMatch) throw new Error("Could not find <svg id=\"ph-map\"> in index4.html");

html = html.replace(htmlMatch[0], `${htmlMatch[1]}\n${newPaths}\n${htmlMatch[3]}`);

// Fix the typography
// Change <em style="font-style:italic;color:#f0c040;"> to var(--gold) and ensure fonts
html = html.replace(
  /<h3 style="font-family:var\(--font-serif\);font-size:clamp\(22px,3\.5vw,36px\);font-weight:700;color:#fff;line-height:1\.2;margin-bottom:10px;">\s*DPWH Projects<br><em style="font-style:italic;color:#f0c040;">Click a Region to View<\/em>\s*<\/h3>/g,
  `<h2 style="font-family:var(--font-serif);font-size:clamp(32px, 4.5vw, 48px);font-weight:700;color:#fff;line-height:1.1;margin-bottom:12px;">
    DPWH Projects<br><em style="font-style:italic;color:var(--gold);font-weight:600;font-size:clamp(24px, 3.5vw, 36px);">Click a Region to View</em>
  </h2>`
);

// Also make sure the descriptive text below it is strictly DM Sans and readable
html = html.replace(
  /<p style="color:rgba\(255,255,255,0\.65\);font-size:15px;margin-bottom:0;">\s*Hover over any region to highlight it\. Click to view regional project details\. You may refer to the legends on the right\.\s*<\/p>/g,
  `<p style="font-family:var(--font-sans);color:rgba(255,255,255,0.8);font-size:16px;margin-bottom:0;line-height:1.5;">
    Hover over any region to highlight it. Click to view regional project details. You may refer to the legends on the right.
  </p>`
);

fs.writeFileSync('index4.html', html);
console.log('Successfully updated index4.html with detailed map and typography.');
