export default function AttendanceTable({
  data,
  onSelectStudent,
  absenceStats,
}) {
  return (
    <div className="overflow-auto max-h-72 ">
      <table className="table table-zebra w-full mb-10">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Status</th>
            <th>Absent %</th>
            <th>isEligible</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((student, index) => {
              const percentage =
                absenceStats[student.id_number]?.absentPercentage || "0";

              return (
                <tr
                  key={student.id_number}
                  className="hover:bg-base-300 cursor-pointer"
                  onClick={() => onSelectStudent(student)}
                >
                  <td>{index + 1}</td>
                  <td>{student.name}</td>
                  <td>
                    <span
                      className={`font-semibold ${
                        student.status === "Present"
                          ? "text-green-600"
                          : student.status === "Absent"
                          ? "text-red-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {student.status}
                    </span>
                  </td>
                  <td>{percentage}%</td>
                  <td>{percentage < 25 ? "Yes" : "No"}</td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="4" className="text-center text-gray-500">
                No matching students
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
