import React, { useMemo, useState } from 'react';
import { useData } from '../contexts/DataContext';
import { Incident } from '../types';
import { 
  Users, 
  AlertTriangle, 
  CheckCircle2, 
  FileText,
  TrendingDown,
  TrendingUp, 
  UserX,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';
import { Modal } from '../components/Modal';
import { IncidentTable } from '../components/IncidentTable';
import { LoadingScreen } from '../components/LoadingScreen';

export const Dashboard: React.FC = () => {
  const { data, loading, error, refreshData } = useData();
  
  // Refactored modal state to hold specific configuration
  const [modalConfig, setModalConfig] = useState<{title: string, data: Incident[]} | null>(null);

  const stats = useMemo(() => {
    if (loading || error) return null;
    
    const total = data.length;
    const negative = data.filter(i => i.type === 'Salbiy').length;
    const positive = data.filter(i => i.type === 'Ijobiy').length;
    const totalScore = data.reduce<number>((acc, curr) => acc + (curr.score || 0), 0);
    const uniqueStudents = new Set(data.map(i => i.student)).size;
    
    // Group by category (Reason Type)
    const reasonsMap = data.reduce<Record<string, number>>((acc, curr) => {
        const parts = curr.reason.split('–');
        const key = parts.length > 1 ? parts[1].trim() : curr.reason;
        acc[key] = (acc[key] || 0) + 1;
        return acc;
    }, {});

    const chartData = Object.entries(reasonsMap)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => Number(b.value) - Number(a.value))
        .slice(0, 5);
    
    // Calculate Top Students by Score
    type StudentScore = {name: string, score: number, incidents: number};
    const studentScores = data.reduce<Record<string, StudentScore>>((acc, curr) => {
        if (!acc[curr.student]) {
            acc[curr.student] = { name: curr.student, score: 0, incidents: 0 };
        }
        acc[curr.student].score += (curr.score || 0);
        acc[curr.student].incidents += 1;
        return acc;
    }, {});

    const topStudents = (Object.values(studentScores) as StudentScore[])
        .sort((a, b) => b.score - a.score)
        .slice(0, 6);

    return { total, negative, positive, totalScore, uniqueStudents, chartData, topStudents };
  }, [data, loading, error]);

  const COLORS = ['#ef4444', '#f59e0b', '#3b82f6', '#6366f1', '#8b5cf6', '#10b981'];

  // Handlers for interactions
  const openAll = () => setModalConfig({ title: "Barcha Voqealar", data: data });
  const openNegative = () => setModalConfig({ title: "Salbiy Holatlar", data: data.filter(i => i.type === 'Salbiy') });
  const openPositive = () => setModalConfig({ title: "Ijobiy Holatlar", data: data.filter(i => i.type === 'Ijobiy') });
  const openScores = () => setModalConfig({ title: "Jarima va Ballar", data: [...data].sort((a, b) => b.score - a.score) });
  
  const handleStudentClick = (studentName: string) => {
    const studentData = data.filter(i => i.student === studentName);
    setModalConfig({ title: `${studentName} - Tarix`, data: studentData });
  };

  const handleReasonClick = (reasonShortName: string) => {
    const filteredData = data.filter(i => {
        const parts = i.reason.split('–');
        const key = parts.length > 1 ? parts[1].trim() : i.reason;
        return key === reasonShortName;
    });
    setModalConfig({ title: `Sabab: ${reasonShortName}`, data: filteredData });
  };

  if (loading) return <LoadingScreen />;

  if (error) {
    const isPermissionError = error.includes("DeployRuxsatXatoligi") || error.includes("HTML");

    return (
        <div className="flex flex-col items-center justify-center h-[70vh] text-center p-6">
            <div className="bg-red-50 p-4 rounded-full mb-4">
                <AlertTriangle className="w-12 h-12 text-red-500" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">Ma'lumotlarni yuklashda xatolik</h2>
            
            {isPermissionError ? (
                <div className="max-w-md bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 text-left">
                    <p className="font-semibold text-amber-800 mb-2">Google Apps Script sozlamalarini tekshiring:</p>
                    <ol className="list-decimal list-inside text-sm text-amber-700 space-y-2">
                        <li>Google Script loyihasini oching.</li>
                        <li><b>Deploy</b> &rarr; <b>New deployment</b> tugmasini bosing.</li>
                        <li><b>Who has access</b> qismini <b>"Anyone"</b> qilib belgilang.</li>
                        <li>Qayta deploy qilib, yangi URL ni oling.</li>
                    </ol>
                </div>
            ) : (
                <p className="text-slate-500 mb-6 max-w-md">{error}. Internet aloqasini tekshiring.</p>
            )}

            <button 
                onClick={refreshData}
                className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
            >
                <RefreshCw size={18} />
                <span>Qayta urinish</span>
            </button>
        </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-6 pb-6">
      <Modal 
        isOpen={!!modalConfig} 
        onClose={() => setModalConfig(null)} 
        title={modalConfig?.title || ""}
      >
        <IncidentTable data={modalConfig?.data || []} />
      </Modal>

      <div>
        <h1 className="text-2xl font-bold text-slate-800">Umumiy Statistika</h1>
        <p className="text-slate-500 mt-1">Maktab intizomi va o'zlashtirish bo'yicha qisqacha ma'lumot</p>
      </div>

      {/* Stat Cards - Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div 
            onClick={openAll}
            className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-lg hover:border-indigo-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 group-hover:text-indigo-600 transition-colors">Jami Voqealar</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{stats.total}</h3>
            </div>
            <div className="p-3 bg-indigo-50 rounded-lg group-hover:bg-indigo-100 transition-colors">
              <FileText className="text-indigo-600" size={24} />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs text-slate-500">
            <Users className="mr-1" size={14} />
            {stats.uniqueStudents} ta o'quvchi qatnashgan
          </div>
        </div>

        <div 
            onClick={openNegative}
            className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-lg hover:border-red-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 group-hover:text-red-600 transition-colors">Salbiy Holatlar</p>
              <h3 className="text-2xl font-bold text-red-600 mt-1">{stats.negative}</h3>
            </div>
            <div className="p-3 bg-red-50 rounded-lg group-hover:bg-red-100 transition-colors">
              <AlertTriangle className="text-red-600" size={24} />
            </div>
          </div>
           <div className="mt-4 flex items-center text-xs text-red-600 font-medium">
            <TrendingDown className="mr-1" size={14} />
            {(stats.negative / (stats.total || 1) * 100).toFixed(1)}% umumiy miqdordan
          </div>
        </div>

        <div 
            onClick={openPositive}
            className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-lg hover:border-emerald-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 group-hover:text-emerald-600 transition-colors">Ijobiy Holatlar</p>
              <h3 className="text-2xl font-bold text-emerald-600 mt-1">{stats.positive}</h3>
            </div>
            <div className="p-3 bg-emerald-50 rounded-lg group-hover:bg-emerald-100 transition-colors">
              <CheckCircle2 className="text-emerald-600" size={24} />
            </div>
          </div>
           <div className="mt-4 flex items-center text-xs text-emerald-600 font-medium">
            <TrendingUp className="mr-1" size={14} />
            {(stats.positive / (stats.total || 1) * 100).toFixed(1)}% umumiy miqdordan
          </div>
        </div>

        <div 
            onClick={openScores}
            className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-lg hover:border-amber-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 group-hover:text-amber-600 transition-colors">Jami Jarima/Ball</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{stats.totalScore}</h3>
            </div>
            <div className="p-3 bg-amber-50 rounded-lg group-hover:bg-amber-100 transition-colors">
              <Users className="text-amber-600" size={24} />
            </div>
          </div>
           <div className="mt-4 text-xs text-slate-400">
            Barcha o'quvchilar bo'yicha yig'indi
          </div>
        </div>
      </div>

      {/* Main Content Grid - Responsive Stacking */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Students List */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-full">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-800 flex items-center">
                <UserX className="mr-2 text-red-500" size={20} />
                Eng ko'p ball ayrilgan o'quvchilar
            </h2>
          </div>
          <div className="p-4 flex-1 overflow-auto max-h-[400px]">
            <div className="space-y-4">
              {stats.topStudents.map((item, index) => (
                <div 
                    key={index} 
                    onClick={() => handleStudentClick(item.name)}
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100 hover:border-indigo-200 hover:bg-slate-100 cursor-pointer transition-all"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                          index < 3 ? 'bg-red-100 text-red-600' : 'bg-slate-200 text-slate-600'
                      }`}>
                          {index + 1}
                      </div>
                      <div className="min-w-0">
                          <p className="text-sm font-bold text-slate-900 truncate">{item.name}</p>
                          <p className="text-xs text-slate-500">{item.incidents} ta holat</p>
                      </div>
                  </div>
                  <span className="text-sm font-bold px-3 py-1 bg-red-100 text-red-700 rounded-lg whitespace-nowrap">
                    {item.score} ball
                  </span>
                </div>
              ))}
              {stats.topStudents.length === 0 && (
                <p className="text-center text-slate-500 py-4">Ma'lumot mavjud emas</p>
              )}
            </div>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col">
           <h2 className="text-lg font-bold text-slate-800 mb-6">Sabablar Tahlili (Top 5)</h2>
           <div className="h-[300px] w-full relative">
             <div className="absolute inset-0">
               {stats.chartData.length > 0 ? (
                 <ResponsiveContainer width="100%" height="100%">
                   <PieChart>
                     <Pie
                        data={stats.chartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        onClick={(data) => handleReasonClick(data.name)}
                        cursor="pointer"
                        label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                            const RADIAN = Math.PI / 180;
                            const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                            const x = cx + radius * Math.cos(-midAngle * RADIAN);
                            const y = cy + radius * Math.sin(-midAngle * RADIAN);
                          
                            return percent > 0.05 ? (
                              <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={12} fontWeight="bold">
                                {`${(percent * 100).toFixed(0)}%`}
                              </text>
                            ) : null;
                          }}
                     >
                        {stats.chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                     </Pie>
                     <RechartsTooltip 
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                     />
                     <Legend 
                        layout="vertical" 
                        verticalAlign="middle" 
                        align="right"
                        wrapperStyle={{ fontSize: '12px', right: 0 }}
                     />
                   </PieChart>
                 </ResponsiveContainer>
               ) : (
                 <div className="flex items-center justify-center h-full text-slate-400">
                   Grafik uchun ma'lumot yo'q
                 </div>
               )}
             </div>
           </div>
           <p className="text-center text-xs text-slate-400 mt-4">Batafsil ko'rish uchun diagramma bo'laklariga bosing</p>
        </div>
      </div>
    </div>
  );
};