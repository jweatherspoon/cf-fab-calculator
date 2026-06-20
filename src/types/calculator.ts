export type ResinPreset = {
  id: string
  name: string
  resinRatio: number
  hardenerRatio: number
}

export type CalculationInput = {
  volumeCm3: number
  resinRatio: number
  hardenerRatio: number
}

export type CalculationResult = {
  totalMass: number
  carbonFiberMass: number
  resinHardenerMass: number
  resinMass: number
  hardenerMass: number
}
