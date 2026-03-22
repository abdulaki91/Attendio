// Node.js script to generate sample students Excel file
// Run with: node generate_sample_students.js

import fs from "fs";

// Sample student data matching the database structure
const sampleStudents = [
  {
    "Full Name": "John Smith",
    "ID Number": "STU001",
    Department: "Computer Science",
    Batch: "2024",
    Gender: "Male",
    Section: "A",
  },
  {
    "Full Name": "Sarah Johnson",
    "ID Number": "STU002",
    Department: "Computer Science",
    Batch: "2024",
    Gender: "Female",
    Section: "A",
  },
  {
    "Full Name": "Michael Brown",
    "ID Number": "STU003",
    Department: "Computer Science",
    Batch: "2024",
    Gender: "Male",
    Section: "B",
  },
  {
    "Full Name": "Emily Davis",
    "ID Number": "STU004",
    Department: "Computer Science",
    Batch: "2024",
    Gender: "Female",
    Section: "B",
  },
  {
    "Full Name": "David Wilson",
    "ID Number": "STU005",
    Department: "Information Technology",
    Batch: "2023",
    Gender: "Male",
    Section: "A",
  },
  {
    "Full Name": "Jessica Miller",
    "ID Number": "STU006",
    Department: "Information Technology",
    Batch: "2023",
    Gender: "Female",
    Section: "A",
  },
  {
    "Full Name": "Christopher Moore",
    "ID Number": "STU007",
    Department: "Information Technology",
    Batch: "2023",
    Gender: "Male",
    Section: "B",
  },
  {
    "Full Name": "Amanda Taylor",
    "ID Number": "STU008",
    Department: "Information Technology",
    Batch: "2023",
    Gender: "Female",
    Section: "B",
  },
  {
    "Full Name": "Matthew Anderson",
    "ID Number": "STU009",
    Department: "Electrical Engineering",
    Batch: "2024",
    Gender: "Male",
    Section: "A",
  },
  {
    "Full Name": "Ashley Thomas",
    "ID Number": "STU010",
    Department: "Electrical Engineering",
    Batch: "2024",
    Gender: "Female",
    Section: "A",
  },
  {
    "Full Name": "Daniel Jackson",
    "ID Number": "STU011",
    Department: "Electrical Engineering",
    Batch: "2024",
    Gender: "Male",
    Section: "B",
  },
  {
    "Full Name": "Stephanie White",
    "ID Number": "STU012",
    Department: "Electrical Engineering",
    Batch: "2024",
    Gender: "Female",
    Section: "B",
  },
  {
    "Full Name": "Ryan Harris",
    "ID Number": "STU013",
    Department: "Mechanical Engineering",
    Batch: "2023",
    Gender: "Male",
    Section: "A",
  },
  {
    "Full Name": "Nicole Martin",
    "ID Number": "STU014",
    Department: "Mechanical Engineering",
    Batch: "2023",
    Gender: "Female",
    Section: "A",
  },
  {
    "Full Name": "Kevin Thompson",
    "ID Number": "STU015",
    Department: "Mechanical Engineering",
    Batch: "2023",
    Gender: "Male",
    Section: "B",
  },
  {
    "Full Name": "Lauren Garcia",
    "ID Number": "STU016",
    Department: "Mechanical Engineering",
    Batch: "2023",
    Gender: "Female",
    Section: "B",
  },
  {
    "Full Name": "Brandon Martinez",
    "ID Number": "STU017",
    Department: "Civil Engineering",
    Batch: "2024",
    Gender: "Male",
    Section: "A",
  },
  {
    "Full Name": "Megan Robinson",
    "ID Number": "STU018",
    Department: "Civil Engineering",
    Batch: "2024",
    Gender: "Female",
    Section: "A",
  },
  {
    "Full Name": "Tyler Clark",
    "ID Number": "STU019",
    Department: "Civil Engineering",
    Batch: "2024",
    Gender: "Male",
    Section: "B",
  },
  {
    "Full Name": "Samantha Rodriguez",
    "ID Number": "STU020",
    Department: "Civil Engineering",
    Batch: "2024",
    Gender: "Female",
    Section: "B",
  },
];

// Convert to CSV format
const csvHeader = "Full Name,ID Number,Department,Batch,Gender,Section\n";
const csvRows = sampleStudents
  .map(
    (student) =>
      `"${student["Full Name"]}","${student["ID Number"]}","${student["Department"]}","${student["Batch"]}","${student["Gender"]}","${student["Section"]}"`,
  )
  .join("\n");

const csvContent = csvHeader + csvRows;

// Write CSV file
fs.writeFileSync("sample_students_import.csv", csvContent);

console.log("✅ Generated sample_students_import.csv with 20 students");
console.log("📋 File structure matches your batch import requirements:");
console.log("   - Full Name (required)");
console.log("   - ID Number (required, unique)");
console.log("   - Department (required)");
console.log("   - Batch (optional)");
console.log("   - Gender (required: Male/Female/Other)");
console.log("   - Section (required)");
console.log("\n🚀 You can now import this CSV file through your application!");
