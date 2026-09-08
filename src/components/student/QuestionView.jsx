import React from 'react';
import TableInput from './TableInput';
import ImageUpload from './ImageUpload';

export default function QuestionView({ question, number, answer, onChange }) {
  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-slate-200 mb-4">
      <div className="flex gap-3 mb-3">
        <span className="flex-shrink-0 w-7 h-7 bg-blue-100 text-blue-700 font-semibold rounded-full flex items-center justify-center text-sm">
          {number}
        </span>
        <div className="text-slate-800 text-sm sm:text-base font-medium leading-relaxed pt-0.5">
          {question.questionText}
        </div>
      </div>

      {/* Soal Jenis Teks / Paragraf */}
      {question.type === 'text' && (
        <textarea
          rows={4}
          value={answer || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={question.placeholder || 'Ketik jawaban Anda di sini...'}
          className="w-full p-3 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      )}

      {/* Soal Jenis Tabel */}
      {question.type === 'table' && (
        <TableInput
          tableData={question.tableData}
          answer={answer}
          onChange={(val) => onChange(val)}
        />
      )}

      {/* Soal Jenis Unggah Gambar */}
      {question.type === 'image' && (
        <ImageUpload value={answer} onChange={(val) => onChange(val)} />
      )}
    </div>
  );
}