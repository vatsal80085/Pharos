// src/pages/Register.tsx
import { useState } from 'react';
import { Link } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("INITIALIZING_CREATION:", formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 selection:bg-indigo-500 selection:text-white">
      {/* Central Auth Card */}
      <div className="w-full max-w-lg bg-[#111] border-4 border-white p-8 md:p-12 shadow-hard-indigo relative">
        
        {/* Decorative Corner Tab */}
        <div className="absolute -top-1 -right-1 bg-indigo-600 text-white border-b-4 border-l-4 border-white px-3 py-1 font-mono text-[10px] font-black uppercase tracking-tighter">
          NEW_USER_UPLINK
        </div>

        <header className="mb-10">
          <h2 className="text-5xl font-black text-white uppercase italic tracking-tighter leading-none mb-2">
            Register<span className="text-indigo-500">.</span>
          </h2>
          <p className="font-mono text-xs text-indigo-400 font-bold uppercase tracking-widest">
            {'>'} Define system credentials...
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col group">
            <label className="font-mono text-[10px] font-black text-gray-500 uppercase mb-1 ml-1 group-focus-within:text-indigo-400 transition-colors">
              Full_Name
            </label>
            <input 
              type="text"
              required
              className="bg-black border-2 border-white/20 p-4 font-mono text-sm text-white focus:outline-none focus:border-indigo-500 focus:shadow-hard-indigo transition-all placeholder:text-gray-700"
              placeholder="IDENTITY_STRING"
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div className="flex flex-col group">
            <label className="font-mono text-[10px] font-black text-gray-500 uppercase mb-1 ml-1 group-focus-within:text-indigo-400 transition-colors">
              Coordinates (Email)
            </label>
            <input 
              type="email"
              required
              className="bg-black border-2 border-white/20 p-4 font-mono text-sm text-white focus:outline-none focus:border-indigo-500 focus:shadow-hard-indigo transition-all placeholder:text-gray-700"
              placeholder="USER@DOMAIN.COM"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div className="flex flex-col group">
            <label className="font-mono text-[10px] font-black text-gray-500 uppercase mb-1 ml-1 group-focus-within:text-indigo-400 transition-colors">
              Master_Key (Password)
            </label>
            <input 
              type="password"
              required
              className="bg-black border-2 border-white/20 p-4 font-mono text-sm text-white focus:outline-none focus:border-indigo-500 focus:shadow-hard-indigo transition-all placeholder:text-gray-700"
              placeholder="••••••••"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-white text-black border-2 border-black py-5 font-black uppercase tracking-tighter text-xl hover:bg-indigo-600 hover:text-white transition-all shadow-hard hover:translate-x-1 hover:translate-y-1 hover:shadow-none mt-4"
          >
            Create_Identity →
          </button>
        </form>

        <footer className="mt-10 pt-6 border-t-2 border-white/10 border-dashed">
          <p className="font-mono text-[10px] text-center text-gray-500 uppercase">
            Already registered? <Link to="/login" className="font-bold text-white hover:text-indigo-400 underline decoration-indigo-500 underline-offset-4">Access_Vault</Link>
          </p>
        </footer>
      </div>

      {/* Background Graphic Accent */}
      <div className="fixed bottom-10 right-10 text-8xl font-black text-white/5 select-none pointer-events-none uppercase">
        Create
      </div>
    </div>
  );
};

export default Register;