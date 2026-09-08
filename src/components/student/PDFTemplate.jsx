import React, { forwardRef } from 'react';

const PDFTemplate = forwardRef(({ lkpd, answers }, ref) => {
  return (
    <div style={{ position: 'absolute', left: '-9999px', top: '0px', width: '210mm', background: '#ffffff' }}>
      <div 
        ref={ref} 
        style={{ 
          width: '210mm', 
          padding: '40px', 
          backgroundColor: '#ffffff', 
          color: '#1e293b', 
          fontFamily: 'Arial, sans-serif',
          boxSizing: 'border-box' 
        }}
      >
        
        {/* Header Dokumen PDF */}
        <div style={{ borderBottom: '2px solid #0f172a', paddingBottom: '16px', marginBottom: '24px' }}>
          <span style={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', backgroundColor: '#2563eb', color: '#ffffff', padding: '4px 8px', borderRadius: '4px' }}>
            {lkpd?.subject || 'Informatika'}
          </span>
          <h1 style={{ fontSize: '22px', fontWeight: 'bold', marginTop: '8px', color: '#0f172a' }}>
            {lkpd?.title || 'LKPD'}
          </h1>
          <p style={{ fontSize: '12px', color: '#475569', marginTop: '4px' }}>
            {lkpd?.instructions || ''}
          </p>
        </div>

        {/* Data Identitas Siswa */}
        <div style={{ marginBottom: '24px', backgroundColor: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <h3 style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', color: '#64748b', marginBottom: '8px' }}>
            Identitas Siswa
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '13px' }}>
            <p><strong>Nama:</strong> {answers?.identity?.name || '-'}</p>
            <p><strong>Kelas:</strong> {answers?.identity?.className || '-'}</p>
            <p><strong>Nomor Absen:</strong> {answers?.identity?.studentId || '-'}</p>
          </div>
        </div>

        {/* Daftar Jawaban Soal */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', color: '#64748b', borderBottom: '1px solid #e2e8f0', paddingBottom: '4px' }}>
            Lembar Jawaban
          </h3>
          {lkpd?.questions?.map((q, idx) => (
            <div key={q.id || idx} style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '12px' }}>
              <p style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>
                {idx + 1}. {q.questionText}
              </p>
              <div style={{ padding: '10px 12px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '13px', minHeight: '40px', whiteSpace: 'pre-wrap', color: '#334155' }}>
                {answers?.responses?.[q.id] || <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>Tidak dijawab</span>}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
});

export default PDFTemplate;