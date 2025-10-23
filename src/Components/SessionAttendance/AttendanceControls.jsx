import { Search, FileDown } from "lucide-react";

export default function AttendanceControls({
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus,
  onExport,
}) {
  return (
    <div className="flex flex-col md:flex-row items-center gap-3">
      <div className="relative flex">
        <Search className="absolute left-3 top-2." size={18} width={40} />
        <input
          type="text"
          placeholder="Search student..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input input-bordered w-full"
        />
      </div>

      <select
        className="select select-bordered"
        value={filterStatus}
        onChange={(e) => setFilterStatus(e.target.value)}
      >
        <option>All</option>
        <option>Present</option>
        <option>Absent</option>
      </select>

      <button
        onClick={onExport}
        className="btn btn-outline flex items-center gap-2"
      >
        <FileDown size={16} /> Export
      </button>
    </div>
  );
}
