import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { store } from '../store';
import { Button } from './Button';
import { Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export const Auth: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    
    // Simulate network delay
    setTimeout(() => {
      store.login(email);
      setLoading(false);
      navigate('/dashboard');
    }, 800);
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-zinc-100 p-8"
      >
        <div className="flex items-center justify-center gap-2 mb-8">
           <div className="bg-indigo-600 p-2 rounded-lg">
             <Sparkles className="w-6 h-6 text-white" />
           </div>
           <h1 className="text-2xl font-bold tracking-tight text-zinc-900">PortoX</h1>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-xl font-semibold mb-2">Turn your resume into a website</h2>
          <p className="text-zinc-500 text-sm">
            Sign in to upload your resume and generate a unique, hosted portfolio in seconds.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-zinc-700 mb-1">Email address</label>
            <input
              type="email"
              id="email"
              required
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full py-2.5" isLoading={loading}>
            Get Started <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </form>

        <div className="mt-6 text-center text-xs text-zinc-400">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </div>
      </motion.div>
    </div>
  );
};