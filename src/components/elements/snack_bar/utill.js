export const showMessage = (message, severity, setOpen) => {
  
  

  if (message) {
    setOpen({
      open: true,
      message: message,
      severity: severity,
    });

    // Automatically close the notification after 3 seconds
    setTimeout(() => {
      setOpen((prev) => ({ ...prev, open: false }));
    }, 3000);
  }
};

//Getting Current Date Time in the Required Format
export const getCurrentDateTime = () => {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  return `${year}${month}${day}${hours}${minutes}${seconds}`;
};
