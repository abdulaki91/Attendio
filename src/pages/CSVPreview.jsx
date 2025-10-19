import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import api from "../api/api";
export default function CSVPreview({
  fetchedStudents,
  onImportSuccess,
  onClose,
  csvData,
}) {
  const [validatedData, setValidatedData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const seenIds = new Set();
    const existingIds = new Set(fetchedStudents.map((s) => s.id_number));

    // Normalize and simplify key
    // ✅ Keep underscores and digits
    const normalizeKey = (key) =>
      key
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "_") // convert spaces to underscores
        .replace(/[^a-z0-9_]/g, ""); // keep underscores and numbers

    // Map CSV keys flexibly
    const validated = csvData.map((rawRow) => {
      // Convert all keys to a simple normalized form
      const normalized = Object.fromEntries(
        Object.entries(rawRow).map(([k, v]) => [normalizeKey(k), v?.trim()])
      );

      // Helper to find the most likely key for each field
      const findKey = (targets) => {
        for (const t of targets) {
          const match = Object.keys(normalized).find((k) => k.includes(t));
          if (match) return normalized[match];
        }
        return "";
      };

      // Detect column data using partial matches
      const row = {
        fullname: findKey(["fullname", "name", "fname", "Full Name"]),
        id_number: findKey([
          "id_number",
          "idno",
          "id",
          "ID Number",
          "Id Number",
        ]),
        department: findKey(["department", "departme", "dept", "Department"]),
        batch: findKey(["batch", "year"]),
        section: findKey(["section", "sect", "Section", "class", "Class"]),
        gender: findKey(["gender", "sex", "Gender"]),
      };

      // Validation
      const errors = [];
      if (!row.fullname) errors.push("Missing fullname");
      if (!row.id_number) errors.push("Missing ID");
      if (!row.department) errors.push("Missing department");
      if (!row.gender) errors.push("Missing gender");
      if (!row.section) errors.push("Missing section");

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
      const res = await api.post(`/students/batch-import`, validStudents, {});

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
              <th>Full Name</th>
              <th>ID Number</th>
              <th>Department</th>
              <th>Batch</th>
              <th>Gender</th>
              <th>Section</th>
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

                <td className="border border-accent/10 text-center px-2 py-1">
                  {row.gender || "-"}
                </td>
                <td className="border border-accent/10 px-2 py-1">
                  {row.section || "-"}
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
