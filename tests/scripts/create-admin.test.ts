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
  it("needs the email", () => expect(() => checkEnv({ ...env, ADMIN_EMAIL: "" }, [])).toThrow(/must be set/))
  it("gives a long random password when none is set (magic link only)", () =>
    expect(checkEnv({ ...env, ADMIN_PASSWORD: "" }, []).password.length).toBeGreaterThan(30))
  it("refuses a short password", () => expect(() => checkEnv({ ...env, ADMIN_PASSWORD: "short" }, [])).toThrow(/at least/))
})
