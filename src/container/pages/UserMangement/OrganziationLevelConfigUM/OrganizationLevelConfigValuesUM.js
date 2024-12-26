export const options = [];

for (let i = 0; i < 50; i++) {
  options.push({
    label: `${i + 1} ${i + 1 === 1 ? "Day" : "Days"}`,
    value: i + 1,
  });
}

export const MonthOptions = [];
for (let i = 0; i < 15; i++) {
  MonthOptions.push({
    label: `${i + 1} ${i + 1 === 1 ? "Month" : "Months"}`,
    value: i + 1,
  });
}
export const autoResolutionsOptionsValues = (lastValue = 30) => {
  const options = [];
  for (let i = 1; i <= lastValue; i++) {
    options.push({
      label: i,
      value: i,
    });
  }
  return options;
};
