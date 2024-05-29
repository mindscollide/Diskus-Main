import React, { useState, useRef, useEffect } from "react";
import styles from "./AddUser.module.css";
import { useSelector, useDispatch } from "react-redux";
import { FormControl, FormGroup } from "react-bootstrap";
import {
  Container,
  Row,
  Col,
  Form,
  Card,
  ListGroup,
  ProgressBar,
  Spinner,
} from "react-bootstrap";
import EmailVeriFyIcon from "./../../../../assets/images/email-verify-icon.png";
import VerificationFailedIcon from "./../../../../assets/images/failed.png";
import { Spin } from "antd";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import { countryName, countryNameforPhoneNumber } from "./CountryJson";
import {
  validateEmail,
  validateEmailEnglishAndArabicFormat,
  validationEmail,
} from "../../../../commen/functions/validations";
import ReactFlagsSelect, { Ro } from "react-flags-select";
import PhoneInput from "react-phone-input-2";
import "./../../../../i18n";
import { useTranslation } from "react-i18next";
import { Chart } from "react-google-charts";
import { Check2, ExclamationTriangleFill } from "react-bootstrap-icons";
import VerticalBarGraph from "@chartiful/react-vertical-bar-graph";
// import { Bar } from "react-chartjs-2";
import "react-phone-input-2/lib/style.css";
import {
  Button,
  TextField,
  Notification,
  Paper,
  Modal,
  Loader,
  Subscriptionwarningline,
  Subscriptionwarninglimit,
} from "../../../../components/elements";
import { borderRadius } from "@mui/system";
import {
  addUserAction,
  OrganizationUserListStatisticsAction,
  setEmailCheck,
  setLoader,
} from "../../../../store/actions/Admin_AddUser";
import { GetOrganizationByID } from "../../../../store/actions/RolesList";
import { cleareMessage } from "../../../../store/actions/Admin_AddUser";
import { checkEmailExsist } from "../../../../store/actions/Admin_Organization";

const AddUser = ({ show, setShow, ModalTitle }) => {
  //for translation
  const { t } = useTranslation();
  const [errorBar, setErrorBar] = useState(false);
  const [allowLimitModal, setAllowedLimitModal] = useState(false);
  const [emailVerifyModal, setEmailVerifyModal] = useState(false);
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const { adminReducer, roleListReducer, LanguageReducer } = state;
  //for spinner in bar chart
  const [loading, setLoading] = useState(true);
  const [dataa, setDataa] = useState([]);
  const [limitBreach, seLimitBreach] = useState(0);
  const [totalBarCount, setTotalBarCount] = useState(0);
  const [totalActiveBarCount, setTotalActiveBarCount] = useState(0);
  const [organizationName, setOrganizationName] = useState("");
  const [userRolesListNameOptions, setUserRolesListNameOptions] = useState([]);
  const [organaizationRolesOptions, setOrganaizationRolesOptions] = useState(
    []
  );

  const navigate = useNavigate();

  //For Enter Key
  const reactFlag = useRef(null);
  const Name = useRef(null);
  const Organization = useRef(null);
  const Designation = useRef(null);
  const countryCodeRef = useRef(null);
  const MobileNumber = useRef(null);
  const OrganizationRole = useRef(null);
  const UserRole = useRef(null);
  const Email = useRef(null);

  const [selected, setSelected] = useState("US");
  const [selectedCountry, setSelectedCountry] = useState({});

  const [open, setOpen] = useState({
    open: false,
    message: "",
  });
  const [companyEmailValidate, setCompanyEmailValidate] = useState(false);
  const [companyEmailValidateError, setCompanyEmailValidateError] =
    useState("");
  const [isEmailUnique, setEmailUnique] = useState(false);

  const [editOrganization, setEditOrganization] = useState([]);
  const [editUserRole, setEditUserRole] = useState([]);

  // states for Adduser card
  const [addUserCardSection, setAddUserCardSection] = useState({
    TotalAllowedUser: "",
    EnableUser: "",
    DisableUser: "",
    LockedUser: "",
    DormantUser: "",
  });

  // states for Adduser Fields Section
  const [addUserSection, setAddUserSection] = useState({
    Name: {
      value: "",
      errorMessage: "",
      errorStatus: false,
    },
    OrganizationName: {
      value: "",
      errorMessage: "",
      errorStatus: false,
    },
    OrganizationRoleID: {
      value: "",
      errorMessage: "",
      errorStatus: false,
    },
    Designation: {
      value: "",
      errorMessage: "",
      errorStatus: false,
    },
    MobileNumber: {
      value: "",
      errorMessage: "",
      errorStatus: false,
    },
    OrganizationRole: {
      value: "",
      errorMessage: "",
      errorStatus: false,
    },
    UserRole: {
      value: "",
      errorMessage: "",
      errorStatus: false,
    },
    Email: {
      value: "",
      errorMessage: "",
      errorStatus: false,
    },
    FK_NumberWorldCountryID: 0,
  });

  const [againCall, setAgainCall] = useState(false);

  const handleSelect = (country) => {
    setSelected(country);
    setSelectedCountry(country);
    let a = Object.values(countryNameforPhoneNumber).find((obj) => {
      return obj.primary == country;
    });
    setAddUserSection({
      ...addUserSection,
      FK_NumberWorldCountryID: a.id,
    });
  };
  // Enter key handler
  const enterKeyHandler = (event, nextInput) => {
    if (event.key === "Enter") {
      nextInput.current.focus();
    }
  };

  const handleDropdownOpen = () => {
    if (reactFlag.current) {
      reactFlag.current.focus();
    }
  };

  //Validate Handler
  const AddUserHandler = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    if (name === "Name" && value !== "") {
      let valueCheck = value.replace(/[^a-zA-Z ]/g, "");
      let newValue = valueCheck.trimStart();
      if (newValue !== "") {
        // if (newValue.legend <= 100) {

        setAddUserSection({
          ...addUserSection,
          Name: {
            value: newValue,
            errorMessage: "",
            errorStatus: false,
          },
        });
        // } else {
        //

        //   setAddUserSection({
        //     ...addUserSection,
        //     Name: {
        //       value: addUserSection.Name.value,
        //       errorMessage: "",
        //       errorStatus: false,
        //     },
        //   });
        // }
      } else {
        setAddUserSection({
          ...addUserSection,
          Name: {
            value: "",
            errorMessage: "",
            errorStatus: false,
          },
        });
      }
    } else if (name === "Name" && value === "") {
      setAddUserSection({
        ...addUserSection,
        Name: { value: "", errorMessage: "", errorStatus: false },
      });
    }
    if (name === "Designation" && value !== "") {
      // let valueCheck = value.replace(/[^a-zA-Z ]/g, "");
      if (value !== "") {
        setAddUserSection({
          ...addUserSection,
          Designation: {
            value: value.trimStart(),
            errorMessage: "",
            errorStatus: false,
          },
        });
      }
    } else if (name === "Designation" && value === "") {
      setAddUserSection({
        ...addUserSection,
        Designation: {
          value: "",
          errorMessage: "",
          errorStatus: false,
        },
      });
    }
    if (name === "Email" && value !== "") {
      if (value !== "") {
        setAddUserSection({
          ...addUserSection,
          Email: {
            value: value.trim(),
            errorMessage: "",
            errorStatus: false,
          },
        });
        if (isEmailUnique) {
          setEmailUnique(false);
          dispatch(setEmailCheck(false));
        }
      }
    } else if (name === "Email" && value === "") {
      if (isEmailUnique) {
        setEmailUnique(false);
        dispatch(setEmailCheck(false));
      }

      setAddUserSection({
        ...addUserSection,
        Email: {
          value: "",
          errorMessage: "",
          errorStatus: true,
        },
      });
    }

    if (name === "MobileNumber" && value !== "") {
      let valueCheck = value.replace(/[^\d]/g, "");
      if (valueCheck !== "") {
        setAddUserSection({
          ...addUserSection,
          MobileNumber: {
            value: valueCheck.trimStart(),
            errorMessage: "",
            errorStatus: false,
          },
        });
      }
    } else if (name === "MobileNumber" && value === "") {
      setAddUserSection({
        ...addUserSection,
        MobileNumber: { value: "", errorMessage: "", errorStatus: false },
      });
    }
  };

  //  For Email Validation
  const handeEmailvlidate = () => {
    if (addUserSection.Email.value !== "") {
      if (validateEmailEnglishAndArabicFormat(addUserSection.Email.value)) {
        dispatch(
          checkEmailExsist(
            setCompanyEmailValidate,
            setCompanyEmailValidateError,
            addUserSection,
            t,
            setEmailUnique
          )
        );
      } else {
        dispatch(setEmailCheck(false));
        setEmailUnique(false);
        setAddUserSection({
          ...addUserSection,
          Email: {
            value: addUserSection.Email.value,
            errorMessage: t("Enter-valid-email-address"),
            errorStatus: true,
          },
        });
      }
    } else {
      dispatch(setEmailCheck(false));
      setEmailUnique(false);
      setAddUserSection({
        ...addUserSection,
        Email: {
          value: addUserSection.Email.value,
          errorMessage: t("Enter-valid-email-address"),
          errorStatus: true,
        },
      });
    }
  };
  // For Erroe handling of email
  useEffect(() => {
    if (companyEmailValidateError !== "") {
      setAddUserSection({
        ...addUserSection,
        Email: {
          value: addUserSection.Email.value,
          errorMessage: companyEmailValidateError,
          errorStatus: companyEmailValidate,
        },
      });
    }
  }, [companyEmailValidate, companyEmailValidateError]);

  useEffect(() => {
    if (againCall) {
      let createData = {
        UserName: addUserSection.Name.value,
        OrganizationName: addUserSection.OrganizationName.value,
        Designation: addUserSection.Designation.value,
        MobileNumber: addUserSection.MobileNumber.value,
        UserEmail: addUserSection.Email.value,
        OrganizationRoleID: addUserSection.OrganizationRole.value,
        OrganizationID: addUserSection.OrganizationRoleID.value,
        UserRoleID: addUserSection.UserRole.value,
        FK_NumberWorldCountryID: addUserSection.FK_NumberWorldCountryID,
      };

      dispatch(
        addUserAction(
          navigate,
          createData,
          setEmailVerifyModal,
          setAllowedLimitModal,
          t
        )
      );
      let OrganizationID = localStorage.getItem("organizationID");
      let RequestingUserID = localStorage.getItem("userID");
      if (OrganizationID !== undefined && RequestingUserID !== undefined) {
        let Data = {
          OrganizationID: parseInt(OrganizationID),
          RequestingUserID: parseInt(RequestingUserID),
        };
        let newData = { OrganizationID: parseInt(OrganizationID) };
        dispatch(OrganizationUserListStatisticsAction(navigate, Data, t));
        dispatch(GetOrganizationByID(navigate, newData, t));
      }
      setAddUserSection({
        ...addUserSection,
        Name: {
          value: "",
          errorMessage: "",
          errorStatus: false,
        },
        OrganizationName: {
          value: addUserSection.OrganizationName.value,
          errorMessage: "",
          errorStatus: false,
        },
        OrganizationRoleID: {
          value: addUserSection.OrganizationRoleID.value,
          errorMessage: "",
          errorStatus: false,
        },
        Designation: {
          value: "",
          errorMessage: "",
          errorStatus: false,
        },
        MobileNumber: {
          value: "",
          errorMessage: "",
          errorStatus: false,
        },
        OrganizationRole: {
          value: "",
          errorMessage: "",
          errorStatus: false,
        },
        UserRole: {
          value: "",
          errorMessage: "",
          errorStatus: false,
        },
        Email: {
          value: "",
          errorMessage: "",
          errorStatus: false,
        },
      });
      setEditOrganization([]);
      setEditUserRole([]);
      setAgainCall(false);
    } else {
      setAgainCall(false);
    }
  }, [adminReducer.EmailCheck]);

  const handleClick = async () => {
    if (
      addUserSection.Name.value !== "" &&
      addUserSection.OrganizationName.value !== "" &&
      addUserSection.OrganizationRoleID.value !== "" &&
      addUserSection.Designation.value !== "" &&
      addUserSection.MobileNumber.value !== "" &&
      addUserSection.OrganizationRole.value !== "" &&
      addUserSection.UserRole.value !== "" &&
      addUserSection.Email.value !== ""
    ) {
      if (validateEmailEnglishAndArabicFormat(addUserSection.Email.value)) {
        if (adminReducer.EmailCheck !== false) {
          let createData = {
            UserName: addUserSection.Name.value,
            OrganizationName: addUserSection.OrganizationName.value,
            Designation: addUserSection.Designation.value,
            MobileNumber: addUserSection.MobileNumber.value,
            UserEmail: addUserSection.Email.value,
            OrganizationRoleID: addUserSection.OrganizationRole.value,
            OrganizationID: addUserSection.OrganizationRoleID.value,
            UserRoleID: addUserSection.UserRole.value,
            FK_NumberWorldCountryID: addUserSection.FK_NumberWorldCountryID,
          };
          localStorage.setItem("EmailValue", addUserSection.Email.value);
          await dispatch(
            addUserAction(
              navigate,
              createData,
              setEmailVerifyModal,
              setAllowedLimitModal,
              t
            )
          );
          let OrganizationID = localStorage.getItem("organizationID");
          let RequestingUserID = localStorage.getItem("userID");
          if (OrganizationID !== undefined && RequestingUserID !== undefined) {
            let Data = {
              OrganizationID: parseInt(OrganizationID),
              RequestingUserID: parseInt(RequestingUserID),
            };
            let newData = { OrganizationID: parseInt(OrganizationID) };
            await dispatch(
              OrganizationUserListStatisticsAction(navigate, Data, t)
            );
            await dispatch(GetOrganizationByID(navigate, newData, t));
          }
          setSelected("US");
          setAddUserSection({
            ...addUserSection,
            Name: {
              value: "",
              errorMessage: "",
              errorStatus: false,
            },
            OrganizationName: {
              value: addUserSection.OrganizationName.value,
              errorMessage: "",
              errorStatus: false,
            },
            OrganizationRoleID: {
              value: addUserSection.OrganizationRoleID.value,
              errorMessage: "",
              errorStatus: false,
            },
            Designation: {
              value: "",
              errorMessage: "",
              errorStatus: false,
            },
            MobileNumber: {
              value: "",
              errorMessage: "",
              errorStatus: false,
            },
            OrganizationRole: {
              value: "",
              errorMessage: "",
              errorStatus: false,
            },
            UserRole: {
              value: "",
              errorMessage: "",
              errorStatus: false,
            },
            Email: {
              value: "",
              errorMessage: "",
              errorStatus: false,
            },
          });
          setEditOrganization([]);
          setEditUserRole([]);
          dispatch(setEmailCheck(false));
        } else {
          await dispatch(setLoader(true));
          await handeEmailvlidate();
          await setAgainCall(true);
        }
      } else {
        setOpen({
          ...open,
          open: true,
          message: t("Email-should-be-in-email-format"),
        });
      }
    } else {
      setAddUserSection({
        ...addUserSection,
        Name: {
          value: addUserSection.Name.value,
          errorMessage: t("Name-is-required"),
          errorStatus: addUserSection.Name.value != "" ? false : true,
        },
        Designation: {
          value: addUserSection.Designation.value,
          errorMessage: t("Desgination-is-required"),
          errorStatus: addUserSection.Designation.value != "" ? false : true,
        },
        MobileNumber: {
          value: addUserSection.MobileNumber.value,
          errorMessage: t("Mobile-number-is-required"),
          errorStatus: addUserSection.MobileNumber.value != "" ? false : true,
        },
        OrganizationRole: {
          value: addUserSection.OrganizationRole.value,
          errorMessage: t("Organization-role-is-required"),
          errorStatus:
            addUserSection.OrganizationRole.value != "" ? false : true,
        },
        UserRole: {
          value: addUserSection.UserRole.value,
          errorMessage: t("User-role-is-required"),
          errorStatus: addUserSection.UserRole.value != "" ? false : true,
        },
        Email: {
          value: addUserSection.Email.value,
          errorMessage: t("Email-is-required"),
          errorStatus: addUserSection.Email.value != "" ? false : true,
        },
      });
      setOpen({
        ...open,
        open: true,
        message: t("Please-fill-all-the-fields"),
      });
    }
  };
  console.log(
    "addUserSection.OrganizationRole.value",
    addUserSection.UserRole.value
  );
  useEffect(() => {
    if (
      adminReducer.UpdateOrganizationMessageResponseMessage !== "" &&
      adminReducer.UpdateOrganizationMessageResponseMessage !==
        "" &&
      adminReducer.UpdateOrganizationMessageResponseMessage !==
        t(
          "User-created-successfully-and-the-otp-has-been-generated-please-verify-you-email"
        ) &&
      adminReducer.UpdateOrganizationMessageResponseMessage !==
        t("User-email-doesnt-exists")
    ) {
      console.log(
        "adminReduceradminReduceradminReducer",
        adminReducer.UpdateOrganizationMessageResponseMessage
      );
      setOpen({
        ...open,
        open: true,
        message: adminReducer.UpdateOrganizationMessageResponseMessage,
      });
      setTimeout(() => {
        setOpen({
          ...open,
          open: false,
          message: "",
        });
      }, 3000);

      dispatch(cleareMessage());
    } else if (
      adminReducer.AllOrganizationResponseMessage !== "" &&
      adminReducer.AllOrganizationResponseMessage !== t("Data-available") &&
      adminReducer.AllOrganizationResponseMessage !== "" &&
      adminReducer.AllOrganizationResponseMessage !==
        t(
          "User-created-successfully-and-the-otp-has-been-generated-please-verify-you-email"
        ) &&
      adminReducer.AllOrganizationResponseMessage !==
        t("User-email-doesnt-exists")
    ) {
      console.log(
        "adminReduceradminReduceradminReducer",
        adminReducer.AllOrganizationResponseMessage
      );

      setOpen({
        ...open,
        open: true,
        message: adminReducer.AllOrganizationResponseMessage,
      });
      setTimeout(() => {
        setOpen({
          ...open,
          open: false,
          message: "",
        });
      }, 3000);

      dispatch(cleareMessage());
    } else if (
      adminReducer.DeleteOrganizationMessageResponseMessage !== "" &&
      adminReducer.DeleteOrganizationMessageResponseMessage !== null &&
      adminReducer.DeleteOrganizationMessageResponseMessage !==
        "" &&
      adminReducer.DeleteOrganizationMessageResponseMessage !==
        t(
          "User-created-successfully-and-the-otp-has-been-generated-please-verify-you-email"
        ) &&
      adminReducer.DeleteOrganizationMessageResponseMessage !==
        t("User-email-doesnt-exists")
    ) {
      console.log(
        "adminReduceradminReduceradminReducer",
        adminReducer.DeleteOrganizationMessageResponseMessage
      );

      setOpen({
        ...open,
        open: true,
        message: adminReducer.DeleteOrganizationMessageResponseMessage,
      });
      setTimeout(() => {
        setOpen({
          ...open,
          open: false,
          message: "",
        });
      }, 3000);

      dispatch(cleareMessage());
    } else if (
      adminReducer.ResponseMessage !== "" &&
      adminReducer.ResponseMessage !== "" &&
      adminReducer.ResponseMessage !== t("Data-available") &&
      adminReducer.ResponseMessage !==
        t(
          "The-organization-has-been-created-successfully-and-the-otp-has-been-generated-please-verfiy-you-email"
        ) &&
      adminReducer.ResponseMessage !==
        t(
          "User-created-successfully-and-the-otp-has-been-generated-please-verify-you-email"
        ) &&
      adminReducer.ResponseMessage !==
        t(
          "The-organization-has-been-created-successfully-but-the-otp-has-not-been-generated"
        ) &&
      adminReducer.ResponseMessage !== t("User-email-doesnt-exists")
    ) {
      console.log(
        "adminReduceradminReduceradminReducer",
        adminReducer.ResponseMessage
      );

      setOpen({
        ...open,
        open: true,
        message: adminReducer.ResponseMessage,
      });
      setTimeout(() => {
        setOpen({
          ...open,
          open: false,
          message: "",
        });
      }, 3000);

      dispatch(cleareMessage());
    } else {
      dispatch(cleareMessage());
    }
  }, [
    adminReducer.UpdateOrganizationMessageResponseMessage,
    adminReducer.AllOrganizationResponseMessage,
    adminReducer.DeleteOrganizationMessageResponseMessage,
    adminReducer.ResponseMessage,
  ]);
  // for OK button IN Create modal
  const okCreateHandler = () => {
    setEditOrganization([]);
    setEditUserRole([]);
    setAddUserSection({
      ...addUserSection,
      Name: {
        value: "",
        errorMessage: "",
        errorStatus: false,
      },
      OrganizationName: {
        value: addUserSection.OrganizationName.value,
        errorMessage: "",
        errorStatus: false,
      },
      OrganizationRoleID: {
        value: addUserSection.OrganizationRoleID.value,
        errorMessage: "",
        errorStatus: false,
      },
      Designation: {
        value: "",
        errorMessage: "",
        errorStatus: false,
      },
      MobileNumber: {
        value: "",
        errorMessage: "",
        errorStatus: false,
      },
      OrganizationRole: {
        value: "",
        errorMessage: "",
        errorStatus: false,
      },
      UserRole: {
        value: "",
        errorMessage: "",
        errorStatus: false,
      },
      Email: {
        value: "",
        errorMessage: "",
        errorStatus: false,
      },
    });
    setEmailVerifyModal(false);
    setEmailUnique(false);
    dispatch(setEmailCheck(false));
  };

  //for OK button IN AllowLimit modal
  const okResetHandler = () => {
    setEditOrganization([]);
    setEditUserRole([]);
    setAddUserSection({
      ...addUserSection,
      Name: {
        value: "",
        errorMessage: "",
        errorStatus: false,
      },
      OrganizationName: {
        value: addUserSection.OrganizationName.value,
        errorMessage: "",
        errorStatus: false,
      },
      OrganizationRoleID: {
        value: addUserSection.OrganizationRoleID.value,
        errorMessage: "",
        errorStatus: false,
      },
      Designation: {
        value: "",
        errorMessage: "",
        errorStatus: false,
      },
      MobileNumber: {
        value: "",
        errorMessage: "",
        errorStatus: false,
      },
      OrganizationRole: {
        value: "",
        errorMessage: "",
        errorStatus: false,
      },
      UserRole: {
        value: "",
        errorMessage: "",
        errorStatus: false,
      },
      Email: {
        value: "",
        errorMessage: "",
        errorStatus: false,
      },
    });
    setAllowedLimitModal(false);
    dispatch(setEmailCheck(false));
    setEmailUnique(false);
  };

  // for Reset Button modal
  const resetModalHandler = async () => {
    setSelected("US");
    setEditOrganization([]);
    setEditUserRole([]);
    setAddUserSection({
      Name: {
        value: "",
        errorMessage: "",
        errorStatus: false,
      },
      OrganizationName: {
        value: addUserSection.OrganizationName.value,
        errorMessage: "",
        errorStatus: false,
      },
      OrganizationRoleID: {
        value: addUserSection.OrganizationRoleID.value,
        errorMessage: "",
        errorStatus: false,
      },
      Designation: {
        value: "",
        errorMessage: "",
        errorStatus: false,
      },
      MobileNumber: {
        value: "",
        errorMessage: "",
        errorStatus: false,
      },
      OrganizationRole: {
        value: "",
        errorMessage: "",
        errorStatus: false,
      },
      UserRole: {
        value: "",
        errorMessage: "",
        errorStatus: false,
      },
      Email: {
        value: "",
        errorMessage: "",
        errorStatus: false,
      },
    });
    setEmailUnique(false);
    dispatch(setEmailCheck(false));
  };

  //for remove the grid from backgroun
  const options = {
    backgroundColor: "transparent",
    border: "1px solid #ffffff",
    // strokeWidth: "10px",
    hAxis: {
      viewWindow: {
        min: 0, // for space horizontally between bar
        max: 4, // for space horizontally between bar
      },
      textStyle: {
        color: "#000000",
        // this will change the color of the text to white
        fontSize: 11, // this will change the font size of the text to 12px
      },
    },
    legend: "none",
    vAxis: {
      textPosition: "none",
      gridlines: {
        count: 0,
        background: "transparent",
      },
    },

    bar: {
      groupWidth: "95%",
    },
  };
  // for spinner in bar chart
  useEffect(() => {
    let OrganizationID = localStorage.getItem("organizationID");
    let RequestingUserID = localStorage.getItem("userID");
    if (OrganizationID !== undefined && RequestingUserID !== undefined) {
      let Data = {
        OrganizationID: parseInt(OrganizationID),
        RequestingUserID: parseInt(RequestingUserID),
      };
      let newData = { OrganizationID: parseInt(OrganizationID) };
      dispatch(OrganizationUserListStatisticsAction(navigate, Data, t));
      dispatch(GetOrganizationByID(navigate, newData, t));
    }
  }, []);

  useEffect(() => {
    if (!adminReducer.Loading) {
      if (Object.keys(adminReducer.TotalUserListsData).length > 0) {
        const data = [
          ["Element", "Users", { role: "style" }, { role: "annotation" }],
          [
            "Enabled Users",
            parseInt(adminReducer.TotalUserListsData.enabledUsers),

            "stroke-color: #6DE595; stroke-opacity: 1 ;  fill-color: #6DE595; fill-opacity:1",
            adminReducer.TotalUserListsData.enabledUsers.toString(),
          ], // RGB value
          [
            "Disabled Users",
            parseInt(adminReducer.TotalUserListsData.disabledUsers),
            "stroke-color: #F16B6B; stroke-opacity: 1 ; stroke-color:#F16B6B; fill-color: #F16B6B; fill-opacity:1; text-color:#F16B6B",
            adminReducer.TotalUserListsData.disabledUsers.toString(),
          ], // English color name
          [
            "Locked Users",
            parseInt(adminReducer.TotalUserListsData.lockedUsers),
            "stroke-color: #000; stroke-opacity: 1 ; stroke-color:#000000; fill-color: #000000; fill-opacity:1",
            adminReducer.TotalUserListsData.lockedUsers.toString(),
          ],
          [
            "Dormant Users",
            parseInt(adminReducer.TotalUserListsData.dormantUsers),
            "stroke-color: #000; stroke-opacity: 1 ; stroke-color:#949494; fill-color: #949494; fill-opacity:1",
            adminReducer.TotalUserListsData.dormantUsers.toString(),
          ], // CSS-style declaration
        ];
        let packageAllowedBoardMemberUsers = parseInt(
          adminReducer.TotalUserListsData.packageAllowedBoardMemberUsers
        );
        let packageAllowedAdminUsers = parseInt(
          adminReducer.TotalUserListsData.packageAllowedAdminUsers
        );
        let packageAllowedOtherUsers = parseInt(
          adminReducer.TotalUserListsData.packageAllowedOtherUsers
        );
        setTotalBarCount(
          parseInt(
            packageAllowedBoardMemberUsers +
              packageAllowedAdminUsers +
              packageAllowedOtherUsers
          )
        );
        let packageActiveBoardMemberUsers = parseInt(
          adminReducer.TotalUserListsData.boardMemberUsers
        );
        let packageActiveAdminUsers = parseInt(
          adminReducer.TotalUserListsData.adminUsers
        );
        let packageActiveOtherUsers = parseInt(
          adminReducer.TotalUserListsData.otherUsers
        );
        console.log(
          "packageActiveBoardMemberUserspackageActiveBoardMemberUsers",
          packageActiveBoardMemberUsers
        );
        console.log(
          "packageActiveBoardMemberUserspackageActiveBoardMemberUsers",
          packageActiveAdminUsers
        );
        console.log(
          "packageActiveBoardMemberUserspackageActiveBoardMemberUsers",
          packageActiveOtherUsers
        );
        console.log(
          "packageActiveBoardMemberUserspackageActiveBoardMemberUsers",
          packageAllowedBoardMemberUsers
        );
        console.log(
          "packageActiveBoardMemberUserspackageActiveBoardMemberUsers",
          packageAllowedAdminUsers
        );
        console.log(
          "packageActiveBoardMemberUserspackageActiveBoardMemberUsers",
          packageAllowedOtherUsers
        );
        setTotalActiveBarCount(
          parseInt(
            packageActiveBoardMemberUsers +
              packageActiveAdminUsers +
              packageActiveOtherUsers
          )
        );
        setDataa(data);
        if (
          parseInt(
            packageActiveBoardMemberUsers +
              packageActiveAdminUsers +
              packageActiveOtherUsers
          ) >
          parseInt(
            packageAllowedBoardMemberUsers +
              packageAllowedAdminUsers +
              packageAllowedOtherUsers
          )
        ) {
          seLimitBreach(1);
        } else {
          seLimitBreach(0);
        }
      }
    }
  }, [adminReducer.TotalUserListsData]);

  useEffect(() => {
    if (Object.keys(dataa).length > 0) {
      setLoading(false);
    } else {
      if (roleListReducer.ResponseMessage === t("Something-went-wrong")) {
        setLoading(false);
      }
    }
  }, [dataa]);

  useEffect(() => {
    let OrganizationName = localStorage.getItem("organizatioName");
    if (
      OrganizationName !== "" &&
      OrganizationName !== null &&
      OrganizationName !== undefined
    ) {
      setOrganizationName(OrganizationName);
      setAddUserSection({
        ...addUserSection,
        OrganizationName: {
          value: OrganizationName,
          errorMessage: "",
          errorStatus: false,
        },
      });
    }
  }, [organizationName]);

  useEffect(() => {
    let tem = [];
    if (Object.keys(roleListReducer.OrganaizationRolesList).length > 0) {
      roleListReducer.OrganaizationRolesList.map((data, index) => {
        let op = { value: data.pK_OrganizationRoleID, label: data.roleName };
        tem.push(op);
      });
      setOrganaizationRolesOptions(tem);

      if (roleListReducer.OrganaizationName.organizationName !== "") {
        setAddUserSection({
          ...addUserSection,
          OrganizationRoleID: {
            value: parseInt(
              roleListReducer.OrganaizationName.pK_OrganizationID
            ),
            errorMessage: "",
            errorStatus: false,
          },
        });
      }
    }
  }, [roleListReducer.OrganaizationRolesList]);

  useEffect(() => {
    let tem = [];
    if (Object.keys(roleListReducer.UserRolesList).length > 0) {
      roleListReducer.UserRolesList.map((data, index) => {
        let op = { value: data.pK_URID, label: data.roleName };
        tem.push(op);
      });

      setUserRolesListNameOptions(tem);
    }
  }, [roleListReducer.UserRolesList]);

  const OrganaizationRoleHandler = async (selectedOptions) => {
    if (editUserRole != "") {
      if (selectedOptions.value === 4) {
        if (addUserSection.UserRole.value === 2) {
          setEditOrganization(selectedOptions);
          if (Object.keys(selectedOptions).length > 0) {
            setAddUserSection({
              ...addUserSection,
              OrganizationRole: {
                value: parseInt(selectedOptions.value),
                errorMessage: "",
                errorStatus: false,
              },
            });
          } else {
            setAddUserSection({
              ...addUserSection,
              OrganizationRole: {
                value: "",
                errorMessage: t("OrganizationRole-number-is-required"),
                errorStatus: true,
              },
            });
          }
        } else {
          setOpen({
            ...open,
            open: true,
            message: t("This-user-role-can-not-be-organization-admin"),
          });
          setTimeout(() => {
            setOpen({
              ...open,
              open: false,
              message: "",
            });
          }, 3000);
          setEditOrganization([]);
          setAddUserSection({
            ...addUserSection,
            OrganizationRole: {
              value: "",
              errorMessage: "",
              errorStatus: false,
            },
          });
        }
      } else if (selectedOptions.value != 4) {
        if (addUserSection.UserRole.value != 2) {
          setEditOrganization(selectedOptions);
          if (Object.keys(selectedOptions).length > 0) {
            setAddUserSection({
              ...addUserSection,
              OrganizationRole: {
                value: parseInt(selectedOptions.value),
                errorMessage: "",
                errorStatus: false,
              },
            });
          } else {
            setAddUserSection({
              ...addUserSection,
              OrganizationRole: {
                value: "",
                errorMessage: t("OrganizationRole-number-is-required"),
                errorStatus: true,
              },
            });
          }
        } else {
          setOpen({
            ...open,
            open: true,
            message: t(
              "This-user-role-can-not-be-other-then-organization-admin"
            ),
          });
          setTimeout(() => {
            setOpen({
              ...open,
              open: false,
              message: "",
            });
          }, 3000);
          setEditOrganization([]);
          setAddUserSection({
            ...addUserSection,
            OrganizationRole: {
              value: "",
              errorMessage: "",
              errorStatus: false,
            },
          });
        }
      } else {
      }
      // UserRole;
    } else {
      setEditOrganization(selectedOptions);
      if (Object.keys(selectedOptions).length > 0) {
        setAddUserSection({
          ...addUserSection,
          OrganizationRole: {
            value: parseInt(selectedOptions.value),
            errorMessage: "",
            errorStatus: false,
          },
        });
      } else {
        setAddUserSection({
          ...addUserSection,
          OrganizationRole: {
            value: "",
            errorMessage: t("OrganizationRole-number-is-required"),
            errorStatus: true,
          },
        });
      }
    }
  };

  // to change select border color functionality
  const borderChanges = {
    control: (base, state) => ({
      ...base,
      border: "1px solid #e1e1e1 !important",
      borderRadius: "4px !important",
      boxShadow: "0 !important",
      "&:focus-within": {
        border: "1px solid #e1e1e1 !important",
      },
    }),
  };

  const UserRoleHandler = async (selectedOptions) => {
    if (editOrganization != "") {
      if (selectedOptions.value === 2) {
        if (addUserSection.OrganizationRole.value === 4) {
          setEditUserRole(selectedOptions);
          if (Object.keys(selectedOptions).length > 0) {
            setAddUserSection({
              ...addUserSection,
              UserRole: {
                value: parseInt(selectedOptions.value),
                errorMessage: "",
                errorStatus: false,
              },
            });
          } else {
            setAddUserSection({
              ...addUserSection,
              UserRole: {
                value: "",
                errorMessage: t("UserRole-number-is-required"),
                errorStatus: true,
              },
            });
          }
        } else {
          setOpen({
            ...open,
            open: true,
            message: t("Selected-organaization-role-can-only-be-user"),
          });
          setTimeout(() => {
            setOpen({
              ...open,
              open: false,
              message: "",
            });
          }, 3000);
          setEditUserRole("");
          setAddUserSection({
            ...addUserSection,
            UserRole: {
              value: "",
              errorMessage: "",
              errorStatus: false,
            },
          });
        }
      } else if (parseInt(selectedOptions.value) != 2) {
        if (parseInt(addUserSection.OrganizationRole.value) != 4) {
          setEditUserRole(selectedOptions);
          if (Object.keys(selectedOptions).length > 0) {
            setAddUserSection({
              ...addUserSection,
              UserRole: {
                value: parseInt(selectedOptions.value),
                errorMessage: "",
                errorStatus: false,
              },
            });
          } else {
            setAddUserSection({
              ...addUserSection,
              UserRole: {
                value: "",
                errorMessage: t("UserRole-number-is-required"),
                errorStatus: true,
              },
            });
          }
        } else {
          setOpen({
            ...open,
            open: true,
            message: t("Selected-organaization-role-can-not-be-user"),
          });
          setTimeout(() => {
            setOpen({
              ...open,
              open: false,
              message: "",
            });
          }, 3000);
          setEditUserRole([]);
          setAddUserSection({
            ...addUserSection,
            UserRole: {
              value: "",
              errorMessage: "",
              errorStatus: false,
            },
          });
        }
      }
    } else {
      setEditUserRole(selectedOptions);
      if (Object.keys(selectedOptions).length > 0) {
        setAddUserSection({
          ...addUserSection,
          UserRole: {
            value: parseInt(selectedOptions.value),
            errorMessage: "",
            errorStatus: false,
          },
        });
      } else {
        setAddUserSection({
          ...addUserSection,
          UserRole: {
            value: "",
            errorMessage: t("UserRole-number-is-required"),
            errorStatus: true,
          },
        });
      }
    }
  };

  let emailValue = localStorage.getItem("EmailValue");

  return (
    <>
      <Container className="limit-reached-container">
        {limitBreach > 0 ? (
          <Subscriptionwarninglimit
            rowClassNameWarning="row-warning-message"
            text={t("You-have-reached-the-allowed-limit")}
            textStyle="row-warning-text"
          />
        ) : null}

        {/* <Paper className={styles["papercolor-adduser"]}> */}
        <Row className="Add-User-Limit">
          <Col lg={6} md={6} sm={12} xs={12} className="mt-2">
            <Container>
              <>
                <Row>
                  <Col lg={12} md={12} sm={12} xs={12} className="mt-2">
                    <label className={styles["addUser-Heading"]}>
                      {t("Add-user")}
                    </label>
                  </Col>
                </Row>
                <Row>
                  <Col lg={9} md={9} sm={12} xs={12} className="mt-2">
                    <div className={styles["chartbarBorder-adduser"]}>
                      {loading ? (
                        <div>
                          <Row className="mt-5 mb-5">
                            <Col
                              lg={6}
                              md={6}
                              sm={6}
                              xs={12}
                              className="d-flex justify-content-end ms-4 mt-5 mb-5"
                            >
                              <Spin />
                            </Col>
                          </Row>
                        </div>
                      ) : (
                        <Chart
                          // controls={false}
                          chartType="ColumnChart"
                          width="100%"
                          height="250px"
                          radius={10}
                          data={dataa}
                          options={options}
                          className={styles["Addchart"]}
                        />
                      )}
                      {loading ? null : (
                        <Row className="d-flex justify-content-center">
                          <Col
                            lg={8}
                            md={8}
                            sm={8}
                            xs={12}
                            className="color-5a5a5a font-14 Saved_money_Tagline"
                          >
                            {totalActiveBarCount} {t("Of")} {totalBarCount}{" "}
                            {t("Users")}
                          </Col>
                        </Row>
                      )}
                      {loading ? null : (
                        <Row className="d-flex justify-content-center">
                          <Col lg={8} md={8} sm={8} xs={12}>
                            <ProgressBar
                              now={totalActiveBarCount}
                              max={totalBarCount}
                              className={styles["AddProgressBar"]}
                            />
                          </Col>
                        </Row>
                      )}

                      {loading ? null : (
                        <Row>
                          <Col lg={8} md={8} sm={8} xs={12} className="">
                            <label className={styles["labelChart-Title"]}>
                              {t("Board-member")}
                            </label>
                          </Col>
                          <Col lg={4} md={4} sm={4} xs={12}>
                            <label className={styles["labelChart-Number"]}>
                              {adminReducer.TotalUserListsData
                                .packageAllowedBoardMemberUsers !== undefined
                                ? adminReducer.TotalUserListsData
                                    .boardMemberUsers +
                                  "/" +
                                  adminReducer.TotalUserListsData
                                    .packageAllowedBoardMemberUsers
                                : 0 + "/" + 0}
                            </label>
                          </Col>
                          <div className={styles["borderLine-title"]} />
                        </Row>
                      )}
                      {loading ? null : (
                        <Row>
                          <Col lg={8} md={8} sm={8} xs={12} className="">
                            <label className={styles["Admin-labelChart-Title"]}>
                              {t("Admin-member")}
                            </label>
                          </Col>
                          <Col lg={4} md={4} sm={4} xs={12}>
                            <label
                              className={styles["Admin-labelChart-Number"]}
                            >
                              {adminReducer.TotalUserListsData
                                .packageAllowedAdminUsers !== undefined
                                ? adminReducer.TotalUserListsData.adminUsers +
                                  "/" +
                                  adminReducer.TotalUserListsData
                                    .packageAllowedAdminUsers
                                : 0 + "/" + 0}
                            </label>
                          </Col>
                          <div className={styles["borderLine-title"]} />
                        </Row>
                      )}
                      {loading ? null : (
                        <Row>
                          <Col lg={8} md={8} sm={8} xs={12} className="">
                            <label
                              className={styles["Admin-labelChart-Title"]}
                              // className={styles["labelChart-Remain-Title"]}
                            >
                              {t("Client-member")}
                            </label>
                          </Col>
                          <Col lg={4} md={4} sm={4} xs={12}>
                            <label
                              // className={styles["labelChart-RemainNum"]}
                              className={styles["Admin-labelChart-Number"]}
                            >
                              {adminReducer.TotalUserListsData
                                .packageAllowedOtherUsers !== undefined
                                ? adminReducer.TotalUserListsData.otherUsers +
                                  "/" +
                                  adminReducer.TotalUserListsData
                                    .packageAllowedOtherUsers
                                : 0 + "/" + 0}
                            </label>
                          </Col>
                        </Row>
                      )}
                    </div>
                  </Col>
                </Row>
              </>
            </Container>
          </Col>

          <Col
            lg={6}
            md={6}
            sm={12}
            xs={12}
            className="ms-auto"
            style={{ marginTop: "10px" }}
          >
            {/* <Form> */}
            <Container className="mt-5">
              <>
                <Row>
                  <Col
                    lg={6}
                    md={6}
                    sm={6}
                    xs={12}
                    className="d-flex justify-content-start"
                  >
                    <label className={styles["addUserlabel1"]}>
                      {t("Name")}
                    </label>
                  </Col>
                  <Col lg={6} md={6} sm={6} xs={12}>
                    <Row className="mt-3">
                      <Col sm={12} md={12} lg={12}>
                        <Form.Control
                          className={styles["formcontrol-name-fieldssss"]}
                          ref={Name}
                          onKeyDown={(event) =>
                            enterKeyHandler(event, Designation)
                          }
                          name="Name"
                          placeholder={t("Name")}
                          maxLength={200}
                          applyClass="form-control2"
                          onChange={AddUserHandler}
                          value={addUserSection.Name.value}
                        />
                        <span
                          className=" color-5a5a5a Saved_money_Tagline"
                          style={{ fontSize: "0.5rem" }}
                        >
                          ({t("Maximum-characters-200-alphabets-only")})
                        </span>
                      </Col>
                      <Col sm={12} md={12} lg={12}>
                        <p
                          className={
                            addUserSection.Name.errorStatus &&
                            addUserSection.Name.value === ""
                              ? ` ${styles["errorMessage"]} `
                              : `${styles["errorMessage_hidden"]}`
                          }
                        >
                          {addUserSection.Name.errorMessage}
                        </p>{" "}
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <Row>
                  <Col
                    lg={6}
                    md={6}
                    sm={6}
                    xs={12}
                    className="d-flex justify-content-start"
                  >
                    <label className={styles["addUserlabel2"]}>
                      {t("Organization")}
                    </label>
                  </Col>
                  <Col
                    lg={6}
                    md={6}
                    sm={6}
                    xs={12}
                    className="d-flex justify-content-center"
                  >
                    <Form.Control
                      className={styles["formcontrol-name-fieldssss"]}
                      ref={Organization}
                      onKeyDown={(event) => enterKeyHandler(event, Designation)}
                      placeholder={t("Organization")}
                      applyClass="form-control2"
                      disabled
                      value={addUserSection.OrganizationName.value}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col
                    lg={6}
                    md={6}
                    sm={6}
                    xs={12}
                    className="d-flex justify-content-start"
                  >
                    <label className={styles["addUserlabel3"]}>
                      {t("Designation")}
                    </label>
                  </Col>
                  <Col lg={6} md={6} sm={6} xs={12}>
                    <Row>
                      <Col sm={12} md={12} lg={12}>
                        <Form.Control
                          className={styles["formcontrol-name-fieldssss"]}
                          ref={Designation}
                          onKeyDown={(event) =>
                            enterKeyHandler(event, MobileNumber)
                          }
                          name="Designation"
                          placeholder={t("Designation")}
                          maxLength={200}
                          applyClass="form-control2"
                          onChange={AddUserHandler}
                          value={addUserSection.Designation.value}
                        />
                      </Col>
                      <Col sm={12} md={12} lg={12}>
                        <p
                          className={
                            addUserSection.Designation.errorStatus &&
                            addUserSection.Designation.value === ""
                              ? ` ${styles["errorMessage"]} `
                              : `${styles["errorMessage_hidden"]}`
                          }
                        >
                          {addUserSection.Designation.errorMessage}
                        </p>
                      </Col>
                    </Row>
                  </Col>
                </Row>

                <Row>
                  <Col lg={6} md={6} sm={6} xs={12}>
                    <label className={styles["addUserlabel4"]}>
                      {t("Mobile-number")}
                    </label>
                  </Col>

                  <Col lg={6} md={6} sm={6} xs={6}>
                    <Row>
                      <Col
                        lg={4}
                        md={4}
                        sm={4}
                        xs={12}
                        className={styles["react-flag"]}
                      >
                        <ReactFlagsSelect
                          name="reactFlag"
                          ref={reactFlag}
                          fullWidth={false}
                          onOpen={handleDropdownOpen}
                          // onClick={onClickHandler}
                          selected={selected}
                          selectedCountry={selectedCountry}
                          // autoFocus={true}
                          // defaultCountry={showCountry}
                          selectedSize={8}
                          onSelect={handleSelect}
                          searchable={true}
                          placeholder={"Select Co...."}
                          customLabels={countryNameforPhoneNumber}
                          // className={styles["react-flag"]}
                        />
                      </Col>
                      <Col lg={8} md={8} sm={8} xs={12}>
                        <Form.Control
                          ref={MobileNumber}
                          onKeyDown={(event) =>
                            enterKeyHandler(event, OrganizationRole)
                          }
                          placeholder={t("Enter-phone-number")}
                          className={
                            styles["formcontrol-Phone-Input-Textfield"]
                          }
                          applyClass="form-control2"
                          onChange={AddUserHandler}
                          maxLength={15}
                          minLength={4}
                          name="MobileNumber"
                          value={addUserSection.MobileNumber.value || ""}
                        />
                      </Col>
                      <Col>
                        <p
                          className={
                            addUserSection.MobileNumber.errorStatus &&
                            addUserSection.MobileNumber.value === ""
                              ? ` ${styles["errorMessage"]} `
                              : `${styles["errorMessage_hidden"]}`
                          }
                        >
                          {addUserSection.MobileNumber.errorMessage}
                        </p>
                        {/* {addUserSection.MobileNumber.value != "" && (
                          <p
                            className={
                              (addUserSection.MobileNumber.errorStatus &&
                                addUserSection.MobileNumber.value === "") ||
                              (addUserSection.MobileNumber.errorMessage !==
                                "" &&
                                addUserSection.MobileNumber.errorMessage !==
                                  t("User-mobile-doesnt-exists"))
                                ? ` ${styles["errorMessage"]} `
                                : `${styles["errorMessage_hidden"]}`
                            }
                          >
                            {addUserSection.MobileNumber.errorMessage}
                          </p>
                        )} */}
                      </Col>
                    </Row>
                  </Col>
                </Row>

                <Row>
                  <Col
                    lg={6}
                    md={6}
                    sm={6}
                    xs={12}
                    className="d-flex justify-content-start"
                  >
                    <label className={styles["addUserlabel5"]}>
                      {t("Organization-role")}
                    </label>
                  </Col>

                  <Col lg={6} md={6} sm={6} xs={12}>
                    <Row>
                      <Col
                        lg={12}
                        md={12}
                        sm={12}
                        xs={12}
                        className={"Select-box-column"}
                      >
                        <Select
                          ref={OrganizationRole}
                          name="OrganizationRole"
                          onKeyDown={(event) =>
                            enterKeyHandler(event, UserRole)
                          }
                          options={organaizationRolesOptions}
                          onChange={OrganaizationRoleHandler}
                          value={editOrganization}
                          placeholder={t("Please-select-one-option")}
                          className={styles["selectbox-height-organization"]}
                          // applyClass="form-control2"
                          styles={borderChanges}
                        />
                      </Col>
                      <Col>
                        {Object.keys(addUserSection.OrganizationRole.value)
                          .length === 0 && (
                          <p
                            className={
                              addUserSection.OrganizationRole.errorStatus &&
                              Object.keys(addUserSection.OrganizationRole.value)
                                .length === 0
                                ? ` ${styles["errorMessage"]} `
                                : `${styles["errorMessage_hidden"]}`
                            }
                          >
                            {addUserSection.OrganizationRole.errorMessage}
                          </p>
                        )}
                      </Col>
                    </Row>
                  </Col>
                </Row>

                <Row>
                  <Col
                    lg={6}
                    md={6}
                    sm={6}
                    xs={12}
                    className="d-flex justify-content-start"
                  >
                    <label className={styles["addUserlabel6"]}>
                      {t("User-role")}
                    </label>
                  </Col>

                  <Col lg={6} md={6} sm={6} xs={12}>
                    <Row className="mt-3">
                      <Col
                        lg={12}
                        md={12}
                        sm={12}
                        xs={12}
                        className={"Select-box-column"}
                      >
                        <Select
                          ref={UserRole}
                          onKeyDown={(event) => enterKeyHandler(event, Email)}
                          options={userRolesListNameOptions}
                          onChange={UserRoleHandler}
                          value={editUserRole}
                          placeholder={t("Please-select-one-option")}
                          className={styles["selectbox-height-organization"]}
                          applyClass="form-control2"
                          styles={borderChanges}
                        />
                      </Col>
                      <Col>
                        {Object.keys(addUserSection.UserRole.value).length ===
                          0 && (
                          <p
                            className={
                              addUserSection.UserRole.errorStatus &&
                              Object.keys(addUserSection.UserRole.value)
                                .length === 0
                                ? ` ${styles["errorMessage"]} `
                                : `${styles["errorMessage_hidden"]}`
                            }
                          >
                            {addUserSection.UserRole.errorMessage}
                          </p>
                        )}
                      </Col>
                    </Row>
                  </Col>
                </Row>

                <Row>
                  <Col
                    lg={6}
                    md={6}
                    sm={6}
                    xs={12}
                    className="d-flex justify-content-start"
                  >
                    <label className={styles["addUserlabel7"]}>
                      {t("Email")}
                    </label>
                  </Col>

                  <Col lg={6} md={6} sm={6} xs={12}>
                    <Row>
                      <Col
                        sm={12}
                        md={12}
                        lg={12}
                        className={styles["emailcheckbox"]}
                      >
                        <Form.Control
                          ref={Email}
                          className={styles["formcontrol-name-fieldssss"]}
                          onBlur={() => {
                            handeEmailvlidate();
                          }}
                          name="Email"
                          placeholder={t("Email")}
                          onChange={AddUserHandler}
                          value={addUserSection.Email.value}
                          // onKeyDown={(event) => enterKeyHandler(event, Email)}
                          maxLength={160}
                          applyClass="form-control2"
                        />
                        <FormControl.Feedback className={styles["IconStyle"]}>
                          {isEmailUnique && addUserSection.Email.value != "" ? (
                            <img
                              draggable="false"
                              src={EmailVeriFyIcon}
                              className={styles["isEmailUnique"]}
                            />
                          ) : adminReducer.EmailCheckSpinner &&
                            addUserSection.Email.value != "" ? (
                            <Spinner className={styles["checkEmailSpinner"]} />
                          ) : null}
                        </FormControl.Feedback>
                      </Col>
                      <Row>
                        <Col>
                          {!isEmailUnique &&
                            addUserSection.Email.value != "" && (
                              <p
                                className={
                                  (addUserSection.Email.errorStatus &&
                                    addUserSection.Email.value === "") ||
                                  (addUserSection.Email.errorMessage !== "" &&
                                    addUserSection.Email.errorMessage !==
                                      t("User-email-doesnt-exists"))
                                    ? ` ${styles["errorMessage"]} `
                                    : `${styles["errorMessage_hidden"]}`
                                }
                              >
                                {addUserSection.Email.errorMessage}
                              </p>
                            )}
                        </Col>
                      </Row>
                    </Row>
                  </Col>
                </Row>

                <Row className="mt-5 py-4">
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    xs={12}
                    className="d-flex justify-content-end gap-2"
                  >
                    <Button
                      onClick={resetModalHandler}
                      className={styles["add-User-Reset-btn"]}
                      text={t("Reset")}
                    ></Button>
                    <Button
                      onClick={handleClick}
                      className={styles["Add-User-Create"]}
                      text={t("Create")}
                      disableBtn={
                        adminReducer.EmailCheck &&
                        addUserSection.Email.value !== ""
                          ? false
                          : true
                      }
                    ></Button>
                  </Col>
                </Row>

                <Modal
                  show={emailVerifyModal || allowLimitModal}
                  setShow={() => {
                    setAllowedLimitModal();
                    setEmailVerifyModal();
                  }}
                  ButtonTitle={ModalTitle}
                  centered
                  size={emailVerifyModal && allowLimitModal === "sm"}
                  modalHeaderClassName="close-modal-verification"
                  ModalBody={
                    <>
                      {emailVerifyModal ? (
                        <>
                          <Row>
                            <Col
                              lg={12}
                              md={12}
                              sm={12}
                              className="d-flex justify-content-center"
                            >
                              <p
                                className={
                                  styles["verification-email-modal-title"]
                                }
                              >
                                {t("Verification-email-sent")}
                              </p>
                            </Col>
                          </Row>

                          <Row>
                            <Col
                              lg={12}
                              md={12}
                              sm={12}
                              className="d-flex justify-content-center"
                            >
                              <p
                                className={
                                  styles["verification-email-modal-paragraph"]
                                }
                              >
                                {t("Please-check-your-inbox-email-send-to")}
                                <span
                                  style={{
                                    display: "block",
                                    textAlign: "center",
                                  }}
                                >
                                  {emailValue}
                                </span>
                              </p>
                            </Col>
                          </Row>

                          <Row>
                            <Col
                              lg={12}
                              md={12}
                              xs={12}
                              className="d-flex justify-content-center"
                            >
                              <Button
                                className={styles["Ok-modal-btn"]}
                                text={t("Ok")}
                                onClick={okCreateHandler}
                              />
                            </Col>
                          </Row>
                        </>
                      ) : allowLimitModal ? (
                        <>
                          <Row className="mt-2">
                            <Col
                              lg={12}
                              md={12}
                              sm={12}
                              className="d-flex justify-content-center"
                            >
                              <img
                                draggable="false"
                                src={VerificationFailedIcon}
                                width={60}
                                className={styles["allowModalIcon"]}
                              />
                            </Col>
                          </Row>
                          <Row>
                            <Col lg={12} md={12} sm={12}>
                              <p className={styles["allow-limit-modal-title"]}>
                                {t("You-have-reached-the-allowed-limit")}
                              </p>
                            </Col>
                          </Row>

                          <Row className="mt-4">
                            <Col
                              lg={12}
                              md={12}
                              xs={12}
                              className="d-flex justify-content-center"
                            >
                              <Button
                                className={styles["Ok-modal-btn"]}
                                text={t("Ok")}
                                onClick={okResetHandler}
                              />
                            </Col>
                          </Row>
                        </>
                      ) : null}
                    </>
                  }
                />
              </>
            </Container>
          </Col>
        </Row>
      </Container>
      <Notification setOpen={setOpen} open={open.open} message={open.message} />
      {roleListReducer.Loading ||
      LanguageReducer.Loading ||
      adminReducer.Loading ? (
        <Loader />
      ) : null}
    </>
  );
};

export default AddUser;
