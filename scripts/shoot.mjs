// Scroll through the live page at a normal viewport and screenshot each section.
// Usage: node scripts/shoot.mjs http://localhost:5173 out/shots [width] [height]
import puppeteer from "puppeteer-core";
import { mkdirSync } from "node:fs";
import { resolve } from "node:path";

const [url = "http://localhost:5173", outDir = "out/shots", w = "1440", h = "900"] = process.argv.slice(2);
mkdirSync(outDir, { recursive: true });
const executablePath = resolve("node_modules/.remotion/chrome-headless-shell/win64/chrome-headless-shell-win64/chrome-headless-shell.exe");
const browser = await puppeteer.launch({ executablePath, headless: true, args: ["--no-sandbox", "--disable-gpu", "--hide-scrollbars"] });
const page = await browser.newPage();
await page.setViewport({ width: Number(w), height: Number(h), deviceScaleFactor: 1 });
await page.goto(url, { waitUntil: "networkidle0" });
await new Promise((r) => setTimeout(r, 1500));
const ids = await page.$$eval("section[id], footer", (els) => els.map((e) => e.id || "footer"));
for (const id of ids) {
  await page.evaluate((id) => {
    const el = id === "footer" ? document.querySelector("footer") : document.getElementById(id);
    el?.scrollIntoView({ block: "start", behavior: "instant" });
    window.scrollBy(0, -70);
  }, id);
  await new Promise((r) => setTimeout(r, 1400));
  await page.screenshot({ path: `${outDir}/${id}.png` });
  console.log("shot", id);
}
await browser.close();
