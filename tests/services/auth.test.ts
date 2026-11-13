import { beforeEach, describe, expect, it, vi } from "vitest"

const auth = { getSession: vi.fn(), signInAnonymously: vi.fn(), updateUser: vi.fn() }
vi.mock("@/lib/supabase", () => ({ supabase: { auth } }))

const { ensureGuestSession, labelGuest } = await import("@/services/auth")

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

  it("asks the browser to keep the storage once signed in", async () => {
    const persist = vi.fn(() => Promise.resolve(true))
    vi.stubGlobal("navigator", { storage: { persist } })
    auth.getSession.mockResolvedValue({ data: { session: null }, error: null })
    auth.signInAnonymously.mockResolvedValue({ data: { user: { id: "u3" } }, error: null })
    await ensureGuestSession()
    expect(persist).toHaveBeenCalledTimes(1)
    vi.unstubAllGlobals()
  })

  it("throws instead of returning a fallback", async () => {
    auth.getSession.mockResolvedValue({ data: { session: null }, error: null })
    auth.signInAnonymously.mockResolvedValue({ data: { user: null }, error: new Error("rate limited") })
    await expect(ensureGuestSession()).rejects.toThrow("rate limited")
  })

  it("creates ONE anonymous user when asked twice at the same moment", async () => {
    auth.getSession.mockResolvedValue({ data: { session: null }, error: null })
    auth.signInAnonymously.mockResolvedValue({ data: { user: { id: "u9" } }, error: null })
    const [a, b] = await Promise.all([ensureGuestSession(), ensureGuestSession()])
    expect([a, b]).toEqual(["u9", "u9"])
    expect(auth.signInAnonymously).toHaveBeenCalledTimes(1)
  })
})

describe("labelGuest", () => {
  const session = (name?: string) => ({ data: { session: { user: { id: "u1", user_metadata: name ? { display_name: name } : {} } } }, error: null })
  it("writes the guest's name on their account", async () => {
    auth.getSession.mockResolvedValue(session())
    auth.updateUser.mockResolvedValue({ error: null })
    await labelGuest("Abuela Carmen")
    expect(auth.updateUser).toHaveBeenCalledWith({ data: { display_name: "Abuela Carmen" } })
  })
  it("does nothing when the name is already there", async () => {
    auth.getSession.mockResolvedValue(session("Abuela Carmen"))
    await labelGuest("Abuela Carmen")
    expect(auth.updateUser).not.toHaveBeenCalled()
  })
})
