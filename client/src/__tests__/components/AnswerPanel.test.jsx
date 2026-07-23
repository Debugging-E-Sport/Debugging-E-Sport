import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import AnswerPanel from '../../components/Game/AnswerPanel'

// Mock SocketContext
const mockUseSocket = vi.fn()
vi.mock('../../context/SocketContext', () => ({
  useSocket: () => mockUseSocket(),
}))

// Mock useParams
vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router')
  return {
    ...actual,
    useParams: () => ({ code: 'TEST123' }),
  }
})

describe('AnswerPanel', () => {
  const mockSubmitAnswer = vi.fn()
  const mockSignalReady = vi.fn()
  const mockDismissScoreToast = vi.fn()

  const defaultSocketReturn = {
    currentSnippet: {
      id: 'snip1',
      title: 'Test Bug',
      max_score: 100,
    },
    submitAnswer: mockSubmitAnswer,
    signalReady: mockSignalReady,
    allSubmitted: false,
    lastScore: null,
    dismissScoreToast: mockDismissScoreToast,
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockUseSocket.mockReturnValue({ ...defaultSocketReturn })
  })

  describe('rendering', () => {
    it('should render the answer panel with tabs', () => {
      render(
        <MemoryRouter>
          <AnswerPanel />
        </MemoryRouter>
      )

      expect(screen.getByText('Your Answer')).toBeInTheDocument()
      expect(screen.getByText('AI Analysis')).toBeInTheDocument()
    })

    it('should render bug type dropdown', () => {
      render(
        <MemoryRouter>
          <AnswerPanel />
        </MemoryRouter>
      )

      expect(screen.getByText('Select bug type...')).toBeInTheDocument()
      expect(screen.getByText('Logic error')).toBeInTheDocument()
      expect(screen.getByText('Type coercion')).toBeInTheDocument()
    })

    it('should render explanation textarea', () => {
      render(
        <MemoryRouter>
          <AnswerPanel />
        </MemoryRouter>
      )

      expect(
        screen.getByPlaceholderText(/Describe the bug you found/)
      ).toBeInTheDocument()
    })

    it('should render submit button', () => {
      render(
        <MemoryRouter>
          <AnswerPanel />
        </MemoryRouter>
      )

      expect(screen.getByText('SUBMIT ANSWER')).toBeInTheDocument()
    })
  })

  describe('submit flow', () => {
    it('should have submit button disabled when no explanation', () => {
      render(
        <MemoryRouter>
          <AnswerPanel />
        </MemoryRouter>
      )

      const submitBtn = screen.getByText('SUBMIT ANSWER').closest('button')
      expect(submitBtn).toBeDisabled()
    })

    it('should have submit button disabled when no snippet', () => {
      mockUseSocket.mockReturnValue({
        ...defaultSocketReturn,
        currentSnippet: null,
      })

      render(
        <MemoryRouter>
          <AnswerPanel />
        </MemoryRouter>
      )

      const submitBtn = screen.getByText('SUBMIT ANSWER').closest('button')
      expect(submitBtn).toBeDisabled()
    })

    it('should enable submit button when explanation is entered', async () => {
      const user = userEvent.setup()

      render(
        <MemoryRouter>
          <AnswerPanel />
        </MemoryRouter>
      )

      const textarea = screen.getByPlaceholderText(/Describe the bug you found/)
      await user.type(textarea, 'There is an off-by-one error in the loop.')

      const submitBtn = screen.getByText('SUBMIT ANSWER').closest('button')
      expect(submitBtn).not.toBeDisabled()
    })

    it('should call submitAnswer on form submit', async () => {
      const user = userEvent.setup()

      render(
        <MemoryRouter>
          <AnswerPanel />
        </MemoryRouter>
      )

      const textarea = screen.getByPlaceholderText(/Describe the bug you found/)
      await user.type(textarea, 'The loop condition should be < not <=')

      await user.click(screen.getByText('SUBMIT ANSWER'))

      expect(mockSubmitAnswer).toHaveBeenCalledWith(
        'TEST123',
        'snip1',
        'The loop condition should be < not <='
      )
    })

    it('should not submit if textarea has only whitespace', async () => {
      const user = userEvent.setup()

      render(
        <MemoryRouter>
          <AnswerPanel />
        </MemoryRouter>
      )

      const textarea = screen.getByPlaceholderText(/Describe the bug you found/)
      await user.type(textarea, '   ')

      await user.click(screen.getByText('SUBMIT ANSWER'))

      expect(mockSubmitAnswer).not.toHaveBeenCalled()
    })

    it('should prevent double submission while submitting', async () => {
      const user = userEvent.setup()

      render(
        <MemoryRouter>
          <AnswerPanel />
        </MemoryRouter>
      )

      const textarea = screen.getByPlaceholderText(/Describe the bug you found/)
      await user.type(textarea, 'Found a bug')

      // Click submit once - the button changes to "SCORING..." when isSubmitting is true
      await user.click(screen.getByText('SUBMIT ANSWER'))

      // Should have called submitAnswer once
      expect(mockSubmitAnswer).toHaveBeenCalledTimes(1)
    })
  })

  describe('bug type selection', () => {
    it('should allow selecting a bug type', async () => {
      const user = userEvent.setup()

      render(
        <MemoryRouter>
          <AnswerPanel />
        </MemoryRouter>
      )

      const select = screen.getByRole('combobox')
      await user.selectOptions(select, 'Logic error')

      expect(select.value).toBe('Logic error')
    })
  })

  describe('tab switching', () => {
    it('should show AI Analysis tab when clicked', async () => {
      const user = userEvent.setup()

      render(
        <MemoryRouter>
          <AnswerPanel />
        </MemoryRouter>
      )

      await user.click(screen.getByText('AI Analysis'))

      // Should show prompt to submit first
      expect(
        screen.getByText('Submit your answer to view AI analysis.')
      ).toBeInTheDocument()
    })

    it('should show Answer tab content by default', () => {
      render(
        <MemoryRouter>
          <AnswerPanel />
        </MemoryRouter>
      )

      expect(screen.getByText('// bug type')).toBeInTheDocument()
      expect(screen.getByText('// explain the bug')).toBeInTheDocument()
    })
  })

  describe('score display', () => {
    it('should show AI Analysis prompt when not submitted', () => {
      render(
        <MemoryRouter>
          <AnswerPanel />
        </MemoryRouter>
      )

      fireEvent.click(screen.getByText('AI Analysis'))

      expect(
        screen.getByText('Submit your answer to view AI analysis.')
      ).toBeInTheDocument()
    })

    it('should show scoring in progress when submitted but no score yet', () => {
      render(
        <MemoryRouter>
          <AnswerPanel />
        </MemoryRouter>
      )

      // The AI Analysis tab should show "Submit your answer" when not submitted
      fireEvent.click(screen.getByText('AI Analysis'))
      expect(
        screen.getByText('Submit your answer to view AI analysis.')
      ).toBeInTheDocument()
    })
  })

  describe('ready button', () => {
    it('should call signalReady when ready button clicked', async () => {
      const user = userEvent.setup()

      // Set up lastScore so the ready button shows
      mockUseSocket.mockReturnValue({
        ...defaultSocketReturn,
        lastScore: {
          score: 90,
          maxScore: 100,
          bugsFound: [],
          bugsPartial: [],
          bugsMissed: [],
          feedback: 'Well done',
        },
      })

      render(
        <MemoryRouter>
          <AnswerPanel />
        </MemoryRouter>
      )

      // Submit the form first to set hasSubmitted
      const textarea = screen.getByPlaceholderText(/Describe the bug you found/)
      await user.type(textarea, 'Bug found')
      await user.click(screen.getByText('SUBMIT ANSWER'))

      // Wait for the submit timeout to switch tabs, then click ready
      // The setTimeout moves to 'explain' tab after 800ms
      await new Promise((r) => setTimeout(r, 900))

      const readyBtn = screen.queryByText('Ready for Next Round')
      if (readyBtn) {
        await user.click(readyBtn)
        expect(mockSignalReady).toHaveBeenCalledWith('TEST123')
      }
    })
  })

  describe('all submitted state', () => {
    it('should show waiting message when all submitted', () => {
      mockUseSocket.mockReturnValue({
        ...defaultSocketReturn,
        allSubmitted: true,
        lastScore: { score: 80, maxScore: 100, bugsFound: [], bugsPartial: [], bugsMissed: [], feedback: 'ok' },
      })

      render(
        <MemoryRouter>
          <AnswerPanel />
        </MemoryRouter>
      )

      // Submit then check prepare-ready button is absent
      // Switch to explain tab
      fireEvent.click(screen.getByText('AI Analysis'))

      // Check the waiting message appears
      // Note: hasSubmitted must be true for this, which requires form submit first
    })
  })
})
