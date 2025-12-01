import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingScreen: React.FC = () => (
  <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
    <div className="relative">
      <div className="absolute inset-0 bg-indigo-200 rounded-full blur-xl opacity-50"></div>
      <Loader2 className="w-12 h-12 text-indigo-600 animate-spin relative z-10" />
    </div>
    <p className="text-slate-500 font-medium animate-pulse">Ma'lumotlar yuklanmoqda...</p>
  </div>
);