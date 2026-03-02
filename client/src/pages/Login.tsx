// src/pages/Login.tsx
import { useState } from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("AUTHORIZING_ACCESS:", formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 selection:bg-indigo-500 selection:text-white">
      {/* Central Auth Card */}
      <div className="w-full max-w-lg bg-[#111] border-4 border-white p-8 md:p-12 shadow-hard-indigo relative">
        
        {/* Decorative Corner Tab */}
        <div className="absolute -top-1 -right-1 bg-white text-black border-b-4 border-l-4 border-black px-3 py-1 font-mono text-[10px] font-black uppercase tracking-tighter">
          SECURE_UPLINK
        </div>

        <header className="mb-10">
          <h2 className="text-5xl font-black text-white uppercase italic tracking-tighter leading-none mb-2 text-stroke-white">
            Login<span className="text-indigo-500">.</span>
          </h2>
          <p className="font-mono text-xs text-indigo-400 font-bold uppercase tracking-widest">
            {'>'} Enter_Master_Credentials...
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col group">
            <label className="font-mono text-[10px] font-black text-gray-500 uppercase mb-1 ml-1 group-focus-within:text-indigo-400 transition-colors">
              Coordinates (Email)
            </label>
            <input 
              type="email"
              required
              className="bg-black border-2 border-white/20 p-4 font-mono text-sm text-white focus:outline-none focus:border-indigo-500 focus:shadow-hard-indigo transition-all placeholder:text-gray-800"
              placeholder="USER@DOMAIN.COM"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div className="flex flex-col group">
            <div className="flex justify-between items-end mb-1">
              <label className="font-mono text-[10px] font-black text-gray-500 uppercase ml-1 group-focus-within:text-indigo-400 transition-colors">
                Key (Password)
              </label>
            </div>
            <input 
              type="password"
              required
              className="bg-black border-2 border-white/20 p-4 font-mono text-sm text-white focus:outline-none focus:border-indigo-500 focus:shadow-hard-indigo transition-all placeholder:text-gray-800"
              placeholder="••••••••"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-indigo-600 text-white border-2 border-black py-5 font-black uppercase tracking-tighter text-xl hover:bg-white hover:text-black transition-all shadow-hard hover:translate-x-1 hover:translate-y-1 hover:shadow-none mt-4"
          >
            Access_Vault →
          </button>
        </form>

        <footer className="mt-10 pt-6 border-t-2 border-white/10 border-dashed">
          <p className="font-mono text-[10px] text-center text-gray-500 uppercase">
            Not Registered? <Link to="/register" className="font-bold text-white hover:text-indigo-400 underline decoration-indigo-500 underline-offset-4">Initialize_New_Identity</Link>
          </p>
        </footer>
      </div>

      {/* Background Graphic Accent */}
      <div className="fixed top-10 left-10 text-8xl font-black text-white/5 select-none pointer-events-none uppercase">
        Access
      </div>
    </div>
  );
};

export default Login;