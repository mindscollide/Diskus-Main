import { useState, useEffect } from "react";

export function useFiscalYearRange(mqttData) {
  const [fiscalYearRange, setFiscalYearRange] = useState("");

  const calculateFiscalYear = (startDay, startMonth) => {
    if (!startDay || !startMonth) return "";

    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const startText = `${startDay.toString().padStart(2, "0")} ${
      monthNames[startMonth - 1]
    }`;

    let endDay;
    let endMonth = startMonth - 1; // same month by default (0 index)

    if (startDay === 1) {
      // If start day is 1 → go to previous month
      endMonth = startMonth - 2;
      if (endMonth < 0) endMonth = 11;

      // Get last day of that previous month
      const tempDate = new Date(new Date().getFullYear(), endMonth + 1, 0);
      endDay = tempDate.getDate();
    } else {
      // Otherwise just subtract 1 day (same month)
      endDay = startDay - 1;
    }

    const endText = `${endDay.toString().padStart(2, "0")} ${
      monthNames[endMonth]
    }`;

    return `${startText} - ${endText}`;
  };

  useEffect(() => {
    let startDay = parseInt(localStorage.getItem("fiscalYearStartDay"), 10);
    let startMonth = parseInt(localStorage.getItem("fiscalStartMonth"), 10);

    // If MQTT updates exist → use them and update localStorage
    if (mqttData?.fiscalYearStartDay && mqttData?.fiscalStartMonth) {
      startDay = mqttData.fiscalYearStartDay;
      startMonth = mqttData.fiscalStartMonth;

      localStorage.setItem("fiscalYearStartDay", startDay);
      localStorage.setItem("fiscalStartMonth", startMonth);
    }

    setFiscalYearRange(calculateFiscalYear(startDay, startMonth));
  }, [mqttData]);

  return fiscalYearRange;
}
