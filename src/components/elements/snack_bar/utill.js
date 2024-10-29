export const showMessage = (message, severity, setOpen) => {
  console.log("Showing message:", message);
  console.log("Showing severity:", severity);

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
