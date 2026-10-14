import { formatNumber } from "../../../../commen/functions/utils";

// This module runs at import time (outside React), so it has no access to
// useTranslation() — callers pass in `t` from their own component instead.
// export const getDaysOptions = (t) => {
//   const options = [];
//   for (let i = 0; i < 30; i++) {
//     options.push({
//       label: `${formatNumber(i + 1)} ${i + 1 === 1 ? t("Day") : t("Days")}`,
//       value: i + 1,
//     });
//   }
//   return options;
// };

export const getDaysOptions = (t) => {
  const options = [];

  for (let i = 0; i < 30; i++) {
    options.push({
      label: `${formatNumber(i + 1)} ${
        i + 1 === 1 ? t("Day") : t("Days")
      }`,
      value: i + 1,
    });
  }

  const durationOptions = [
    [3, 90, "Months"],
    [6, 180, "Months"],
    [9, 270, "Months"],
    [1, 365, "Year"],
  ];

  durationOptions.forEach(([label, value, unit]) => {
    options.push({
      label: `${formatNumber(label)} ${t(unit)}`,
      value,
    });
  });

  return options;
};

export const getMonthOptions = (t) => {
  const options = [];
  for (let i = 0; i < 15; i++) {
    options.push({
      label: `${formatNumber(i + 1)} ${
        i + 1 === 1 ? t("Month") : t("Months")
      }`,
      value: i + 1,
    });
  }
  return options;
};
export const autoResolutionsOptionsValues = (lastValue = 30) => {
  const options = [];
  for (let i = 1; i <= lastValue; i++) {
    options.push({
      label: formatNumber(i),
      value: i,
    });
  }
  return options;
};
