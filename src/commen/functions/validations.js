import XRegExp from "xregexp";

export const checkEmptyField = (data) => {
  let dataToStr = String(data);
  return dataToStr.length > 0 ? false : true;
};

export const validEmailAddress = (data) => {
  let pattern = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
  let dataToStr = String(data);

  return dataToStr.match(pattern) ? true : false;
};

export const validateEmail = (email) => {
  const re = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
  return re.test(String(email).toLowerCase());
};

export const validationEmail = (value) => {
  var mailformat = /^[a-zA-Z0-9._%+-]{1,64}@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (mailformat.test(value)) {
    return true;
  } else {
    return false;
  }
};

//only are valid from this function
export const stringValidation = (value) => {
  let valueCheck = value.replace(/[^a-zA-Z ]/g, "");
  let stringValidate = valueCheck !== "" ? true : false;
  return stringValidate;
};

export const onlyNumberValidation = (value) => {
  let valueCheck = value.replace(/[^\d]/g, "");
  let numberValidate = valueCheck !== "" ? true : false;
  return numberValidate;
};

export function removePropertiesFromObject(obj) {
  for (var key in obj) {
    if (typeof obj[key] === "object" && !Array.isArray(obj[key])) {
      // If the current property is an object (but not an array), recursively remove properties from it
      removePropertiesFromObject(obj[key]);
    } else {
      // Remove the specified properties
      if (
        key === "presenterName" ||
        key === "subAgendarequestContributorUrlName" ||
        key === "requestContributorURlName"
      ) {
        delete obj[key];
      }
    }
  }
  return obj;
}

//Email supports arabic and english langugae both emails formats

export const validateEmailEnglishAndArabicFormat = (email) => {
  const emailRegex = XRegExp(
    `
  ^
  [\\p{L}0-9._%+-]+@[\\p{L}0-9.-]+\\.[\\p{L}]{2,}$
`,
    "xi"
  );
  return emailRegex.test(email);
};

// tabManager.js
// export const manageTabs = () => {
//   const tabId = `tab-${Date.now()}-${Math.random()}`; // Unique ID for the tab
//   const countKey = "tabsCount";

//   const incrementCount = () => {
//     const currentCount = Number(localStorage.getItem(countKey) || 0);
//     localStorage.setItem(countKey, currentCount + 1);
//   };

//   const decrementCount = () => {
//     const currentCount = Math.max(
//       Number(localStorage.getItem(countKey) || 0) - 1,
//       0
//     );
//     localStorage.setItem(countKey, currentCount);
//     if (currentCount === 0) {
//       // Perform action when all tabs are closed, e.g., show an alert
//       alert("All tabs closed");
//       // alert("All tabs closed"); // Uncomment to use alert
//     }
//   };

//   // Increment on load
//   incrementCount();

//   // Decrement on before unload/close
//   window.addEventListener("beforeunload", decrementCount);

//   // Listen to storage changes
//   window.addEventListener("storage", (e) => {
//     if (e.key === countKey && e.newValue === "0") {
//       // alert("All tabs closed 1");
//       localStorage.removeItem("signupCurrentPage")
//       localStorage.removeItem("LoginFlowPageRoute")
//       // alert("All tabs closed"); // Uncomment to use alert
//     }
//   });

//   // To ensure the counter is correctly decremented when the page is closed
//   return () => {
//     window.removeEventListener("beforeunload", decrementCount);
//     decrementCount(); // Decrement once more in case beforeunload doesn't fire
//   };
// };
export const manageTabs = () => {
  const tabId = `tab-${Date.now()}-${Math.random()}`; // Unique ID for the tab
  const countKey = "tabsCount";

  const incrementCount = () => {
    const currentCount = Number(localStorage.getItem(countKey) || 0);
    localStorage.setItem(countKey, currentCount + 1);
  };

  const decrementCount = () => {
    const currentCount = Math.max(
      Number(localStorage.getItem(countKey) || 0) - 1,
      0
    );
    localStorage.setItem(countKey, currentCount);
    if (currentCount === 0) {
      // Before alerting or when all tabs are closed, remove specific localStorage items
      localStorage.removeItem("signupCurrentPage");
      localStorage.removeItem("LoginFlowPageRoute");

      // You mentioned wanting an alert, but as discussed, this might not be reliable
      // alert("All tabs closed"); // Uncomment to use alert
    }
  };

  // Increment on load
  incrementCount();

  // Decrement on before unload/close
  window.addEventListener("beforeunload", decrementCount);

  // Listen to storage changes
  window.addEventListener("storage", (e) => {
    if (e.key === countKey && e.newValue === "0") {
      // Optional: Any action to take when the count reaches 0 in other tabs,
      // but remember, this tab will not be able to react to storage changes.
    }
  });

  // Cleanup logic to ensure listeners are removed and count is decremented properly when the component unmounts
  return () => {
    window.removeEventListener("beforeunload", decrementCount);
    decrementCount(); // Ensure the count is decremented correctly if the component unmounts
  };
};
