export default function Table({ data = [], onEdit, onDelete }) {
  if (!data.length)
    return (
      <div className="w-full flex items-center justify-center py-12">
        <div className="text-center">
          <p className="text-base-content/70">No students found</p>
        </div>
      </div>
    );

  // Fixed columns from your model
  const columns = [
    "fullname",
    "id_number",
    "department",
    "batch",
    "section",
    "gender",
  ];

  // Helper: capitalize words
  const capitalizeWords = (str) =>
    str
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

  return (
    <div className="rounded-xl shadow-md border border-base-300/40 w-full m-4 ">
      <table className="table table-zebra w-full">
        <thead className="bg-base-200 sticky top-0 z-10">
          <tr>
            <th className="px-3 py-2 text-xs md:text-sm">#</th>
            {columns.map((col) => (
              <th key={col} className="px-3 py-2 text-xs md:text-sm">
                {capitalizeWords(col)}
              </th>
            ))}
            <th className="px-3 py-2 text-xs md:text-sm text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx} className="hover:bg-base-100 transition-colors">
              <td className="px-3 py-2 align-middle">{idx + 1}</td>
              {columns.map((col) => (
                <td
                  key={col}
                  className="px-3 py-2 align-middle whitespace-nowrap max-w-[14ch] md:max-w-none overflow-hidden text-ellipsis"
                  title={row[col] ?? "-"}
                >
                  {row[col] ?? "-"}
                </td>
              ))}
              <td className="px-3 py-2 align-middle">
                <div className="flex items-center justify-end gap-2">
                  <button
                    className="btn btn-ghost btn-xs md:btn-sm btn-outline"
                    onClick={() => onEdit && onEdit(row)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-error btn-xs md:btn-sm"
                    onClick={() => onDelete && onDelete(row)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
