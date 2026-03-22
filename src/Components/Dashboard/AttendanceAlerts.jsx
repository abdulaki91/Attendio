import React, { useMemo } from "react";
import { AlertTriangle, CheckCircle, Clock, XCircle } from "lucide-react";
import useFetchResource from "../../hooks/useFetchResource";

const AttendanceAlerts = () => {
  const { data: students = [] } = useFetchResource(
    "students/get-students",
    "students",
  );
  const { data: attendance = [] } = useFetchResource(
    "attendance/get-latest",
    "attendance",
  );

  const alerts = useMemo(() => {
    const alertList = [];

    // Students with low attendance (less than 75%)
    const attendanceByStudent = {};
    attendance.forEach((record) => {
      const studentId = record.student_id;
      if (!attendanceByStudent[studentId]) {
        attendanceByStudent[studentId] = {
          present: 0,
          total: 0,
          name: record.student_name,
        };
      }
      attendanceByStudent[studentId].total++;
      if (record.status?.toLowerCase() === "present") {
        attendanceByStudent[studentId].present++;
      }
    });

    Object.entries(attendanceByStudent).forEach(([studentId, data]) => {
      const rate = (data.present / data.total) * 100;
      if (rate < 75 && data.total >= 5) {
        // Only alert if student has at least 5 records
        alertList.push({
          type: "low-attendance",
          icon: <AlertTriangle size={16} className="text-warning" />,
          message: `${data.name} has ${rate.toFixed(0)}% attendance`,
          severity: rate < 50 ? "high" : "medium",
        });
      }
    });

    // Departments with low attendance today
    const departmentStats = {};
    attendance.forEach((record) => {
      const dept = record.department;
      if (!departmentStats[dept]) {
        departmentStats[dept] = { present: 0, total: 0 };
      }
      departmentStats[dept].total++;
      if (record.status?.toLowerCase() === "present") {
        departmentStats[dept].present++;
      }
    });

    Object.entries(departmentStats).forEach(([dept, stats]) => {
      const rate = (stats.present / stats.total) * 100;
      if (rate < 60 && stats.total >= 3) {
        alertList.push({
          type: "dept-low-attendance",
          icon: <XCircle size={16} className="text-error" />,
          message: `${dept} department has ${rate.toFixed(0)}% attendance today`,
          severity: "high",
        });
      }
    });

    // No alerts message
    if (alertList.length === 0) {
      alertList.push({
        type: "all-good",
        icon: <CheckCircle size={16} className="text-success" />,
        message: "All attendance metrics are looking good!",
        severity: "info",
      });
    }

    return alertList.slice(0, 5); // Limit to 5 alerts
  }, [students, attendance]);

  const getSeverityClass = (severity) => {
    switch (severity) {
      case "high":
        return "border-l-error bg-error/10";
      case "medium":
        return "border-l-warning bg-warning/10";
      case "info":
        return "border-l-success bg-success/10";
      default:
        return "border-l-base-300 bg-base-100";
    }
  };

  return (
    <div className="card bg-base-200 shadow-lg">
      <div className="card-body">
        <h2 className="card-title text-lg flex items-center gap-2">
          <AlertTriangle size={20} className="text-warning" />
          Attendance Alerts
        </h2>
        <div className="space-y-3">
          {alerts.map((alert, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg border-l-4 ${getSeverityClass(alert.severity)}`}
            >
              <div className="flex items-start gap-3">
                {alert.icon}
                <div className="flex-1">
                  <p className="text-sm font-medium">{alert.message}</p>
                  {alert.type !== "all-good" && (
                    <p className="text-xs text-base-content/70 mt-1">
                      Consider reviewing attendance patterns
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AttendanceAlerts;
