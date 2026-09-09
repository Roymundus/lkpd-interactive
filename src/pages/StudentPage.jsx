import React, { useRef, useState } from 'react';
import { useAutoSave } from '../hooks/useAutoSave';
import IdentityForm from '../components/student/IdentityForm';
import QuestionView from '../components/student/QuestionView';
import PDFTemplate from '../components/student/PDFTemplate';
import { generatePDF } from '../utils/generatePDF';
import { Save, Download, Loader2, Layers } from 'lucide-react';

const fallbackLKPD = {
  id: 'lkpd-01',
  title: 'LKPD 1: Jaringan Komputer Dasar',
  subject: 'Informatika',
  instructions: 'Isilah data identitas Anda, lalu jawab pertanyaan-pertanyaan berikut dengan jelas.',
  sections: [
    {
      title: 'Bagian Utama',
      instructions: '',
      questions: []
    }
  ],
};

export default function StudentPage({ lkpdData }) {
  const lkpd = lkpdData || fallbackLKPD;
  const sections = lkpd.sections || [
    { title: 'Bagian Umum', instructions: '', questions: lkpd.questions || [] }
  ];

  const [answers, setAnswers] = useAutoSave(`lkpd_answers_${lkpd.id}`, {
    identity: { name: '', className: '', studentId: '' },
    responses: {},
  });

  const [isExporting, setIsExporting] = useState(false);
  const pdfRef = useRef(null);

  const handleIdentityChange = (newIdentity) => {
    setAnswers((prev) => ({ ...prev, identity: newIdentity }));
  };

  const handleQuestionChange = (questionId, value) => {
    setAnswers((prev) => ({
      ...prev,
      responses: {
        ...prev.responses,
        [questionId]: value,
      },
    }));
  };

  const handleDownloadPDF = async () => {
    const { name, className } = answers.identity;

    if (!name || !className) {
      alert('Silakan isi Nama Lengkap dan Kelas pada bagian Identitas terlebih dahulu!');
      return;
    }

    setIsExporting(true);
    const cleanName = name.replace(/[^a-zA-Z0-9]/g, '_');
    const cleanClass = className.replace(/[^a-zA-Z0-9]/g, '_');
    const fileName = `LKPD_${cleanClass}_${cleanName}.pdf`;

    await generatePDF(pdfRef, fileName);
    setIsExporting(false);
  };

  // Hitung penomoran soal global atau per section
  let globalQuestionCounter = 0;

  return (
    <div className="min-h-screen bg-slate-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header LKPD */}
        <div className="bg-blue-600 text-white p-6 rounded-xl shadow-md">
          <span className="text-xs font-semibold tracking-wide uppercase bg-blue-500 px-2.5 py-1 rounded-md">
            {lkpd.subject || 'Informatika'}
          </span>
          <h1 className="text-xl sm:text-2xl font-bold mt-2">{lkpd.title}</h1>
          <p className="text-blue-100 text-xs sm:text-sm mt-1">{lkpd.instructions}</p>
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-blue-500/50">
            <div className="flex items-center gap-1.5 text-xs text-blue-200">
              <Save className="w-3.5 h-3.5" />
              <span>Jawaban tersimpan otomatis</span>
            </div>
          </div>
        </div>

        {/* Form Identitas */}
        <IdentityForm identity={answers.identity} onChange={handleIdentityChange} />

        {/* Daftar Section & Soal */}
        {sections.map((sec, secIdx) => (
          <div key={sec.id || secIdx} className="space-y-4">
            <div className="bg-slate-200/70 px-4 py-2.5 rounded-lg border border-slate-300 flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" />
              <div>
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">{sec.title}</h3>
                {sec.instructions && <p className="text-[11px] text-slate-600">{sec.instructions}</p>}
              </div>
            </div>

            {sec.questions?.map((q) => {
              globalQuestionCounter++;
              const qNum = globalQuestionCounter;
              return (
                <QuestionView
                  key={q.id}
                  number={qNum}
                  question={q}
                  answer={answers.responses[q.id]}
                  onChange={(val) => handleQuestionChange(q.id, val)}
                />
              );
            })}
          </div>
        ))}

        {/* Tombol Download PDF */}
        <div className="mt-8 mb-12 flex flex-col items-center">
          <button
            type="button"
            onClick={handleDownloadPDF}
            disabled={isExporting}
            className="w-full sm:w-auto px-8 py-3.5 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Memproses PDF...</span>
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                <span>Selesai & Unduh Jawaban (PDF)</span>
              </>
            )}
          </button>
          <p className="text-xs text-slate-500 mt-2 text-center">
            File PDF yang diunduh dapat langsung Anda unggah ke folder Google Drive kelas.
          </p>
        </div>

        {/* Template PDF Tersembunyi */}
        <PDFTemplate ref={pdfRef} lkpd={lkpd} answers={answers} />
      </div>
    </div>
  );
}