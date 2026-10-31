/**
 * Tiny zero-dependency static server for local preview.
 * Usage: npm run serve  (then open http://localhost:3000)
 */
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize, sep } from "node:path";
import { gzipSync } from "node:zlib";

const root = process.cwd();
const port = Number(process.env.PORT || 3000);

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".json": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".webmanifest": "application/manifest+json",
};

createServer(async (req, res) => {
  const url = new URL(req.url || "/", "http://localhost");
  let path = decodeURIComponent(url.pathname);
  if (path.endsWith("/")) path += "index.html";

  const file = normalize(join(root, path));
  if (!file.startsWith(root + sep)) {
    res.writeHead(403, { "Content-Type": "text/plain" });
    res.end("Forbidden");
    return;
  }

  try {
    const body = await readFile(file);
    const type = types[extname(file).toLowerCase()] || "application/octet-stream";
    const compressible =
      /^(text\/|application\/(javascript|json|manifest\+json)|image\/svg\+xml)/.test(type);
    const acceptsGzip = /\bgzip\b/.test(req.headers["accept-encoding"] || "");

    let payload = body;
    const headers = {
      "Content-Type": type,
      "Cache-Control": "no-cache",
      "X-Content-Type-Options": "nosniff",
    };

    if (compressible && acceptsGzip && body.length > 1024) {
      payload = gzipSync(body);
      headers["Content-Encoding"] = "gzip";
      headers["Vary"] = "Accept-Encoding";
    }
    headers["Content-Length"] = payload.length;

    res.writeHead(200, headers);
    res.end(payload);
  } catch {
    try {
      const body = await readFile(join(root, "404.html"));
      res.writeHead(404, { "Content-Type": types[".html"] });
      res.end(body);
    } catch {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Not found");
    }
  }
}).listen(port, () => {
  console.log(`\n  faiz.dev is running at http://localhost:${port}\n`);
});
