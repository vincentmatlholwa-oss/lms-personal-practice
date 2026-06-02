import { describe, it, expect, beforeEach } from "vitest"
import { makePersistent, clearPersisted, mockUsers, persistArray } from "../lib/mock-data"

function getStored<T>(key: string, defaults: T[]): T[] {
  try {
    const stored = localStorage.getItem("lms_" + key)
    if (stored) return JSON.parse(stored) as T[]
  } catch { /* noop */ }
  return [...defaults]
}

describe("makePersistent", () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it("returns an array with the default values", () => {
    const arr = makePersistent("test-key", [1, 2, 3])
    expect(arr.length).toBe(3)
    expect(arr[0]).toBe(1)
    expect(arr[1]).toBe(2)
    expect(arr[2]).toBe(3)
  })

  it("persists mutations to localStorage", () => {
    const arr = makePersistent("test-push", [1])
    arr.push(2)
    const stored = getStored("test-push", [])
    expect(stored).toEqual([1, 2])
  })

  it("persists splice mutations", () => {
    const arr = makePersistent("test-splice", [1, 2, 3])
    arr.splice(1, 1)
    const stored = getStored("test-splice", [])
    expect(stored).toEqual([1, 3])
  })

  it("persists pop mutations", () => {
    const arr = makePersistent("test-pop", [1, 2])
    arr.pop()
    const stored = getStored("test-pop", [])
    expect(stored).toEqual([1])
  })
})

describe("mockUsers", () => {
  it("has default users", () => {
    expect(mockUsers.length).toBeGreaterThan(0)
  })

  it("has an admin user", () => {
    const admin = mockUsers.find((u) => u.role === "Admin")
    expect(admin).toBeDefined()
    expect(admin?.email).toBe("admin@mdihub.com")
  })

  it("has student users", () => {
    const students = mockUsers.filter((u) => u.role === "Student")
    expect(students.length).toBeGreaterThan(0)
  })

  it("has facilitator users", () => {
    const facilitators = mockUsers.filter((u) => u.role === "Facilitator")
    expect(facilitators.length).toBeGreaterThan(0)
  })
})
