# Student Batch Import Guide - WORKING FORMAT

## The Issue You Encountered

The CSV parser was showing "Missing fullname, Missing ID..." because it couldn't match the column headers. The system normalizes headers by:

1. Converting to lowercase
2. Replacing spaces with underscores
3. Removing special characters

## Two Working Formats

### Option 1: Use Human-Readable Headers (Recommended)

```csv
Full Name,ID Number,Department,Batch,Gender,Section
```

The system will automatically convert:

- "Full Name" → "full_name" → matches "fullname"
- "ID Number" → "id_number" → matches "id_number"

### Option 2: Use Exact Database Field Names

```csv
fullname,id_number,department,batch,gender,section
```

## Generated Working Files

- `students_working_format.csv` - ✅ Uses "Full Name,ID Number" headers
- `students_normalized_headers.csv` - ✅ Uses "fullname,id_number" headers

## Required Fields

- **Full Name** / **fullname** - Student's complete name
- **ID Number** / **id_number** - Unique identifier
- **Department** / **department** - Academic department
- **Gender** / **gender** - Must be: Male, Female, or Other
- **Section** / **section** - Class section

## Optional Fields

- **Batch** / **batch** - Academic year

## How the Matching Works

The system looks for these patterns in your headers:

| Your Header | Normalized | Matches Field |
| ----------- | ---------- | ------------- |
| Full Name   | full_name  | fullname      |
| ID Number   | id_number  | id_number     |
| Department  | department | department    |
| Batch       | batch      | batch         |
| Gender      | gender     | gender        |
| Section     | section    | section       |

## Test Your Import

1. Download `students_working_format.csv`
2. Upload it to your application
3. You should see all 20 students as "Valid" in the preview
4. Replace the sample data with your actual students

## Common Issues Fixed

- ❌ Empty rows causing "Missing" errors
- ❌ Wrong column order
- ❌ Special characters in headers
- ✅ Now using proper header matching
