import React, { useState } from 'react';
import imageCompression from 'browser-image-compression';
import { Upload, Image as ImageIcon, Loader2, X } from 'lucide-react';

export default function ImageUpload({ value, onChange }) {
  const [loading, setLoading] = useState(false);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    const options = {
      maxSizeMB: 0.3,         // Maksimal ~300KB
      maxWidthOrHeight: 1200, // Ukuran piksel maksimal
      useWebWorker: true,
    };

    try {
      const compressedFile = await imageCompression(file, options);
      const reader = new FileReader();
      reader.readAsDataURL(compressedFile);
      reader.onloadend = () => {
        onChange(reader.result);
        setLoading(false);
      };
    } catch (error) {
      console.error('Gagal mengompresi gambar:', error);
      setLoading(false);
    }
  };

  const handleRemove = () => {
    onChange('');
  };

  return (
    <div className="my-3">
      {value ? (
        <div className="relative inline-block border border-slate-200 rounded-lg p-2 bg-slate-50">
          <img src={value} alt="Preview Jawaban" className="max-h-60 rounded object-contain" />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-3 right-3 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 shadow"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {loading ? (
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-2" />
            ) : (
              <Upload className="w-8 h-8 text-slate-400 mb-2" />
            )}
            <p className="text-xs text-slate-500">
              {loading ? 'Mengompresi gambar...' : 'Klik untuk mengambil foto / memilih gambar'}
            </p>
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            disabled={loading}
            className="hidden"
          />
        </label>
      )}
    </div>
  );
}