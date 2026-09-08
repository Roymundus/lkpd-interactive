import React, { useState } from 'react';
import QuestionForm from '../components/admin/QuestionForm';
import { Plus, Save, BookOpen, CheckCircle, FileText } from 'lucide-react';

export default function AdminDashboard({ onSaveLKPD, currentLKPD }) {
  const [lkpdMeta, setLkpdMeta] = useState({
    id: currentLKPD?.id || `lkpd_${Date.now()}`,
    title: currentLKPD?.title || '',
    subject: currentLKPD?.subject || '',
    instructions: currentLKPD?.instructions || 'Isilah data identitas Anda, lalu jawablah pertanyaan berikut dengan teliti.',
  });

  const [questions, setQuestions] = useState(currentLKPD?.questions || []);
  const [savedSuccess, setSavedSuccess] = useState(false);

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

  // Simpan LKPD
  const handleSave = () => {
    if (!lkpdMeta.title || !lkpdMeta.subject) {
      alert('Silakan isi Judul LKPD dan Mata Pelajaran terlebih dahulu!');
      return;
    }

    if (questions.length === 0) {
      alert('Tambahkan minimal 1 soal sebelum menyimpan!');
      return;
    }

    const fullLKPD = {
      ...lkpdMeta,
      questions,
    };

    onSaveLKPD(fullLKPD);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  // Salin Link LKPD
  // Tambahkan fungsi salin tautan di AdminDashboard.jsx
  const handleCopyLink = () => {
    const vercelDomain = window.location.origin; // Mengambil domain aktif (localhost / vercel)
    const shareUrl = `${vercelDomain}/?id=${lkpdMeta.id}`;
    
    navigator.clipboard.writeText(shareUrl);
    alert(`Tautan berhasil disalin:\n${shareUrl}`);
  };


  return (
    <div className="min-h-screen bg-slate-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Admin */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-6">
          <div>
            <div className="flex items-center gap-2 text-blue-600 font-semibold text-sm mb-1">
              <BookOpen className="w-4 h-4" />
              <span>Panel Guru / Admin</span>
            </div>
            <h1 className="text-xl font-bold text-slate-800">Pembuat & Pengelola LKPD</h1>
          </div>

          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow flex items-center justify-center gap-2 transition-all"
          >
            {savedSuccess ? (
              <>
                <CheckCircle className="w-4 h-4" /> Berhasil Disimpan!
              </>
            ) : (
              <>
                <Save className="w-4 h-4" /> Simpan LKPD
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleCopyLink}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-lg border border-slate-300 flex items-center gap-2"
          >
            Salin Tautan Siswa
          </button>
        </div>

        {/* Form Meta Informasi LKPD */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-6 space-y-4">
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
                placeholder="Contoh: LKPD 1 - Pengenalan Jaringan Komputer"
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
        <div className="mb-6">
          <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4">Daftar Soal</h2>

          {questions.length === 0 ? (
            <div className="bg-white p-8 rounded-xl border border-dashed border-slate-300 text-center text-slate-500 mb-4">
              <p className="text-sm mb-3">Belum ada soal yang dibuat.</p>
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
                key={q.id}
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
  );
}