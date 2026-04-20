/**
 * @file TableDataCalculation.js
 * @description Aggregation helpers that compute licence counts and charge
 * totals for subscription plan tables.  Each function reduces a row array
 * down to a single "Total" summary object suitable for appending as the last
 * row of an Ant Design (or similar) table.
 */

/**
 * Computes total licence count plus monthly, quarterly, and yearly charges
 * from a subscription plan row array.  Used by the main billing / upgrade
 * subscription table.
 *
 * @param {Array<{licenseCount: number|string, price: number}>} data
 * @returns {{
 *   name: "Total",
 *   Numberoflicenses: number,
 *   MonthCharges: number,
 *   Quarterlycharges: number,
 *   YearlychargesTotal: number
 * }}
 */
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

/**
 * Computes totals for the billing stepper's plan selection table.
 * Uses `headCount` (instead of `licenseCount`) and handles errors gracefully.
 *
 * @param {Array<{headCount: number|string, price: number}>} data
 * @returns {{
 *   name: "Total",
 *   headCount: number,
 *   Yearlycharges: number,
 *   Quaterlycharges: number,
 *   Monthlycharges: number
 * }|undefined} Returns `undefined` on error.
 */
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

// ─── Downgrade Subscription Table Aggregators ───────────────────────────────

/**
 * Sums the `price` field across all downgrade-subscription package rows.
 * @param {Array<{price: number}>} packages
 * @returns {number}
 */
export const calculateTotalChargesDowngradeSubscription = (packages) => {
  return packages.reduce((acc, pkg) => acc + pkg.price, 0);
};

/**
 * Sums the `headCount` field across all downgrade-subscription package rows.
 * @param {Array<{headCount: number}>} packages
 * @returns {number}
 */
export const calculateTotalHeadCountDowngradeSubscription = (packages) => {
  return packages.reduce((acc, pkg) => acc + pkg.headCount, 0);
};

/**
 * Sums the `allotedUsers` field across all downgrade-subscription package rows.
 * @param {Array<{allotedUsers: number}>} packages
 * @returns {number}
 */
export const calculateTotalAllotedUsersDowngradeSubscription = (packages) => {
  return packages.reduce((acc, pkg) => acc + pkg.allotedUsers, 0);
};

/**
 * Sums the "not-utilised" slots (`headCount - allotedUsers`) for each package
 * row in the downgrade-subscription table.
 * @param {Array<{headCount: number, allotedUsers: number}>} packages
 * @returns {number}
 */
export const calculateTotalNotUtilizedDowngradeSubscription = (packages) => {
  return packages.reduce(
    (acc, pkg) => acc + (pkg.headCount - pkg.allotedUsers),
    0
  );
};

/**
 * Sums all integer values stored in the text-field map that tracks how many
 * licences the user wants to remove from each package during a downgrade.
 * Non-numeric strings are treated as 0.
 * @param {Object.<string, string|number>} textFieldValues - Key → raw input value.
 * @returns {number}
 */
export const calculateTotalReductionDowngradeSubscription = (
  textFieldValues
) => {
  return Object.values(textFieldValues).reduce(
    (acc, value) => acc + (parseInt(value, 10) || 0),
    0
  );
};
