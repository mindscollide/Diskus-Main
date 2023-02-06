import React, { useState, useRef, useEffect } from "react";
import styles from "./AddUser.module.css";
import { useSelector, useDispatch } from "react-redux";
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
import { Spin } from "antd";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import {
  validateEmail,
  validationEmail,
} from "../../../../commen/functions/validations";
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
import { getPackageExpiryDetail } from "../../../../store/actions/GetPackageExpirtyDetails";
import { checkEmailExsist } from "../../../../store/actions/Admin_Organization";

const AddUser = ({ show, setShow, ModalTitle }) => {
  //for translation
  const { t } = useTranslation();
  const [errorBar, setErrorBar] = useState(false);
  const [allowLimitModal, setAllowedLimitModal] = useState(false);
  const [emailVerifyModal, setEmailVerifyModal] = useState(false);
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const { adminReducer, roleListReducer } = state;
  //for spinner in bar chart
  const [loading, setLoading] = useState(true);
  const [dataa, setDataa] = useState([]);
  const [totalBarCount, setTotalBarCount] = useState(0);
  const [totalActiveBarCount, setTotalActiveBarCount] = useState(0);
  const [organizationName, setOrganizationName] = useState("");
  const [userRolesListNameOptions, setUserRolesListNameOptions] = useState([]);
  const [organaizationRolesOptions, setOrganaizationRolesOptions] = useState(
    []
  );

  const navigate = useNavigate();
  //For Enter Key
  const Name = useRef(null);
  const Organization = useRef(null);
  const Designation = useRef(null);
  const MobileNumber = useRef(null);
  const OrganizationRole = useRef(null);
  const UserRole = useRef(null);
  const Email = useRef(null);

  const [open, setOpen] = useState({
    open: false,
    message: "",
  });
  const [companyEmailValidate, setCompanyEmailValidate] = useState(false);
  const [companyEmailValidateError, setCompanyEmailValidateError] =
    useState("");
  const [isEmailUnique, setEmailUnique] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const handleSelect = (country) => {
    setSelectedCountry(country);
  };
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
  });
  const [againCall, setAgainCall] = useState(false);
  // Enter key handler
  const enterKeyHandler = (event, nextInput) => {
    if (event.key === "Enter") {
      nextInput.current.focus();
    }
  };

  //Validate Handler
  const AddUserHandler = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    if (name === "Name" && value !== "") {
      let valueCheck = value.replace(/[^a-zA-Z ]/g, "");
      if (valueCheck !== "") {
        setAddUserSection({
          ...addUserSection,
          Name: { value: valueCheck, errorMessage: "", errorStatus: false },
        });
      }
    } else if (name === "Name" && value === "") {
      setAddUserSection({
        ...addUserSection,
        Name: { value: "", errorMessage: "", errorStatus: false },
      });
    }
    if (name === "Designation" && value !== "") {
      let valueCheck = value.replace(/[^a-zA-Z ]/g, "");
      if (valueCheck !== "") {
        setAddUserSection({
          ...addUserSection,
          Designation: {
            value: valueCheck,
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
      console.log("valuevalueemailvaluevalueemail", value);
      if (value !== "") {
        setAddUserSection({
          ...addUserSection,
          Email: {
            value: value,
            errorMessage: "",
            errorStatus: false,
          },
        });
      }
    } else if (name === "Email" && value === "") {
      setAddUserSection({
        ...addUserSection,
        Email: {
          value: "",
          errorMessage: "",
          errorStatus: true,
        },
      });
    }
  };
  //  For Email Validation
  const handeEmailvlidate = () => {
    if (addUserSection.Email.value !== "") {
      if (validateEmail(addUserSection.Email.value)) {
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
      console.log("checkLoader");
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
      console.log("checkLoader");
      let createData = {
        UserName: addUserSection.Name.value,
        OrganizationName: addUserSection.OrganizationName.value,
        Designation: addUserSection.Designation.value,
        MobileNumber: addUserSection.MobileNumber.value,
        UserEmail: addUserSection.Email.value,
        OrganizationRoleID: addUserSection.OrganizationRole.value,
        OrganizationID: addUserSection.OrganizationRoleID.value,
        UserRoleID: addUserSection.UserRole.value,
      };

      dispatch(
        addUserAction(createData, setEmailVerifyModal, setAllowedLimitModal, t)
      );
      let OrganizationID = localStorage.getItem("organizationID");
      let RequestingUserID = localStorage.getItem("userID");
      if (OrganizationID !== undefined && RequestingUserID !== undefined) {
        let Data = {
          OrganizationID: parseInt(OrganizationID),
          RequestingUserID: parseInt(RequestingUserID),
        };
        let newData = { OrganizationID: parseInt(OrganizationID) };
        dispatch(OrganizationUserListStatisticsAction(Data, t));
        dispatch(GetOrganizationByID(newData, t));
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
      console.log("checkLoader");
      setAgainCall(false);
    }
  }, [adminReducer.EmailCheck]);

  const handleClick = async () => {
    console.log("checkLoader");

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
      console.log("checkLoader");

      if (validationEmail(addUserSection.Email.value)) {
        console.log("checkLoader");

        if (adminReducer.EmailCheck !== false) {
          console.log("checkLoader");

          let createData = {
            UserName: addUserSection.Name.value,
            OrganizationName: addUserSection.OrganizationName.value,
            Designation: addUserSection.Designation.value,
            MobileNumber: addUserSection.MobileNumber.value,
            UserEmail: addUserSection.Email.value,
            OrganizationRoleID: addUserSection.OrganizationRole.value,
            OrganizationID: addUserSection.OrganizationRoleID.value,
            UserRoleID: addUserSection.UserRole.value,
          };

          await dispatch(
            addUserAction(
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
            await dispatch(OrganizationUserListStatisticsAction(Data, t));
            await dispatch(GetOrganizationByID(newData, t));
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
          dispatch(setEmailCheck(false));
        } else {
          console.log("checkLoader", adminReducer.Loading);
          await dispatch(setLoader(true));
          await handeEmailvlidate();
          await setAgainCall(true);
        }
      } else {
        setOpen({
          ...open,
          open: true,
          message: t("Email-should-be-in-Email-Format"),
        });
      }
    } else {
      setAddUserSection({
        ...addUserSection,
        Name: {
          value: addUserSection.Name.value,
          errorMessage: "Name is required",
          errorStatus: true,
        },
        Designation: {
          value: addUserSection.Designation.value,
          errorMessage: "Desgination is required",
          errorStatus: true,
        },
        MobileNumber: {
          value: addUserSection.MobileNumber.value,
          errorMessage: "Mobile-number-is-required",
          errorStatus: true,
        },
        Email: {
          value: addUserSection.Email.value,
          errorMessage: "Email-is-required",
          errorStatus: true,
        },
      });
      setOpen({
        ...open,
        open: true,
        message: t("Please-fill-fields"),
      });
    }
  };

  useEffect(() => {
    if (adminReducer.UpdateOrganizationMessageResponseMessage !== "") {
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
    } else if (adminReducer.AllOrganizationResponseMessage !== "") {
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
    } else if (adminReducer.DeleteOrganizationMessageResponseMessage !== "") {
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
    } else if (adminReducer.ResponseMessage !== "") {
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
    let OrganizationID = localStorage.getItem("organizationID");
    let RequestingUserID = localStorage.getItem("userID");
    if (OrganizationID !== undefined && RequestingUserID !== undefined) {
      let Data = {
        OrganizationID: parseInt(OrganizationID),
        RequestingUserID: parseInt(RequestingUserID),
      };
      let newData = { OrganizationID: parseInt(OrganizationID) };
      dispatch(OrganizationUserListStatisticsAction(Data, t));
      dispatch(GetOrganizationByID(newData, t));
    }
    setEmailVerifyModal(false);
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
  };

  // for Create Button modal
  const createModalHandler = async () => {
    // setEmailVerifyModal(true);
  };

  // for Reset Button modal
  const resetModalHandler = async () => {
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
    dispatch(setEmailCheck(false));
  };

  // data for react google bar chart
  // const data = [
  //   ["Element", "Users", { role: "style" }, { role: "annotation" }],
  //   [
  //     "Enabled Users",
  //     4,
  //     "stroke-color: #ccc; stroke-opacity: 0.8 ; stroke-color: #ccc; fill-color: #4d4a4a; fill-opacity: 0.8",
  //     "04",
  //   ], // RGB value
  //   [
  //     "Disabled Users",
  //     1,
  //     "stroke-color: #ccc; stroke-opacity: 0.8 ; stroke-color: #ccc; fill-color: #4d4a4a; fill-opacity: 0.8",
  //     "01",
  //   ], // English color name
  //   [
  //     "Locked Users",
  //     2,
  //     "stroke-color: #ccc; stroke-opacity: 0.6 ; stroke-color: #ccc; fill-color: #4d4a4a; fill-opacity: 0.8",
  //     "02",
  //   ],
  //   [
  //     "Dormant Users",
  //     3,
  //     "stroke-color: #ccc; stroke-opacity: 0.6 ; stroke-color: #ccc; fill-color: #4d4a4a; fill-opacity: 0.8",
  //     "03",
  //   ], // CSS-style declaration
  // ];

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
        color: "#000000", // this will change the color of the text to white
        fontSize: 12, // this will change the font size of the text to 12px
      },
    },

    vAxis: {
      // viewWindow: {
      //   min: 0, // for space vertically between bar
      //   max: 5, // for space vertically between bar
      // },
      textPosition: "none",
      gridlines: {
        count: 0,
        background: "transparent",
      },
    },

    bar: {
      groupWidth: "95%",
    },
    // radius: {
    //   rx: "10px",
    // },
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
      dispatch(OrganizationUserListStatisticsAction(Data, t));
      dispatch(GetOrganizationByID(newData, t));
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
            "stroke-color: #ccc; stroke-opacity: 0.8 ; stroke-color: #ccc; fill-color: #ccc; fill-opacity: 0.8",
            adminReducer.TotalUserListsData.enabledUsers.toString(),
          ], // RGB value
          [
            "Disabled Users",
            parseInt(adminReducer.TotalUserListsData.disabledUsers),
            "stroke-color: #ccc; stroke-opacity: 0.8 ; stroke-color: #ccc; fill-color: #ccc; fill-opacity: 0.8",
            adminReducer.TotalUserListsData.disabledUsers.toString(),
          ], // English color name
          [
            "Locked Users",
            parseInt(adminReducer.TotalUserListsData.lockedUsers),
            "stroke-color: #ccc; stroke-opacity: 0.6 ; stroke-color: #ccc; fill-color: #4d4a4a; fill-opacity: 0.8",
            adminReducer.TotalUserListsData.lockedUsers.toString(),
          ],
          [
            "Dormant Users",
            parseInt(adminReducer.TotalUserListsData.dormantUsers),
            "stroke-color: #ccc; stroke-opacity: 0.6 ; stroke-color: #ccc; fill-color: #4d4a4a; fill-opacity: 0.8",
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
        setTotalActiveBarCount(
          parseInt(
            packageActiveBoardMemberUsers +
              packageActiveAdminUsers +
              packageActiveOtherUsers
          )
        );
        setDataa(data);
      }
    }
  }, [adminReducer.Loading]);

  useEffect(() => {
    if (Object.keys(dataa).length > 0) {
      setLoading(false);
    } else {
      if (roleListReducer.ResponseMessage === t("something-went-worng")) {
        setLoading(false);
      }
    }
  }, [dataa]);

  useEffect(() => {
    let OrganizationName = localStorage.getItem("OrganizatioName");
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
    }
  };

  const UserRoleHandler = async (selectedOptions) => {
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
    }
  };

  const PhoneHandler = async (selectedOptions) => {
    console.log("selectedOptions", selectedOptions);
    if (selectedOptions.phone !== "") {
      setAddUserSection({
        ...addUserSection,
        MobileNumber: {
          value: selectedOptions,
          errorMessage: "",
          errorStatus: false,
        },
      });
    } else {
      setAddUserSection({
        ...addUserSection,
        MobileNumber: {
          value: "",
          errorMessage: "",
          errorStatus: false,
        },
      });
    }
  };

  return (
    <>
      <Container>
        {totalActiveBarCount > totalBarCount ? (
          <Subscriptionwarningline text={t("Allowed-Limit-Reached")} />
        ) : null}

        {/* <Paper className={styles["papercolor-adduser"]}> */}
        <Row>
          <Col lg={6} md={6} sm={12} xs={12} className="mt-4">
            <Container>
              <>
                <Row>
                  <Col lg={12} md={12} sm={12} xs={12} className="mt-2">
                    <label className={styles["addUser-Heading"]}>
                      Add User
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
                          height="300px"
                          radius={10}
                          data={dataa}
                          options={options}
                          className={styles["Addchart"]}
                        />
                      )}
                      {loading ? null : (
                        <Row className="d-flex justify-content-center">
                          <Col lg={8} md={8} sm={8} xs={12}>
                            {totalActiveBarCount} of {totalBarCount} Users
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
                          <Col
                            lg={8}
                            md={8}
                            sm={8}
                            xs={12}
                            className="d-flex justify-content-center"
                          >
                            <label className={styles["labelChart-Title"]}>
                              Board Members
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
                          <Col
                            lg={8}
                            md={8}
                            sm={8}
                            xs={12}
                            className="d-flex justify-content-center"
                          >
                            <label className={styles["Admin-labelChart-Title"]}>
                              Admin Members
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
                          <Col
                            lg={8}
                            md={8}
                            sm={8}
                            xs={12}
                            className="d-flex justify-content-center"
                          >
                            <label
                              className={styles["Admin-labelChart-Title"]}
                              // className={styles["labelChart-Remain-Title"]}
                            >
                              Client Members
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

          <Col lg={6} md={6} sm={12} xs={12} className="ms-auto">
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
                    <Row>
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
                            enterKeyHandler(event, OrganizationRole)
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
                  <Col
                    lg={6}
                    md={6}
                    sm={6}
                    xs={12}
                    className="d-flex justify-content-start"
                  >
                    <label className={styles["addUserlabel4"]}>
                      {t("Mobile")}
                    </label>
                  </Col>

                  <Col
                    lg={6}
                    md={6}
                    sm={6}
                    xs={12}
                    className="d-flex justify-content-center"
                  >
                    <PhoneInput
                      ref={MobileNumber}
                      onChange={PhoneHandler}
                      className={styles["formcontrol-Phone-field"]}
                      maxLength={10}
                      placeholder={t("Enter-Phone-Number")}
                      value={addUserSection.MobileNumber.value}
                      name="MobileNumber"
                      countryCodeEditable={false}
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
                    <label className={styles["addUserlabel5"]}>
                      {t("Organization-Role")}
                    </label>
                  </Col>

                  <Col
                    lg={6}
                    md={6}
                    sm={6}
                    xs={12}
                    className="d-flex justify-content-center"
                  >
                    <Select
                      options={organaizationRolesOptions}
                      onChange={OrganaizationRoleHandler}
                      value={editOrganization}
                      placeholder={t("Please-Select-One-Option")}
                      className={styles["selectbox-height-organization"]}
                      applyClass="form-control2"
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
                    <label className={styles["addUserlabel6"]}>
                      {t("User-Role")}
                    </label>
                  </Col>

                  <Col
                    lg={6}
                    md={6}
                    sm={6}
                    xs={12}
                    className="d-flex justify-content-center"
                  >
                    <Select
                      options={userRolesListNameOptions}
                      onChange={UserRoleHandler}
                      value={editUserRole}
                      placeholder={t("Please-Select-One-Option")}
                      className={styles["selectbox-height-organization"]}
                      applyClass="form-control2"
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
                    <label className={styles["addUserlabel7"]}>
                      {t("Email")}
                    </label>
                  </Col>

                  <Col lg={6} md={6} sm={6} xs={12}>
                    <Row>
                      <Col sm={12} md={12} lg={12}>
                        <Form.Control
                          className={styles["formcontrol-name-fieldssss"]}
                          onBlur={() => {
                            handeEmailvlidate();
                          }}
                          name="Email"
                          ref={Email}
                          placeholder="Email"
                          onChange={AddUserHandler}
                          value={addUserSection.Email.value}
                          onKeyDown={(event) => enterKeyHandler(event, Name)}
                          maxLength={160}
                          applyClass="form-control2"
                        />
                      </Col>
                      <Row>
                        <Col>
                          {!isEmailUnique && (
                            <p
                              className={
                                (addUserSection.Email.errorStatus &&
                                  addUserSection.Email.value === "") ||
                                (addUserSection.Email.errorMessage !== "" &&
                                  addUserSection.Email.errorMessage !==
                                    t("User-email-doesn’t-exists"))
                                  ? ` ${styles["errorMessage"]} `
                                  : `${styles["errorMessage_hidden"]}`
                              }
                            >
                              {addUserSection.Email.errorMessage}
                            </p>
                          )}
                        </Col>
                      </Row>
                      {/* <Col sm={12} md={12} lg={12}>
                        <p
                          className={
                            addUserSection.Email.errorStatus &&
                            addUserSection.Email.value === ""
                              ? ` ${styles["errorMessage"]} `
                              : `${styles["errorMessage_hidden"]}`
                          }
                        >
                          {addUserSection.Email.errorMessage}
                        </p>
                      </Col> */}
                    </Row>
                  </Col>
                  <Col sm={12} md={1} lg={1}>
                    {adminReducer.EmailCheckSpinner ? (
                      <Spinner className={styles["checkEmailSpinner"]} />
                    ) : null}
                    {isEmailUnique && (
                      <Check2 className={styles["isEmailUnique"]} />
                    )}
                  </Col>
                </Row>

                <Row className="mt-5">
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
                                {t("Verification-Email-Sent")}
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
                                {t("Please-Check-Inbox")}
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
                                text={t("Ok-Title")}
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
                              <ExclamationTriangleFill
                                className={styles["allowModalIcon"]}
                                size={60}
                              />
                            </Col>
                          </Row>
                          <Row>
                            <Col lg={12} md={12} sm={12}>
                              <p className={styles["allow-limit-modal-title"]}>
                                {t("Allowed-Limit-Reached")}
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
                                text={t("Ok-Title")}
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
      {roleListReducer.Loading ? (
        <Loader />
      ) : adminReducer.Loading ? (
        <Loader />
      ) : null}
    </>
  );
};

export default AddUser;
