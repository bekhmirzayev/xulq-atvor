import React from 'react';
import { Incident } from '../types';

interface IncidentTableProps {
  data: Incident[];
  hideStudent?: boolean;
  hideStaff?: boolean;
}

export const IncidentTable: React.FC<IncidentTableProps> = ({ data, hideStudent, hideStaff }) => {
  if (data.length === 0) {
    return <div className="text-center py-8 text-slate-500">Ma'lumot mavjud emas</div>;
  }

  // Helper to format date as DD.MM
  const formatDate = (dateStr: string) => {
    const parts = dateStr.split('/');
    if (parts.length >= 2) return `${parts[0]}.${parts[1]}`;
    return dateStr;
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <th className="px-4 py-3">Sana</th>
            {!hideStudent && <th className="px-4 py-3">O'quvchi</th>}
            {!hideStaff && <th className="px-4 py-3">Xodim</th>}
            <th className="px-4 py-3">Sabab</th>
            <th className="px-4 py-3">Tur</th>
            <th className="px-4 py-3">Ball</th>
            <th className="px-4 py-3">Izoh</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data.map((item) => (
            <tr key={item.id} className="hover:bg-slate-50 transition-colors">
              <td className="px-4 py-3 text-sm text-slate-600 whitespace-nowrap">{formatDate(item.date)}</td>
              {!hideStudent && (
                <td className="px-4 py-3 text-sm font-medium text-slate-900">{item.student}</td>
              )}
              {!hideStaff && (
                <td className="px-4 py-3 text-sm text-slate-600">{item.staff}</td>
              )}
              <td className="px-4 py-3 text-sm text-slate-600 max-w-[200px] truncate" title={item.reason}>
                {item.reason}
              </td>
              <td className="px-4 py-3">
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  item.type === 'Salbiy' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
                }`}>
                  {item.type}
                </span>
              </td>
              <td className="px-4 py-3 text-sm font-bold text-slate-700">{item.score}</td>
              <td className="px-4 py-3 text-sm text-slate-500 max-w-[200px] truncate" title={item.comment}>
                {item.comment}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};