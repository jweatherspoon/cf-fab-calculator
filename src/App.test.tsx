import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('App', () => {
  it('recomputes outputs when volume changes', () => {
    render(<App />)

    const input = screen.getByLabelText(/volume/i)
    fireEvent.change(input, { target: { value: '100' } })

    expect(screen.getByText('140.00 g')).toBeInTheDocument()
    expect(screen.getAllByText('84.00 g')).toHaveLength(2)
    expect(screen.getByText('109.20 g')).toBeInTheDocument()
  })

  it('shows an error for negative values', () => {
    render(<App />)

    const input = screen.getByLabelText(/volume/i)
    fireEvent.change(input, { target: { value: '-2' } })

    expect(
      screen.getByText(/volume must be zero or greater/i),
    ).toBeInTheDocument()
  })
})
