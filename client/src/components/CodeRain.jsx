import { useEffect, useRef } from 'react'

export default function CodeRain() {
  const ref = useRef(null)

  useEffect(() => {
    const c = ref.current
    if (!c) return
    c.innerHTML = ''

    const chars = '01{}[]();=<>+-*/{}!@#$%^&*()'
    for (let i = 0; i < 40; i++) {
      const s = document.createElement('span')
      s.textContent = chars[Math.floor(Math.random() * chars.length)]
      s.style.left = Math.random() * 100 + '%'
      s.style.fontSize = (Math.random() * 8 + 10) + 'px'
      s.style.animationDuration = (Math.random() * 10 + 10) + 's'
      s.style.animationDelay = (Math.random() * 12) + 's'
      c.appendChild(s)
    }
  }, [])

  return (
    <div
      ref={ref}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
    />
  )
}
