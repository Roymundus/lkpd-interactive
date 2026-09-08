import html2pdf from 'html2pdf.js';

export const generatePDF = async (elementRef, fileName = 'LKPD_Jawaban.pdf') => {
  const element = elementRef.current;
  if (!element) return;

  const opt = {
    margin: [10, 10, 10, 10], // Margin [atas, kiri, bawah, kanan] dalam mm
    filename: fileName,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, logging: false },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
  };

  try {
    await html2pdf().set(opt).from(element).save();
  } catch (error) {
    console.error('Gagal membuat file PDF:', error);
    alert('Terjadi kesalahan saat mengunduh PDF. Silakan coba lagi.');
  }
};