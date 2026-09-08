import React, { forwardRef } from 'react';

const PDFTemplate = forwardRef(({ lkpd, answers }, ref) => {
  const { identity = {}, responses = {} } = answers;

  return (
    <div className="hidden">
      <div
        ref={ref}
        id="pdf-content"
        className="p-8 bg-white text-slate-900 font-sans text-sm w-[210mm] min-h-[297mm] mx-auto"
        style={{ boxSizing: 'border-box' }}
      >
        {/* Header Dokumen */}
        <div className="border-b-2 border-slate-800 pb-4 mb-6">
          <h1 className="text-xl font-bold uppercase tracking-wide text-center text-slate-900">
            LEMBAR KERJA PESERTA DIDIK (LKPD)
          </h1>
          <h2 className="text-base font-semibold text-center text-slate-700 mt-1">
            {lkpd.title}
          </h2>
          <p className="text-xs text-center text-slate-500 mt-0.5">Mata Pelajaran: {lkpd.subject}</p>
        </div>

        {/* Tabel Identitas Siswa */}
        <div className="mb-6 bg-slate-50 p-4 rounded border border-slate-300">
          <table className="w-full text-xs border-collapse">
            <tbody>
              <tr>
                <td className="font-semibold py-1 w-28 text-slate-600">Nama Lengkap</td>
                <td className="py-1">: <span className="font-medium text-slate-900">{identity.name || '-'}</span></td>
                <td className="font-semibold py-1 w-24 text-slate-600">Kelas</td>
                <td className="py-1">: <span className="font-medium text-slate-900">{identity.className || '-'}</span></td>
              </tr>
              <tr>
                <td className="font-semibold py-1 text-slate-600">Nomor Absen</td>
                <td className="py-1">: <span className="font-medium text-slate-900">{identity.studentId || '-'}</span></td>
                <td className="font-semibold py-1 text-slate-600">Tanggal Selesai</td>
                <td className="py-1">: <span className="font-medium text-slate-900">{new Date().toLocaleDateString('id-ID')}</span></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Section Soal & Jawaban */}
        <div className="space-y-6">
          {lkpd.questions.map((q, index) => {
            const answer = responses[q.id];

            return (
              <div key={q.id} className="border-b border-slate-200 pb-4 last:border-b-0 break-inside-avoid">
                <p className="font-semibold text-slate-900 mb-2">
                  {index + 1}. {q.questionText}
                </p>

                {/* Jawaban Teks */}
                {q.type === 'text' && (
                  <div className="bg-slate-50 p-3 rounded border border-slate-200 min-h-[60px] text-slate-800 whitespace-pre-wrap">
                    {answer || <span className="italic text-slate-400">(Tidak dijawab)</span>}
                  </div>
                )}

                {/* Jawaban Tabel */}
                {q.type === 'table' && (
                  <div className="overflow-x-auto my-2">
                    <table className="w-full text-xs border-collapse border border-slate-400">
                      <thead>
                        <tr className="bg-slate-200 text-slate-800">
                          {q.tableData.headers.map((h, i) => (
                            <th key={i} className="border border-slate-400 px-3 py-2 text-left">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {q.tableData.rows.map((row, rowIndex) => (
                          <tr key={rowIndex}>
                            {row.map((cellValue, colIndex) => {
                              const userVal = answer?.[rowIndex]?.[colIndex] ?? cellValue;
                              return (
                                <td key={colIndex} className="border border-slate-400 px-3 py-2">
                                  {userVal || <span className="text-slate-400 italic">-</span>}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Jawaban Gambar */}
                {q.type === 'image' && (
                  <div className="my-2">
                    {answer ? (
                      <img
                        src={answer}
                        alt={`Jawaban Soal ${index + 1}`}
                        className="max-h-72 max-w-full rounded border border-slate-300 object-contain mx-auto"
                      />
                    ) : (
                      <p className="italic text-slate-400 text-xs">(Tidak ada gambar diunggah)</p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
});

export default PDFTemplate;