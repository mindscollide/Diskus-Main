export const ConvertFileSizeInMB = (fileSize) => {
  const fileSizeInKB = fileSize / 1024;
  const fileSizeInMB = fileSizeInKB / 1024;
  return fileSizeInMB.toFixed(2);
};

export const isFileSizeValid = (fileSize) => {
  const fileSizeInGB = fileSize / (1024 * 1024 * 1024); // Convert bytes to GB
  const isMorethan = fileSizeInGB <= 1.5;
  return { fileSizeInGB, isMorethan };
};
