import { beforeEach, describe, expect, it, vi } from "vitest"

const auth = { getSession: vi.fn(), signInWithOtp: vi.fn(), signOut: vi.fn() }
vi.mock("@/lib/supabase", () => ({ supabase: { auth } }))

const { getAdminSession, sendAdminLink, signOutAdmin } = await import("@/services/admin-auth")

beforeEach(() => vi.clearAllMocks())

describe("sendAdminLink", () => {
  it("sends a magic link that never creates a user, back to the admin page", async () => {
    auth.signInWithOtp.mockResolvedValue({ error: null })
    await sendAdminLink("  admin@fotocall.test ", "https://app.test/admin")
    expect(auth.signInWithOtp).toHaveBeenCalledWith({
      email: "admin@fotocall.test",
      options: { shouldCreateUser: false, emailRedirectTo: "https://app.test/admin" },
    })
  })
  it("answers an unknown address like a known one (never says who is an admin)", async () => {
    auth.signInWithOtp.mockResolvedValue({ error: { code: "otp_disabled", message: "Signups not allowed for otp" } })
    await expect(sendAdminLink("nobody@x.test", "/admin")).resolves.toBeUndefined()
  })
  it("throws a real failure (rate limit, network)", async () => {
    auth.signInWithOtp.mockResolvedValue({ error: { code: "over_email_send_rate_limit", message: "rate limit" } })
    await expect(sendAdminLink("admin@fotocall.test", "/admin")).rejects.toBeTruthy()
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
