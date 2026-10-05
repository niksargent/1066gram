// Small shared helpers: SVG rasterising (for share images and 3D textures) and font embedding.

let fontCss = null;
// Fetches the Tapestry caption font once and returns an @font-face rule with the font inlined,
// so captions survive being drawn into a canvas.
export async function embeddedFontCss() {
  if (fontCss !== null) return fontCss;
  try {
    const css = await (await fetch('https://fonts.googleapis.com/css2?family=IM+Fell+English+SC&display=swap')).text();
    const url = css.match(/url\((https:[^)]+\.woff2)\)/)?.[1];
    if (!url) throw new Error('no font url');
    const blob = await (await fetch(url)).blob();
    const data = await new Promise((r) => { const fr = new FileReader(); fr.onload = () => r(fr.result); fr.readAsDataURL(blob); });
    fontCss = `@font-face{font-family:'IM Fell English SC';src:url(${data}) format('woff2');}`;
  } catch {
    fontCss = '';
  }
  return fontCss;
}

// Draws an SVG string into a new canvas of the given size.
export async function rasterize(svg, w, h, { font = true } = {}) {
  let src = svg;
  if (!/xmlns=/.test(src)) src = src.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
  if (font) {
    const css = await embeddedFontCss();
    if (css) src = src.replace(/<svg([^>]*)>/, `<svg$1><style>${css}</style>`);
  }
  src = src.replace(/<svg([^>]*?)\sstyle="[^"]*"/, '<svg$1').replace(/<svg /, `<svg width="${w}" height="${h}" `);
  const url = URL.createObjectURL(new Blob([src], { type: 'image/svg+xml' }));
  try {
    const img = new Image();
    img.decoding = 'async';
    await new Promise((res, rej) => { img.onload = res; img.onerror = rej; img.src = url; });
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    c.getContext('2d').drawImage(img, 0, 0, w, h);
    return c;
  } finally {
    URL.revokeObjectURL(url);
  }
}

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
export const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
