import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFDownloadLink,
} from "@react-pdf/renderer";

// Styles
const styles = StyleSheet.create({
  page: { padding: 20, fontSize: 10, fontFamily: "Helvetica" },
  title: { fontSize: 18, textAlign: "center", marginBottom: 10 },
  table: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  row: { flexDirection: "row" },
  col: {
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 4,
    flex: 1,
    textAlign: "center",
  },
  header: { backgroundColor: "#f0f0f0", fontWeight: "bold" },
});

// PDF Document
const AttendancePDF = ({ students, daysInMonth }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>Attendance Report</Text>

      <View style={styles.table}>
        {/* Header Row */}
        <View style={styles.row}>
          <Text style={[styles.col, styles.header, { flex: 0.5 }]}>#</Text>
          <Text style={[styles.col, styles.header, { flex: 2 }]}>Name</Text>
          <Text style={[styles.col, styles.header, { flex: 1.5 }]}>
            Department
          </Text>
          {daysInMonth.map((day) => (
            <Text key={day} style={[styles.col, styles.header, { flex: 0.7 }]}>
              {day}
            </Text>
          ))}
        </View>

        {/* Student Rows */}
        {students.map((student, idx) => (
          <View key={student.student_id} style={styles.row}>
            <Text style={[styles.col, { flex: 0.5 }]}>{idx + 1}</Text>
            <Text style={[styles.col, { flex: 2 }]}>{student.fullname}</Text>
            <Text style={[styles.col, { flex: 1.5 }]}>
              {student.department}
            </Text>
            {daysInMonth.map((day) => {
              const dateStr = new Date(
                `${new Date().getFullYear()}-${String(
                  new Date().getMonth() + 1
                ).padStart(2, "0")}-${String(day).padStart(2, "0")}`
              )
                .toISOString()
                .split("T")[0];

              const record = student.attendance?.find(
                (att) => att.attendance_date.split("T")[0] === dateStr
              );
              return (
                <Text key={day} style={[styles.col, { flex: 0.7 }]}>
                  {record ? (record.status === "Present" ? "✔" : "✘") : ""}
                </Text>
              );
            })}
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

export default AttendancePDF;
