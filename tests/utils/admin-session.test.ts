import type { Session } from "@supabase/supabase-js"
import { describe, expect, it } from "vitest"
import { toAdminSession } from "@/utils/admin-session"

const session = (user: object) => ({ user }) as unknown as Session

describe("toAdminSession", () => {
  it("is not admin without a session", () => expect(toAdminSession(null)).toEqual({ isAdmin: false }))
  it("is admin with app_metadata.role admin", () =>
    expect(toAdminSession(session({ app_metadata: { role: "admin" }, is_anonymous: false })).isAdmin).toBe(true))
  it("a guest (anonymous) is not admin", () =>
    expect(toAdminSession(session({ app_metadata: {}, is_anonymous: true })).isAdmin).toBe(false))
  it("an anonymous user claiming the role is not admin", () =>
    expect(toAdminSession(session({ app_metadata: { role: "admin" }, is_anonymous: true })).isAdmin).toBe(false))
  it("user_metadata is never read", () =>
    expect(toAdminSession(session({ app_metadata: {}, user_metadata: { role: "admin" } })).isAdmin).toBe(false))
})
