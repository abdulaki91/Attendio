import { useReactToPrint } from "react-to-print";
import toast from "react-hot-toast";

export default function usePrint(ref, label = "Attendance") {
  const reactToPrintFn = useReactToPrint({
    documentTitle: label,
    contentRef: ref,
    pageStyle: `
      @media print {
        tr { page-break-inside: avoid; page-break-after: auto; }
        table { page-break-inside: auto; }
        body { -webkit-print-color-adjust: exact; }
      }
    `,
    onAfterPrint: () => toast.success("Print completed "),
  });

  const handlePrint = () => {
    if (!ref.current) {
      toast.error("There is nothing to print ");
      return;
    }
    reactToPrintFn();
  };

  return { handlePrint };
}
