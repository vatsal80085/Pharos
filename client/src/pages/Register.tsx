// src/pages/Register.tsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api, saveToken, type AuthResponse } from '../lib/api';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await api.post<AuthResponse>('/auth/register', formData);
      saveToken(response.data.token);
      navigate('/dashboard');
    } catch {
      setError('Registration failed. Try a different email address.');
    } finally {
      setIsSubmitting(false);
    }
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
              value={formData.fullName}
              className="bg-black border-2 border-white/20 p-4 font-mono text-sm text-white focus:outline-none focus:border-indigo-500 focus:shadow-hard-indigo transition-all placeholder:text-gray-700"
              placeholder="IDENTITY_STRING"
              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
            />
          </div>

          <div className="flex flex-col group">
            <label className="font-mono text-[10px] font-black text-gray-500 uppercase mb-1 ml-1 group-focus-within:text-indigo-400 transition-colors">
              Coordinates (Email)
            </label>
            <input 
              type="email"
              required
              value={formData.email}
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
              value={formData.password}
              className="bg-black border-2 border-white/20 p-4 font-mono text-sm text-white focus:outline-none focus:border-indigo-500 focus:shadow-hard-indigo transition-all placeholder:text-gray-700"
              placeholder="••••••••"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          {error && <p className="font-mono text-xs text-red-300">{error}</p>}

          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-white text-black border-2 border-black py-5 font-black uppercase tracking-tighter text-xl hover:bg-indigo-600 hover:text-white transition-all shadow-hard hover:translate-x-1 hover:translate-y-1 hover:shadow-none mt-4"
          >
            {isSubmitting ? 'Creating...' : 'Create_Identity ->'}
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
