import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

/** Strona `/` jest prerenderowana statycznie, wiec test czyta gotowy HTML z builda. */
async function renderedHtml() {
  return readFile(new URL("../.next/server/app/index.html", import.meta.url), "utf8");
}

test("renders the salon prototype shell and presentation scenario", async () => {
  const html = await renderedHtml();

  assert.match(html, /SalonOS/);
  assert.match(html, /Pracownia/);
  assert.match(html, /Panel recepcji/i);
  assert.match(html, /Widok zasobów/);
  assert.match(html, /Planowanie zasobów/);
  assert.match(html, /Anna Kowalska/);
  assert.match(html, /Lista rezerwowa/);
  assert.match(html, /Symulacja na żywo/);
  assert.match(html, /Dziennik/);
  assert.doesNotMatch(html, /Your site is taking shape/);
  assert.doesNotMatch(html, /codex-preview/);
});

test("keeps the prototype architecture documented and starter preview removed", async () => {
  const [architecture, plan, packageJson] = await Promise.all([
    readFile(new URL("../docs/ARCHITECTURE.md", import.meta.url), "utf8"),
    readFile(new URL("../docs/IMPLEMENTATION_PLAN.md", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  assert.match(architecture, /plan terapii nie jest pakietem/);
  assert.match(architecture, /adapterem HTTP/);
  assert.match(plan, /Plan dalszego rozwoju po akceptacji/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  await assert.rejects(access(new URL("../app/_sites-preview/SkeletonPreview.tsx", import.meta.url)));
});

test("runs on Next.js without the Cloudflare Workers stack", async () => {
  const packageJson = JSON.parse(
    await readFile(new URL("../package.json", import.meta.url), "utf8"),
  );
  const all = { ...packageJson.dependencies, ...packageJson.devDependencies };

  assert.ok(all.next, "next musi byc zaleznoscia projektu");
  for (const removed of ["vinext", "wrangler", "@cloudflare/vite-plugin", "vite"]) {
    assert.equal(all[removed], undefined, `${removed} nie powinien juz byc w package.json`);
  }

  assert.equal(packageJson.scripts.build, "next build");
  await assert.rejects(access(new URL("../vite.config.ts", import.meta.url)));
  await assert.rejects(access(new URL("../worker/index.ts", import.meta.url)));
});
