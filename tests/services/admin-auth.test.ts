import { beforeEach, describe, expect, it, vi } from "vitest"

const auth = { getSession: vi.fn(), signInWithPassword: vi.fn(), signOut: vi.fn() }
vi.mock("@/lib/supabase", () => ({ supabase: { auth } }))
vi.mock("@/config/app.config", () => ({ appConfig: { adminEmail: "admin@fotocall.test" } }))

const { getAdminSession, signInAdmin, signOutAdmin } = await import("@/services/admin-auth")
const adminUser = { app_metadata: { role: "admin" }, is_anonymous: false }

beforeEach(() => vi.clearAllMocks())

describe("signInAdmin", () => {
  it("signs in with the public email and the typed password", async () => {
    auth.signInWithPassword.mockResolvedValue({ data: { session: { user: adminUser } }, error: null })
    await expect(signInAdmin("secret-password")).resolves.toEqual({ isAdmin: true })
    expect(auth.signInWithPassword).toHaveBeenCalledWith({ email: "admin@fotocall.test", password: "secret-password" })
  })
  it("throws on a wrong password", async () => {
    auth.signInWithPassword.mockResolvedValue({ data: { session: null }, error: new Error("Invalid login") })
    await expect(signInAdmin("x")).rejects.toThrow()
  })
  it("signs out and throws when the user has no admin role", async () => {
    auth.signInWithPassword.mockResolvedValue({ data: { session: { user: { app_metadata: {}, is_anonymous: false } } }, error: null })
    await expect(signInAdmin("x")).rejects.toThrow(/not an admin/)
    expect(auth.signOut).toHaveBeenCalled()
  })
})

describe("getAdminSession / signOutAdmin", () => {
  it("reads the stored session", async () => {
    auth.getSession.mockResolvedValue({ data: { session: null }, error: null })
    await expect(getAdminSession()).resolves.toEqual({ isAdmin: false })
  })
  it("throws when sign-out fails", async () => {
    auth.signOut.mockResolvedValue({ error: new Error("x") })
    await expect(signOutAdmin()).rejects.toThrow()
  })
})
