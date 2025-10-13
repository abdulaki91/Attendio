import { useMemo, useRef, useState } from "react";
import LoadingSpinner from "../components/LoadingSpinner";
import Select from "../Components/Select";
import Button from "../Components/Button";
import usePrint from "../hooks/usePrint";
import formatLocaldate from "../utils/formatLocaldate";
import useMarkStudent from "../hooks/useMarkStudent";
import { useAttendanceStudents } from "../hooks/useAttendanceStudents";
import { useDepartments } from "../hooks/useDepartments";
import { useBatches } from "../hooks/useBatch";
import { useSections } from "../hooks/useSection"; // ✅ new custom hook for sections

const Attendance = () => {
  // ======= STATE =======
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [selectedWeekdays, setSelectedWeekdays] = useState([]);

  const weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  // ======= HOOKS =======
  const { mutate: markStudent } = useMarkStudent();
  const { data: departments = [] } = useDepartments();
  const { data: batches = [] } = useBatches();
  const { data: sections = [] } = useSections();

  const tableRef = useRef(null);
  const { handlePrint } = usePrint(
    tableRef,
    `Attendance Record - ${
      selectedDepartment || "All Departments"
    } | ${new Date(year, month - 1).toLocaleString("default", {
      month: "long",
    })} ${year}`
  );

  const { data: students = [], isLoading } = useAttendanceStudents({
    year,
    month,
    department: selectedDepartment,
    batch: selectedBatch,
    section: selectedSection, // ✅ added filter
  });

  // ======= MEMOIZED VALUES =======
  const daysInMonth = useMemo(() => {
    return Array.from(
      { length: new Date(year, month, 0).getDate() },
      (_, i) => {
        const date = new Date(year, month - 1, i + 1);
        const dayName = date.toLocaleString("default", { weekday: "long" });
        return selectedWeekdays.includes(dayName) ? i + 1 : null;
      }
    ).filter(Boolean);
  }, [year, month, selectedWeekdays]);

  // ======= HELPERS =======
  const formattedDay = (day) =>
    `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  const toggleAttendance = (studentId, day) => {
    markStudent({ studentId, date: formattedDay(day) });
  };

  const handleResetFilters = () => {
    setSelectedDepartment("");
    setSelectedBatch("");
    setSelectedSection("");
    setSelectedWeekdays([]);
  };

  // ======= RENDER =======
  return (
    <div className="p-2 md:p-4 lg:p-6 bg-base-300 space-y-6 rounded-lg">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Attendance</h1>
        <p>Today is {formatLocaldate(new Date())}</p>
      </div>

      {/* FILTERS */}
      <div className="flex flex-wrap gap-3 bg-base-100 p-3 rounded-lg shadow-sm justify-between items-center">
        <div className="flex flex-wrap gap-2 items-center">
          <Select
            options={departments}
            label="Select Department"
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
          />
          <Select
            options={batches}
            label="Select Batch"
            value={selectedBatch}
            onChange={(e) => setSelectedBatch(e.target.value)}
          />
          <Select
            options={sections}
            label="Select Section"
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
          />
        </div>

        {/* WEEKDAY SELECTION */}
        <div className="flex flex-wrap gap-2 bg-base-200 p-2 rounded-lg">
          {weekdays.map((day) => (
            <label key={day} className="flex items-center gap-1 text-sm">
              <input
                type="checkbox"
                checked={selectedWeekdays.includes(day)}
                onChange={() =>
                  setSelectedWeekdays((prev) =>
                    prev.includes(day)
                      ? prev.filter((d) => d !== day)
                      : [...prev, day]
                  )
                }
              />
              {day}
            </label>
          ))}
        </div>

        {/* CONTROLS */}
        <div className="flex items-center gap-2">
          <select
            className="select select-bordered select-sm md:select-md"
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
              <option key={m} value={m}>
                {new Date(0, m - 1).toLocaleString("default", {
                  month: "long",
                })}
              </option>
            ))}
          </select>

          <input
            type="number"
            className="input input-bordered input-sm md:input-md w-24"
            value={year}
            min="2024"
            step="1"
            placeholder="Year"
            onChange={(e) =>
              setYear(e.target.value === "" ? "" : Number(e.target.value))
            }
          />

          <Button
            onClick={handleResetFilters}
            className="btn btn-outline btn-secondary"
          >
            Clear Filters
          </Button>

          <Button onClick={handlePrint} className="btn btn-secondary">
            Print
          </Button>
        </div>
      </div>

      {/* ATTENDANCE TABLE */}
      <div
        id="attendanceTableContainer"
        ref={tableRef}
        className={`max-h-96 overflow-auto border border-blue-300 rounded-lg ${
          isLoading ? "" : "table-container"
        }`}
      >
        {isLoading ? (
          <LoadingSpinner />
        ) : students.length === 0 ? (
          <div className="p-6 text-center text-sm">
            No students found. Try changing filters or adding students.
          </div>
        ) : (
          <table className="table table-zebra min-w-full text-xs md:text-sm lg:text-base">
            <thead className="bg-base-200 sticky top-0 z-30">
              <tr>
                <th>#</th>
                <th>ID</th>
                <th className="sticky left-0 bg-base-200 z-20">Name</th>
                <th>Department</th>
                <th>Batch</th>
                <th>Section</th>
                {daysInMonth.map((day) => (
                  <th key={day}>{day}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {students.map((student, idx) => (
                <tr
                  key={student.id}
                  className="hover:bg-base-100 transition-colors"
                >
                  <td className="text-center">{idx + 1}</td>
                  <td className="text-center whitespace-nowrap">
                    {student.id_number}
                  </td>
                  <td className="sticky left-0 bg-base-100 whitespace-nowrap z-10">
                    {student.fullname}
                  </td>
                  <td className="text-center">{student.department}</td>
                  <td className="text-center">{student.batch}</td>
                  <td className="text-center">{student.section}</td>

                  {daysInMonth.map((day) => {
                    const formattedDate = formattedDay(day);
                    const isPresent = student.attendance?.some(
                      (att) =>
                        att.attendance_date === formattedDate &&
                        att.status === "Present"
                    );
                    return (
                      <td
                        key={day}
                        className="text-center border-[0.5px] border-accent/50"
                      >
                        <input
                          type="checkbox"
                          className="checkbox checkbox-xs md:checkbox-md checkbox-primary"
                          checked={!!isPresent}
                          onChange={() => toggleAttendance(student.id, day)}
                        />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Attendance;
