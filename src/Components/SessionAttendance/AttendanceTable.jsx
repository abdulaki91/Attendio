export default function AttendanceTable({ data, absenceStats }) {
  return (
    <div className="overflow-auto max-h-[70vh] ">
      <table className="table table-zebra w-full mb-10">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Gender</th>
            <th>Section</th>
            <th>Department</th>
            <th>Batch</th>
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
                >
                  <td>{index + 1}</td>
                  <td>{student.name}</td>
                  <td>{student.gender}</td>
                  <td>{student.section}</td>
                  <td>{student.department}</td>
                  <td>{student.batch}</td>
                  <td>{percentage}%</td>
                  <td>{percentage > 25 ? "No" : "Yes"}</td>
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
