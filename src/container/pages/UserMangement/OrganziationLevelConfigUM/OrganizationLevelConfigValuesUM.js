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

export const MonthValues = [];
for (let i = 0; i < 30; i++) {
  MonthValues.push({
    label: `${i + 1} ${i + 1 === 1 ? "Day" : "Days"}`,
    value: i + 1,
  });
}
