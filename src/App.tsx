import { useMemo, useState } from 'react'
import resinPresets from './config/resins.json'
import { calculateMasses } from './lib/calculations'
import { formatGrams } from './lib/format'
import type { ResinPreset } from './types/calculator'

type ResultRowProps = {
  label: string
  symbol: string
  value: string
}

function ResultRow({ label, symbol, value }: ResultRowProps) {
  return (
    <li className="flex items-center justify-between rounded-xl border border-white/40 bg-white/70 p-4 shadow-sm backdrop-blur-sm">
      <div>
        <p className="text-xs uppercase tracking-[0.16em] text-slate-500">{symbol}</p>
        <p className="text-sm font-semibold text-slate-800">{label}</p>
      </div>
      <p className="text-lg font-semibold text-teal-900">{value}</p>
    </li>
  )
}

function App() {
  const presets = resinPresets as ResinPreset[]
  const [volumeInput, setVolumeInput] = useState('')
  const [selectedPresetId, setSelectedPresetId] = useState(presets[0]?.id ?? '')

  const selectedPreset = useMemo(
    () => presets.find((preset) => preset.id === selectedPresetId) ?? presets[0],
    [presets, selectedPresetId],
  )

  const parsedVolume = Number.parseFloat(volumeInput)
  const hasVolume = volumeInput.trim().length > 0
  const volumeIsValid = hasVolume && Number.isFinite(parsedVolume) && parsedVolume >= 0

  const validationMessage = useMemo(() => {
    if (!hasVolume) {
      return 'Enter a volume to begin calculations.'
    }

    if (!Number.isFinite(parsedVolume)) {
      return 'Volume must be a valid number.'
    }

    if (parsedVolume < 0) {
      return 'Volume must be zero or greater.'
    }

    return ''
  }, [hasVolume, parsedVolume])

  const result = useMemo(() => {
    if (!selectedPreset || !volumeIsValid) {
      return null
    }

    return calculateMasses({
      volumeCm3: parsedVolume,
      resinRatio: selectedPreset.resinRatio,
      hardenerRatio: selectedPreset.hardenerRatio,
    })
  }, [parsedVolume, selectedPreset, volumeIsValid])

  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-8 sm:px-6 sm:py-10">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(14,59,67,0.22),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(217,107,75,0.2),transparent_30%),radial-gradient(circle_at_50%_100%,rgba(38,95,128,0.18),transparent_45%)]" />

      <div className="mx-auto w-full max-w-3xl rounded-3xl border border-white/60 bg-[rgba(243,239,229,0.76)] p-5 shadow-[0_18px_48px_rgba(12,28,35,0.18)] backdrop-blur-md sm:p-8">
        <header className="mb-6 sm:mb-8">
          <p className="text-xs uppercase tracking-[0.2em] text-teal-800">Composite Tooling</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Carbon Fiber Mass Calculator
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
            Enter the part volume in cm^3 and select a resin preset to calculate total mass,
            carbon fiber mass, resin-hardener mass, and split resin and hardener masses.
          </p>
        </header>

        <section className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 sm:p-5">
            <label
              htmlFor="volume"
              className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-700"
            >
              Volume (cm^3)
            </label>
            <input
              id="volume"
              type="number"
              inputMode="decimal"
              min="0"
              step="any"
              value={volumeInput}
              onChange={(event) => setVolumeInput(event.target.value)}
              placeholder="Example: 125.5"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-lg text-slate-900 shadow-inner outline-none ring-teal-600/60 transition focus:ring-2"
            />
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 sm:p-5">
            <label
              htmlFor="preset"
              className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-700"
            >
              Resin / Hardener Preset
            </label>
            <select
              id="preset"
              value={selectedPreset?.id}
              onChange={(event) => setSelectedPresetId(event.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 outline-none ring-teal-600/60 transition focus:ring-2"
            >
              {presets.map((preset) => (
                <option key={preset.id} value={preset.id}>
                  {preset.name} ({preset.resinRatio}:{preset.hardenerRatio})
                </option>
              ))}
            </select>
            <p className="mt-3 text-xs text-slate-500">
              Selected ratio: R_r={selectedPreset?.resinRatio}, R_h={selectedPreset?.hardenerRatio}
            </p>
          </div>
        </section>

        <section className="mt-5 rounded-2xl border border-slate-200 bg-white/75 p-4 sm:p-6">
          {validationMessage ? (
            <p className="rounded-xl border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900">
              {validationMessage}
            </p>
          ) : null}

          <ul className="mt-4 grid gap-3">
            <ResultRow
              label="Total Part Mass"
              symbol="m"
              value={result ? formatGrams(result.totalMass) : '--'}
            />
            <ResultRow
              label="Carbon Fiber Mass"
              symbol="m_cf"
              value={result ? formatGrams(result.carbonFiberMass) : '--'}
            />
            <ResultRow
              label="Resin + Hardener Mass"
              symbol="m_rh"
              value={result ? formatGrams(result.resinHardenerMass) : '--'}
            />
            <ResultRow
              label="Resin Mass"
              symbol="m_r"
              value={result ? formatGrams(result.resinMass) : '--'}
            />
            <ResultRow
              label="Hardener Mass"
              symbol="m_h"
              value={result ? formatGrams(result.hardenerMass) : '--'}
            />
          </ul>
        </section>

        <details className="mt-5 rounded-2xl border border-slate-200 bg-white/65 p-4 text-sm text-slate-700">
          <summary className="cursor-pointer font-semibold text-slate-900">
            Calculation details
          </summary>
          <ul className="mt-3 space-y-1 leading-relaxed">
            <li>m = v * 1.4</li>
            <li>m_cf = m * 0.6</li>
            <li>m_rh = m_cf * 1.3</li>
            <li>m_r = m_rh * (R_r / (R_r + R_h))</li>
            <li>m_h = m_rh * (R_h / (R_r + R_h))</li>
          </ul>
        </details>

        <p className="mt-5 text-center text-xs uppercase tracking-[0.16em] text-slate-500">
          All output masses are shown in grams
        </p>
      </div>
    </main>
  )
}

export default App
