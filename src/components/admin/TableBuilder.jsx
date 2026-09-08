import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

export default function TableBuilder({ tableData, onChange }) {
  const { headers = ['Kolom 1', 'Kolom 2'], rows = [['', '']] } = tableData || {};

  // Tambah Kolom
  const handleAddColumn = () => {
    const newHeaders = [...headers, `Kolom ${headers.length + 1}`];
    const newRows = rows.map((row) => [...row, '']);
    onChange({ headers: newHeaders, rows: newRows });
  };

  // Hapus Kolom
  const handleRemoveColumn = (colIndex) => {
    if (headers.length <= 1) return;
    const newHeaders = headers.filter((_, idx) => idx !== colIndex);
    const newRows = rows.map((row) => row.filter((_, idx) => idx !== colIndex));
    onChange({ headers: newHeaders, rows: newRows });
  };

  // Tambah Baris
  const handleAddRow = () => {
    const newRow = new Array(headers.length).fill('');
    onChange({ headers, rows: [...rows, newRow] });
  };

  // Hapus Baris
  const handleRemoveRow = (rowIndex) => {
    if (rows.length <= 1) return;
    const newRows = rows.filter((_, idx) => idx !== rowIndex);
    onChange({ headers, rows: newRows });
  };

  // Edit Header
  const handleHeaderChange = (colIndex, value) => {
    const newHeaders = [...headers];
    newHeaders[colIndex] = value;
    onChange({ headers: newHeaders, rows });
  };

  // Edit Sel (Isi preset petunjuk)
  const handleCellChange = (rowIndex, colIndex, value) => {
    const newRows = rows.map((r) => [...r]);
    newRows[rowIndex][colIndex] = value;
    onChange({ headers, rows: newRows });
  };

  return (
    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mt-3 space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
          Pengaturan Struktur Tabel
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleAddColumn}
            className="text-xs bg-white border border-slate-300 px-2.5 py-1 rounded hover:bg-slate-100 flex items-center gap-1 text-slate-700"
          >
            <Plus className="w-3 h-3" /> Tambah Kolom
          </button>
          <button
            type="button"
            onClick={handleAddRow}
            className="text-xs bg-white border border-slate-300 px-2.5 py-1 rounded hover:bg-slate-100 flex items-center gap-1 text-slate-700"
          >
            <Plus className="w-3 h-3" /> Tambah Baris
          </button>
        </div>
      </div>

      <div className="overflow-x-auto border border-slate-300 rounded bg-white">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-slate-100 border-b border-slate-300">
              {headers.map((header, colIdx) => (
                <th key={colIdx} className="p-2 border-r border-slate-300 min-w-[140px]">
                  <div className="flex items-center gap-1">
                    <input
                      type="text"
                      value={header}
                      onChange={(e) => handleHeaderChange(colIdx, e.target.value)}
                      placeholder="Nama Header"
                      className="w-full p-1 border border-slate-300 rounded font-bold text-slate-800 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    {headers.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveColumn(colIdx)}
                        className="text-red-500 hover:text-red-700 p-1"
                        title="Hapus Kolom"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </th>
              ))}
              <th className="p-2 w-10"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIdx) => (
              <tr key={rowIdx} className="border-b border-slate-200">
                {row.map((cellVal, colIdx) => (
                  <td key={colIdx} className="p-2 border-r border-slate-200">
                    <input
                      type="text"
                      value={cellVal}
                      onChange={(e) => handleCellChange(rowIdx, colIdx, e.target.value)}
                      placeholder="Petunjuk (Kosongkan jika diisi siswa)"
                      className="w-full p-1.5 border border-slate-200 rounded text-slate-700 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </td>
                ))}
                <td className="p-2 text-center">
                  {rows.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveRow(rowIdx)}
                      className="text-red-500 hover:text-red-700"
                      title="Hapus Baris"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-[11px] text-slate-500 italic">
        * Catatan: Sel yang Anda biarkan kosong akan menjadi area input interaktif bagi siswa.
      </p>
    </div>
  );
}