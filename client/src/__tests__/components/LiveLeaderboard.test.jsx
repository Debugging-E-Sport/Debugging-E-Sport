import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import LiveLeaderboard from '../../components/Game/LiveLeaderboard'

// Mock SocketContext
const mockUseSocket = vi.fn()
vi.mock('../../context/SocketContext', () => ({
  useSocket: () => mockUseSocket(),
}))

// Mock AuthContext
const mockUseAuthContext = vi.fn()
vi.mock('../../context/AuthContext', () => ({
  useAuthContext: () => mockUseAuthContext(),
}))

describe('LiveLeaderboard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseSocket.mockReturnValue({
      leaderboard: [],
      allSubmitted: false,
      scores: {},
      players: [],
    })
    mockUseAuthContext.mockReturnValue({
      user: { id: '1', username: 'player1' },
    })
  })

  describe('empty state', () => {
    it('should render waiting message when leaderboard is empty', () => {
      render(<LiveLeaderboard />)

      expect(screen.getByText('Waiting for scores...')).toBeInTheDocument()
      expect(
        screen.getByText('Leaderboard updates after each round.')
      ).toBeInTheDocument()
    })

    it('should render the leaderboard title', () => {
      render(<LiveLeaderboard />)

      expect(screen.getByText('Leaderboard')).toBeInTheDocument()
    })

    it('should not render players online section when no players', () => {
      render(<LiveLeaderboard />)

      expect(screen.queryByText('Players Online')).not.toBeInTheDocument()
    })
  })

  describe('with leaderboard data', () => {
    const mockLeaderboard = [
      { username: 'alice', totalScore: 150 },
      { username: 'bob', totalScore: 120 },
      { username: 'charlie', totalScore: 90 },
      { username: 'dave', totalScore: 60 },
      { username: 'eve', totalScore: 30 },
    ]

    it('should render all leaderboard entries', () => {
      mockUseSocket.mockReturnValue({
        leaderboard: mockLeaderboard,
        allSubmitted: false,
        scores: {},
        players: [],
      })

      render(<LiveLeaderboard />)

      expect(screen.getByText('alice')).toBeInTheDocument()
      expect(screen.getByText('bob')).toBeInTheDocument()
      expect(screen.getByText('charlie')).toBeInTheDocument()
      expect(screen.getByText('dave')).toBeInTheDocument()
      expect(screen.getByText('eve')).toBeInTheDocument()
    })

    it('should render scores for each player', () => {
      mockUseSocket.mockReturnValue({
        leaderboard: mockLeaderboard,
        allSubmitted: false,
        scores: {},
        players: [],
      })

      render(<LiveLeaderboard />)

      expect(screen.getByText('150')).toBeInTheDocument()
      expect(screen.getByText('120')).toBeInTheDocument()
      expect(screen.getByText('90')).toBeInTheDocument()
    })

    it('should highlight current user with special styling', () => {
      mockUseAuthContext.mockReturnValue({
        user: { id: '1', username: 'bob' },
      })

      mockUseSocket.mockReturnValue({
        leaderboard: mockLeaderboard,
        allSubmitted: false,
        scores: {},
        players: [],
      })

      render(<LiveLeaderboard />)

      // Bob should have "● You" indicator
      expect(screen.getByText('● You')).toBeInTheDocument()
    })

    it('should show medal emojis for top 3', () => {
      mockUseSocket.mockReturnValue({
        leaderboard: mockLeaderboard,
        allSubmitted: false,
        scores: {},
        players: [],
      })

      render(<LiveLeaderboard />)

      expect(screen.getByText('🥇')).toBeInTheDocument()
      expect(screen.getByText('🥈')).toBeInTheDocument()
      expect(screen.getByText('🥉')).toBeInTheDocument()
    })

    it('should show numeric rank for 4th place and beyond', () => {
      mockUseSocket.mockReturnValue({
        leaderboard: mockLeaderboard,
        allSubmitted: false,
        scores: {},
        players: [],
      })

      render(<LiveLeaderboard />)

      expect(screen.getByText('4')).toBeInTheDocument()
      expect(screen.getByText('5')).toBeInTheDocument()
    })

    it('should render player avatars with initials', () => {
      mockUseSocket.mockReturnValue({
        leaderboard: mockLeaderboard,
        allSubmitted: false,
        scores: {},
        players: [],
      })

      render(<LiveLeaderboard />)

      expect(screen.getByText('A')).toBeInTheDocument() // alice
      expect(screen.getByText('B')).toBeInTheDocument() // bob
    })

    it('should show LIVE indicator', () => {
      mockUseSocket.mockReturnValue({
        leaderboard: mockLeaderboard,
        allSubmitted: false,
        scores: {},
        players: [],
      })

      render(<LiveLeaderboard />)

      expect(screen.getByText('LIVE')).toBeInTheDocument()
    })
  })

  describe('players online section', () => {
    it('should render players online when players exist', () => {
      mockUseSocket.mockReturnValue({
        leaderboard: [],
        allSubmitted: false,
        scores: {},
        players: [
          { username: 'player1' },
          { username: 'player2' },
          { username: 'player3' },
        ],
      })

      render(<LiveLeaderboard />)

      expect(screen.getByText('Players Online')).toBeInTheDocument()
      expect(screen.getByText('3 connected')).toBeInTheDocument()
      expect(screen.getByText('player1')).toBeInTheDocument()
      expect(screen.getByText('player2')).toBeInTheDocument()
      expect(screen.getByText('player3')).toBeInTheDocument()
    })

    it('should mark current user in players list', () => {
      mockUseAuthContext.mockReturnValue({
        user: { id: '1', username: 'player2' },
      })

      mockUseSocket.mockReturnValue({
        leaderboard: [],
        allSubmitted: false,
        scores: {},
        players: [
          { username: 'player1' },
          { username: 'player2' },
        ],
      })

      render(<LiveLeaderboard />)

      expect(screen.getByText('(you)')).toBeInTheDocument()
    })

    it('should show connected count', () => {
      mockUseSocket.mockReturnValue({
        leaderboard: [],
        allSubmitted: false,
        scores: {},
        players: [{ username: 'p1' }],
      })

      render(<LiveLeaderboard />)

      expect(screen.getByText('1 connected')).toBeInTheDocument()
    })
  })
})
