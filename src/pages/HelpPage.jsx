import { HelpCircle } from "lucide-react";

export default function HelpPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <HelpCircle size={24} className="text-primary" />
        <h1 className="text-3xl font-bold text-primary">Attendio User Guide</h1>
      </div>

      {/* 1. Introduction */}
      <section className="card bg-base-100 shadow-md p-4 space-y-2">
        <h2 className="card-title text-xl font-semibold">What is Attendio?</h2>
        <p>
          Attendio is a modern attendance management system designed for
          educational institutions. It helps teachers and administrators
          efficiently manage student attendance, track absenteeism, and generate
          reports. Unlike traditional methods, Attendio is fully digital,
          intuitive, and ensures accurate record keeping.
        </p>
        <h3 className="font-semibold">Why Attendio is Unique?</h3>
        <ul className="list-disc ml-6 space-y-1">
          <li>Real-time attendance tracking with instant updates.</li>
          <li>Automatically calculates absent percentages and eligibility.</li>
          <li>Supports multiple classes, sections, and batches.</li>
          <li>Export reports to Excel/CSV for record-keeping.</li>
          <li>Search, filter, and sort students easily.</li>
        </ul>
      </section>

      {/* 2. Import Student Data */}
      <section className="card bg-base-100 shadow-md p-4 space-y-2">
        <h2 className="card-title text-xl font-semibold">
          Import Student Data
        </h2>
        <p>
          To start using Attendio, upload your student data using a CSV file.
          Make sure the CSV columns match the system’s requirements:
        </p>
        <div className="overflow-x-auto">
          <table className="table table-compact table-zebra w-full">
            <thead>
              <tr>
                <th>Column Name</th>
                <th>Description</th>
                <th>Example</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>id_number</td>
                <td>Unique student ID</td>
                <td>2024001</td>
              </tr>
              <tr>
                <td>name</td>
                <td>Full name of the student</td>
                <td>John Doe</td>
              </tr>
              <tr>
                <td>gender</td>
                <td>Male / Female</td>
                <td>Male</td>
              </tr>
              <tr>
                <td>department</td>
                <td>Department / Program</td>
                <td>Computer Science</td>
              </tr>
              <tr>
                <td>batch</td>
                <td>Batch / Year</td>
                <td>2025</td>
              </tr>
              <tr>
                <td>section</td>
                <td>Class section</td>
                <td>A</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-2">
          Go to <strong>Student</strong> page &rarr; click{" "}
          <strong>Import Students</strong> and upload your CSV.
        </p>
      </section>

      {/* 3. Start a Session */}
      <section className="card bg-base-100 shadow-md p-4 space-y-2">
        <h2 className="card-title text-xl font-semibold">Start a Session</h2>
        <p>
          A session represents a class on a particular date. Here’s how to
          create one:
        </p>
        <ol className="list-decimal ml-6 space-y-1 mt-2">
          <li>
            Navigate to <strong>Session Attendance</strong>.
          </li>
          <li>
            Click <strong>Start New Session</strong>.
          </li>
          <li>
            Select <strong>Department</strong>, <strong>Batch</strong>,{" "}
            <strong>Section</strong>, and <strong>Date</strong>.
          </li>
          <li>
            Click <strong>Save</strong>. The session will appear in the session
            list.
          </li>
        </ol>
      </section>

      {/* 4. Mark Attendance */}
      <section className="card bg-base-100 shadow-md p-4 space-y-2">
        <h2 className="card-title text-xl font-semibold">Mark Attendance</h2>
        <p>
          Click a session to view students. You can mark attendance by clicking
          each row:
        </p>
        <ol className="list-decimal ml-6 space-y-1 mt-2">
          <li>
            Click a student row to toggle status:{" "}
            <span className="font-semibold text-green-600">Present</span>,{" "}
            <span className="font-semibold text-red-600">Absent</span>, or{" "}
            <span className="font-semibold text-yellow-600">Late</span>.
          </li>
          <li>Use the search box to find students quickly.</li>
          <li>
            The system automatically calculates <strong>Absent %</strong> and
            eligibility.
          </li>
        </ol>
        <div className="overflow-x-auto mt-2">
          <table className="table table-compact table-zebra w-full">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Status</th>
                <th>Absent %</th>
                <th>Eligible</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>John Doe</td>
                <td className="text-green-600 font-semibold">Present</td>
                <td>0%</td>
                <td>Yes</td>
              </tr>
              <tr>
                <td>2</td>
                <td>Jane Smith</td>
                <td className="text-red-600 font-semibold">Absent</td>
                <td>50%</td>
                <td>No</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 5. Export Attendance */}
      <section className="card bg-base-100 shadow-md p-4 space-y-2">
        <h2 className="card-title text-xl font-semibold">Export Attendance</h2>
        <p>
          Click <span className="badge badge-primary">Export</span> to download
          attendance reports in Excel/CSV format. The filename is generated
          using Department & Section for easy identification.
        </p>
      </section>

      {/* 6. Tips */}
      <section className="card bg-base-100 shadow-md p-4 space-y-2">
        <h2 className="card-title text-xl font-semibold">
          Tips & Best Practices
        </h2>
        <ul className="list-disc ml-6 space-y-1">
          <li>Ensure CSV columns match the template exactly.</li>
          <li>Start sessions for each class separately.</li>
          <li>Export attendance regularly for record-keeping.</li>
          <li>Use search and filters to quickly locate students.</li>
        </ul>
      </section>
    </div>
  );
}
