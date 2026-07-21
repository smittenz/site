import { readdir, readFile, rm, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = path.join(projectRoot, "public");
const distDir = path.join(projectRoot, "dist");
const dryRun = process.argv.includes("--dry-run");

async function listFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await listFiles(absolutePath));
    else if (entry.isFile()) files.push(absolutePath);
  }

  return files;
}

function toWebPath(absolutePath, root) {
  return path.relative(root, absolutePath).split(path.sep).join("/");
}

function formatMiB(bytes) {
  return `${(bytes / 1024 / 1024).toFixed(2)} MiB`;
}

const sourceFiles = [
  ...await listFiles(path.join(projectRoot, "src")),
  path.join(projectRoot, "index.html"),
];
const sourceText = (await Promise.all(sourceFiles.map(file => readFile(file, "utf8")))).join("\n");
const publicFiles = await listFiles(publicDir);
const publicByPath = new Map(publicFiles.map(file => [toWebPath(file, publicDir), file]));
const keep = new Set(["_redirects"]);

// Keep files referenced with their normal root-relative public URL.
for (const relativePath of publicByPath.keys()) {
  if (sourceText.includes(`/${relativePath}`)) keep.add(relativePath);
}

// StudyPage builds a small set of /assets URLs through asset("filename").
for (const match of sourceText.matchAll(/\basset\(\s*["'`]([^"'`]+)["'`]\s*\)/g)) {
  keep.add(`assets/${match[1]}`);
}

// Referenced Deficit GLTF models load sibling buffers and textures at runtime.
// Preserve each complete package (including its license) while omitting unused
// sibling models. Other model formats used by this site are self-contained.
const modelPrefixes = new Set();
for (const relativePath of keep) {
  if (!relativePath.startsWith("models/deficit/")) continue;
  const parts = relativePath.split("/");
  modelPrefixes.add(`${parts.slice(0, 3).join("/")}/`);
}
for (const relativePath of publicByPath.keys()) {
  if ([...modelPrefixes].some(prefix => relativePath.startsWith(prefix))) keep.add(relativePath);
}

const missingReferences = [...keep].filter(relativePath => !publicByPath.has(relativePath));
if (missingReferences.length) {
  throw new Error(`Referenced public files are missing:\n${missingReferences.join("\n")}`);
}

const unused = [...publicByPath.entries()].filter(([relativePath]) => !keep.has(relativePath));
const unusedBytes = (await Promise.all(unused.map(([, file]) => stat(file).then(info => info.size))))
  .reduce((total, size) => total + size, 0);

if (!dryRun) {
  for (const [relativePath] of unused) {
    const builtFile = path.join(distDir, ...relativePath.split("/"));
    await rm(builtFile, { force: true });
  }
}

const action = dryRun ? "Would prune" : "Pruned";
console.log(`${action} ${unused.length} unused public files (${formatMiB(unusedBytes)}); ${keep.size} runtime files remain.`);
