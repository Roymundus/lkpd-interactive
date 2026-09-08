import React, { useState, useEffect } from 'react';
import StudentPage from './pages/StudentPage';
import AdminDashboard from './pages/AdminDashboard';
import { supabase } from './utils/supabase';
import { Loader2 } from 'lucide-react';

function App() {
  const queryParams = new URLSearchParams(window.location.search);
  const lkpdIdFromUrl = queryParams.get('id');

  // Jika ada ?id= di URL, buka mode student. Jika tidak, buka panel admin.
  const [activeTab, setActiveTab] = useState(lkpdIdFromUrl ? 'student' : 'admin');
  const [currentLKPD, setCurrentLKPD] = useState(null);
  const [loading, setLoading] = useState(!!lkpdIdFromUrl);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!lkpdIdFromUrl) {
      setLoading(false);
      return;
    }

    const fetchLKPD = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('lkpds')
        .select('*')
        .eq('id', lkpdIdFromUrl)
        .single();

      if (error || !data) {
        console.error('Gagal mengambil data LKPD:', error?.message);
        setNotFound(true);
      } else {
        setCurrentLKPD(data);
      }
      setLoading(false);
    };

    fetchLKPD();
  }, [lkpdIdFromUrl]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-2" />
        <p className="text-xs text-slate-500">Memuat LKPD...</p>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4 text-center">
        <h1 className="text-base font-bold text-slate-800">LKPD Tidak Ditemukan</h1>
        <p className="text-xs text-slate-500 mt-1">Pastikan tautan yang Anda buka sudah benar.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Tombol Navigasi Switcher (Berguna saat testing di Localhost) */}
      <div className="bg-white border-b border-slate-200 px-4 py-2 flex justify-between items-center text-xs shadow-sm">
        <span className="font-semibold text-slate-600">
          Mode: <strong className="text-blue-600">{activeTab === 'admin' ? 'Panel Guru (Admin)' : 'Halaman Siswa'}</strong>
        </span>
        <div className="space-x-2">
          <button
            onClick={() => {
              setActiveTab('admin');
              // Hapus parameter ?id= dari URL saat kembali ke mode admin
              window.history.pushState({}, '', window.location.pathname);
            }}
            className={`px-3 py-1 rounded font-medium transition-colors ${
              activeTab === 'admin' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Buat/Edit LKPD (Admin)
          </button>
          {currentLKPD && (
            <button
              onClick={() => setActiveTab('student')}
              className={`px-3 py-1 rounded font-medium transition-colors ${
                activeTab === 'student' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Lihat Tampilan Siswa
            </button>
          )}
        </div>
      </div>

      {/* Render Halaman Berdasarkan Tab Aktif */}
      {activeTab === 'student' ? (
        <StudentPage lkpdData={currentLKPD} />
      ) : (
        <AdminDashboard />
      )}
    </div>
  );
}

App.displayName = 'App';
export default App;