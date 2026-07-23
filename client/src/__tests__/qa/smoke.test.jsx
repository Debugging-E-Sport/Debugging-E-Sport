import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import App from '../../App'

// Mock react-router's BrowserRouter to use MemoryRouter so we don't nest routers
vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router')
  return {
    ...actual,
    BrowserRouter: ({ children }) => <>{children}</>,
  }
})

// Mock all pages to avoid heavy dependencies during smoke tests
vi.mock('../../pages/LoginPage', () => ({
  default: () => <div data-testid="login-page">Login Page</div>,
}))

vi.mock('../../pages/SelectRolePage', () => ({
  default: () => <div data-testid="select-role-page">Select Role Page</div>,
}))

vi.mock('../../pages/ArenaLobbyPage', () => ({
  default: () => <div data-testid="arena-lobby-page">Arena Lobby Page</div>,
}))

vi.mock('../../pages/GamePage', () => ({
  default: () => <div data-testid="game-page">Game Page</div>,
}))

vi.mock('../../pages/GameOverPage', () => ({
  default: () => <div data-testid="game-over-page">Game Over Page</div>,
}))

vi.mock('../../pages/MockStatusPage', () => ({
  default: () => <div data-testid="mock-status-page">Mock Status Page</div>,
}))

// Mock ProtectedRoute to avoid auth checks in smoke test
vi.mock('../../components/ProtectedRoute', () => ({
  default: ({ children }) => <>{children}</>,
}))

// Mock contexts
vi.mock('../../context/AuthContext', () => ({
  AuthProvider: ({ children }) => <>{children}</>,
  useAuthContext: () => ({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    isCheckingAuth: false,
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
  }),
}))

vi.mock('../../context/RoomContext', () => ({
  RoomProvider: ({ children }) => <>{children}</>,
  useRoom: () => ({
    currentRoom: null,
    isLoading: false,
    error: null,
    createRoom: vi.fn(),
    joinRoom: vi.fn(),
    fetchRoom: vi.fn(),
  }),
}))

vi.mock('../../context/SocketContext', () => ({
  SocketProvider: ({ children }) => <>{children}</>,
  useSocket: () => ({
    isConnected: false,
    gameState: 'idle',
    currentRound: 0,
    totalRounds: 0,
    currentSnippet: null,
    timeLeft: 0,
    leaderboard: [],
    scores: {},
    allSubmitted: false,
    players: [],
    winner: null,
    finalLeaderboard: [],
    lastScore: null,
    connect: vi.fn(),
    emit: vi.fn(),
    leaveGame: vi.fn(),
    submitAnswer: vi.fn(),
    signalReady: vi.fn(),
    dismissScoreToast: vi.fn(),
  }),
}))

describe('App Smoke Tests', () => {
  beforeAll(() => {
    vi.stubEnv('VITE_ENABLE_MSW', 'false')
  })

  afterAll(() => {
    vi.unstubAllEnvs()
  })

  it('should render without crashing', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/login']}>
        <App />
      </MemoryRouter>
    )
    expect(container).toBeTruthy()
  })
})

describe('App Routes', () => {
  it('should redirect / to /login', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    )

    expect(screen.getByTestId('login-page')).toBeInTheDocument()
  })

  it('should render login at /login', () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <App />
      </MemoryRouter>
    )

    expect(screen.getByTestId('login-page')).toBeInTheDocument()
  })

  it('should render select role page at /select/role', () => {
    render(
      <MemoryRouter initialEntries={['/select/role']}>
        <App />
      </MemoryRouter>
    )

    expect(screen.getByTestId('select-role-page')).toBeInTheDocument()
  })

  it('should render room page at /room/:code', () => {
    render(
      <MemoryRouter initialEntries={['/room/ABC123']}>
        <App />
      </MemoryRouter>
    )

    expect(screen.getByTestId('arena-lobby-page')).toBeInTheDocument()
  })

  it('should render game page at /game/:code', () => {
    render(
      <MemoryRouter initialEntries={['/game/ABC123']}>
        <App />
      </MemoryRouter>
    )

    expect(screen.getByTestId('game-page')).toBeInTheDocument()
  })

  it('should render game over page at /game/:code/over', () => {
    render(
      <MemoryRouter initialEntries={['/game/ABC123/over']}>
        <App />
      </MemoryRouter>
    )

    expect(screen.getByTestId('game-over-page')).toBeInTheDocument()
  })

  it('should redirect unknown routes to /login', () => {
    render(
      <MemoryRouter initialEntries={['/some/random/path']}>
        <App />
      </MemoryRouter>
    )

    expect(screen.getByTestId('login-page')).toBeInTheDocument()
  })
})
