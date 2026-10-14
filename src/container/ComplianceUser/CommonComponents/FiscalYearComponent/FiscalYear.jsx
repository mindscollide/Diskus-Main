import { useState, useEffect } from "react";

export function useFiscalYearRange(mqttData) {
  const [fiscalYearRange, setFiscalYearRange] = useState("");

  const calculateFiscalYear = (startDay, startMonth) => {
    if (!startDay || !startMonth) return "";

    const currentLanguage = localStorage.getItem("i18nextLng") || "en";

    const isArabic = currentLanguage === "ar";

    const monthNames = isArabic
      ? [
          "يناير",
          "فبراير",
          "مارس",
          "أبريل",
          "مايو",
          "يونيو",
          "يوليو",
          "أغسطس",
          "سبتمبر",
          "أكتوبر",
          "نوفمبر",
          "ديسمبر",
        ]
      : [
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

    const formatDay = (day) => {
      return isArabic
        ? new Intl.NumberFormat("ar").format(day).padStart(2, "٠")
        : day.toString().padStart(2, "0");
    };

    const startText = `${formatDay(startDay)} ${
      monthNames[startMonth - 1]
    }`;

    let endDay;
    let endMonth = startMonth - 1;

    if (startDay === 1) {
      endMonth = startMonth - 2;

      if (endMonth < 0) endMonth = 11;

      const tempDate = new Date(
        new Date().getFullYear(),
        endMonth + 1,
        0
      );

      endDay = tempDate.getDate();
    } else {
      endDay = startDay - 1;
    }

    const endText = `${formatDay(endDay)} ${
      monthNames[endMonth]
    }`;

    return `${startText} - ${endText}`;
  };

  useEffect(() => {
    let startDay = parseInt(
      localStorage.getItem("fiscalYearStartDay"),
      10
    );

    let startMonth = parseInt(
      localStorage.getItem("fiscalStartMonth"),
      10
    );

    if (
      mqttData?.fiscalYearStartDay &&
      mqttData?.fiscalStartMonth
    ) {
      startDay = mqttData.fiscalYearStartDay;
      startMonth = mqttData.fiscalStartMonth;

      localStorage.setItem("fiscalYearStartDay", startDay);
      localStorage.setItem("fiscalStartMonth", startMonth);
    }

    setFiscalYearRange(
      calculateFiscalYear(startDay, startMonth)
    );
  }, [mqttData]);

  return fiscalYearRange;
}
