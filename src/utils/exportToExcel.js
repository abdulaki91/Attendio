import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function exportToExcel(data, fileName, absenceStats = {}) {
  if (!data.length) return;

  // 1️Prepare table-like data (same as your AttendanceTable)
  const tableData = data.map((student) => {
    const percentage = absenceStats[student.id_number]?.absentPercentage || 0;

    return {
      Name: student.name,
      Section: student.section,
      Batch: student.batch,
      ID_Number: student.id_number,
      Department: student.department,
      Gender: student.gender,
      "Absent %": `${percentage}%`,
      isEligible: percentage > 25 ? "No" : "Yes",
    };
  });

  //  Convert JSON → worksheet
  const worksheet = XLSX.utils.json_to_sheet(tableData);

  //  Auto-adjust column width
  worksheet["!cols"] = Object.keys(tableData[0]).map((key) => ({
    wch: Math.max(key.length + 2, 12),
  }));

  // 4️ Create workbook & sheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");

  // 5️ Export as Excel (.xlsx)
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  saveAs(blob, `${fileName}.xlsx`);
}
