// Every pure logic file ships WITH its unit test (12-TESTING_CI): src/{utils,i18n,stores,services}
// → tests/<same path>.test.ts, or a first line `// no-unit-test: <reason>`. utils/animations exempt.
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs"
import { join, relative } from "node:path"

const SRC = "src"
const DIRS = ["utils", "i18n", "stores", "services"]

const walk = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    return statSync(path).isDirectory() ? walk(path) : [path]
  })

const missing = DIRS
  .filter((d) => existsSync(join(SRC, d)))
  .flatMap((d) => walk(join(SRC, d)))
  .filter((f) => f.endsWith(".ts") && !f.endsWith(".d.ts") && !f.includes(`${join("utils", "animations")}`))
  .filter((f) => !/^\/\/ no-unit-test: .{8,}/.test(readFileSync(f, "utf8").split("\n")[0]))
  .map((f) => relative(SRC, f))
  .filter((rel) => !existsSync(join("tests", rel.replace(/\.ts$/, ".test.ts"))))

if (missing.length) {
  console.error(missing.map((f) => `  ✗ src/${f} → write tests/${f.replace(/\.ts$/, ".test.ts")}`).join("\n"))
  process.exit(1)
}
console.log("every logic file has its unit test")
