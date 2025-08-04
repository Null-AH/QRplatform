"use client";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";

export default function TablePreview({ file }) {

  const [data, setData] = useState([]);

  useEffect(() => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const binaryStr = event.target.result;
      const workbook = XLSX.read(binaryStr, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      setData(jsonData.slice(0, 5)); 
    };
    reader.readAsBinaryString(file);
  }, [file]);
  

  if (!file) return null;

  return (
   <div className="mt-6 w-full max-w-[90%] overflow-auto border rounded-md max-h-[300px]">
  <table className="min-w-[500px] border text-sm text-center">
    <tbody>
      {data.map((row, rowIndex) => (
        <tr key={rowIndex} className="border">
          {row.map((cell, cellIndex) => (
            <td key={cellIndex} className="border px-4 py-2">
              {cell}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
</div>

  );
}
