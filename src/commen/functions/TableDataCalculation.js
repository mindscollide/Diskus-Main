//Calculating the totals
export const calculateTotals = (data) => {
  let isMonthlyValueHas = false;
  let isQuarterlyValueHas = false;
  let isYearlyValueHas = false;
  console.log(data, "datadatadatadata");
  const totalLicenses = data.reduce(
    (total, row) => total + (Number(row.licenseCount) || 0),
    0
  );

  // Calculate total monthly charges
  const totalMonthlyCharges = data.reduce((total, row) => {
    const monthlyCharge = row.price * (Number(row.licenseCount) || 0);
    return total + monthlyCharge;
  }, 0);
  if (
    totalMonthlyCharges !== undefined &&
    totalMonthlyCharges !== null &&
    totalMonthlyCharges !== 0
  ) {
    isMonthlyValueHas = true;
  }
  console.log(totalMonthlyCharges, "totalMonthlyCharges");

  const totalQuarterlyCharges = data.reduce((total, row) => {
    const quarterlyCharge = row.price * (Number(row.licenseCount) || 0) * 3; // Multiply by 3 for quarterly
    return total + quarterlyCharge;
  }, 0);
  if (
    totalQuarterlyCharges !== undefined &&
    totalQuarterlyCharges !== null &&
    totalQuarterlyCharges !== 0
  ) {
    isQuarterlyValueHas = true;
  }
  console.log(totalQuarterlyCharges, "totalMonthlyCharges");

  const totalYearlyCharges = data.reduce((total, row) => {
    const yearlyCharge = row.price * (Number(row.licenseCount) || 0) * 12; // Multiply by 12 for yearly
    return total + yearlyCharge;
  }, 0);
  if (
    totalYearlyCharges !== undefined &&
    totalYearlyCharges !== null &&
    totalYearlyCharges !== 0
  ) {
    isYearlyValueHas = true;
  }
  console.log(totalYearlyCharges, "totalMonthlyCharges");

  // Return an object with the totals that can be used as a row in your table.
  return {
    name: "Total",
    Numberoflicenses: totalLicenses,
    MonthCharges: totalMonthlyCharges,
    Quarterlycharges: totalQuarterlyCharges,
    YearlychargesTotal: totalYearlyCharges,
  };
};
