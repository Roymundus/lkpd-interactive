import React from 'react';
import { User, Layers, Hash } from 'lucide-react';

export default function IdentityForm({ identity, onChange }) {
  const handleChange = (field, value) => {
    if (typeof onChange === 'function') {
      onChange(field, value);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-6 space-y-4">
      <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider border-b pb-2 flex items-center gap-2">
        <User className="w-4 h-4 text-blue-500" /> Identitas Siswa
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1 flex items-center gap-1">
            <User className="w-3 h-3 text-slate-400" /> Nama Lengkap
          </label>
          <input
            type="text"
            name="name"
            value={identity?.name || ''}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Masukkan nama lengkap..."
            className="w-full p-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1 flex items-center gap-1">
            <Layers className="w-3 h-3 text-slate-400" /> Kelas
          </label>
          <input
            type="text"
            name="className"
            value={identity?.className || ''}
            onChange={(e) => handleChange('className', e.target.value)}
            placeholder="Contoh: XII TKJ 1"
            className="w-full p-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1 flex items-center gap-1">
            <Hash className="w-3 h-3 text-slate-400" /> Nomor Absen
          </label>
          <input
            type="text"
            name="studentId"
            value={identity?.studentId || ''}
            onChange={(e) => handleChange('studentId', e.target.value)}
            placeholder="Contoh: 15"
            className="w-full p-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
}