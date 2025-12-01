import React, { useMemo, useState } from 'react';
import { useData } from '../contexts/DataContext';
import { Incident, StudentStat } from '../types';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';
import { Modal } from '../components/Modal';
import { IncidentTable } from '../components/IncidentTable';
import { LoadingScreen } from '../components/LoadingScreen';

export const StudentAnalysis: React.FC = () => {
  const { data: incidents, loading } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<'name' | 'score' | 'count'>('score');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [selectedStudent, setSelectedStudent] = useState<StudentStat | null>(null);

  const students = useMemo(() => {
    if (loading) return [];

    const map = new Map<string, StudentStat>();

    incidents.forEach(inc => {
      if (!map.has(inc.student)) {
        map.set(inc.student, {
          name: inc.student,
          totalIncidents: 0,
          totalScore: 0,
          negativeCount: 0,
          positiveCount: 0,
          incidents: []
        });
      }
      const stat = map.get(inc.student)!;
      stat.totalIncidents++;
      stat.totalScore += inc.score;
      if (inc.type === 'Salbiy') stat.negativeCount++;
      else stat.positiveCount++;
      stat.incidents.push(inc);
    });

    return Array.from(map.values());
  }, [incidents, loading]);

  const filteredAndSorted = useMemo(() => {
    let result = students.filter(s => 
      s.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    result.sort((a, b) => {
      let valA: any = a.totalScore;
      let valB: any = b.totalScore;

      if (sortField === 'name') {
        valA = a.name;
        valB = b.name;
      } else if (sortField === 'count') {
        valA = a.totalIncidents;
        valB = b.totalIncidents;
      }

      if (valA < valB) return sortDir === 'asc' ? -1 : 1;
      if (valA > valB) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [students, searchTerm, sortField, sortDir]);

  const handleSort = (field: 'name' | 'score' | 'count') => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  const SortIcon = ({ field }: { field: string }) => {
    if (sortField !== field) return <ChevronDown size={14} className="text-slate-300 opacity-0 group-hover:opacity-50" />;
    return sortDir === 'asc' ? <ChevronUp size={14} className="text-indigo-600" /> : <ChevronDown size={14} className="text-indigo-600" />;
  };

  if (loading) return <LoadingScreen />;

  return (
    <div className="space-y-6">
      <Modal
        isOpen={!!selectedStudent}
        onClose={() => setSelectedStudent(null)}
        title={selectedStudent ? `${selectedStudent.name} - Tarix` : ''}
      >
        {selectedStudent && <IncidentTable data={selectedStudent.incidents} hideStudent />}
      </Modal>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-2xl font-bold text-slate-800">O'quvchilar Tahlili</h1>
           <p className="text-slate-500">Har bir o'quvchi bo'yicha batafsil statistika</p>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="O'quvchini izlash..."
            className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none w-full md:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-4 cursor-pointer group hover:bg-slate-100 transition-colors" onClick={() => handleSort('name')}>
                  <div className="flex items-center space-x-1">
                    <span>O'quvchi (F.I.SH)</span>
                    <SortIcon field="name" />
                  </div>
                </th>
                <th className="px-6 py-4 cursor-pointer group hover:bg-slate-100 transition-colors" onClick={() => handleSort('count')}>
                  <div className="flex items-center space-x-1">
                    <span>Jami Holatlar</span>
                    <SortIcon field="count" />
                  </div>
                </th>
                <th className="px-6 py-4">
                   <div className="flex items-center space-x-1">
                    <span>Salbiy / Ijobiy</span>
                   </div>
                </th>
                <th className="px-6 py-4 cursor-pointer group hover:bg-slate-100 transition-colors" onClick={() => handleSort('score')}>
                   <div className="flex items-center space-x-1">
                    <span>Jami Ball</span>
                    <SortIcon field="score" />
                  </div>
                </th>
                <th className="px-6 py-4">Izohlar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAndSorted.map((student, idx) => (
                <tr 
                  key={idx} 
                  className="hover:bg-slate-50 transition-colors cursor-pointer group"
                  onClick={() => setSelectedStudent(student)}
                >
                  <td className="px-6 py-4 text-sm font-medium text-slate-900 group-hover:text-indigo-600">
                    {student.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {student.totalIncidents} ta
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2 text-xs font-medium">
                      <span className="px-2 py-1 bg-red-100 text-red-700 rounded-md">
                        {student.negativeCount} Salbiy
                      </span>
                      {student.positiveCount > 0 && (
                        <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-md">
                          {student.positiveCount} Ijobiy
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                     <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                       student.totalScore > 20 ? 'bg-red-100 text-red-800' : 
                       student.totalScore > 10 ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-800'
                     }`}>
                       {student.totalScore}
                     </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 max-w-xs truncate">
                    {student.incidents[0]?.comment || '-'}
                  </td>
                </tr>
              ))}
              {filteredAndSorted.length === 0 && (
                 <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                       Ma'lumot topilmadi
                    </td>
                 </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};