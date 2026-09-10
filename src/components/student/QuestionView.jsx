import React from 'react';


export default function QuestionView({ number, question, answer, onChange }) {
  const modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['clean']
    ],
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4 mb-4">
      <div className="flex items-start gap-3">
        <span className="w-7 h-7 bg-blue-50 text-blue-600 font-bold text-xs rounded-full flex items-center justify-center shrink-0 mt-0.5">
          {number}
        </span>
        <div className="space-y-1 flex-1">
          <p className="text-sm font-semibold text-slate-800 whitespace-pre-wrap">{question.questionText}</p>
        </div>
      </div>

      {question.type === 'text' && (
        <div className="mt-2 rounded-lg overflow-hidden border border-slate-300 bg-white">
          <ReactQuill
            theme="snow"
            value={answer || ''}
            onChange={onChange}
            modules={modules}
            placeholder="Ketik jawaban Anda di sini (mendukung bold, italic, bullet, numbering)..."
            className="text-sm"
          />
        </div>
      )}

      {/* Tambahan penanganan tipe lain jika diperlukan */}
    </div>
  );
}