import React, { useState, useEffect } from 'react';
import StudentPage from './pages/StudentPage';
import AdminDashboard from './pages/AdminDashboard';
import { LayoutDashboard, GraduationCap, Loader2 } from 'lucide-react';
import { supabase } from './utils/supabase';

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
  const [currentLKPD, setCurrentLKPD] = useState(defaultLKPD);
  const [isLoadingUrlLkpd, setIsLoadingUrlLkpd] = useState(true);
  const [isUrlMode, setIsUrlMode] = useState(false); // Menandakan apakah dibuka lewat link khusus ?id=

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const lkpdId = params.get('id');

    if (lkpdId) {
      setIsUrlMode(true);
      fetchLkpdFromSupabase(lkpdId);
    } else {
      // Jika tidak ada parameter id di URL, gunakan localStorage seperti biasa
      const saved = localStorage.getItem('active_lkpd');
      if (saved) {
        try {
          setCurrentLKPD(JSON.parse(saved));
        } catch (e) {
          console.error('Gagal parsing localStorage', e);
        }
      }
      setIsLoadingUrlLkpd(false);
    }
  }, []);

  const fetchLkpdFromSupabase = async (id) => {
    try {
      const { data, error } = await supabase
        .from('lkpds')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (data) {
        setCurrentLKPD(data);
      }
    } catch (err) {
      console.error('Gagal memuat LKPD dari URL:', err.message);
      alert('LKPD tidak ditemukan di database atau tautan tidak valid.');
    } finally {
      setIsLoadingUrlLkpd(false);
    }
  };

  const handleSaveLKPD = (newLKPD) => {
    setCurrentLKPD(newLKPD);
    localStorage.setItem('active_lkpd', JSON.stringify(newLKPD));
  };

  if (isLoadingUrlLkpd) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-slate-600 gap-2">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <p className="text-sm font-medium">Memuat LKPD dari server...</p>
      </div>
    );
  }

  // Jika diakses melalui tautan khusus siswa (?id=...), tampilkan halaman siswa penuh tanpa topbar admin
  if (isUrlMode) {
    return <StudentPage lkpdData={currentLKPD} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Bar Switcher Mode untuk Guru */}
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