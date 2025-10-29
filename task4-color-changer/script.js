// Dynamic Color Changer
// - Generates random hex colors
// - Shows hex and a simple "name/hint" (light/dark or CSS color name when possible)
// - Enables copying hex to clipboard
// - Also allows picking a named CSS color randomly

const changeBtn = document.getElementById('change-btn');
const colorCodeEl = document.getElementById('color-code');
const colorNameEl = document.getElementById('color-name');
const colorSwatch = document.getElementById('color-swatch');
const copyBtn = document.getElementById('copy-btn');
const randomNamedBtn = document.getElementById('random-named-btn');

const namedColors = [
  'aliceblue','antiquewhite','aqua','aquamarine','azure','beige','bisque','black','blanchedalmond',
  'blue','blueviolet','brown','burlywood','cadetblue','chartreuse','chocolate','coral','cornflowerblue',
  'crimson','cyan','darkblue','darkcyan','darkgoldenrod','darkgreen','darkgrey','darkmagenta','darkolivegreen',
  'darkorange','darkorchid','darkred','darksalmon','darkseagreen','darkslateblue','darkslategray','darkturquoise',
  'darkviolet','deeppink','deepskyblue','dimgray','dodgerblue','firebrick','forestgreen','fuchsia','gold','goldenrod',
  'gray','green','greenyellow','hotpink','indigo','ivory','khaki','lavender','lavenderblush','lightblue','lightcoral',
  'lightcyan','lightgoldenrodyellow','lightgray','lightgreen','lightpink','lightsalmon','lightseagreen','lightsteelblue',
  'lime','linen','magenta','maroon','mediumaquamarine','mediumblue','mediumorchid','mediumpurple','mediumseagreen',
  'mediumslateblue','mediumspringgreen','mediumturquoise','mediumvioletred','midnightblue','mintcream','mistyrose',
  'moccasin','navajowhite','navy','oldlace','olive','olivedrab','orange','orangered','orchid','palegoldenrod','palegreen',
  'paleturquoise','palevioletred','peru','pink','plum','powderblue','purple','red','rosybrown','royalblue','saddlebrown',
  'salmon','sandybrown','seagreen','seashell','sienna','silver','skyblue','slateblue','slategray','springgreen','steelblue',
  'tan','teal','thistle','tomato','turquoise','violet','wheat','white','whitesmoke','yellow','yellowgreen'
];

// Helper: generate random hex color #RRGGBB
function randomHexColor() {
  const r = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
  const g = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
  const b = Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
  return `#${r}${g}${b}`.toUpperCase();
}

// Helper: determine if color is light or dark (relative luminance)
function isLight(hex) {
  const c = hex.replace('#','');
  const r = parseInt(c.substr(0,2),16);
  const g = parseInt(c.substr(2,2),16);
  const b = parseInt(c.substr(4,2),16);
  // formula for luminance
  const lum = 0.2126 * (r/255) + 0.7152 * (g/255) + 0.0722 * (b/255);
  return lum > 0.6; // threshold (tweakable)
}

// Update UI given a color hex (or named CSS color)
function applyColor(color) {
  // if color is a named CSS color, convert to computed hex for luminance check
  const testDiv = document.createElement('div');
  testDiv.style.display = 'none';
  testDiv.style.color = color;
  document.body.appendChild(testDiv);
  const computed = getComputedStyle(testDiv).color;
  document.body.removeChild(testDiv);

  // compute hex from rgb(a) string like "rgb(255, 0, 0)"
  let hex = color;
  const rgbMatch = computed.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
  if (rgbMatch) {
    const r = Number(rgbMatch[1]).toString(16).padStart(2,'0');
    const g = Number(rgbMatch[2]).toString(16).padStart(2,'0');
    const b = Number(rgbMatch[3]).toString(16).padStart(2,'0');
    hex = `#${r}${g}${b}`.toUpperCase();
  }

  // apply background
  document.body.style.backgroundColor = hex;
  colorSwatch.style.background = hex;
  colorCodeEl.textContent = hex;

  // set readable text color for the UI
  const light = isLight(hex);
  const textColor = light ? '#111' : '#fff';
  // Do NOT override the color of the displayed value text (hex and name/hint).
  // Clear any inline color previously set so these elements use their CSS-defined color.
  colorNameEl.style.color = '';
  colorCodeEl.style.color = '';
  colorSwatch.style.borderColor = light ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.12)';

  // simple "name/hint" — if passed color is a named CSS color show name; else show hint
  if (namedColors.includes(color.toLowerCase())) {
    colorNameEl.textContent = capitalize(color);
  } else {
    colorNameEl.textContent = light ? 'Light color' : 'Dark color';
  }

  // ensure heading contrast adjusts (optional)
  const heading = document.getElementById('main-heading');
  heading.style.color = light ? '#0b1220' : '#ffffff';
}

// Utility to capitalize
function capitalize(s) {
  if (!s) return s;
  return s.split(' ').map(p => p[0].toUpperCase() + p.slice(1)).join(' ');
}

// Copy hex to clipboard
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    copyBtn.textContent = 'Copied!';
    setTimeout(()=> (copyBtn.textContent = 'Copy Code'), 1200);
  } catch (err) {
    copyBtn.textContent = 'Copy Failed';
    setTimeout(()=> (copyBtn.textContent = 'Copy Code'), 1200);
  }
}

// Event handlers
changeBtn.addEventListener('click', () => {
  const hex = randomHexColor();
  applyColor(hex);
});

copyBtn.addEventListener('click', () => {
  copyToClipboard(colorCodeEl.textContent);
});

randomNamedBtn.addEventListener('click', () => {
  const idx = Math.floor(Math.random() * namedColors.length);
  const name = namedColors[idx];
  applyColor(name);
});

// initialize with a pleasant random color
applyColor(randomHexColor());
