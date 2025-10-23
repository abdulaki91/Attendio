export default function toLocalString(dateString) {
  // expects "DD/MM/YYYY"
  const [day, month, year] = dateString.split("/");
  const date = new Date(`${year}-${month}-${day}`); // convert to YYYY-MM-DD
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
