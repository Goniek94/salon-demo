import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("renders the salon prototype shell and presentation scenario", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
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
