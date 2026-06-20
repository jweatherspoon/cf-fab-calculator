import { describe, expect, it } from 'vitest'
import { calculateMasses } from './calculations'

describe('calculateMasses', () => {
  it('calculates all mass outputs from known values', () => {
    const result = calculateMasses({
      volumeCm3: 100,
      resinRatio: 100,
      hardenerRatio: 30,
    })

    expect(result.totalMass).toBeCloseTo(140)
    expect(result.carbonFiberMass).toBeCloseTo(84)
    expect(result.resinHardenerMass).toBeCloseTo(109.2)
    expect(result.resinMass).toBeCloseTo(84)
    expect(result.hardenerMass).toBeCloseTo(25.2)
  })

  it('throws on invalid denominator', () => {
    expect(() =>
      calculateMasses({ volumeCm3: 12, resinRatio: 0, hardenerRatio: 0 }),
    ).toThrow(/non-zero denominator/i)
  })

  it('throws on negative volume', () => {
    expect(() =>
      calculateMasses({ volumeCm3: -1, resinRatio: 100, hardenerRatio: 30 }),
    ).toThrow(/non-negative/i)
  })
})
