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

    // ✅ Handle CSV file
    if (ext === "csv") {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          // Keep raw data — CSVPreview will handle normalization
          setCsvData(results.data);
          console.log("📄 Parsed CSV Data:", results.data);
        },
        error: (err) => {
          console.error("CSV Parse Error:", err);
          toast.error("Failed to parse CSV file");
        },
      });

      return;
    }

    // ✅ Handle Excel file (.xlsx or .xls)
    if (ext === "xlsx" || ext === "xls") {
      const reader = new FileReader();
      reader.onload = (evt) => {
        try {
          const data = new Uint8Array(evt.target.result);
          const workbook = XLSX.read(data, { type: "array" });
          const firstSheet = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheet];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
          setCsvData(jsonData);
          console.log("📘 Parsed Excel Data:", jsonData);
        } catch (err) {
          console.error("Excel Parse Error:", err);
          toast.error("Failed to parse Excel file");
        }
      };
      reader.readAsArrayBuffer(file);
      return;
    }

    //  Unsupported file type
    toast.error("Unsupported file type. Please upload a CSV or Excel file.");
  };

  return { csvData, setCsvData, handleFileUpload };
}
