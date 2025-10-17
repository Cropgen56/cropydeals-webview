export function formatToYYYYMMDD(dateInput) {
  const regexDash = /^\d{4}-\d{2}-\d{2}$/;
  const regexSlash = /^\d{4}\/\d{2}\/\d{2}$/;

  if (typeof dateInput === "string" && regexDash.test(dateInput)) {
    return dateInput;
  }

  if (typeof dateInput === "string" && regexSlash.test(dateInput)) {
    const [year, month, day] = dateInput.split("/");
    return `${year}-${month}-${day}`;
  }

  const date = new Date(dateInput);
  if (isNaN(date.getTime())) {
    throw new Error("Invalid date format");
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

// return 6 months before date
export function getSixMonthsBefore(dateInput) {
  const date = new Date(dateInput);
  date.setMonth(date.getMonth() - 6);
  return date.toISOString().split("T")[0];
}
