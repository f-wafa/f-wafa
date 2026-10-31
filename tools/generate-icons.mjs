/**
 * Generates the inline SVG sprite used across the site.
 *
 * Brand marks come from Simple Icons, UI marks from Lucide. Both are MIT /
 * ISC licensed. Run `node tools/generate-icons.mjs` to refresh the sprite,
 * then paste the output into the `<!--SPRITE-->` slot in each HTML page.
 */
import { writeFile, mkdir } from "node:fs/promises";

const BRANDS = [
  "github",
  "gmail",
  "instagram",
  "tiktok",
  "youtube",
  "buymeacoffee",
  "html5",
  "css",
  "javascript",
  "typescript",
  "react",
  "nextdotjs",
  "tailwindcss",
  "markdown",
  "nodedotjs",
  "mongodb",
  "git",
  "npm",
  "figma",
  "canva",
  "vercel",
  "githubpages",
];

const UI = [
  "menu",
  "x",
  "sun",
  "moon",
  "arrow-right",
  "arrow-up-right",
  "arrow-up",
  "arrow-down",
  "arrow-left",
  "download",
  "mail",
  "copy",
  "check",
  "send",
  "search",
  "coffee",
  "cat",
  "heart",
  "sparkles",
  "terminal",
  "code-xml",
  "database",
  "wrench",
  "external-link",
  "volume-2",
  "volume-x",
  "paw-print",
  "map-pin",
  "graduation-cap",
  "target",
  "rocket",
  "monitor-smartphone",
  "git-branch",
  "command",
  "file-text",
  "briefcase",
  "message-circle",
  "chevron-down",
  "circle-check",
  "alert-circle",
  "music-2",
  "palette",
  "layout-grid",
  "keyboard",
  "mouse-pointer-click",
  "refresh-cw",
  "printer",
  "corner-down-left",
];

const BRAND_BASE = "https://cdn.jsdelivr.net/npm/simple-icons@15/icons";
const UI_BASE = "https://unpkg.com/lucide-static@latest/icons";

async function get(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.text();
}

function inner(svg) {
  return svg
    .replace(/^[\s\S]*?<svg[^>]*>/, "")
    .replace(/<\/svg>\s*$/, "")
    .trim();
}

const symbols = [];

/* LinkedIn was removed from Simple Icons; keep the classic glyph inline. */
symbols.push(
  `  <symbol id="b-linkedin" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zM7.119 20.452H3.555V9h3.564v11.452z"/></symbol>`,
);

for (const name of BRANDS) {
  const svg = await get(`${BRAND_BASE}/${name}.svg`);
  symbols.push(
    `  <symbol id="b-${name}" viewBox="0 0 24 24" fill="currentColor">${inner(svg)}</symbol>`,
  );
}

for (const name of UI) {
  const svg = await get(`${UI_BASE}/${name}.svg`);
  symbols.push(
    `  <symbol id="i-${name}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${inner(svg)}</symbol>`,
  );
}

const sprite = `<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style="position:absolute;width:0;height:0;overflow:hidden">
${symbols.join("\n")}
</svg>
`;

await mkdir("assets/icons", { recursive: true });
await writeFile("assets/icons/sprite.svg", sprite);
console.log(`Wrote assets/icons/sprite.svg (${(sprite.length / 1024).toFixed(1)} KB)`);
