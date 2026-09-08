import React, { useState, useEffect } from 'react';
import StudentPage from './pages/StudentPage';
import AdminDashboard from './pages/AdminDashboard';
import { LayoutDashboard, GraduationCap, Loader2 } from 'lucide-react';
import { supabase } from './utils/supabase';

export default function App() {
  const searchParams = new URLSearchParams(window.location.search);
  const urlLkpdId = searchParams.get('id');

  const [activeTab, setActiveTab] = useState('student');
  const [currentLKPD, setCurrentLKPD] = useState(null);
  const [isLoading, setIsLoading] = useState(!!urlLkpdId);

  useEffect(() => {
    if (urlLkpdId) {
      fetchLkpdById(urlLkpdId);
    } else {
      const saved = localStorage.getItem('active_lkpd');
      if (saved) {
        try {
          setCurrentLKPD(JSON.parse(saved));
        } catch (e) {
          console.error(e);
        }
      } else {
        setCurrentLKPD({
          id: 'lkpd-01',
          title: 'LKPD 1: Jaringan Komputer Dasar',
          subject: 'Informatika',
          instructions: 'Isilah data identitas Anda, lalu jawab pertanyaan.',
          questions: [],
        });
      }
      setIsLoading(false);
    }
  }, [urlLkpdId]);

  const fetchLkpdById = async (id) => {
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
      console.error('Gagal memuat LKPD:', err.message);
      alert('LKPD tidak ditemukan di database.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-slate-600 gap-2">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <p className="text-sm font-medium">Memuat LKPD untuk siswa...</p>
      </div>
    );
  }

  // JIKA DIAKSES MENGGUNAKAN LINK SISWA (?id=...), TAMPILKAN HANYA HALAMAN SISWA TANPA NAVBAR/ADMIN
  if (urlLkpdId) {
    return <StudentPage lkpdData={currentLKPD} />;
  }

  // Tampilan Utama Guru (Tanpa parameter ?id=)
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
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

      <main className="flex-1">
        {activeTab === 'student' ? (
          <StudentPage lkpdData={currentLKPD} />
        ) : (
          <AdminDashboard
            currentLKPD={currentLKPD}
            onSaveLKPD={(newLkpd) => {
              setCurrentLKPD(newLkpd);
              localStorage.setItem('active_lkpd', JSON.stringify(newLkpd));
            }}
          />
        )}
      </main>
    </div>
  );
}