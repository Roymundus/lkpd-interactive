import React, { useState, useEffect } from 'react';
import { Plus, Save, BookOpen, CheckCircle, FileText, FolderOpen, RefreshCw, Trash2, Copy, Layers } from 'lucide-react';
import { supabase } from '../utils/supabase';

export default function AdminDashboard({ onSaveLKPD }) {
  const [lkpdMeta, setLkpdMeta] = useState({
    id: `lkpd_${Date.now()}`,
    title: 'LKPD: Mengenal dan Menganalisis Sistem Komputer',
    subject: 'Informatika',
    instructions: 'Isilah data identitas kelompok Anda, lalu diskusikan setiap bagian aktivitas dengan teliti.',
  });

  const [sections, setSections] = useState([
    {
      id: `sec_${Date.now()}`,
      title: 'Bagian 1: Komputer Atau Bukan?',
      instructions: 'Tentukan apakah perangkat dikategorikan sebagai komputer berdasarkan syarat input, proses, dan output.',
      questions: [
        { id: `q_${Date.now()}_1`, type: 'text', questionText: 'Analisis perangkat (Laptop, Smartphone, Kalkulator, dll.) apakah termasuk komputer dan berikan alasannya.' }
      ]
    }
  ]);

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [allLkpdList, setAllLkpdList] = useState([]);
  const [isLoadingList, setIsLoadingList] = useState(false);

  useEffect(() => {
    fetchSavedLkpdList();
  }, []);

  const fetchSavedLkpdList = async () => {
    setIsLoadingList(true);
    const { data, error } = await supabase
      .from('lkpds')
      .select('id, title, subject')
      .order('id', { ascending: false });

    if (!error && data) {
      setAllLkpdList(data);
    }
    setIsLoadingList(false);
  };

  const handleNewLKPD = () => {
    if (sections.some(s => s.questions.length > 0) && !window.confirm('Buat LKPD baru? Perubahan yang belum disimpan akan direset.')) {
      return;
    }
    setLkpdMeta({
      id: `lkpd_${Date.now()}`,
      title: '',
      subject: '',
      instructions: 'Isilah data identitas Anda, lalu jawablah pertanyaan berikut dengan teliti.',
    });
    setSections([
      {
        id: `sec_${Date.now()}`,
        title: 'Bagian 1: Bagian Utama',
        instructions: '',
        questions: []
      }
    ]);
  };

  const handleSelectLkpd = async (id) => {
    setIsLoadingList(true);
    const { data, error } = await supabase
      .from('lkpds')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      alert('Gagal memuat LKPD: ' + error.message);
    } else if (data) {
      setLkpdMeta({
        id: data.id,
        title: data.title,
        subject: data.subject,
        instructions: data.instructions,
      });
      if (data.sections) {
        setSections(data.sections);
      } else if (data.questions) {
        setSections([{
          id: 'sec_legacy',
          title: 'Bagian Umum',
          instructions: '',
          questions: data.questions
        }]);
      }
    }
    setIsLoadingList(false);
  };

  const handleDeleteLkpd = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Yakin ingin menghapus LKPD ini dari database?')) return;

    const { error } = await supabase.from('lkpds').delete().eq('id', id);
    if (error) {
      alert('Gagal menghapus: ' + error.message);
    } else {
      fetchSavedLkpdList();
      if (lkpdMeta.id === id) {
        handleNewLKPD();
      }
    }
  };

  const handleAddSection = () => {
    const newSection = {
      id: `sec_${Date.now()}`,
      title: `Bagian ${sections.length + 1}`,
      instructions: '',
      questions: []
    };
    setSections([...sections, newSection]);
  };

  const handleSectionChange = (secIndex, field, value) => {
    const updated = [...sections];
    updated[secIndex][field] = value;
    setSections(updated);
  };

  const handleDeleteSection = (secIndex) => {
    if (sections.length === 1) {
      alert('LKPD harus memiliki minimal satu bagian/section.');
      return;
    }
    setSections(sections.filter((_, idx) => idx !== secIndex));
  };

  const handleAddQuestion = (secIndex) => {
    const updated = [...sections];
    updated[secIndex].questions.push({
      id: `q_${Date.now()}`,
      type: 'text',
      questionText: '',
    });
    setSections(updated);
  };

  const handleQuestionChange = (secIndex, qIndex, field, value) => {
    const updated = [...sections];
    updated[secIndex].questions[qIndex][field] = value;
    setSections(updated);
  };

  const handleDeleteQuestion = (secIndex, qIndex) => {
    const updated = [...sections];
    updated[secIndex].questions = updated[secIndex].questions.filter((_, idx) => idx !== qIndex);
    setSections(updated);
  };

  const handleSave = async () => {
    if (!lkpdMeta.title || !lkpdMeta.subject) {
      alert('Silakan isi Judul LKPD dan Mata Pelajaran terlebih dahulu!');
      return;
    }

    const totalQuestions = sections.reduce((acc, sec) => acc + sec.questions.length, 0);
    if (totalQuestions === 0) {
      alert('Tambahkan minimal 1 soal sebelum menyimpan!');
      return;
    }

    setIsSaving(true);
    try {
      const fullLKPD = {
        id: lkpdMeta.id,
        title: lkpdMeta.title,
        subject: lkpdMeta.subject,
        instructions: lkpdMeta.instructions,
        sections: sections,
        questions: sections.flatMap(s => s.questions)
      };

      const { error } = await supabase.from('lkpds').upsert(fullLKPD);
      if (error) throw error;

      if (onSaveLKPD) onSaveLKPD(fullLKPD);

      setSavedSuccess(true);
      fetchSavedLkpdList();
      alert('LKPD berhasil disimpan ke Database Supabase!');
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Gagal menyimpan:', err.message);
      alert('Terjadi kesalahan: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopyLink = () => {
    const productionDomain = 'https://lkpd-interactive.vercel.app';
    const shareUrl = `${productionDomain}/?id=${lkpdMeta.id}`;
    navigator.clipboard.writeText(shareUrl);
    alert(`Tautan berhasil disalin:\n${shareUrl}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Sidebar Arsip */}
        <div className="lg:col-span-1 bg-white p-4 rounded-xl border border-slate-200 shadow-sm h-fit space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <FolderOpen className="w-4 h-4 text-blue-500" /> Arsip LKPD
            </h2>
            <button
              onClick={handleNewLKPD}
              className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-600 font-semibold text-xs rounded-lg flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Baru
            </button>
          </div>

          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {isLoadingList ? (
              <p className="text-xs text-slate-400 text-center py-4">Memuat daftar...</p>
            ) : allLkpdList.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4">Belum ada arsip LKPD.</p>
            ) : (
              allLkpdList.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleSelectLkpd(item.id)}
                  className={`p-3 rounded-lg border text-left cursor-pointer transition-all flex items-start justify-between group ${
                    lkpdMeta.id === item.id ? 'bg-blue-50 border-blue-300 shadow-sm' : 'bg-slate-50/50 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="pr-2 overflow-hidden">
                    <p className="text-xs font-bold text-slate-800 truncate">{item.title || 'Tanpa Judul'}</p>
                    <span className="text-[10px] text-blue-600 font-medium">{item.subject || 'Umum'}</span>
                  </div>
                  <button
                    onClick={(e) => handleDeleteLkpd(item.id, e)}
                    className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                    title="Hapus"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Konten Utama Admin */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div>
              <div className="flex items-center gap-2 text-blue-600 font-semibold text-sm mb-1">
                <BookOpen className="w-4 h-4" /> <span>Panel Guru / Admin</span>
              </div>
              <h1 className="text-xl font-bold text-slate-800">
                {allLkpdList.some(i => i.id === lkpdMeta.id) ? 'Edit LKPD' : 'Buat LKPD Baru'}
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button onClick={handleNewLKPD} className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg border border-slate-300 flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5" /> Reset
              </button>
              <button onClick={handleCopyLink} className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg border border-slate-300 flex items-center gap-1.5">
                <Copy className="w-3.5 h-3.5" /> Salin Link
              </button>
              <button onClick={handleSave} disabled={isSaving} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow flex items-center gap-2 disabled:opacity-50">
                {isSaving ? 'Menyimpan...' : savedSuccess ? <><CheckCircle className="w-4 h-4" /> Berhasil!</> : <><Save className="w-4 h-4" /> Simpan</>}
              </button>
            </div>
          </div>

          {/* Informasi Umum */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider border-b pb-2 flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-500" /> Informasi Umum LKPD
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Judul LKPD</label>
                <input
                  type="text"
                  value={lkpdMeta.title}
                  onChange={(e) => setLkpdMeta({ ...lkpdMeta, title: e.target.value })}
                  placeholder="Contoh: LKPD - Mengenal Sistem Komputer"
                  className="w-full p-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Mata Pelajaran</label>
                <input
                  type="text"
                  value={lkpdMeta.subject}
                  onChange={(e) => setLkpdMeta({ ...lkpdMeta, subject: e.target.value })}
                  placeholder="Contoh: Informatika"
                  className="w-full p-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Petunjuk Pengerjaan Umum</label>
              <textarea
                rows={2}
                value={lkpdMeta.instructions}
                onChange={(e) => setLkpdMeta({ ...lkpdMeta, instructions: e.target.value })}
                className="w-full p-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Manajemen Sections & Soal */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-500" /> Struktur Bagian (Sections) & Soal LKM
              </h2>
              <button
                onClick={handleAddSection}
                className="px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 font-semibold text-xs rounded-lg flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Tambah Bagian Baru
              </button>
            </div>

            {sections.map((sec, secIndex) => (
              <div key={sec.id || secIndex} className="bg-white p-6 rounded-xl border-2 border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b pb-3 gap-4">
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={sec.title}
                      onChange={(e) => handleSectionChange(secIndex, 'title', e.target.value)}
                      placeholder="Judul Bagian (Contoh: Bagian 1: Komputer Atau Bukan?)"
                      className="p-2 text-sm font-bold bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      value={sec.instructions || ''}
                      onChange={(e) => handleSectionChange(secIndex, 'instructions', e.target.value)}
                      placeholder="Instruksi khusus bagian ini (opsional)"
                      className="p-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <button
                    onClick={() => handleDeleteSection(secIndex)}
                    className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                    title="Hapus Bagian Ini"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Soal dalam Section */}
                <div className="space-y-3 pl-2 sm:pl-4 border-l-2 border-blue-100">
                  {sec.questions.map((q, qIndex) => (
                    <div key={q.id || qIndex} className="bg-slate-50 p-4 rounded-lg border border-slate-200 relative group space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-600">Pertanyaan/Aktivitas #{qIndex + 1}</span>
                        <div className="flex items-center gap-2">
                          <select
                            value={q.type}
                            onChange={(e) => handleQuestionChange(secIndex, qIndex, 'type', e.target.value)}
                            className="text-xs p-1 bg-white border border-slate-300 rounded-md"
                          >
                            <option value="text">Teks / Esai (Rich Text)</option>
                            <option value="table">Tabel Analisis</option>
                            <option value="image">Upload Gambar</option>
                          </select>
                          <button
                            onClick={() => handleDeleteQuestion(secIndex, qIndex)}
                            className="text-slate-400 hover:text-red-500 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <textarea
                        rows={2}
                        value={q.questionText}
                        onChange={(e) => handleQuestionChange(secIndex, qIndex, 'questionText', e.target.value)}
                        placeholder="Tuliskan pertanyaan atau deskripsi aktivitas di sini..."
                        className="w-full p-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  ))}

                  <button
                    onClick={() => handleAddQuestion(secIndex)}
                    className="w-full py-2 bg-white border border-dashed border-blue-300 text-blue-600 hover:bg-blue-50 font-semibold text-xs rounded-lg flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" /> Tambah Pertanyaan/Aktivitas di Bagian Ini
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}