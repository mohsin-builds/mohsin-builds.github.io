import { chromium } from "playwright";
import { mkdir, readFile, writeFile, stat } from "node:fs/promises";
import { createHash } from "node:crypto";
import { join } from "node:path";

const DEMO = "https://app.mohsinlabs.com/demo";
const OUTPUT = "assets/projects/mohsin-os";
const MODULES = [
  { id: "hq", file: "cover.jpg", expect: "#cards article" },
  { id: "crm", file: "preview-01.jpg", expect: ".ml-unified-sidebar" },
  { id: "business", file: "preview-02.jpg", expect: ".ml-unified-sidebar" },
  { id: "agents", file: "preview-03.jpg", expect: ".ml-unified-sidebar" },
];
const safe = (value) => !/Mohsin Iqbal|mohsinbuilds@gmail\.com|[A-Za-z0-9_-]{20,}\.supabase\.co/i.test(value);
await mkdir(OUTPUT, { recursive: true });
const browser = await chromium.launch({ headless: true, args: ["--no-sandbox"] });
const context = await browser.newContext({
  viewport: { width: 1440, height: 1050 },
  deviceScaleFactor: 1,
  colorScheme: "light",
  reducedMotion: "reduce",
});
const page = await context.newPage();
const manifest = {
  source: DEMO,
  policy: "Public fictional-data demo only — never screenshot authenticated workspace",
  capturedAt: new Date().toISOString(),
  assets: [],
};
async function waitForModule(id, expect) {
  await page.frameLocator("iframe.ml-mirror-frame").locator('body[data-demo-module="' + id + '"]').waitFor({ timeout: 30000 });
  await page.frameLocator("iframe.ml-mirror-frame").locator(expect).first().waitFor({ timeout: 30000 });
  await page.locator(".ml-mirror-loading").waitFor({ state: "hidden", timeout: 30000 });
  await page.waitForTimeout(900);
  const text = await page.frameLocator("iframe.ml-mirror-frame").locator("body").innerText();
  if (!safe(text)) throw new Error("Screenshot gate blocked possible private workspace data: " + id);
  if (text.trim().length < 200) throw new Error("Dashboard is blank or incomplete: " + id);
}
async function capture(file) {
  const path = join(OUTPUT, file);
  await page.screenshot({ path, type: "jpeg", quality: 84, animations: "disabled" });
  const bytes = await readFile(path);
  if (bytes.byteLength < 25000) throw new Error("Image is suspiciously small: " + file);
  manifest.assets.push({ path, bytes: bytes.byteLength, sha256: createHash("sha256").update(bytes).digest("hex") });
  process.stdout.write("Captured " + path + " " + bytes.byteLength + " bytes\n");
}
try {
  await page.goto(DEMO, { waitUntil: "domcontentloaded", timeout: 45000 });
  for (const mod of MODULES) {
    if (mod.id !== "hq") {
      // Navigate the actual public demo. The iframe is sandboxed to an opaque origin.
      // This is a deterministic test-only navigation event, never a private API call.
      await page.evaluate((route) => {
        const frame = document.querySelector("iframe.ml-mirror-frame");
        if (!frame?.contentWindow) throw new Error("Public demo frame missing");
        window.dispatchEvent(new MessageEvent("message", {
          source: frame.contentWindow,
          data: { type: "ml-demo-navigation", route },
        }));
      }, "/" + mod.id);
    }
    await waitForModule(mod.id, mod.expect);
    await capture(mod.file);
    if (mod.id === "hq") {
      const dest = join(OUTPUT, "social.jpg");
      await page.screenshot({
        path: dest, type: "jpeg", quality: 88,
        clip: { x: 0, y: 0, width: 1200, height: 630 },
        animations: "disabled",
      });
      const buf = await readFile(dest);
      if (buf.byteLength < 20000) throw new Error("Social share image failed");
      manifest.assets.push({ path: dest, bytes: buf.byteLength, sha256: createHash("sha256").update(buf).digest("hex") });
    }
  }
  const sourceFile = "js/projects.js";
  let source = await readFile(sourceFile, "utf8");
  for (const name of ["cover","preview-01","preview-02","preview-03"]) {
    const old = "assets/projects/mohsin-os/" + name + ".svg";
    if (!source.includes(old) && !source.includes("assets/projects/mohsin-os/" + name + ".jpg"))
      throw new Error("Expected project visual reference missing: " + old);
    source = source.replaceAll(old, "assets/projects/mohsin-os/" + name + ".jpg");
  }
  await writeFile(sourceFile, source);
  await writeFile(join(OUTPUT, "visual-manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
} finally {
  await browser.close();
}