export function formatDate(inputDate) {
  try {
    // Regular expression to match YYYY-MM-DD format
    const isYYYYMMDD = /^\d{4}-\d{2}-\d{2}$/.test(inputDate);

    // If the date is already in YYYY-MM-DD format, return it as-is
    if (isYYYYMMDD) {
      return inputDate;
    }

    // Check if input is a string and matches DD/MM/YYYY format
    if (
      typeof inputDate !== 'string' ||
      !/^\d{2}\/\d{2}\/\d{4}$/.test(inputDate)
    ) {
      throw new Error(
        'Invalid date format. Expected DD/MM/YYYY (e.g., 24/04/2025).',
      );
    }

    // Split the date into day, month, year
    const [day, month, year] = inputDate.split('/').map(Number);

    // Validate day, month, year
    if (month < 1 || month > 12) {
      throw new Error('Invalid month. Must be between 01 and 12.');
    }
    if (day < 1 || day > 31) {
      throw new Error('Invalid day. Must be between 01 and 31.');
    }
    if (year < 1000 || year > 9999) {
      throw new Error('Invalid year. Must be a 4-digit number.');
    }

    const dateObj = new Date(year, month - 1, day);
    if (
      dateObj.getFullYear() !== year ||
      dateObj.getMonth() !== month - 1 ||
      dateObj.getDate() !== day
    ) {
      throw new Error('Invalid date. Please check the day, month, and year.');
    }

    // Format the date as YYYY-MM-DD
    const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day
      .toString()
      .padStart(2, '0')}`;

    return formattedDate;
  } catch (error) {
    throw new Error(`Error formatting date: ${error.message}`);
  }
}

export function getPreviousDay(dateString) {
  // Validate input format (DD/MM/YYYY)
  const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  if (!regex.test(dateString)) {
    throw new Error('Invalid date format. Expected DD/MM/YYYY');
  }

  // Parse the date string
  const [day, month, year] = dateString.split('/').map(Number);

  // Create Date object (months are 0-based in JavaScript)
  const date = new Date(year, month - 1, day);

  // Subtract one day
  date.setDate(date.getDate() - 1);

  // Format the result back to DD/MM/YYYY
  const prevDay = String(date.getDate()).padStart(2, '0');
  const prevMonth = String(date.getMonth() + 1).padStart(2, '0');
  const prevYear = date.getFullYear();

  return `${prevDay}/${prevMonth}/${prevYear}`;
}

export function getTenDaysBefore(dateString) {
  // Validate input format (DD/MM/YYYY)
  const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  if (!regex.test(dateString)) {
    throw new Error('Invalid date format. Expected DD/MM/YYYY');
  }

  // Parse the date string
  const [day, month, year] = dateString.split('/').map(Number);

  // Create Date object (months are 0-based in JavaScript)
  const date = new Date(year, month - 1, day);

  // Subtract 10 days
  date.setDate(date.getDate() - 10);

  // Format the result back to DD/MM/YYYY
  const prevDay = String(date.getDate()).padStart(2, '0');
  const prevMonth = String(date.getMonth() + 1).padStart(2, '0');
  const prevYear = date.getFullYear();

  return `${prevDay}/${prevMonth}/${prevYear}`;
}
