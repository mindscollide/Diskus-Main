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
  }
  // export const validationEmail = (value) => {
  //   var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  //   if (value.match(mailformat)) {
  //     return true;
  //   }
  //   else {
  //     return false;
  //   }
  // }
  export const validationEmail = (value) => {
    console.log("check")
    var mailformat = /^[a-zA-Z0-9._%+-]{1,64}@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;;
    console.log("check")

    if (mailformat.test(value)) {
    console.log("check")

      return true;
    }else {
    console.log("check")

      return false;
    }
  }
  //only are valid from this function
  export const stringValidation = (value) => {
    let valueCheck = value.replace(/[^a-zA-Z ]/g, "");
    let stringValidate = valueCheck !== "" ? true : false
    return stringValidate;
  }
  
  export const onlyNumberValidation = (value) => {
    let valueCheck = value.replace(/[^\d]/g, "");
    let numberValidate = valueCheck !== "" ? true: false;
    return numberValidate
  }