export default function Table({ data = [], onEdit, onDelete }) {
  if (!data.length) return <p>No students found</p>;

  // Fixed columns from your model
  const columns = [
    "fullname",
    "id_number",
    "department",
    "batch",
    "year",
    "gender",
  ];

  // Helper: capitalize words
  const capitalizeWords = (str) =>
    str
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  return (
    <table className="table-auto border-collapse w-full">
      <thead className="bg-base-100">
        <tr>
          <th className="px-2 py-1 border font-semibold">#</th>
          {columns.map((col) => (
            <th key={col} className="px-2 py-1 border font-semibold">
              {capitalizeWords(col)}
            </th>
          ))}
          <th className="px-2 py-1 border font-semibold">Actions</th>
        </tr>
      </thead>

      <tbody>
        {data.map((row, idx) => (
          <tr key={idx} className="border hover:bg-base-300">
            <td className="px-2 py-1 border-[0.5px]">{idx + 1}</td>
            {columns.map((col) => (
              <td key={col} className="px-2 py-1 border-[0.5px]">
                {row[col] ?? "-"}
              </td>
            ))}
            <td className="px-2 py-1 border-[0.5px] flex gap-2">
              <button
                className="btn btn-xs btn-info"
                onClick={() => onEdit && onEdit(row)}
              >
                Edit
              </button>
              <button
                className="btn btn-xs btn-error"
                onClick={() => onDelete && onDelete(row)}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
