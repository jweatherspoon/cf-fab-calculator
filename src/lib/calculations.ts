import type { CalculationInput, CalculationResult } from '../types/calculator'

const TOTAL_MASS_FACTOR = 1.4
const CARBON_FIBER_FACTOR = 0.6
const RESIN_HARDENER_FACTOR = 1.3

export function calculateMasses(input: CalculationInput): CalculationResult {
  const { volumeCm3, resinRatio, hardenerRatio } = input
  const ratioSum = resinRatio + hardenerRatio

  if (volumeCm3 < 0 || !Number.isFinite(volumeCm3)) {
    throw new Error('Volume must be a non-negative number.')
  }

  if (resinRatio < 0 || hardenerRatio < 0 || ratioSum <= 0) {
    throw new Error('Resin and hardener ratios must produce a non-zero denominator.')
  }

  const totalMass = volumeCm3 * TOTAL_MASS_FACTOR
  const carbonFiberMass = totalMass * CARBON_FIBER_FACTOR
  const resinHardenerMass = carbonFiberMass * RESIN_HARDENER_FACTOR
  const resinMass = resinHardenerMass * (resinRatio / ratioSum)
  const hardenerMass = resinHardenerMass * (hardenerRatio / ratioSum)

  return {
    totalMass,
    carbonFiberMass,
    resinHardenerMass,
    resinMass,
    hardenerMass,
  }
}
