/* Every data-i18n key on a bilingual page must have an English string.
   Usage: node tools/check-i18n.js   (exit 1 on any missing key) */
const fs = require("fs"), path = require("path"), vm = require("vm");
const root = path.join(__dirname, "..");
const ctx = {};
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(root, "assets/i18n.js"), "utf8") +
  ";this.I18N=I18N;this.UI_JA=UI_JA;", ctx);
vm.runInContext(fs.readFileSync(path.join(root, "assets/data.js"), "utf8") +
  ";this.SCENES=SCENES;", ctx);
const en = ctx.I18N.en, used = new Set();
let missing = 0;

for (const f of fs.readdirSync(root).filter(f => f.endsWith(".html"))) {
  const html = fs.readFileSync(path.join(root, f), "utf8");
  if (!html.includes("assets/i18n.js")) continue;          // repair pages: English only
  const keys = [...html.matchAll(/data-i18n(?:-ph|-content)?="([^"]+)"/g)].map(m => m[1]);
  if (html.includes("data-gallery")) Object.keys(ctx.SCENES).forEach(k => keys.push("scene." + k));
  for (const k of new Set(keys)) {
    used.add(k);
    if (en[k] == null) { console.log("MISSING", f, k); missing++; }
  }
}
for (const k of Object.keys(en)) if (!used.has(k)) console.log("unused ", k);
for (const k of Object.keys(ctx.UI_JA)) if (!["menu","close","stepMissing","anyMissing","restored","saved","sending","failed"].includes(k))
  console.log("unknown UI_JA key", k);
console.log(missing ? missing + " missing" : "all keys translated");
process.exit(missing ? 1 : 0);
