import React, { useState, useEffect } from 'react';
import StudentPage from './pages/StudentPage';
import AdminDashboard from './pages/AdminDashboard';
import { supabase } from './utils/supabase';
import { Loader2 } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('student');
  const [currentLKPD, setCurrentLKPD] = useState(null);
  const [loading, setLoading] = useState(true);

  // Ambil ID dari Query String URL (?id=xxxx)
  const queryParams = new URLSearchParams(window.location.search);
  const lkpdIdFromUrl = queryParams.get('id') || 'lkpd-01';

  useEffect(() => {
    fetchLKPD(lkpdIdFromUrl);
  }, [lkpdIdFromUrl]);

  const fetchLKPD = async (id) => {
    setLoading(true);
    const { data, error } = await supabase
      .from('lkpds')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Gagal mengambil data LKPD:', error.message);
    } else if (data) {
      setCurrentLKPD(data);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-2" />
        <p className="text-xs text-slate-500">Memuat LKPD...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Panggil StudentPage / AdminDashboard dengan data currentLKPD */}
      {activeTab === 'student' ? (
        <StudentPage lkpdData={currentLKPD} />
      ) : (
        <AdminDashboard currentLKPD={currentLKPD} onSaveLKPD={fetchLKPD} />
      )}
    </div>
  );
}

export default App;