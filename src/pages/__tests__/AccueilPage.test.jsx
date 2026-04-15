import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi } from 'vitest'
import AccueilPage from '../AccueilPage'

vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    estConnecte: () => false
  })
}))

vi.mock('../../services/formationService', () => ({
  default: {
    getFormations: vi.fn().mockResolvedValue([
      {
        id: 1,
        titre: 'React Basics',
        niveau: 'debutant',
        formateur: { nom: 'John Doe' }
      }
    ])
  }
}))

describe('AccueilPage', () => {
  it('affiche le hero et sections principales', async () => {
    render(
      <MemoryRouter>
        <AccueilPage />
      </MemoryRouter>
    )
    expect(
      screen.getByText((content) => content.includes('trained today'))
    ).toBeInTheDocument()

    expect(
      screen.getByText(/comment ca marche/i)
    ).toBeInTheDocument()

    expect(
      screen.getByText(/nos valeurs/i)
    ).toBeInTheDocument()
  })
})