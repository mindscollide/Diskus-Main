//Calculating the totals
export const calculateTotals = (data) => {
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

  const totalQuarterlyCharges = data.reduce((total, row) => {
    const quarterlyCharge = row.price * (Number(row.licenseCount) || 0) * 3; // Multiply by 3 for quarterly
    return total + quarterlyCharge;
  }, 0);

  const totalYearlyCharges = data.reduce((total, row) => {
    const yearlyCharge = row.price * (Number(row.licenseCount) || 0) * 12; // Multiply by 12 for yearly
    return total + yearlyCharge;
  }, 0);

  // Return an object with the totals that can be used as a row in your table.
  return {
    name: "Total",
    Numberoflicenses: totalLicenses,
    MonthCharges: totalMonthlyCharges,
    Quarterlycharges: totalQuarterlyCharges,
    YearlychargesTotal: totalYearlyCharges,
  };
};
