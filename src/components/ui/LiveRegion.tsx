// Singleton, mounted once in Providers. announce() lives in @/utils/announce.
export function LiveRegion() {
  return (
    <>
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only" id="live-polite" />
      <div role="alert" aria-live="assertive" aria-atomic="true" className="sr-only" id="live-assertive" />
    </>
  )
}
