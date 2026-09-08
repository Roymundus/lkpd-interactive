import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const generatePDF = async (pdfRef, fileName = 'LKPD_Siswa.pdf') => {
  try {
    const element = pdfRef.current;
    if (!element) {
      throw new Error('Elemen PDF tidak ditemukan di dalam DOM.');
    }

    const canvas = await html2canvas(element, {
      scale: 1.5, // Menggunakan skala 1.5 agar lebih stabil dan ringan
      useCORS: true,
      allowTaint: true,
      logging: true,
      windowWidth: 794, // Lebar standar A4 dalam piksel (96 DPI)
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.90);
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    const pageHeight = pdf.internal.pageSize.getHeight();

    let heightLeft = pdfHeight;
    let position = 0;

    pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, pdfHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - pdfHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, pdfHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(fileName);
  } catch (error) {
    console.error('DETAIL ERROR PDF:', error);
    alert(`Gagal membuat PDF: ${error.message || 'Kesalahan tidak diketahui'}`);
  }
};