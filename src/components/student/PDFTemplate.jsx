import React, { forwardRef } from 'react';

const PDFTemplate = forwardRef(({ lkpd, answers }, ref) => {
  return (
    <div style={{ position: 'absolute', left: '-9999px', top: '0px', width: '210mm', background: 'white' }}>
      <div ref={ref} className="p-8 bg-white text-slate-800 font-sans" style={{ width: '210mm', boxSizing: 'border-box' }}>
        
        {/* Header Dokumen PDF */}
        <div className="border-b-2 border-slate-800 pb-4 mb-6">
          <h1 className="text-2xl font-bold uppercase tracking-wide">{lkpd?.title || 'LKPD'}</h1>
          <p className="text-sm text-slate-600 mt-1">Mata Pelajaran: {lkpd?.subject || '-'}</p>
        </div>

        {/* Data Identitas Siswa */}
        <div className="mb-6 bg-slate-50 p-4 rounded-lg border border-slate-200">
          <h3 className="text-xs font-bold uppercase text-slate-500 mb-2">Identitas Siswa</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <p><strong>Nama:</strong> {answers?.identity?.name || '-'}</p>
            <p><strong>Kelas:</strong> {answers?.identity?.className || '-'}</p>
            <p><strong>Nomor Absen:</strong> {answers?.identity?.studentId || '-'}</p>
          </div>
        </div>

        {/* Daftar Jawaban Soal */}
        <div className="space-y-6">
          <h3 className="text-xs font-bold uppercase text-slate-500 border-b pb-1">Lembar Jawaban</h3>
          {lkpd?.questions?.map((q, idx) => (
            <div key={q.id || idx} className="space-y-2">
              <p className="text-sm font-semibold text-slate-800">
                {idx + 1}. {q.questionText}
              </p>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm min-h-[40px] whitespace-pre-wrap">
                {answers?.responses?.[q.id] || <span className="text-slate-400 italic">Tidak dijawab</span>}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
});

export default PDFTemplate;