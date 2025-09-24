import { useState } from "react";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import toast from "react-hot-toast";

export function useFileUpload() {
  const [csvData, setCsvData] = useState([]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const ext = file.name.split(".").pop().toLowerCase();
    if (ext === "csv") {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const parsedData = results.data.map((row) => ({
            fullname: row.fullname?.trim(),
            id_number: row.id_number?.trim(),
            department: row.department?.trim(),
            batch: row.batch?.trim(),
            year: row.year?.trim(),
            gender: row.gender?.trim(),
          }));
          setCsvData(parsedData);
        },
        error: () => toast.error("Failed to parse CSV"),
      });
    } else if (ext === "xlsx" || ext === "xls") {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const data = new Uint8Array(evt.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheet = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheet];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        const parsedData = jsonData.map((row) => ({
          fullname: row.fullname?.toString().trim(),
          id_number: row.id_number?.toString().trim(),
          department: row.department?.toString().trim(),
          batch: row.batch?.toString().trim(),
          year: row.year?.toString().trim(),
          gender: row.gender?.toString().trim(),
        }));
        setCsvData(parsedData);
      };
      reader.readAsArrayBuffer(file);
    } else {
      toast.error("Unsupported file type. Use CSV or Excel.");
    }
  };

  return { csvData, setCsvData, handleFileUpload };
}
