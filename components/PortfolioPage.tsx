import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { store } from '../store';
import { PortfolioConfig } from '../types';
import { MinimalCentered } from './layouts/MinimalCentered';
import { ModernGrid } from './layouts/ModernGrid';
import { Loader2, AlertCircle } from 'lucide-react';

export const PortfolioPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [portfolio, setPortfolio] = useState<PortfolioConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const found = store.getPortfolioById(id);
      if (found) {
        setPortfolio(found);
      }
    }
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!portfolio) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 text-center">
        <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Portfolio Not Found</h1>
        <p className="text-gray-600 mb-8">The portfolio you are looking for doesn't exist or has been removed.</p>
        <Link to="/" className="text-indigo-600 hover:text-indigo-800 font-medium">
          Create your own portfolio &rarr;
        </Link>
      </div>
    );
  }

  // Layout Selector
  const renderLayout = () => {
    const { data, theme } = portfolio;
    switch (theme.layout) {
      case 'grid':
        return <ModernGrid data={data} color={theme.color} font={theme.font} />;
      case 'timeline':
        // Reuse minimal for now but styled differently in a real full app
        return <MinimalCentered data={data} color={theme.color} font={theme.font} />;
      case 'minimal':
      default:
        return <MinimalCentered data={data} color={theme.color} font={theme.font} />;
    }
  };

  return (
    <>
      {renderLayout()}
      <div className="fixed bottom-4 right-4 opacity-50 hover:opacity-100 transition-opacity">
        <Link to="/" className="bg-black text-white text-xs px-3 py-1 rounded-full shadow-lg">
          Made with PortoX
        </Link>
      </div>
    </>
  );
};