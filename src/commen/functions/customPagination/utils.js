export function convertToArabicNumber(number) {
    const arabicNumbers = "٠١٢٣٤٥٦٧٨٩";
    return number
      .toString()
      .replace(/\d/g, (match) => arabicNumbers[Number(match)]);
  };