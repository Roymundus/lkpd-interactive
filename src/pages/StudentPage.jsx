import React, { useRef, useState } from 'react';
import { useAutoSave } from '../hooks/useAutoSave';
import IdentityForm from '../components/student/IdentityForm';
import QuestionView from '../components/student/QuestionView';
import PDFTemplate from '../components/student/PDFTemplate';
import { generatePDF } from '../utils/generatePDF';
import { Save, Download, Loader2 } from 'lucide-react';

const sampleLKPD = {
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

export default function StudentPage({ lkpdData }) {
  const lkpd = lkpdData || sampleLKPD;
  const [answers, setAnswers] = useAutoSave(`lkpd_answers_${lkpd.id}`, {
    identity: { name: '', className: '', studentId: '' },
    responses: {},
  });
  // Gunakan 'lkpd' sebagai pengganti 'sampleLKPD' di seluruh StudentPage & PDFTemplate

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

  return (
    <div className="min-h-screen bg-slate-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header LKPD */}
        <div className="bg-blue-600 text-white p-6 rounded-xl shadow-md mb-6">
          <span className="text-xs font-semibold tracking-wide uppercase bg-blue-500 px-2.5 py-1 rounded-md">
            {sampleLKPD.subject}
          </span>
          <h1 className="text-xl sm:text-2xl font-bold mt-2">{sampleLKPD.title}</h1>
          <p className="text-blue-100 text-xs sm:text-sm mt-1">{sampleLKPD.instructions}</p>
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-blue-500/50">
            <div className="flex items-center gap-1.5 text-xs text-blue-200">
              <Save className="w-3.5 h-3.5" />
              <span>Jawaban tersimpan otomatis</span>
            </div>
          </div>
        </div>

        {/* Form Identitas */}
        <IdentityForm identity={answers.identity} onChange={handleIdentityChange} />

        {/* Daftar Soal */}
        {sampleLKPD.questions.map((q, index) => (
          <QuestionView
            key={q.id}
            number={index + 1}
            question={q}
            answer={answers.responses[q.id]}
            onChange={(val) => handleQuestionChange(q.id, val)}
          />
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
        <PDFTemplate ref={pdfRef} lkpd={sampleLKPD} answers={answers} />
      </div>
    </div>
  );
}