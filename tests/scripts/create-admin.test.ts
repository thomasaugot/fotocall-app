import { describe, expect, it } from "vitest"
// @ts-expect-error plain .mjs script, no types
import { checkEnv } from "../../scripts/create-admin.mjs"

const env = { SUPABASE_URL: "http://127.0.0.1:54321", SUPABASE_SERVICE_ROLE_KEY: "k", ADMIN_EMAIL: "a@b.test", ADMIN_PASSWORD: "long-enough-pw" }

describe("create-admin checkEnv", () => {
  it("accepts a local target", () => expect(checkEnv(env, []).email).toBe("a@b.test"))
  it("refuses Cloud without --allow-cloud", () =>
    expect(() => checkEnv({ ...env, SUPABASE_URL: "https://x.supabase.co" }, [])).toThrow(/not local/))
  it("allows Cloud with --allow-cloud", () =>
    expect(checkEnv({ ...env, SUPABASE_URL: "https://x.supabase.co" }, ["--allow-cloud"]).url).toContain("supabase.co"))
  it("needs every variable", () => expect(() => checkEnv({ ...env, ADMIN_PASSWORD: "" }, [])).toThrow(/must be set/))
  it("refuses a short password", () => expect(() => checkEnv({ ...env, ADMIN_PASSWORD: "short" }, [])).toThrow(/at least/))
})
