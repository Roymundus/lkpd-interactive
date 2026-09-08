import React, { useState, useEffect } from 'react';
import QuestionForm from '../components/admin/QuestionForm';
import { Plus, Save, BookOpen, CheckCircle, FileText, FolderOpen, RefreshCw, Trash2, Copy } from 'lucide-react';
import { supabase } from '../utils/supabase';

export default function AdminDashboard({ onSaveLKPD }) {
  const [lkpdMeta, setLkpdMeta] = useState({
    id: `lkpd_${Date.now()}`,
    title: '',
    subject: '',
    instructions: 'Isilah data identitas Anda, lalu jawablah pertanyaan berikut dengan teliti.',
  });

  const [questions, setQuestions] = useState([]);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [allLkpdList, setAllLkpdList] = useState([]);
  const [isLoadingList, setIsLoadingList] = useState(false);

  // Ambil daftar semua LKPD yang pernah dibuat dari Supabase saat halaman dimuat
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

  // Tombol untuk membuat LKPD baru (Reset Form & Generate ID Baru agar tidak menimpa yang lama)
  const handleNewLKPD = () => {
    if (questions.length > 0 && !window.confirm('Buat LKPD baru? Perubahan yang belum disimpan pada form ini akan direset.')) {
      return;
    }
    setLkpdMeta({
      id: `lkpd_${Date.now()}`,
      title: '',
      subject: '',
      instructions: 'Isilah data identitas Anda, lalu jawablah pertanyaan berikut dengan teliti.',
    });
    setQuestions([]);
  };

  // Pilih LKPD dari daftar untuk diedit
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
      setQuestions(data.questions || []);
    }
    setIsLoadingList(false);
  };

  // Hapus LKPD dari database
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

  // Tambah Soal Baru
  const handleAddQuestion = () => {
    const newQuestion = {
      id: `q_${Date.now()}`,
      type: 'text',
      questionText: '',
    };
    setQuestions([...questions, newQuestion]);
  };

  // Update Soal
  const handleQuestionChange = (index, updatedQuestion) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = updatedQuestion;
    setQuestions(updatedQuestions);
  };

  // Hapus Soal
  const handleDeleteQuestion = (index) => {
    setQuestions(questions.filter((_, idx) => idx !== index));
  };

  // Pindah Urutan
  const handleMove = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= questions.length) return;

    const updatedQuestions = [...questions];
    const temp = updatedQuestions[index];
    updatedQuestions[index] = updatedQuestions[targetIndex];
    updatedQuestions[targetIndex] = temp;
    setQuestions(updatedQuestions);
  };

  // Simpan LKPD ke Database Supabase
  const handleSave = async () => {
    if (!lkpdMeta.title || !lkpdMeta.subject) {
      alert('Silakan isi Judul LKPD dan Mata Pelajaran terlebih dahulu!');
      return;
    }

    if (questions.length === 0) {
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
        questions: questions,
      };

      const { error } = await supabase.from('lkpds').upsert(fullLKPD);

      if (error) throw error;

      if (onSaveLKPD) {
        onSaveLKPD(fullLKPD);
      }

      setSavedSuccess(true);
      fetchSavedLkpdList(); // Perbarui daftar di sidebar
      alert('LKPD berhasil disimpan ke Database Supabase!');
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Gagal menyimpan ke database:', err.message);
      alert('Terjadi kesalahan saat menyimpan LKPD: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  // Salin Link LKPD untuk Siswa
  const handleCopyLink = () => {
    const vercelDomain = window.location.origin;
    const shareUrl = `${vercelDomain}/?id=${lkpdMeta.id}`;
    
    navigator.clipboard.writeText(shareUrl);
    alert(`Tautan berhasil disalin:\n${shareUrl}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Sidebar: Daftar LKPD yang Pernah Dibuat */}
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
                    lkpdMeta.id === item.id
                      ? 'bg-blue-50 border-blue-300 shadow-sm'
                      : 'bg-slate-50/50 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="pr-2 overflow-hidden">
                    <p className="text-xs font-bold text-slate-800 truncate">{item.title || 'Tanpa Judul'}</p>
                    <span className="text-[10px] text-blue-600 font-medium">{item.subject || 'Umum'}</span>
                  </div>
                  <button
                    onClick={(e) => handleDeleteLkpd(item.id, e)}
                    className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                    title="Hapus LKPD"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Konten Utama: Form Pembuat LKPD */}
        <div className="lg:col-span-3 space-y-6">
          {/* Header Admin */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div>
              <div className="flex items-center gap-2 text-blue-600 font-semibold text-sm mb-1">
                <BookOpen className="w-4 h-4" />
                <span>Panel Guru / Admin</span>
              </div>
              <h1 className="text-xl font-bold text-slate-800">
                {allLkpdList.some(i => i.id === lkpdMeta.id) ? 'Edit LKPD' : 'Buat LKPD Baru'}
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleNewLKPD}
                className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg border border-slate-300 flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Reset Form
              </button>

              <button
                type="button"
                onClick={handleCopyLink}
                className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg border border-slate-300 flex items-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5" /> Salin Link
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {isSaving ? (
                  <span>Menyimpan...</span>
                ) : savedSuccess ? (
                  <>
                    <CheckCircle className="w-4 h-4" /> Berhasil!
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" /> Simpan
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Form Meta Informasi LKPD */}
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
                  placeholder="Contoh: LKPD 1 - Jaringan Komputer"
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
              <label className="block text-xs font-semibold text-slate-600 mb-1">Petunjuk Pengerjaan</label>
              <textarea
                rows={2}
                value={lkpdMeta.instructions}
                onChange={(e) => setLkpdMeta({ ...lkpdMeta, instructions: e.target.value })}
                placeholder="Tuliskan petunjuk umum pengerjaan untuk siswa..."
                className="w-full p-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Daftar Soal */}
          <div>
            <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4">Daftar Soal</h2>

            {questions.length === 0 ? (
              <div className="bg-white p-8 rounded-xl border border-dashed border-slate-300 text-center text-slate-500 mb-4">
                <p className="text-sm mb-3">Belum ada soal pada LKPD ini.</p>
                <button
                  type="button"
                  onClick={handleAddQuestion}
                  className="px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 font-semibold text-xs rounded-lg inline-flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Tambah Soal Pertama
                </button>
              </div>
            ) : (
              questions.map((q, idx) => (
                <QuestionForm
                  key={q.id || idx}
                  number={idx + 1}
                  totalQuestions={questions.length}
                  question={q}
                  onChange={(updated) => handleQuestionChange(idx, updated)}
                  onDelete={() => handleDeleteQuestion(idx)}
                  onMoveUp={() => handleMove(idx, -1)}
                  onMoveDown={() => handleMove(idx, 1)}
                />
              ))
            )}

            {questions.length > 0 && (
              <button
                type="button"
                onClick={handleAddQuestion}
                className="w-full py-3 bg-white border-2 border-dashed border-blue-300 text-blue-600 hover:bg-blue-50/50 font-semibold text-sm rounded-xl flex items-center justify-center gap-2 transition-all"
              >
                <Plus className="w-5 h-5" /> Tambah Soal Baru
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}