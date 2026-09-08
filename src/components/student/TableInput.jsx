import React from 'react';

export default function TableInput({ tableData, answer = [], onChange }) {
  const { headers, rows } = tableData;

  const handleCellChange = (rowIndex, colIndex, value) => {
    const updatedAnswer = [...answer];
    if (!updatedAnswer[rowIndex]) {
      updatedAnswer[rowIndex] = [...rows[rowIndex]];
    }
    updatedAnswer[rowIndex][colIndex] = value;
    onChange(updatedAnswer);
  };

  return (
    <div className="overflow-x-auto border border-slate-200 rounded-lg my-3">
      <table className="w-full text-sm text-left text-slate-700">
        <thead className="text-xs text-slate-700 uppercase bg-slate-100 border-b border-slate-200">
          <tr>
            {headers.map((header, idx) => (
              <th key={idx} className="px-4 py-3 min-w-[120px]">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-b border-slate-100 bg-white">
              {row.map((cellValue, colIndex) => {
                const isPreset = cellValue !== '';
                const currentVal = answer[rowIndex]?.[colIndex] ?? cellValue;

                return (
                  <td key={colIndex} className="p-2 border-r border-slate-100 last:border-r-0">
                    {isPreset ? (
                      <span className="font-medium text-slate-800 px-2">{cellValue}</span>
                    ) : (
                      <input
                        type="text"
                        value={currentVal}
                        onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
                        placeholder="Ketik jawaban..."
                        className="w-full p-2 bg-blue-50/50 border border-blue-200 rounded text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}