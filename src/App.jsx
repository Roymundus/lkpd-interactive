import React, { useState } from 'react';
import StudentPage from './pages/StudentPage';
import AdminDashboard from './pages/AdminDashboard';
import { LayoutDashboard, GraduationCap } from 'lucide-react';

const defaultLKPD = {
  id: 'lkpd-01',
  title: 'LKPD 1: Jaringan Komputer Dasar',
  subject: 'Informatika',
  instructions: 'Isilah data identitas Anda, lalu jawab pertanyaan-pertanyaan berikut dengan jelas.',
  questions: [
    {
      id: 'q1',
      type: 'text',
      questionText: 'Jelaskan pengertian dari IP Address dan jelaskan fungsinya!',
    },
    {
      id: 'q2',
      type: 'table',
      questionText: 'Isilah tabel perbandingan jenis-jenis jaringan komputer di bawah ini:',
      tableData: {
        headers: ['Jenis Jaringan', 'Jangkauan', 'Contoh Penerapan'],
        rows: [
          ['LAN', '', ''],
          ['WAN', '', ''],
        ],
      },
    },
    {
      id: 'q3',
      type: 'image',
      questionText: 'Unggah foto hasil topologi jaringan yang sudah Anda gambar di buku tulis!',
    },
  ],
};

function App() {
  const [activeTab, setActiveTab] = useState('student'); // 'student' | 'admin'
  const [currentLKPD, setCurrentLKPD] = useState(() => {
    const saved = localStorage.getItem('active_lkpd');
    return saved ? JSON.parse(saved) : defaultLKPD;
  });

  const handleSaveLKPD = (newLKPD) => {
    setCurrentLKPD(newLKPD);
    localStorage.setItem('active_lkpd', JSON.stringify(newLKPD));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Bar Switcher Mode */}
      <header className="bg-slate-900 text-white px-4 py-2.5 shadow-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <span className="font-bold text-xs sm:text-sm tracking-wide text-slate-200">
            Platform LKPD Interaktif
          </span>

          <div className="flex bg-slate-800 p-1 rounded-lg border border-slate-700">
            <button
              onClick={() => setActiveTab('student')}
              className={`px-3 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'student'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" /> Mode Siswa
            </button>
            <button
              onClick={() => setActiveTab('admin')}
              className={`px-3 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'admin'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" /> Panel Guru
            </button>
          </div>
        </div>
      </header>

      {/* Main Content View */}
      <main className="flex-1">
        {activeTab === 'student' ? (
          <StudentPage lkpdData={currentLKPD} />
        ) : (
          <AdminDashboard currentLKPD={currentLKPD} onSaveLKPD={handleSaveLKPD} />
        )}
      </main>
    </div>
  );
}

export default App;