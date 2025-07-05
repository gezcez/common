import { readdirSync, renameSync, rmSync, mkdirSync, copyFile } from "node:fs"
import { join, resolve } from "path"

const source = resolve("./src")
const target = resolve("./dist/src")

function copyRecursively(from: string, to: string) {
	const entries = readdirSync(from, { withFileTypes: true })
	for (const entry of entries) {
		const fromPath = join(from, entry.name)
		const toPath = join(to, entry.name)

		if (entry.isDirectory()) {
			mkdirSync(toPath, { recursive: true })
			copyRecursively(fromPath, toPath)
		} else {
			copyFile(fromPath, toPath, (e)=>{
				if (e) console.error(e)
			})
		}
	}
}

// Move all files from dist/src to dist/
try {
	copyFile(join(source,"../index.ts"),join(target,"../index.ts"),(e)=>{
		if (e) console.error(e)
	})
	copyRecursively(source, target)
	rmSync(join(target,"../tsconfig.tsbuildinfo"))
	//   rmSync(source, { recursive: true, force: true });
	console.log("✅ Flattened dist/src into dist/")
} catch (err) {
	console.error("❌ Failed to flatten dist/src:", err)
}
