import React from 'react';
import { PortfolioData, ColorTheme, FontTheme } from '../../types';
import { motion } from 'framer-motion';
import { Github, Linkedin, Twitter, Mail, Link as LinkIcon } from 'lucide-react';

interface Props {
  data: PortfolioData;
  color: ColorTheme;
  font: FontTheme;
}

export const ModernGrid: React.FC<Props> = ({ data, color, font }) => {
  const bgColors = {
    indigo: 'bg-indigo-600',
    emerald: 'bg-emerald-600',
    rose: 'bg-rose-600',
    slate: 'bg-slate-800',
    amber: 'bg-amber-600',
  };

  const textColors = {
    indigo: 'text-indigo-600',
    emerald: 'text-emerald-600',
    rose: 'text-rose-600',
    slate: 'text-slate-800',
    amber: 'text-amber-600',
  };

  const fontClasses = {
    sans: 'font-sans',
    serif: 'font-serif',
    mono: 'font-mono',
  };

  const SocialIcon = ({ platform }: { platform: string }) => {
    const p = platform.toLowerCase();
    if (p.includes('github')) return <Github className="w-5 h-5" />;
    if (p.includes('linkedin')) return <Linkedin className="w-5 h-5" />;
    if (p.includes('twitter')) return <Twitter className="w-5 h-5" />;
    return <LinkIcon className="w-5 h-5" />;
  };

  return (
    <div className={`min-h-screen bg-gray-50 p-4 sm:p-8 ${fontClasses[font]}`}>
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Header / Sidebar Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`md:col-span-4 ${bgColors[color]} text-white rounded-3xl p-8 flex flex-col justify-between shadow-xl min-h-[400px]`}
        >
          <div>
            <h1 className="text-4xl font-bold mb-2">{data.name}</h1>
            <p className="text-white/80 text-xl font-medium">{data.title}</p>
            <div className="mt-8 space-y-4">
               {data.socialLinks.map((link, i) => (
                 <a key={i} href={link.url} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-white/90 hover:text-white transition bg-white/10 p-2 rounded-lg backdrop-blur-sm">
                   <SocialIcon platform={link.platform} />
                   <span className="capitalize">{link.platform}</span>
                 </a>
               ))}
               <a href={`mailto:${data.email}`} className="flex items-center gap-3 text-white/90 hover:text-white transition bg-white/10 p-2 rounded-lg backdrop-blur-sm">
                   <Mail className="w-5 h-5" />
                   <span>Email Me</span>
               </a>
            </div>
          </div>
          <div className="mt-12">
            <p className="text-white/80 leading-relaxed text-sm">
              {data.location}
            </p>
          </div>
        </motion.div>

        {/* Content Area */}
        <div className="md:col-span-8 space-y-6">
          
          {/* Bio Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-3xl p-8 shadow-sm"
          >
            <h2 className={`text-2xl font-bold mb-4 ${textColors[color]}`}>About</h2>
            <p className="text-gray-600 leading-relaxed text-lg">{data.bio}</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Experience */}
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.3 }}
               className="bg-white rounded-3xl p-8 shadow-sm md:col-span-2"
            >
              <h2 className={`text-2xl font-bold mb-6 ${textColors[color]}`}>Experience</h2>
              <div className="space-y-8">
                {data.experience.map((exp, i) => (
                  <div key={i} className="group">
                    <div className="flex justify-between items-start flex-wrap gap-2 mb-2">
                      <h3 className="font-bold text-lg text-gray-900">{exp.role}</h3>
                      <span className="text-sm font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded">{exp.duration}</span>
                    </div>
                    <p className={`text-sm font-medium mb-2 ${textColors[color]}`}>{exp.company}</p>
                    <p className="text-gray-600 text-sm leading-relaxed">{exp.description}</p>
                  </div>
                ))}
              </div>
            </motion.div>

             {/* Skills */}
             <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.4 }}
               className="bg-white rounded-3xl p-8 shadow-sm"
            >
               <h2 className={`text-2xl font-bold mb-6 ${textColors[color]}`}>Skills</h2>
               <div className="flex flex-wrap gap-2">
                 {data.skills.map((skill, i) => (
                   <span key={i} className={`px-3 py-1.5 rounded-lg text-sm font-medium bg-gray-50 text-gray-700 hover:${textColors[color]} transition`}>
                     {skill}
                   </span>
                 ))}
               </div>
            </motion.div>

             {/* Education */}
             <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.5 }}
               className="bg-white rounded-3xl p-8 shadow-sm"
            >
               <h2 className={`text-2xl font-bold mb-6 ${textColors[color]}`}>Education</h2>
               <div className="space-y-4">
                 {data.education.map((edu, i) => (
                   <div key={i}>
                     <h3 className="font-bold text-gray-900">{edu.institution}</h3>
                     <p className="text-sm text-gray-600">{edu.degree}</p>
                     <p className="text-xs text-gray-400 mt-1">{edu.year}</p>
                   </div>
                 ))}
               </div>
            </motion.div>
          </div>
        </div>

      </div>
    </div>
  );
};
