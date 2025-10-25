export const exportToCSV = (data, fileName, absenceStats = {}) => {
  if (!data.length) return;

  // Build headers including "Absent %"
  const headers = [...Object.keys(data[0]), "Absent %"];

  const csvRows = data.map((row) => {
    const absentPercentage =
      absenceStats[row.id_number]?.absentPercentage || "0";
    return headers
      .map((header) => {
        if (header === "Absent %") return `"${absentPercentage}"`;
        return `"${row[header] ?? ""}"`;
      })
      .join(",");
  });

  const csv = [headers.join(","), ...csvRows].join("\n");

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
};
