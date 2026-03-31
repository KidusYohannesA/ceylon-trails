import fs from 'fs';

let svgContent;
try {
  svgContent = fs.readFileSync('lk.svg', 'utf8');
} catch(e) {
  console.error("lk.svg not found!");
  process.exit(1);
}

const regionMapping = {
  // 9 Provinces mappings
  "LK41": "Northern Province", "LK42": "Northern Province", "LK43": "Northern Province", "LK44": "Northern Province", "LK45": "Northern Province",
  "LK71": "North Central Province", "LK72": "North Central Province",
  "LK53": "Eastern Province", "LK51": "Eastern Province", "LK52": "Eastern Province",
  "LK21": "Central Province", "LK23": "Central Province", "LK22": "Central Province",
  "LK31": "Southern Province", "LK32": "Southern Province", "LK33": "Southern Province",
  "LK81": "Uva (Southeast)", "LK82": "Uva (Southeast)",
  "LK11": "Western Province", "LK12": "Western Province", "LK13": "Western Province",
  "LK61": "North Western Province", "LK62": "North Western Province",
  "LK91": "Sabaragamuwa Province", "LK92": "Sabaragamuwa Province"
};

const regex = /<path d="([^"]+)" id="([^"]+)" name="([^"]+)">/g;
let match;
let groupedPaths = {};

while ((match = regex.exec(svgContent)) !== null) {
  const d = match[1];
  const id = match[2];
  const name = match[3];
  
  const region = regionMapping[id] || "Other";
  
  if (!groupedPaths[region]) groupedPaths[region] = [];
  groupedPaths[region].push(`    <path id="${id}" data-name="${name}" d="${d}" />`);
}

let newSvgGroups = '';
for (const [region, paths] of Object.entries(groupedPaths)) {
  newSvgGroups += `  <g class="map-region" data-region="${region}">\n`;
  newSvgGroups += paths.join('\n');
  newSvgGroups += `\n  </g>\n`;
}

// Cultural Triangle Overlay (Anuradhapura, Polonnaruwa, and Kandy)
const culturalTriangleOverlay = `
  <g class="map-overlay" data-region="Cultural Triangle">
    <polygon points="441.7,392.5 564.1,472.4 469.1,641.6" />
    <circle cx="441.7" cy="392.5" r="6" fill="#0A6E6E" />
    <text x="450" y="388" font-family="var(--font-accent)" font-size="14px" font-weight="700" fill="#0A6E6E">Anuradhapura</text>
    <circle cx="564.1" cy="472.4" r="6" fill="#0A6E6E" />
    <text x="575" y="476" font-family="var(--font-accent)" font-size="14px" font-weight="700" fill="#0A6E6E">Polonnaruwa</text>
    <circle cx="469.1" cy="641.6" r="6" fill="#0A6E6E" />
    <text x="480" y="645" font-family="var(--font-accent)" font-size="14px" font-weight="700" fill="#0A6E6E">Kandy</text>
    <text x="460" y="520" text-anchor="middle" font-family="var(--font-accent)" font-style="italic">Cultural Triangle</text>
  </g>
`;

let html = fs.readFileSync('destinations.html', 'utf8');

const oldSvgRegex1 = /<svg viewBox="0 0 350 450" id="sri-lanka-map">[\s\S]*?<\/svg>/;
const oldSvgRegex2 = /<svg viewBox="200 0 700 1000" id="sri-lanka-map">[\s\S]*?<\/svg>/;

const newSvgStr = `<svg viewBox="200 0 700 1000" id="sri-lanka-map">\n${newSvgGroups}\n${culturalTriangleOverlay}\n</svg>`;

if(oldSvgRegex2.test(html)) {
  html = html.replace(oldSvgRegex2, newSvgStr);
} else if (oldSvgRegex1.test(html)) {
  html = html.replace(oldSvgRegex1, newSvgStr);
}

fs.writeFileSync('destinations.html', html);
console.log("Successfully rebuilt map and injected into destinations.html");
