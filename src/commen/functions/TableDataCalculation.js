//Calculating the totals
export const calculateTotals = (data) => {
  console.log(data, "datadatadatadata");
  const totalLicenses = data.reduce(
    (total, row) => total + (Number(row.licenseCount) || 0),
    0
  );

  // Calculate total monthly charges
  const totalMonthlyCharges = data.reduce((total, row) => {
    console.log(total, "totaltotal");
    const monthlyCharge = row.price * (Number(row.licenseCount) || 0);
    return total + monthlyCharge;
  }, 0);

  console.log(totalMonthlyCharges, "totalMonthlyCharges");

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

export const calculateTotalsBillingStepper = (data) => {
  try {
    const totalLicenses = data.reduce((acc, cur) => {
      const licenses = Number(cur.headCount) || 0;
      return acc + licenses;
    }, 0);

    const totalYearlyCharges = data.reduce((acc, cur) => {
      const yearlyCharge = Number(cur.price * cur.headCount) * 12 || 0;
      return acc + yearlyCharge;
    }, 0);

    const totalQuaterlyCharges = data.reduce((acc, cur) => {
      const quarterlyCharge = Number(cur.price * cur.headCount) * 3 || 0;
      return acc + quarterlyCharge;
    }, 0);

    const totalMontlyCharges = data.reduce((acc, cur) => {
      const monthlyCharge = Number(cur.price * cur.headCount) || 0;
      return acc + monthlyCharge;
    }, 0);

    console.log(totalMontlyCharges, "totalMontlyCharges");
    // Return an object with the totals that can be used as a row in your table.
    return {
      name: "Total",
      headCount: totalLicenses,
      Yearlycharges: totalYearlyCharges,
      Quaterlycharges: totalQuaterlyCharges,
      Monthlycharges: totalMontlyCharges,
    };
  } catch (error) {
    console.log(error, "errorerrorerror");
  }
};
