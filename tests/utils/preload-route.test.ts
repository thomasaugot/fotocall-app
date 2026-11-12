import { describe, expect, it, vi } from "vitest"

const gallery = vi.fn(() => Promise.resolve({ GalleryPage: () => null }))
const notFound = vi.fn(() => Promise.reject(new Error("chunk 404")))
const galleryData = vi.fn(() => new Promise<void>(() => {}))   // a query that never answers

vi.mock("@/app/route-modules", () => ({
  routeModules: { gallery, notFound },
  routeData: { gallery: galleryData },
}))
vi.mock("@/lib/query-client", () => ({ queryClient: {} }))

const { preloadRoute } = await import("@/utils/preload-route")

describe("preloadRoute", () => {
  it("loads the module of a known lazy route and starts its data", async () => {
    await preloadRoute("/galeria?x=1")
    expect(gallery).toHaveBeenCalledTimes(1)
    expect(galleryData).toHaveBeenCalledTimes(1)
  })

  it("resolves on the code even when the data never arrives", async () => {
    await expect(preloadRoute("/galeria")).resolves.toBeUndefined()
  })

  it("resolves without loading for a route with no lazy module or an unknown path", async () => {
    await expect(preloadRoute("/")).resolves.toBeUndefined()
    await expect(preloadRoute("/nope")).resolves.toBeUndefined()
  })

  it("never rejects when the chunk or the data fails", async () => {
    galleryData.mockImplementationOnce(() => Promise.reject(new Error("rls")))
    await expect(preloadRoute("/galeria")).resolves.toBeUndefined()
    vi.doMock("@/i18n/paths", () => ({ routeKeyFromPath: () => "notFound" }))
    vi.resetModules()
    const { preloadRoute: preload } = await import("@/utils/preload-route")
    await expect(preload("/x")).resolves.toBeUndefined()
    expect(notFound).toHaveBeenCalled()
  })
})
