import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const generatePDF = async (pdfRef, fileName = 'LKPD_Siswa.pdf') => {
  try {
    const element = pdfRef.current;
    if (!element) {
      throw new Error('Elemen PDF tidak ditemukan di dalam DOM.');
    }

    // Pastikan elemen siap dibaca
    const canvas = await html2canvas(element, {
      scale: 2, // Skala 2 untuk kualitas gambar yang tajam
      useCORS: true,
      logging: false,
      windowWidth: element.scrollWidth,
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    const pageHeight = pdf.internal.pageSize.getHeight();

    let heightLeft = pdfHeight;
    let position = 0;

    // Cetak halaman pertama
    pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, pdfHeight);
    heightLeft -= pageHeight;

    // Jika konten lebih dari 1 halaman A4, buat halaman baru secara otomatis
    while (heightLeft > 0) {
      position = heightLeft - pdfHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, pdfHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(fileName);
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Terjadi kesalahan saat mengunduh PDF. Pastikan koneksi stabil dan coba lagi.');
  }
};