import { beforeEach, describe, expect, it, vi } from "vitest"

const auth = { getSession: vi.fn(), signInAnonymously: vi.fn() }
vi.mock("@/lib/supabase", () => ({ supabase: { auth } }))

const { ensureGuestSession } = await import("@/services/auth")

beforeEach(() => vi.clearAllMocks())

describe("ensureGuestSession", () => {
  it("reuses the stored session, so a guest keeps owning their photos", async () => {
    auth.getSession.mockResolvedValue({ data: { session: { user: { id: "u1" } } }, error: null })
    await expect(ensureGuestSession()).resolves.toBe("u1")
    expect(auth.signInAnonymously).not.toHaveBeenCalled()
  })

  it("signs in anonymously when there is no session", async () => {
    auth.getSession.mockResolvedValue({ data: { session: null }, error: null })
    auth.signInAnonymously.mockResolvedValue({ data: { user: { id: "u2" } }, error: null })
    await expect(ensureGuestSession()).resolves.toBe("u2")
  })

  it("throws instead of returning a fallback", async () => {
    auth.getSession.mockResolvedValue({ data: { session: null }, error: null })
    auth.signInAnonymously.mockResolvedValue({ data: { user: null }, error: new Error("rate limited") })
    await expect(ensureGuestSession()).rejects.toThrow("rate limited")
  })
})
