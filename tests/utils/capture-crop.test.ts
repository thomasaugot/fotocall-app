import { describe, expect, it } from "vitest"
import { CAPTURE_RATIO, coverCrop } from "@/utils/capture-crop"

describe("coverCrop", () => {
  it("crops the sides of a landscape stream", () => {
    expect(coverCrop(1920, 1080, CAPTURE_RATIO)).toEqual({ sx: 555, sy: 0, sw: 810, sh: 1080 })
  })
  it("crops top and bottom of a tall stream", () => {
    expect(coverCrop(1080, 1920, CAPTURE_RATIO)).toEqual({ sx: 0, sy: 240, sw: 1080, sh: 1440 })
  })
  it("keeps a stream that already matches", () => {
    expect(coverCrop(1440, 1920, CAPTURE_RATIO)).toEqual({ sx: 0, sy: 0, sw: 1440, sh: 1920 })
  })
  it("returns an empty rect before the video has a size", () => {
    expect(coverCrop(0, 0, CAPTURE_RATIO)).toEqual({ sx: 0, sy: 0, sw: 0, sh: 0 })
  })
})
