export const parseUTCDateString = (dateStr) => {
  if (!dateStr || dateStr.length !== 14) return "";

  const year = dateStr.substring(0, 4);
  const month = dateStr.substring(4, 6);
  const day = dateStr.substring(6, 8);
  const hour = dateStr.substring(8, 10);
  const minute = dateStr.substring(10, 12);
  const second = dateStr.substring(12, 14);

  return new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hour),
    Number(minute),
    Number(second)
  );
};

export const formatDateToYMD = (value) => {
  if (!value) return "";

  let date;

  // ✅ If it's already a Date instance
  if (value instanceof Date && !isNaN(value)) {
    date = value;
  }
  // ✅ If it's a yyyymmdd string
  else if (typeof value === "string" && value.length >= 8) {
    const year = value.substring(0, 4);
    const month = value.substring(4, 6);
    const day = value.substring(6, 8);

    date = new Date(`${year}-${month}-${day}`);
  } else {
    return "";
  }

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const parseYYYYMMDDToEndOfDay = (dateString) => {
  if (!dateString || dateString.length < 8) return null;

  const year = dateString.slice(0, 4);
  const month = dateString.slice(4, 6) - 1; // JS months are 0-based
  const day = dateString.slice(6, 8);

  return new Date(year, month, day, 23, 59, 58);
};
