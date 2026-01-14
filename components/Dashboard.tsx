import React, { useState, useRef, useEffect } from 'react';
import { store } from '../store';
import { User, PortfolioConfig, LayoutType, ColorTheme, FontTheme } from '../types';
import { Button } from './Button';
import { parsingService } from '../services/parsingService';
import { useNavigate, Link } from 'react-router-dom';
import { FileText, Plus, Sparkles, LogOut, ArrowRight, Trash2, UploadCloud } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Dashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [portfolios, setPortfolios] = useState<PortfolioConfig[]>([]);
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const u = store.getUser();
    if (!u) {
      navigate('/login');
      return;
    }
    setUser(u);
    setPortfolios(store.getUserPortfolios(u.id));
  }, [navigate]);

  const handleLogout = () => {
    store.logout();
    navigate('/login');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setIsGenerating(true);
    try {
      // 1. Local "Server-side" Parsing
      const data = await parsingService.parseResumeFile(file);
      
      // 2. Randomize Theme
      const layouts: LayoutType[] = ['minimal', 'grid', 'timeline'];
      const colors: ColorTheme[] = ['indigo', 'emerald', 'rose', 'slate', 'amber'];
      const fonts: FontTheme[] = ['sans', 'serif', 'mono'];

      const randomTheme = {
        layout: layouts[Math.floor(Math.random() * layouts.length)],
        color: colors[Math.floor(Math.random() * colors.length)],
        font: fonts[Math.floor(Math.random() * fonts.length)],
      };

      // 3. Save to DB (Local Store)
      const newPortfolio: PortfolioConfig = {
        id: Math.random().toString(36).substring(2, 9),
        userId: user.id,
        createdAt: new Date().toISOString(),
        data,
        theme: randomTheme
      };

      store.savePortfolio(newPortfolio);
      setPortfolios(store.getUserPortfolios(user.id));
      
      // 4. Redirect to Live URL
      navigate(`/p/${newPortfolio.id}`);

    } catch (err) {
      console.error(err);
      alert("Failed to parse the file. Please try a cleaner PDF or DOCX.");
    } finally {
      setIsGenerating(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 font-sans text-zinc-900">
      {/* Navbar */}
      <nav className="border-b border-zinc-200 bg-white sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <span className="font-bold text-xl tracking-tight">PortoX</span>
          </div>
          <div className="flex items-center gap-4">
             <span className="text-sm text-zinc-500 hidden sm:block">Welcome, {user?.name}</span>
             <Button variant="ghost" onClick={handleLogout} className="text-zinc-500 hover:text-red-600">
               <LogOut className="w-4 h-4" />
             </Button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Create Section */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-zinc-100 p-6">
              <h2 className="text-lg font-semibold mb-1">Create New Portfolio</h2>
              <p className="text-sm text-zinc-500 mb-6">Upload your resume to instantly generate a unique site.</p>
              
              <div className="space-y-4">
                <div 
                  className={`border-2 border-dashed border-zinc-200 rounded-xl p-8 flex flex-col items-center justify-center text-center transition-colors cursor-pointer ${isGenerating ? 'opacity-50 cursor-not-allowed' : 'hover:border-indigo-400 hover:bg-indigo-50'}`}
                  onClick={() => !isGenerating && fileInputRef.current?.click()}
                >
                  <UploadCloud className="w-10 h-10 text-indigo-500 mb-3" />
                  <p className="text-sm font-medium text-zinc-900">
                    {isGenerating ? "Parsing & Generating..." : "Click to upload Resume"}
                  </p>
                  <p className="text-xs text-zinc-400 mt-1">PDF, DOCX, or TXT</p>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept=".pdf,.docx,.txt" 
                    onChange={handleFileUpload}
                    disabled={isGenerating}
                  />
                </div>

                <div className="bg-zinc-50 p-4 rounded-lg text-xs text-zinc-500 leading-relaxed">
                  <strong>How it works:</strong> We analyze your file locally in your browser (privacy focused) and build a custom layout based on your content.
                </div>
              </div>
            </div>
          </div>

          {/* List Section */}
          <div className="lg:col-span-2">
             <div className="flex items-center justify-between mb-6">
               <h2 className="text-xl font-bold">Your Portfolios</h2>
             </div>

             {portfolios.length === 0 ? (
               <div className="bg-white rounded-2xl p-12 text-center border border-zinc-100">
                  <div className="bg-zinc-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Plus className="w-8 h-8 text-zinc-300" />
                  </div>
                  <h3 className="text-lg font-medium text-zinc-900 mb-1">No portfolios yet</h3>
                  <p className="text-zinc-500">Upload your resume to create your first website.</p>
               </div>
             ) : (
               <div className="grid gap-4 sm:grid-cols-2">
                 <AnimatePresence>
                 {portfolios.map((p) => (
                   <motion.div 
                      key={p.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="group bg-white rounded-xl border border-zinc-200 hover:border-indigo-300 hover:shadow-md transition-all p-5 flex flex-col justify-between h-48"
                   >
                     <div>
                       <div className="flex justify-between items-start mb-2">
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full bg-zinc-100 text-zinc-500`}>
                            {p.theme.layout} &middot; {p.theme.color}
                          </span>
                       </div>
                       <h3 className="font-bold text-lg text-zinc-900 truncate">{p.data.name}</h3>
                       <p className="text-sm text-zinc-500 truncate">{p.data.title}</p>
                     </div>

                     <div className="flex items-center justify-between mt-4 pt-4 border-t border-zinc-100">
                        <span className="text-xs text-zinc-400">
                          {new Date(p.createdAt).toLocaleDateString()}
                        </span>
                        <Link 
                          to={`/p/${p.id}`} 
                          className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-700"
                        >
                          View Site <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                        </Link>
                     </div>
                   </motion.div>
                 ))}
                 </AnimatePresence>
               </div>
             )}
          </div>

        </div>
      </main>
    </div>
  );
};