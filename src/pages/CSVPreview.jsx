import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import baseUri from "../baseURI/BaseUri";
import { useAuth } from "../context/AuthContext";

export default function CSVPreview({
  fetchedStudents,
  onImportSuccess,
  onClose,
  csvData,
}) {
  const [validatedData, setValidatedData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();
  useEffect(() => {
    const seenIds = new Set();
    const existingIds = new Set(fetchedStudents.map((s) => s.id_number));

    const validated = csvData.map((row) => {
      const errors = [];

      if (!row.fullname) errors.push("Missing fullname");
      if (!row.id_number) errors.push("Missing ID");
      if (!row.department) errors.push("Missing department");
      if (!row.gender) errors.push("Missing gender");

      if (row.id_number) {
        if (seenIds.has(row.id_number)) errors.push("Duplicate ID in CSV");
        else if (existingIds.has(row.id_number)) errors.push("Already added");
        else seenIds.add(row.id_number);
      }

      return { ...row, errors };
    });

    setValidatedData(validated);
  }, [csvData, fetchedStudents]);

  const handleAddStudents = async () => {
    const validStudents = validatedData.filter((s) => s.errors.length === 0);
    if (!validStudents.length) {
      toast.error("No valid students to import");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `${baseUri}/students/batch-import`,
        validStudents,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success(
        `${res.data.added} students added. ${res.data.skipped.length} skipped.`
      );
      onImportSuccess && onImportSuccess(validStudents);
    } catch (err) {
      console.error(err);
      toast.error("Failed to import students");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border border-accent/10 rounded p-4 my-4 bg-base-100">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-bold">CSV Preview</h3>
        <button className="btn btn-sm btn-outline" onClick={onClose}>
          Close
        </button>
      </div>

      <div className="overflow-x-auto max-h-64">
        <table className="table-auto w-full border-collapse">
          <thead>
            <tr className="bg-base-200">
              <th>#</th>
              <th>Fullname</th>
              <th>ID Number</th>
              <th>Department</th>
              <th>Batch</th>
              <th>Year</th>
              <th>Gender</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {validatedData.map((row, index) => (
              <tr
                key={row.id_number || index}
                className={
                  row.errors.length > 0
                    ? "bg-base-100 text-red-700"
                    : "text-green-400"
                }
              >
                <td className="border border-accent/10 text-center px-2 py-1">
                  {index + 1}
                </td>
                <td className="border border-accent/10 px-2 py-1">
                  {row.fullname || "-"}
                </td>
                <td className="border border-accent/10 text-center px-2 py-1">
                  {row.id_number || "-"}
                </td>
                <td className="border border-accent/10 px-2 py-1">
                  {row.department || "-"}
                </td>
                <td className="border border-accent/10 px-2 py-1">
                  {row.batch || "-"}
                </td>
                <td className="border border-accent/10 px-2 py-1">
                  {row.year || "-"}
                </td>
                <td className="border border-accent/10 text-center px-2 py-1">
                  {row.gender || "-"}
                </td>
                <td className="border border-accent/10 text-center px-2 py-1">
                  {row.errors.length > 0 ? row.errors.join(", ") : "Valid"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        className="btn btn-primary mt-3"
        onClick={handleAddStudents}
        disabled={
          loading ||
          validatedData.filter((s) => s.errors.length === 0).length === 0
        }
      >
        {loading ? "Adding..." : "Add Valid Students"}
      </button>
    </div>
  );
}
