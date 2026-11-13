// no-unit-test: IndexedDB exists only in a real browser (the queue's rules are tested in upload-queue)
import type { QueuedPhoto } from "@/types/upload-queue"

const DB_NAME = "fotocall"
const STORE = "upload-queue"

const open = (): Promise<IDBDatabase> =>
  new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1)
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE)) request.result.createObjectStore(STORE, { keyPath: "id" })
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error ?? new Error("IndexedDB unavailable"))
  })

const run = async <T>(mode: IDBTransactionMode, work: (store: IDBObjectStore) => IDBRequest<T> | void): Promise<T | undefined> => {
  const db = await open()
  return new Promise<T | undefined>((resolve, reject) => {
    const tx = db.transaction(STORE, mode)
    const request = work(tx.objectStore(STORE))
    tx.oncomplete = () => { db.close(); resolve(request ? request.result : undefined) }
    tx.onerror = () => { db.close(); reject(tx.error ?? new Error("IndexedDB transaction failed")) }
    tx.onabort = () => { db.close(); reject(tx.error ?? new Error("IndexedDB transaction aborted")) }
  })
}

export const queueAvailable = (): boolean => typeof indexedDB !== "undefined"
export const readQueue = async (): Promise<QueuedPhoto[]> => (await run<QueuedPhoto[]>("readonly", (s) => s.getAll())) ?? []
export const saveQueued = async (item: QueuedPhoto): Promise<void> => { await run("readwrite", (s) => { s.put(item) }) }
export const dropQueued = async (id: string): Promise<void> => { await run("readwrite", (s) => { s.delete(id) }) }
