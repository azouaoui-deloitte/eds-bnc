/* Converts the local EDS pre-decoration markup into DA's table-based blocks. */
const { mkdir, readFile, writeFile } = require('node:fs/promises');
const { dirname, join } = require('node:path');

const root = join(__dirname, '..');
const liveAssetBase = 'https://main--eds-bnc--azouaoui-deloitte.aem.live';

function children(html) {
  const result = [];
  const tag = /<\/?div\b[^>]*>/gi;
  let depth = 0;
  let start = -1;
  let match = tag.exec(html);
  while (match) {
    const closing = match[0].startsWith('</');
    if (!closing && depth === 0) start = match.index;
    depth += closing ? -1 : 1;
    if (closing && depth === 0 && start >= 0) {
      result.push(html.slice(start, tag.lastIndex));
      start = -1;
    }
    match = tag.exec(html);
  }
  return result;
}

function inner(div) {
  return div.replace(/^<div\b[^>]*>/i, '').replace(/<\/div>\s*$/i, '');
}

function blockName(classes) {
  const values = classes.split(/\s+/).filter(Boolean);
  const base = values[0];
  const variant = values.find((value) => value.startsWith(`${base}-`));
  const title = base.replace(/(^|-)\w/g, (m) => m.toUpperCase());
  return variant ? `${title} (${variant.slice(base.length + 1)})` : title;
}

function table(name, rows) {
  const body = rows.map((cells) => `<tr>${cells.map((cell) => `<td>${cell.trim()}</td>`).join('')}</tr>`).join('\n');
  return `<table>\n  <thead><tr><th colspan="${Math.max(...rows.map((row) => row.length), 1)}">${name}</th></tr></thead>\n  <tbody>\n${body}\n  </tbody>\n</table>`;
}

function convertBlock(block) {
  const match = block.match(/^<div\s+class="([^"]+)"[^>]*>/i);
  if (!match) return block;
  const direct = children(inner(block));
  const rows = direct.map((row) => children(inner(row)).map(inner));
  return table(blockName(match[1]), rows.length ? rows : [[inner(block)]]);
}

function absolutizeLocalImages(html, sourcePath) {
  const directory = dirname(sourcePath);
  const absoluteImages = html.replace(/\bsrc=(['"])\.\/images\/([^'"]+)\1/gi, (_match, quote, asset) => (
    `src=${quote}${liveAssetBase}/${directory}/images/${asset}${quote}`
  ));
  return absoluteImages.replace(/<picture>\s*<img\s+src=(['"])(https:\/\/[^'"]+)\1([^>]*)>\s*<\/picture>/gi, (_match, quote, src, attributes) => (
    `<picture><source srcset=${quote}${src}${quote}><source srcset=${quote}${src}${quote} media="(min-width: 600px)"><img src=${quote}${src}${quote}${attributes} loading="lazy"></picture>`
  ));
}

function convertSection(section) {
  let output = inner(section);
  const block = /<div\s+class="(?:hero|cards|columns|section-metadata|metadata)[^"]*"[^>]*>/i;
  const parts = [];
  while (output.trim()) {
    const found = output.match(block);
    if (!found || found.index === undefined) {
      parts.push(output.trim());
      break;
    }
    if (found.index > 0) parts.push(output.slice(0, found.index).trim());
    const start = found.index;
    const candidate = output.slice(start);
    const [node] = children(candidate);
    parts.push(convertBlock(node));
    output = candidate.slice(node.length);
  }
  return `<div>\n${parts.filter(Boolean).join('\n')}\n</div>`;
}

async function exportDocument(path) {
  const source = await readFile(join(root, path), 'utf8');
  const converted = absolutizeLocalImages(children(source).map(convertSection).join('\n\n'), path);
  const target = join(root, 'da-export', path.replace('.plain.html', '.html'));
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, `${converted}\n`);
  return target;
}

(async () => {
  const exports = await Promise.all([
    'particuliers/hypotheque.plain.html',
    'particuliers/assurances.plain.html',
  ].map(exportDocument));
  process.stdout.write(`${exports.join('\n')}\n`);
})();
