/**
 * LoadingSkeleton — reusable shimmer skeleton for content placeholders.
 *
 * Variants:
 *   - 'line'     single line
 *   - 'lines'    multiple lines (pass `count`)
 *   - 'card'     card/panel shape
 *   - 'circle'   avatar/circle shape
 *   - 'code'     code block shape with titlebar
 *   - 'leaderboard'  leaderboard rows
 */

export default function LoadingSkeleton({ variant = 'line', count = 3, className = '' }) {
  const shimmer = 'relative overflow-hidden bg-arena-border/30 rounded before:absolute before:inset-0 before:-translate-x-full before:animate-shimmer before:bg-gradient-to-r before:from-transparent before:via-white/5 before:to-transparent'

  switch (variant) {
    case 'card':
      return (
        <div className={`bg-arena-panel border border-arena-border rounded-xl p-5 space-y-4 ${className}`}>
          <div className={`h-4 w-1/3 rounded ${shimmer}`}></div>
          <div className={`h-3 w-full rounded ${shimmer}`}></div>
          <div className={`h-3 w-4/5 rounded ${shimmer}`}></div>
          <div className={`h-10 w-full rounded-lg mt-2 ${shimmer}`}></div>
        </div>
      )

    case 'circle':
      return (
        <div className={`rounded-full ${shimmer} ${className || 'w-12 h-12'}`}></div>
      )

    case 'code':
      return (
        <div className={`bg-arena-panel border border-arena-border rounded-xl overflow-hidden ${className}`}>
          {/* Titlebar */}
          <div className="flex items-center px-4 py-2.5 border-b border-arena-border bg-arena-bg gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500/80"></span>
            <span className="w-3 h-3 rounded-full bg-yellow-500/80"></span>
            <span className="w-3 h-3 rounded-full bg-green-500/80"></span>
          </div>
          {/* Code lines */}
          <div className="p-4 space-y-2.5">
            {Array.from({ length: count }, (_, i) => (
              <div
                key={i}
                className={`h-4 rounded ${shimmer}`}
                style={{ width: `${60 + Math.random() * 35}%` }}
              ></div>
            ))}
          </div>
        </div>
      )

    case 'leaderboard':
      return (
        <div className={`bg-arena-panel border border-arena-border rounded-xl ${className}`}>
          <div className="flex items-center px-4 py-3 border-b border-arena-border gap-2">
            <div className={`h-4 w-24 rounded ${shimmer}`}></div>
          </div>
          <div className="divide-y divide-arena-border">
            {Array.from({ length: count }, (_, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3">
                <div className={`w-5 h-5 rounded ${shimmer}`}></div>
                <div className={`w-8 h-8 rounded-full ${shimmer}`}></div>
                <div className="flex-1 space-y-1.5">
                  <div className={`h-3 w-20 rounded ${shimmer}`}></div>
                  <div className={`h-2.5 w-12 rounded ${shimmer}`}></div>
                </div>
                <div className={`h-4 w-10 rounded ${shimmer}`}></div>
              </div>
            ))}
          </div>
        </div>
      )

    case 'lines':
      return (
        <div className={`space-y-2.5 ${className}`}>
          {Array.from({ length: count }, (_, i) => (
            <div
              key={i}
              className={`h-4 rounded ${shimmer}`}
              style={{ width: `${i === count - 1 ? 65 : 85 + Math.random() * 10}%` }}
            ></div>
          ))}
        </div>
      )

    case 'line':
    default:
      return (
        <div className={`h-4 rounded ${shimmer} ${className || 'w-full'}`}></div>
      )
  }
}
