export function buildMenuFallbackSvg(name: string): string {
  const safeName = escapeSvg(name);
  const svg = `
<svg xmlns='http://www.w3.org/2000/svg' width='480' height='360' viewBox='0 0 480 360'>
  <defs>
    <linearGradient id='bg' x1='0' x2='1' y1='0' y2='1'>
      <stop offset='0%' stop-color='#faf7f2'/>
      <stop offset='100%' stop-color='#f2eee7'/>
    </linearGradient>
    <linearGradient id='plate' x1='0' x2='1' y1='0' y2='1'>
      <stop offset='0%' stop-color='#ffffff'/>
      <stop offset='100%' stop-color='#f1f1f1'/>
    </linearGradient>
  </defs>
  <rect width='480' height='360' fill='url(#bg)'/>
  <ellipse cx='245' cy='188' rx='130' ry='90' fill='url(#plate)' stroke='#dcd8d1' stroke-width='4'/>
  <ellipse cx='245' cy='188' rx='82' ry='52' fill='#f9f5ef' stroke='#e8e2d7' stroke-width='3'/>
  <rect x='68' y='72' width='18' height='220' rx='9' transform='rotate(-16 68 72)' fill='#6f5b4a'/>
  <rect x='102' y='72' width='18' height='220' rx='9' transform='rotate(-16 102 72)' fill='#8b745f'/>
  <ellipse cx='360' cy='100' rx='34' ry='22' fill='#d9d3ca'/>
  <rect x='350' y='98' width='14' height='142' rx='7' fill='#d9d3ca'/>
  <circle cx='245' cy='188' r='26' fill='#d46a4b' opacity='0.85'/>
  <text x='240' y='314' text-anchor='middle' fill='#5b5349' font-size='26' font-family='Arial, sans-serif' font-weight='600'>${safeName}</text>
</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function escapeSvg(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
