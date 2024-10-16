// Export function to show messages
export const showMessage = (message, severity, setOpen) => {
    console.log("Showing message:", message);
    console.log("Showing severity:", severity);
  if(message!==""&&message!==null&&message!==undefined){
    setOpen({
      open: true,
      message: message,
      severity: severity,
    });
  
    // Automatically close the notification after a set time
    setTimeout(() => {
      setOpen((prev) => ({ ...prev, open: false }));
    }, 3000);

  }
  
  };