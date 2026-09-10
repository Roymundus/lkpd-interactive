import React, { useRef } from 'react';
import { Bold, Italic, List, ListOrdered } from 'lucide-react';

export default function QuestionView({ number, question, answer, onChange }) {
  const textareaRef = useRef(null);

  const insertFormatting = (tagStart, tagEnd = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);

    const replacement = `${tagStart}${selectedText || 'teks'}${tagEnd}`;
    const newText = text.substring(0, start) + replacement + text.substring(end);
    
    onChange(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + tagStart.length, end + tagStart.length);
    }, 0);
  };

  const handleFormat = (type) => {
    switch (type) {
      case 'bold':
        insertFormatting('**', '**');
        break;
      case 'italic':
        insertFormatting('_', '_');
        break;
      case 'bullet':
        insertFormatting('\n- ');
        break;
      case 'number':
        insertFormatting('\n1. ');
        break;
      default:
        break;
    }
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
        <div className="border border-slate-300 rounded-lg overflow-hidden bg-white">
          <div className="flex items-center gap-1 bg-slate-100 px-3 py-2 border-b border-slate-300">
            <button
              type="button"
              onClick={() => handleFormat('bold')}
              className="p-1.5 hover:bg-slate-200 rounded text-slate-700 transition-colors"
              title="Bold (Tebal)"
            >
              <Bold className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => handleFormat('italic')}
              className="p-1.5 hover:bg-slate-200 rounded text-slate-700 transition-colors"
              title="Italic (Miring)"
            >
              <Italic className="w-4 h-4" />
            </button>
            <div className="w-px h-4 bg-slate-300 mx-1" />
            <button
              type="button"
              onClick={() => handleFormat('bullet')}
              className="p-1.5 hover:bg-slate-200 rounded text-slate-700 transition-colors"
              title="Bullet List"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => handleFormat('number')}
              className="p-1.5 hover:bg-slate-200 rounded text-slate-700 transition-colors"
              title="Numbered List"
            >
              <ListOrdered className="w-4 h-4" />
            </button>
          </div>

          <textarea
            ref={textareaRef}
            rows={5}
            value={answer || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Ketik jawaban atau analisis kelompok di sini (mendukung format bold, italic, list)..."
            className="w-full p-3 text-sm focus:outline-none bg-white text-slate-800 resize-y"
          />
        </div>
      )}
    </div>
  );
}