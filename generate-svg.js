const fs = require('fs');
const d3 = require('d3-geo');

try {
  const geojson = JSON.parse(fs.readFileSync('ph-regions.json', 'utf8'));

  // Use fitSize to perfectly scale the map into a 550x800 viewBox
  const projection = d3.geoMercator().fitSize([550, 800], geojson);
  const pathGenerator = d3.geoPath().projection(projection);

  // Colors based on regions
  const colorMap = {
    'NCR': '#3B4CC0',
    'CAR': '#27AE60',
    'REGION I': '#E67E22',
    'REGION II': '#8E44AD',
    'REGION III': '#9B59B6',
    'REGION IV-A': '#1ABC9C',
    'REGION IV-B': '#E74C3C',
    'REGION V': '#F39C12',
    'REGION VI': '#16A085',
    'REGION VII': '#2C3E82',
    'REGION VIII': '#229954',
    'REGION IX': '#D35400',
    'REGION X': '#C0392B',
    'REGION XI': '#8E44AD',
    'REGION XII': '#2980B9',
    'REGION XIII': '#16A085',
    'ARMM': '#27AE60',
    'DEFAULT': '#4C6EF5'
  };

  let paths = '';
  geojson.features.forEach((feature, i) => {
    const d = pathGenerator(feature);
    const regionName = feature.properties.REGION || feature.properties.name || `Region-${i}`;
    let fill = colorMap['DEFAULT'];
    
    // Attempt to match region name
    const upName = regionName.toUpperCase();
    for (let key in colorMap) {
      if (upName.includes(key)) {
        fill = colorMap[key];
        break;
      }
    }
    
    // Specific overrides based on known naming conventions
    if (upName.includes('NATIONAL CAPITAL')) fill = colorMap['NCR'];
    if (upName.includes('CORDILLERA')) fill = colorMap['CAR'];
    if (upName.includes('MIMAROPA')) fill = colorMap['REGION IV-B'];
    if (upName.includes('CALABARZON')) fill = colorMap['REGION IV-A'];
    if (upName.includes('CARAGA')) fill = colorMap['REGION XIII'];

    const shortCode = feature.properties.REGION || regionName;

    paths += `  <g class="ph-region" data-region="${shortCode}" data-name="${regionName}" onclick="selectRegion('${shortCode}','${regionName}')">\n`;
    paths += `    <path d="${d}" fill="${fill}" stroke="#fff" stroke-width="0.5" />\n`;
    paths += `  </g>\n`;
  });

  const svgOutput = `<svg id="ph-map" viewBox="0 0 550 800" xmlns="http://www.w3.org/2000/svg" style="width:100%;display:block;transform-origin:0 0;transition:none;">\n${paths}</svg>`;
  fs.writeFileSync('ph-generated.svg', svgOutput);
  console.log('Successfully generated SVG map from GeoJSON.');
} catch (e) {
  console.error('Error generating SVG:', e);
}
