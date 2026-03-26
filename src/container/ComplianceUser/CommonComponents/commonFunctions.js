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
    Number(second),
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
    month:"short",
    year: "numeric",
  });
};

export const parseYYYYMMDDToEndOfDay = (dateString) => {
  try {
    if (!dateString || dateString.length < 8) return null;

    const year = dateString?.slice(0, 4);
    const month = dateString?.slice(4, 6) - 1; // JS months are 0-based
    const day = dateString?.slice(6, 8);

    return new Date(year, month, day, 23, 59, 58);
  } catch (error) {
    console.log(error, dateString);
  }
};

// 20260316235958 -> Date object
export const parseYYYYMMDDHHmmssToDate = (dateString) => {
  if (!dateString) return new Date();
  // Ensure it's a string
  dateString = dateString.toString();

  const year = parseInt(dateString.slice(0, 4));
  const month = parseInt(dateString.slice(4, 6)) - 1; // Month is 0-based
  const day = parseInt(dateString.slice(6, 8));
  const hour = parseInt(dateString.slice(8, 10));
  const minute = parseInt(dateString.slice(10, 12));
  const second = parseInt(dateString.slice(12, 14));

  return new Date(year, month, day, hour, minute, second);
};

export const getDueDateTimeNumber = (dueDate, dueTime) => {
  if (!dueDate) return 0;

  const year = dueDate.substring(0, 4);
  const month = dueDate.substring(4, 6);
  const day = dueDate.substring(6, 8);

  const hours = dueTime?.substring(0, 2) || "00";
  const minutes = dueTime?.substring(2, 4) || "00";
  const seconds = dueTime?.substring(4, 6) || "00";

  // ISO format (SAFE)
  const isoDateTime = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;

  return new Date(isoDateTime).getTime(); // NUMBER
};

const allStatuses = [
  { statusId: 1, statusName: "Not Started" },
  { statusId: 2, statusName: "In Progress" },
  { statusId: 3, statusName: "Completed" },
  { statusId: 5, statusName: "Submitted for Approval" },
  { statusId: 6, statusName: "Reopened" },
  { statusId: 7, statusName: "On Hold" },
  { statusId: 9, statusName: "Cancelled" },
];
const statusTransitions = {
  1: [2, 7], // Not Started → In Progress, On Hold
  2: [5, 7, 9], // In Progress → Submitted, On Hold, Cancelled
  7: [2, 9], // On Hold → In Progress, Cancelled
  5: [3, 6, 7], // Submitted → Completed, Reopened, On Hold
  6: [5, 7, 9], // Reopened → Submitted, On Hold, Cancelled
  3: [6], // Completed → Reopened
  9: [], // Cancelled → none
};

export const getAllowedStatuses = (currentStatusId) => {
  const current = allStatuses.find(function (s) {
    return s.statusId === currentStatusId;
  });

  const allowedIds = statusTransitions[currentStatusId] || [];

  const allowed = allStatuses
    .filter(function (s) {
      return allowedIds.includes(s.statusId);
    })
    .map(function (s) {
      return {
        value: s.statusId,
        label: s.statusName,
      };
    });

  return {
    currentStatus: current
      ? {
          value: current.statusId,
          label: current.statusName,
        }
      : null,
    allowedStatuses: allowed,
  };
};

export const formatGeneratedOnDateTime = (dateStr, timeStr) => {
  if (!dateStr || !timeStr) return "-";

  const year = +dateStr.slice(0, 4);
  const month = +dateStr.slice(4, 6) - 1;
  const day = +dateStr.slice(6, 8);

  const hours = +timeStr.slice(0, 2);
  const minutes = +timeStr.slice(2, 4);
  const seconds = +timeStr.slice(4, 6);

  // Treat API time as UTC
  const date = new Date(Date.UTC(year, month, day, hours, minutes, seconds));

  const formattedTime = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const formattedDate = date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return `${formattedTime} ${formattedDate}`;
};

export const parseBackendDate = (dateStr) => {
  if (!dateStr) return null;

  const year = +dateStr.slice(0, 4);
  const month = +dateStr.slice(4, 6) - 1; // JS months are 0-indexed
  const day = +dateStr.slice(6, 8);
  const hours = +dateStr.slice(8, 10);
  const minutes = +dateStr.slice(10, 12);
  const seconds = +dateStr.slice(12, 14);

  return new Date(year, month, day, hours, minutes, seconds);
};
