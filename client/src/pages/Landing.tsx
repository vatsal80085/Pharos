// src/pages/Landing.tsx
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="min-h-screen relative overflow-hidden selection:bg-indigo-500 selection:text-white">
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 px-4 py-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link
            to="/"
            className="bg-white border-2 border-black px-4 py-1 text-2xl font-black shadow-hard hover:bg-indigo-500 hover:text-white transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none uppercase italic text-black"
          >
            Pharos<span className="text-indigo-600">.io</span>
          </Link>

          <div className="flex gap-4 bg-[#1a1a1a] border-2 border-white/20 p-2 shadow-hard-indigo">
            <Link to="/login" className="px-3 py-1 font-mono font-bold text-sm text-white hover:text-indigo-400 transition-colors">
              /LOGIN
            </Link>
            <Link to="/register" className="px-3 py-1 font-mono font-bold text-sm bg-indigo-600 text-white border border-black hover:bg-indigo-500 transition-colors">
              SIGN_UP
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex flex-col justify-center items-center px-4 pt-20 relative">
        {/* Floating Accents */}
        <div className="absolute top-1/4 left-[10%] w-16 h-16 bg-indigo-600 border-4 border-black shadow-hard hidden lg:block rotate-12 animate-bounce"></div>
        <div className="absolute top-20 right-20 text-9xl opacity-5 font-black select-none pointer-events-none text-white">
          VAULT
        </div>

        <div className="relative z-10 text-center max-w-5xl">
          {/* Status Badge */}
          <div className="inline-block bg-[#1a1a1a] border-2 border-indigo-500 px-4 py-1 mb-8 shadow-hard-indigo rotate-[-1deg]">
            <span className="font-mono font-bold text-indigo-400 animate-pulse mr-2">●</span>
            <span className="font-mono font-bold text-white text-sm tracking-widest">SYSTEM_STATUS: ENCRYPTED</span>
          </div>

          <h1 className="text-[12vw] md:text-[9vw] leading-[0.8] font-black uppercase tracking-tighter mb-8 text-white">
            Visualised <br />
            <span 
              className="text-transparent" 
              style={{ WebkitTextStroke: '2px #4f46e5' }}
            >
              STORAGE
            </span>
          </h1>

          <p className="font-mono text-base md:text-lg max-w-xl mx-auto mb-12 bg-white text-black border-2 border-indigo-500 p-4 shadow-hard-indigo rotate-1 font-bold">
            NO BLOAT. NO FRILLS. JUST SECURE FILE TRANSMISSION FOR DEVELOPERS.
          </p>

          <div className="flex flex-col md:flex-row justify-center gap-6">
            <Link
              to="/register"
              className="bg-indigo-600 text-white border-2 border-black px-12 py-5 text-xl font-bold shadow-hard hover:bg-indigo-500 hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all uppercase tracking-tighter"
            >
              Initialize_Vault
            </Link>
            <button className="bg-transparent text-white border-2 border-white px-12 py-5 text-xl font-bold hover:bg-white hover:text-black transition-all">
              
              <a href="https://github.com/vatsal80085/Pharos">Documentation</a>
            </button>
          </div>
        </div>
      </section>

      {/* Marquee Section */}
      <div className="border-y-2 border-indigo-500/30 bg-black py-4 relative z-20 overflow-hidden">
        <div className="flex whitespace-nowrap font-mono font-bold text-xl text-indigo-400 uppercase animate-[marquee_30s_linear_infinite]">
          {[1, 2, 3, 4].map((i) => (
            <span key={i} className="flex items-center">
              <span className="mx-8">// JWT_STATELESS_AUTH</span>
              <span className="mx-8">// NEON_DB_PERSISTENCE</span>
              <span className="mx-8">// MULTIPART_IO_READY</span>
              <span className="mx-8">// BCRYPT_HASHING_ENABLED</span>
            </span>
          ))}
        </div>
      </div>

      {/* Technical Specs Grid */}
      <section className="py-32 px-4 max-w-7xl mx-auto relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { title: "01_AUTH", desc: "Stateless JWT tokens with auto-expiration and manual logout revocation.", color: "bg-indigo-600" },
            { title: "02_IO", desc: "Buffered multipart streams supporting payloads up to 50MB.", color: "bg-white" },
            { title: "03_DB", desc: "Serverless PostgreSQL on Neon for high-concurrency metadata handling.", color: "bg-indigo-400" }
          ].map((card, idx) => (
            <div key={idx} className="bg-[#111] border-2 border-white/10 p-8 shadow-hard hover:border-indigo-500 transition-all group">
              <div className={`${card.color} w-10 h-10 mb-6 border-2 border-black`}></div>
              <h3 className="text-2xl font-black text-white mb-4 italic tracking-tighter">{card.title}</h3>
              <p className="font-mono text-sm text-gray-400 leading-relaxed group-hover:text-gray-200">
                {card.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <footer className="py-12 border-t border-white/10 text-center font-mono">
        <p className="text-gray-600 text-xs tracking-widest uppercase">
          [ Pharos v1.0 ] — {new Date().getFullYear()} — System_End
        </p>
      </footer>
    </div>
  );
};

export default Landing;