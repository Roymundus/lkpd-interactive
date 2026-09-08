import React from 'react';
import { User, GraduationCap, Hash } from 'lucide-react';

export default function IdentityForm({ identity, onChange }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-slate-200 mb-6">
      <h2 className="text-lg font-semibold text-slate-800 mb-4 pb-2 border-b border-slate-100">
        Identitas Peserta Didik
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Nama Lengkap</label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              name="name"
              value={identity.name || ''}
              onChange={handleChange}
              placeholder="Contoh: Ahmad Fauzi"
              className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Kelas</label>
          <div className="relative">
            <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              name="className"
              value={identity.className || ''}
              onChange={handleChange}
              placeholder="Contoh: X RPL 1"
              className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Nomor Absen</label>
          <div className="relative">
            <Hash className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              name="studentId"
              value={identity.studentId || ''}
              onChange={handleChange}
              placeholder="Contoh: 05"
              className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
}