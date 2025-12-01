import React, { useMemo } from 'react';
import { getIncidents } from '../services/dataService';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const Trends: React.FC = () => {
  const incidents = useMemo(() => getIncidents(), []);

  const timeData = useMemo(() => {
    const map = new Map<string, { date: string, count: number, score: number, originalDate: string }>();
    
    // Sort by date object
    const sortedIncidents = [...incidents].sort((a, b) => 
        (a.dateObj?.getTime() || 0) - (b.dateObj?.getTime() || 0)
    );

    sortedIncidents.forEach(inc => {
       const dateKey = inc.date; 
       if (!map.has(dateKey)) {
           // Create short date label (DD.MM)
           const parts = dateKey.split('/');
           const shortDate = parts.length >= 2 ? `${parts[0]}.${parts[1]}` : dateKey;
           map.set(dateKey, { date: shortDate, count: 0, score: 0, originalDate: dateKey });
       }
       const entry = map.get(dateKey)!;
       entry.count++;
       entry.score += inc.score;
    });

    return Array.from(map.values());
  }, [incidents]);

  return (
    <div className="space-y-6">
       <div>
        <h1 className="text-2xl font-bold text-slate-800">Tendensiyalar</h1>
        <p className="text-slate-500">Vaqt davomida o'zgarishlar dinamikasi</p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-lg font-bold text-slate-800 mb-6">Kunlik Holatlar Soni</h2>
        <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={timeData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <Tooltip 
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        labelFormatter={(label, payload) => payload[0]?.payload.originalDate || label}
                    />
                    <Area type="monotone" dataKey="count" stroke="#6366f1" fillOpacity={1} fill="url(#colorCount)" name="Holatlar" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-lg font-bold text-slate-800 mb-6">Intizomiy Ballar Dinamikasi</h2>
         <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={timeData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <Tooltip 
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        labelFormatter={(label, payload) => payload[0]?.payload.originalDate || label}
                    />
                    <Area type="monotone" dataKey="score" stroke="#f59e0b" fillOpacity={1} fill="url(#colorScore)" name="Jami Ball" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};