import { readdirSync, renameSync, rmSync, mkdirSync } from "node:fs";
import { join, resolve } from "path";

const source = resolve("dist/src");
const target = resolve("dist");

function moveRecursively(from: string, to: string) {
  const entries = readdirSync(from, { withFileTypes: true });
  for (const entry of entries) {
    const fromPath = join(from, entry.name);
    const toPath = join(to, entry.name);

    if (entry.isDirectory()) {
      mkdirSync(toPath, { recursive: true });
      moveRecursively(fromPath, toPath);
    } else {
      renameSync(fromPath, toPath);
    }
  }
}

// Move all files from dist/src to dist/
try {
  moveRecursively(source, target);
  rmSync(source, { recursive: true, force: true });
  console.log("✅ Flattened dist/src into dist/");
} catch (err) {
  console.error("❌ Failed to flatten dist/src:", err);
}