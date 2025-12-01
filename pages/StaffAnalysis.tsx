import React, { useMemo, useState } from 'react';
import { getIncidents } from '../services/dataService';
import { StaffStat, Incident } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Modal } from '../components/Modal';
import { IncidentTable } from '../components/IncidentTable';

export const StaffAnalysis: React.FC = () => {
  const incidents = useMemo(() => getIncidents(), []);
  const [selectedStaffName, setSelectedStaffName] = useState<string | null>(null);

  const staffData = useMemo(() => {
    const map = new Map<string, StaffStat & { incidents: Incident[] }>();
    
    incidents.forEach(inc => {
      const name = inc.staff || "Noma'lum";
      if (!map.has(name)) {
        map.set(name, {
          name: name,
          reportsCount: 0,
          negativeReports: 0,
          positiveReports: 0,
          incidents: []
        });
      }
      const stat = map.get(name)!;
      stat.reportsCount++;
      if (inc.type === 'Salbiy') stat.negativeReports++;
      else stat.positiveReports++;
      stat.incidents.push(inc);
    });

    // Convert to array and sort by total reports descending
    return Array.from(map.values())
        .sort((a, b) => b.reportsCount - a.reportsCount);
  }, [incidents]);

  const selectedStaffData = useMemo(() => {
    return staffData.find(s => s.name === selectedStaffName);
  }, [staffData, selectedStaffName]);

  return (
    <div className="space-y-6">
      <Modal
        isOpen={!!selectedStaffName}
        onClose={() => setSelectedStaffName(null)}
        title={selectedStaffName ? `${selectedStaffName} - Hisobotlar` : ''}
      >
         {selectedStaffData && <IncidentTable data={selectedStaffData.incidents} hideStaff />}
      </Modal>

      <div>
        <h1 className="text-2xl font-bold text-slate-800">O'qituvchilar Faoliyati</h1>
        <p className="text-slate-500">Qaysi xodimlar eng ko'p holat qayd etgan?</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Top Reporter Card */}
         <div 
           className="bg-indigo-600 rounded-xl shadow-lg p-6 text-white col-span-1 cursor-pointer hover:bg-indigo-700 transition-colors"
           onClick={() => staffData.length > 0 && setSelectedStaffName(staffData[0].name)}
         >
            <h3 className="text-indigo-100 text-sm uppercase font-semibold">Eng faol xodim</h3>
            {staffData.length > 0 && (
              <div className="mt-4">
                 <p className="text-3xl font-bold">{staffData[0].name}</p>
                 <div className="mt-4 flex items-center space-x-4">
                    <div>
                        <p className="text-2xl font-bold">{staffData[0].reportsCount}</p>
                        <p className="text-indigo-200 text-xs">Jami hisobotlar</p>
                    </div>
                    <div className="h-8 w-px bg-indigo-400"></div>
                    <div>
                        <p className="text-2xl font-bold">{staffData[0].negativeReports}</p>
                        <p className="text-indigo-200 text-xs">Intizomiy</p>
                    </div>
                 </div>
              </div>
            )}
         </div>

         {/* Chart */}
         <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 col-span-1 lg:col-span-2">
            <h3 className="text-slate-800 font-bold mb-4">Hisobotlar taqsimoti</h3>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={staffData.slice(0, 10)} margin={{ top: 20, right: 30, left: 20, bottom: 50 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 10 }} 
                    interval={0} 
                    angle={-15} 
                    textAnchor="end"
                  />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    cursor={{fill: '#f8fafc'}}
                  />
                  <Legend verticalAlign="top"/>
                  {/* Thinner bars (barSize=24) and rounded corners for a sleeker look */}
                  <Bar dataKey="negativeReports" name="Salbiy" fill="#ef4444" stackId="a" barSize={24} radius={[0, 0, 4, 4]} />
                  <Bar dataKey="positiveReports" name="Ijobiy" fill="#10b981" stackId="a" barSize={24} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-xs text-slate-400 text-center mt-2">Diagrammada eng faol 10 nafar xodim ko'rsatilgan</p>
         </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
              <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                      <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Xodim (F.I.SH)</th>
                      <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase text-center">Jami</th>
                      <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase text-center">Salbiy</th>
                      <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase text-center">Ijobiy</th>
                  </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                  {staffData.map((staff, idx) => (
                      <tr 
                          key={idx} 
                          className="hover:bg-slate-50 cursor-pointer transition-colors group"
                          onClick={() => setSelectedStaffName(staff.name)}
                      >
                          <td className="px-6 py-3 text-sm font-medium text-slate-800 group-hover:text-indigo-600">{staff.name}</td>
                          <td className="px-6 py-3 text-sm text-center font-bold text-slate-900">{staff.reportsCount}</td>
                          <td className="px-6 py-3 text-sm text-center text-red-600">{staff.negativeReports}</td>
                          <td className="px-6 py-3 text-sm text-center text-emerald-600">{staff.positiveReports}</td>
                      </tr>
                  ))}
              </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};