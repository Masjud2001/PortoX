import React from 'react';
import { PortfolioData, ColorTheme, FontTheme } from '../../types';
import { motion } from 'framer-motion';
import { Mail, MapPin, ExternalLink } from 'lucide-react';

interface Props {
  data: PortfolioData;
  color: ColorTheme;
  font: FontTheme;
}

export const MinimalCentered: React.FC<Props> = ({ data, color, font }) => {
  const colorClasses = {
    indigo: 'text-indigo-600 bg-indigo-50 border-indigo-200',
    emerald: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    rose: 'text-rose-600 bg-rose-50 border-rose-200',
    slate: 'text-slate-600 bg-slate-50 border-slate-200',
    amber: 'text-amber-600 bg-amber-50 border-amber-200',
  };

  const fontClasses = {
    sans: 'font-sans',
    serif: 'font-serif',
    mono: 'font-mono',
  };

  const accentColor = colorClasses[color].split(' ')[0];

  return (
    <div className={`min-h-screen py-16 px-4 sm:px-6 lg:px-8 bg-white ${fontClasses[font]}`}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl mx-auto text-center"
      >
        <h1 className="text-5xl font-bold tracking-tight text-gray-900 mb-4">{data.name}</h1>
        <p className={`text-xl font-medium mb-6 ${accentColor}`}>{data.title}</p>
        
        <div className="flex justify-center items-center gap-4 text-gray-500 mb-12">
           {data.location && (
             <span className="flex items-center gap-1">
               <MapPin className="w-4 h-4" /> {data.location}
             </span>
           )}
           <a href={`mailto:${data.email}`} className="flex items-center gap-1 hover:text-gray-900 transition">
             <Mail className="w-4 h-4" /> Contact
           </a>
        </div>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-lg text-gray-600 leading-relaxed mb-12"
        >
          {data.bio}
        </motion.p>

        {/* Skills */}
        <div className="mb-16">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-6">Expertise</h2>
          <div className="flex flex-wrap justify-center gap-2">
            {data.skills.map((skill, idx) => (
              <span key={idx} className={`px-3 py-1 rounded-full text-sm font-medium border ${colorClasses[color].split(' ').slice(1).join(' ')} ${accentColor}`}>
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Experience */}
        <div className="text-left space-y-12">
          <h2 className="text-2xl font-bold text-center mb-8">Work Experience</h2>
          {data.experience.map((job, idx) => (
             <motion.div 
               key={idx}
               initial={{ opacity: 0, x: -20 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               transition={{ delay: idx * 0.1 }}
               className="border-l-2 border-gray-100 pl-6 relative"
             >
               <div className={`absolute -left-[5px] top-2 w-2.5 h-2.5 rounded-full ${colorClasses[color].split(' ')[0].replace('text', 'bg')}`}></div>
               <h3 className="text-xl font-bold text-gray-900">{job.role}</h3>
               <div className="text-gray-500 mb-2">{job.company} &middot; {job.duration}</div>
               <p className="text-gray-600">{job.description}</p>
             </motion.div>
          ))}
        </div>

        {/* Projects */}
        {data.projects && data.projects.length > 0 && (
          <div className="mt-16 text-left">
             <h2 className="text-2xl font-bold text-center mb-8">Selected Projects</h2>
             <div className="grid gap-6">
                {data.projects.map((proj, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-gray-50 p-6 rounded-xl hover:shadow-sm transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg">{proj.name}</h3>
                      <ExternalLink className="w-4 h-4 text-gray-400" />
                    </div>
                    <p className="text-gray-600 mb-4 text-sm">{proj.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {proj.technologies.map(t => (
                        <span key={t} className="text-xs text-gray-500 bg-white px-2 py-1 rounded border">{t}</span>
                      ))}
                    </div>
                  </motion.div>
                ))}
             </div>
          </div>
        )}

      </motion.div>
    </div>
  );
};
