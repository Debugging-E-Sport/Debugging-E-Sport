import { createContext, useContext, useState, useCallback, useRef } from 'react'

const ToastContext = createContext(null)

let toastIdCounter = 0

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const timersRef = useRef({})

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, leaving: true } : t)))
    const leaveTimer = setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 300)
    if (timersRef.current[id]) {
      clearTimeout(timersRef.current[id])
    }
    timersRef.current[id] = leaveTimer
  }, [])

  const addToast = useCallback((message, type = 'error', duration = 5000) => {
    const id = ++toastIdCounter
    setToasts((prev) => [...prev, { id, message, type, leaving: false }])

    const timer = setTimeout(() => {
      dismiss(id)
    }, duration)
    timersRef.current[id] = timer

    return id
  }, [dismiss])

  const toast = {
    error: useCallback((msg, duration) => addToast(msg, 'error', duration), [addToast]),
    success: useCallback((msg, duration) => addToast(msg, 'success', duration), [addToast]),
    info: useCallback((msg, duration) => addToast(msg, 'info', duration), [addToast]),
    warning: useCallback((msg, duration) => addToast(msg, 'warning', duration), [addToast]),
    dismiss,
  }

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {/* Toast container — fixed at bottom-right */}
      <div
        className="fixed bottom-6 right-6 z-[9999] flex flex-col-reverse gap-3 pointer-events-none"
        aria-live="polite"
        aria-label="Notifications"
      >
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={() => dismiss(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

function ToastItem({ toast, onDismiss }) {
  const { message, type, leaving } = toast

  const variants = {
    error: {
      bg: 'bg-red-500/10',
      border: 'border-red-500/30',
      icon: 'fa-solid fa-circle-xmark text-red-400',
      text: 'text-red-300',
    },
    success: {
      bg: 'bg-arena-green/10',
      border: 'border-arena-green/30',
      icon: 'fa-solid fa-circle-check text-arena-green',
      text: 'text-arena-green/90',
    },
    info: {
      bg: 'bg-arena-purple/10',
      border: 'border-arena-purple/30',
      icon: 'fa-solid fa-circle-info text-arena-purpleLight',
      text: 'text-arena-purpleLight/90',
    },
    warning: {
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500/30',
      icon: 'fa-solid fa-triangle-exclamation text-yellow-400',
      text: 'text-yellow-300',
    },
  }

  const v = variants[type] || variants.error

  return (
    <div
      className={`pointer-events-auto bg-[#161b22] border rounded-xl p-4 shadow-[0_0_30px_rgba(0,0,0,0.5)] max-w-sm flex items-start gap-3 transition-all duration-300 ${
        v.border
      } ${leaving ? 'opacity-0 translate-x-8 scale-95' : 'opacity-100 translate-x-0 scale-100'}`}
      role="alert"
    >
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${v.bg}`}>
        <i className={`${v.icon} text-sm`}></i>
      </div>
      <p className={`flex-1 font-mono text-xs leading-relaxed ${v.text}`}>
        {message}
      </p>
      <button
        onClick={onDismiss}
        className="text-arena-muted hover:text-white transition-colors flex-shrink-0 cursor-pointer"
        aria-label="Dismiss notification"
      >
        <i className="fa-solid fa-times text-xs"></i>
      </button>
    </div>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}
