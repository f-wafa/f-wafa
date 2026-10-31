/**
 * Inlines assets/icons/sprite.svg into every HTML page.
 * Replaces either the `<!--SPRITE-->` placeholder or a previously injected sprite.
 * Only symbols referenced by the page are injected (plus icons created at runtime).
 */
import { readFile, writeFile } from "node:fs/promises";

const sprite = await readFile("assets/icons/sprite.svg", "utf8");
const pages = ["index.html", "resume.html", "404.html"];
const injected =
  /<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg" aria-hidden="true" style="position:absolute;width:0;height:0;overflow:hidden">[\s\S]*?<\/svg>/;

const symbols = new Map();
for (const block of sprite.match(/<symbol\b[\s\S]*?<\/symbol>/g) || []) {
  const id = block.match(/<symbol[^>]*\bid="([^"]+)"/)?.[1];
  if (id) symbols.set(id, block);
}

// Icons created by main.js rather than present in the static markup.
const runtimeIcons = new Set(["i-paw-print"]);

for (const page of pages) {
  let html = await readFile(page, "utf8");
  const referenced = new Set([
    ...[...html.matchAll(/href="#([^"]+)"/g)].map((match) => match[1]),
    ...runtimeIcons,
  ]);
  const used = [...symbols.entries()]
    .filter(([id]) => referenced.has(id))
    .map(([, block]) => block);

  for (const id of referenced) {
    if ((id.startsWith("i-") || id.startsWith("b-")) && !symbols.has(id)) {
      console.warn(`Unknown icon #${id} referenced in ${page}`);
    }
  }

  const markup = `<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style="position:absolute;width:0;height:0;overflow:hidden">\n${used.join("\n")}\n</svg>`;

  if (html.includes("<!--SPRITE-->")) {
    html = html.replace("<!--SPRITE-->", markup);
  } else if (injected.test(html)) {
    html = html.replace(injected, markup);
  } else {
    console.warn(`No sprite slot found in ${page}`);
    continue;
  }

  await writeFile(page, html);
  console.log(`Updated ${page} (${used.length} icons)`);
}
