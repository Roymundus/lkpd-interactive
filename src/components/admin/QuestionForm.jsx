import React from 'react';
import TableBuilder from './TableBuilder';
import { Trash2, ArrowUp, ArrowDown, Type, Table, Image as ImageIcon } from 'lucide-react';

export default function QuestionForm({
  question,
  number,
  totalQuestions,
  onChange,
  onDelete,
  onMoveUp,
  onMoveDown,
}) {
  const handleTypeChange = (newType) => {
    let updatedData = { ...question, type: newType };
    if (newType === 'table' && !question.tableData) {
      updatedData.tableData = {
        headers: ['Kolom 1', 'Kolom 2'],
        rows: [['', '']],
      };
    }
    onChange(updatedData);
  };

  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm mb-4">
      {/* Kartu Header & Kontrol */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
        <span className="font-bold text-slate-800 text-sm flex items-center gap-2">
          <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">
            {number}
          </span>
          Soal No. {number}
        </span>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onMoveUp}
            disabled={number === 1}
            className="p-1.5 text-slate-500 hover:bg-slate-100 rounded disabled:opacity-30"
            title="Pindah ke Atas"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onMoveDown}
            disabled={number === totalQuestions}
            className="p-1.5 text-slate-500 hover:bg-slate-100 rounded disabled:opacity-30"
            title="Pindah ke Bawah"
          >
            <ArrowDown className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="p-1.5 text-red-500 hover:bg-red-50 rounded ml-2"
            title="Hapus Soal"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tipe Soal Selector */}
      <div className="mb-4">
        <label className="block text-xs font-semibold text-slate-600 mb-1.5">Tipe Input Jawaban</label>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => handleTypeChange('text')}
            className={`p-2.5 rounded-lg border text-xs font-medium flex items-center justify-center gap-2 transition-all ${
              question.type === 'text'
                ? 'bg-blue-50 border-blue-500 text-blue-700 font-bold'
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Type className="w-4 h-4" /> Teks / Paragraf
          </button>
          <button
            type="button"
            onClick={() => handleTypeChange('table')}
            className={`p-2.5 rounded-lg border text-xs font-medium flex items-center justify-center gap-2 transition-all ${
              question.type === 'table'
                ? 'bg-blue-50 border-blue-500 text-blue-700 font-bold'
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Table className="w-4 h-4" /> Tabel Isian
          </button>
          <button
            type="button"
            onClick={() => handleTypeChange('image')}
            className={`p-2.5 rounded-lg border text-xs font-medium flex items-center justify-center gap-2 transition-all ${
              question.type === 'image'
                ? 'bg-blue-50 border-blue-500 text-blue-700 font-bold'
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <ImageIcon className="w-4 h-4" /> Unggah Foto
          </button>
        </div>
      </div>

      {/* Pertanyaan / Teks Soal */}
      <div className="mb-3">
        <label className="block text-xs font-semibold text-slate-600 mb-1">Pertanyaan / Perintah Soal</label>
        <textarea
          rows={3}
          value={question.questionText || ''}
          onChange={(e) => onChange({ ...question, questionText: e.target.value })}
          placeholder="Tuliskan teks atau perintah soal di sini..."
          className="w-full p-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Builder Khusus Tabel */}
      {question.type === 'table' && (
        <TableBuilder
          tableData={question.tableData}
          onChange={(newTableData) => onChange({ ...question, tableData: newTableData })}
        />
      )}
    </div>
  );
}