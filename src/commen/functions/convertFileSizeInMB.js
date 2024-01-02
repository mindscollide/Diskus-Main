export const ConvertFileSizeInMB = (fileSize) => {
  const fileSizeInKB = fileSize / 1024;
  const fileSizeInMB = fileSizeInKB / 1024;
  return fileSizeInMB.toFixed(2);
};
