import React from 'react';
import { User, BookOpen, Hash } from 'lucide-react';

export default function IdentityForm({ identity, onChange }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({
      ...identity,
      [name]: value,
    });
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-6">
      <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
        <User className="w-5 h-5 text-blue-600" />
        Identitas Siswa
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">
            Nama Lengkap
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <User className="w-4 h-4" />
            </span>
            <input
              type="text"
              name="name"
              value={identity?.name || ''}
              onChange={handleChange}
              placeholder="Masukkan nama lengkap"
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-800"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">
            Kelas
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <BookOpen className="w-4 h-4" />
            </span>
            <input
              type="text"
              name="className"
              value={identity?.className || ''}
              onChange={handleChange}
              placeholder="Contoh: XII TKJ 1"
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-800"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">
            Nomor Absen
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Hash className="w-4 h-4" />
            </span>
            <input
              type="text"
              name="studentId"
              value={identity?.studentId || ''}
              onChange={handleChange}
              placeholder="Contoh: 15"
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-800"
            />
          </div>
        </div>
      </div>
    </div>
  );
}