import { useEffect, useRef, useState } from "react";
import LoadingSpinner from "../components/LoadingSpinner";
import Select from "../Components/Select";
import useMarkStudent from "../hooks/useMarkStudent";
import Button from "../Components/Button";
import Input from "../Components/Input";
import usePrint from "../hooks/usePrint";
import formatLocaldate from "../utils/formatLocaldate";
import { useAttendanceStudents } from "../hooks/useAttendanceStudents";
import { useDepartments } from "../hooks/useDepartments";
const Attendance = () => {
  const [date, setDate] = useState("");
  const [inputDate, setInputDate] = useState("");
  const [batch, setBatch] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const { mutate: markStudent } = useMarkStudent();
  const tableRef = useRef(null);
  const { handlePrint } = usePrint(
    tableRef,
    `Attendance Record for  ${
      !selectedDepartment ? "All" : selectedDepartment
    } Department on ${formatLocaldate(date || new Date())}`
  );
  const { data: students = [], isLoading } = useAttendanceStudents({
    date: inputDate,
    department: selectedDepartment,
    batch: selectedBatch,
  });
  // Fetch distinct departments from backend (per teacher)
  const { data: department = [] } = useDepartments();

  // Collect unique batches
  useEffect(() => {
    const fetchedBatches = students.map((s) => s.batch);
    setBatch([...new Set(fetchedBatches)]);
  }, []);

  // Default date = today (as string YYYY-MM-DD)
  useEffect(() => {
    const today = new Date();
    const localDate = [
      today.getFullYear(),
      String(today.getMonth() + 1).padStart(2, "0"),
      String(today.getDate()).padStart(2, "0"),
    ].join("-");
    setDate(localDate);
  }, []);

  // Days in the current month (pure numbers, no Date conversion to string)
  const daysInMonth = date
    ? Array.from(
        {
          length: new Date(date.split("-")[0], date.split("-")[1], 0).getDate(),
        },
        (_, i) => i + 1
      )
    : [];

  // Filter students
  const displayedStudents = (students || []).filter((s) => {
    const departmentMatch =
      !selectedDepartment || s.department === selectedDepartment;
    const batchMatch = !selectedBatch || s.batch === selectedBatch;
    if (!departmentMatch || !batchMatch) return false;
    const dateMatch =
      !inputDate || s.attendance?.some((a) => a.attendance_date === inputDate);

    return departmentMatch && dateMatch;
  });

  const handleResetFilters = () => {
    setInputDate("");
    setSelectedDepartment("");
  };

  // ✅ Construct YYYY-MM-DD directly as string
  const toggleAttendance = (studentId, day) => {
    const [year, month] = date.split("-");
    const fullDateStr = [
      year,
      month.padStart(2, "0"),
      String(day).padStart(2, "0"),
    ].join("-");

    markStudent({
      studentId,
      date: fullDateStr,
    });
  };

  // ✅ Pure formatter for table checkboxes
  const formattedDay = (day) => {
    const [year, month] = date.split("-");
    return [year, month.padStart(2, "0"), String(day).padStart(2, "0")].join(
      "-"
    );
  };

  return (
    <div className="p-1 sm:p-2 md:p-4 lg:p-6 bg-base-300 space-y-6 rounded-lg">
      <h1 className="text-2xl font-bold"> Attendance</h1>
      <div className=" flex flex-col sm:flex-row gap-2 sm:gap-0 sm:justify-between md:items-center md:gap-1 text-xs md:text-sm lg:text-base">
        {/* Header */}
        <div className="flex flex-wrap sm:gap-1 md:gap-2 lg:gap-2 bg-base-100 w-max  p-1 sm:p-2 md:p-3 lg:p-4 rounded-lg md:flex-row shadow-sm justify-between items-center">
          <div className="flex gap-1 items-center md:flex-row flex-wrap md:justify-center">
            <Input
              type="date"
              value={inputDate}
              onChange={(e) => setInputDate(e.target.value)}
            />
            <Select
              options={department}
              label="Select Department"
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
            />
            <Select
              options={batch}
              label="Select Batch"
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
            />
          </div>
          <div>
            <div className="flex gap-2 flex-wrap flex-col md:flex-row justify-center">
              <Button
                onClick={handleResetFilters}
                className="btn btn-outline  btn-secondary"
              >
                Remove Filters
              </Button>
              <Button onClick={handlePrint} className="btn btn-secondary">
                Print Attendance
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      {displayedStudents.length === 0 && !isLoading ? (
        <div className="p-1 sm:p-2 md:p-4 lg:p-6 space-y-6 flex flex-col items-center w-max h-full ">
          <h1>
            No Students Found please try by adding students or changing filters
          </h1>
        </div>
      ) : (
        <div
          id="attendanceTableContainer"
          ref={tableRef}
          className={`max-h-96 overflow-auto ${
            isLoading ? "" : "border"
          } scrollbar-hide border-blue-300 rounded-lg  table-container`}
        >
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <table className="table table-zebra min-w-full scrollbar-hide text-xs md:text-sm lg:text-base">
              <thead className="bg-base-200 sticky top-0 z-30">
                <tr>
                  <th>#</th>
                  <th>ID</th>
                  <th className="w-max sticky left-0 bg-base-200 z-20 ">
                    Name
                  </th>
                  <th className="w-max">Department</th>
                  <th className="w-max">Batch</th>
                  {daysInMonth.map((day) => (
                    <th key={day}>{day}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {displayedStudents.map((student, idx) => (
                  <tr
                    key={student.id} // ✅ use student_id from DB
                    className="hover:bg-base-100 transition-colors "
                  >
                    <td className="px-4 py-2 text-center">{idx + 1}</td>
                    <td className="px-4 py-2 text-center w-max whitespace-nowrap">
                      {student.id_number}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap left-0 sticky bg-base-100 z-10">
                      {student.fullname}
                    </td>
                    <td className="px-4 py-2 text-center w-max whitespace-nowrap">
                      {student.department}
                    </td>
                    <td className="px-4 py-2 text-center w-max whitespace-nowrap">
                      {student.batch}
                    </td>

                    {daysInMonth.map((day, index) => {
                      const formattedDate = formattedDay(day);
                      const isPresent = student.attendance?.some(
                        (att) =>
                          att.attendance_date == formattedDate &&
                          att.status == "Present"
                      );
                      return (
                        <td
                          key={index} // Fallback to index if att.id is unavailable
                          className="px-2 py-2 text-center border-[0.5px] border-accent/50"
                        >
                          <input
                            type="checkbox"
                            className="checkbox checkbox-xs md:checkbox-md lg:checkbox-base xl:checkbox-lg checkbox-primary"
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
      )}
    </div>
  );
};

export default Attendance;
