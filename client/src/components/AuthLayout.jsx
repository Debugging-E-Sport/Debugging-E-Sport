export default function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Dynamic Animated Background */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-600/30 rounded-full mix-blend-screen filter blur-[100px] animate-blob"></div>
        <div className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] bg-cyan-600/30 rounded-full mix-blend-screen filter blur-[100px] animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-[600px] h-[600px] bg-purple-600/30 rounded-full mix-blend-screen filter blur-[100px] animate-blob animation-delay-4000"></div>
        
        {/* Subtle grid overlay for texture */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiPjxwYXRoIGQ9Ik0wIDQwaDQwTTAgMGg0MHY0MEgwem00MCAwdjQwSDBWMHoiLz48L2c+PC9zdmc+')] opacity-50"></div>
      </div>
      
      {/* Brand Header */}
      <div className="mb-10 z-10 text-center flex flex-col items-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-500 p-[2px] shadow-[0_0_30px_rgba(16,185,129,0.3)] mb-4">
          <div className="w-full h-full bg-[#0a0a0a] rounded-xl flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-300 to-emerald-400">
          Bug Brawl
        </h1>
        <p className="text-sm text-gray-400 mt-2 font-medium tracking-wide uppercase">The Ultimate Debugging Arena</p>
      </div>

      {/* Glassmorphic Card */}
      <div className="w-full max-w-md bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08] rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] relative z-10 overflow-hidden flex flex-col transition-all duration-300 hover:border-white/[0.12]">
        
        {/* Subtle top highlight */}
        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        
        {/* Card Body */}
        <div className="p-8 sm:p-10">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
            {subtitle && <p className="text-gray-400 text-sm leading-relaxed">{subtitle}</p>}
          </div>
          
          <div className="w-full">
            {children}
          </div>
        </div>
      </div>
      
      {/* Footer Text */}
      <div className="mt-12 text-xs text-gray-600 z-10 flex items-center gap-2 font-medium tracking-wider uppercase">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
        </span>
        System Online &copy; {new Date().getFullYear()}
      </div>
    </div>
  );
}
