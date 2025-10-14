import printJS from "print-js";
import toast from "react-hot-toast";

export default function usePrint(ref, titleInfo) {
  const documentTitle = titleInfo.title || "Attendance Report";

  const handlePrint = () => {
    if (!ref.current) {
      toast.error("There is nothing to print");
      return;
    }

    const headerHTML = `
  <div style="
    text-align: center;
    margin-bottom: 20px;
    font-family: 'Arial', sans-serif;
  ">
    <h1 style="font-size: 20px; margin: 0; color: #2d3748;">📘 Attendance Record</h1>
    <div style="
      display: flex;
      justify-content: center;
      gap: 40px;
      flex-wrap: wrap;
      font-size: 14px;
      margin-top: 8px;
      color: #4a5568;
    ">
      <span><strong>Department:</strong> ${titleInfo.department}</span>
      <span><strong>Section:</strong> ${titleInfo.section}</span>
      <span><strong>Batch:</strong> ${titleInfo.batch}</span>
      <span><strong>Date:</strong> ${titleInfo.date}</span>
    </div>
  </div>
`;

    // Append header before printing
    const printContent = `
  
      ${headerHTML}
      ${ref.current.outerHTML}
    `;

    printJS({
      printable: printContent,
      type: "raw-html",
      style: `
        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 10pt;
        }
        th, td {
          border: 1px solid #000;
          padding: 4px 6px;
          text-align: center;
        }
        th {
          background-color: #f3f4f6;
        }
      `,
      documentTitle: documentTitle,
    });
  };

  return { handlePrint };
}
