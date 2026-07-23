import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import CodeSnippetPanel from '../../components/Game/CodeSnippetPanel'

// Mock SocketContext
const mockUseSocket = vi.fn()
vi.mock('../../context/SocketContext', () => ({
  useSocket: () => mockUseSocket(),
}))

describe('CodeSnippetPanel', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('placeholder state (no snippet)', () => {
    it('should render placeholder when no snippet is available', () => {
      mockUseSocket.mockReturnValue({ currentSnippet: null })

      render(<CodeSnippetPanel />)

      expect(screen.getByText('Preparing challenge...')).toBeInTheDocument()
      expect(
        screen.getByText(/The next code snippet will appear here/)
      ).toBeInTheDocument()
      expect(
        screen.getByText('// waiting for game to start')
      ).toBeInTheDocument()
    })

    it('should render the window chrome dots in placeholder', () => {
      mockUseSocket.mockReturnValue({ currentSnippet: null })

      const { container } = render(<CodeSnippetPanel />)

      // Three colored dots in title bar
      const dots = container.querySelectorAll('.rounded-full')
      expect(dots.length).toBeGreaterThanOrEqual(3)
    })

    it('should render placeholder code text', () => {
      mockUseSocket.mockReturnValue({ currentSnippet: null })

      render(<CodeSnippetPanel />)

      expect(
        screen.getByText(/Stay sharp, debugger/)
      ).toBeInTheDocument()
    })
  })

  describe('with snippet data', () => {
    const mockSnippet = {
      id: 'snip1',
      title: 'JavaScript Closure Bug',
      code: 'function outer() {\n  let x = 10;\n  return function inner() {\n    console.log(x);\n  }\n}',
      context: 'Find the closure issue in this code.',
      max_score: 50,
    }

    it('should render snippet title', () => {
      mockUseSocket.mockReturnValue({ currentSnippet: mockSnippet })

      render(<CodeSnippetPanel />)

      expect(screen.getByText('JavaScript Closure Bug')).toBeInTheDocument()
    })

    it('should render snippet context/description', () => {
      mockUseSocket.mockReturnValue({ currentSnippet: mockSnippet })

      render(<CodeSnippetPanel />)

      expect(
        screen.getByText('Find the closure issue in this code.')
      ).toBeInTheDocument()
    })

    it('should render max score', () => {
      mockUseSocket.mockReturnValue({ currentSnippet: mockSnippet })

      render(<CodeSnippetPanel />)

      expect(screen.getByText('+50 pts')).toBeInTheDocument()
      expect(screen.getByText('max score')).toBeInTheDocument()
    })

    it('should display language tag as JavaScript', () => {
      mockUseSocket.mockReturnValue({ currentSnippet: mockSnippet })

      render(<CodeSnippetPanel />)

      expect(screen.getByText('JavaScript')).toBeInTheDocument()
    })

    it('should display language tag as Python for Python snippets', () => {
      mockUseSocket.mockReturnValue({
        currentSnippet: {
          ...mockSnippet,
          title: 'Python Indentation Bug',
        },
      })

      render(<CodeSnippetPanel />)

      expect(screen.getByText('Python')).toBeInTheDocument()
    })

    it('should render code lines with line numbers', () => {
      mockUseSocket.mockReturnValue({ currentSnippet: mockSnippet })

      const { container } = render(<CodeSnippetPanel />)

      const lineNums = container.querySelectorAll('.line-num')
      // Code has trailing newline, so one extra empty line row
      expect(lineNums.length).toBeGreaterThanOrEqual(5)
    })

    it('should render code content', () => {
      mockUseSocket.mockReturnValue({ currentSnippet: mockSnippet })

      render(<CodeSnippetPanel />)

      expect(screen.getByText(/function outer/)).toBeInTheDocument()
      expect(screen.getByText(/let x = 10/)).toBeInTheDocument()
    })

    it('should display read-only badge', () => {
      mockUseSocket.mockReturnValue({ currentSnippet: mockSnippet })

      render(<CodeSnippetPanel />)

      expect(screen.getByText('Read-only')).toBeInTheDocument()
    })

    it('should display challenge filename', () => {
      mockUseSocket.mockReturnValue({ currentSnippet: mockSnippet })

      render(<CodeSnippetPanel />)

      expect(screen.getByText('challenge_snip1.js')).toBeInTheDocument()
    })

    it('should handle snippet without id', () => {
      mockUseSocket.mockReturnValue({
        currentSnippet: { ...mockSnippet, id: undefined },
      })

      render(<CodeSnippetPanel />)

      expect(screen.getByText('challenge.txt')).toBeInTheDocument()
    })

    it('should handle snippet without max_score', () => {
      mockUseSocket.mockReturnValue({
        currentSnippet: { ...mockSnippet, max_score: undefined },
      })

      render(<CodeSnippetPanel />)

      expect(screen.getByText('+? pts')).toBeInTheDocument()
    })

    it('should detect JavaScript from title keywords', () => {
      mockUseSocket.mockReturnValue({
        currentSnippet: { ...mockSnippet, title: 'JS Coercion Bug' },
      })

      render(<CodeSnippetPanel />)

      expect(screen.getByText('JavaScript')).toBeInTheDocument()
    })
  })
})
