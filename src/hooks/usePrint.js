import { useReactToPrint } from "react-to-print";

export default function usePrint(ref, label = "Attendance") {
  const handlePrint = useReactToPrint({
    documentTitle: label,
    contentRef: ref,
    pageStyle:
      "@media print {tr { page-break-inside: avoid; page-break-after: auto; } table { page-break-inside: auto; }  body { -webkit-print-color-adjust: exact; } }",
  });

  return { handlePrint };
}
