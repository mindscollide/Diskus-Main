import React, { useState, useRef, useEffect } from "react";
import styles from "./AllMeeting.module.css";
import {
  Button,
  TextField,
  FilterBar,
  SearchInput,
  Notification,
  Table,
  Loader,
  Modal,
} from "../../../../components/elements";
import "./../../../../i18n";
import { useTranslation } from "react-i18next";
import { Container, Row, Col, Form, Search } from "react-bootstrap";
import { Sliders2, Trash } from "react-bootstrap-icons";
// import { Select } from "antd";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
// import { dataMeeting } from "./../../AllUsers/EditUser/EditData";
import EditIcon from "../../../../assets/images/Edit-Icon.png";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import {
  OrganizationMeetings,
  deleteOrganiationMessage,
  GetMeetingStatus,
  updateOrganizationMeeting,
} from "../../../../store/actions/Admin_AllMeeting";
import moment from "moment";
import {
  removeDashesFromDate,
  TimeDisplayFormat,
} from "../../../../commen/functions/date_formater";
import { cleareMessage } from "../../../../store/actions/Admin_AddUser";

const AllMeetings = ({ show, setShow, ModalTitle }) => {
  //for translation
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [filterBarMeetingModal, setFilterBarMeetingModal] = useState(false);
  const [meetingModal, setMeetingModal] = useState(false);
  const [meetingDeleteModal, setMeetingDeleteModal] = useState(false);
  const navigate = useNavigate();
  const { adminReducer } = useSelector((state) => state);
  console.log("statestatemeeting", adminReducer);
  const [allMeetingData, setAllMeetingData] = useState([]);
  const [isMeetingId, setMeetingId] = useState(0);
  const [isMeetingStatusId, setMeetingStatusId] = useState(0);
  const [open, setOpen] = useState({
    flag: false,
    message: "",
  });
  //default value for table should be 50
  const [rowSize, setRowSize] = useState(50);
  const [meetingStatusOption, setMeetingStatusOption] = useState([]);
  const [meetingSelectedStatusOption, setMeetingSelectedStatusOption] =
    useState([]);

  //for enter key
  const Title = useRef(null);
  const Agenda = useRef(null);
  const Organizers = useRef(null);
  const Date = useRef(null);
  const Status = useRef(null);
  const Name = useRef(null);
  const Host = useRef(null);
  const Attendee = useRef(null);
  const From = useRef(null);
  const To = useRef(null);
  const Titles = useRef(null);
  const Agendas = useRef(null);
  const Statuses = useRef(null);

  // state for editMeetingModal
  const [modalMeetingStates, setModalMeetingStates] = useState({
    Title: "",
    Agenda: "",
    Status: "",
    Date: "",
    Host: "",
    Attendee: "",
    From: "",
    To: "",
  });
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [modalEditMeetingStates, setModalEditMeetingStates] = useState({
    Titles: "",
    Agendas: "",
    Organizers: "",
    DateTime: "",
    Statuses: "",
  });

  const [rows, setRows] = useState([]);

  // validations for fields
  const fieldValidate = (e) => {
    let name = e.target.name;
    let value = e.target.value;

    if (name === "Title" && value != "") {
      let valueCheck = value.replace(/[^a-zA-Z ]/g, "");
      if (valueCheck != "") {
        setModalMeetingStates({
          ...modalMeetingStates,
          Title: valueCheck.trimStart(),
        });
      }
    } else if (name === "Title" && value === "") {
      setModalMeetingStates({
        ...modalMeetingStates,
        Title: "",
      });
    }

    if (name === "Agenda" && value != "") {
      let valueCheck = value.replace(/[^a-zA-Z ]/g, "");
      if (valueCheck != "") {
        setModalMeetingStates({
          ...modalMeetingStates,
          Agenda: valueCheck.trimStart(),
        });
      }
    } else if (name === "Agenda" && value === "") {
      setModalMeetingStates({
        ...modalMeetingStates,
        Agenda: "",
      });
    }

    if (name === "Host" && value != "") {
      let valueCheck = value.replace(/[^a-zA-Z ]/g, "");
      if (valueCheck != "") {
        setModalMeetingStates({
          ...modalMeetingStates,
          Host: valueCheck.trimStart(),
        });
      }
    } else if (name === "Host" && value === "") {
      setModalMeetingStates({
        ...modalMeetingStates,
        Host: "",
      });
    }

    if (name === "Attendee" && value != "") {
      let valueCheck = value.replace(/[^a-zA-Z ]/g, "");
      if (valueCheck != "") {
        setModalMeetingStates({
          ...modalMeetingStates,
          Attendee: valueCheck.trimStart(),
        });
      }
    } else if (name === "Attendee" && value === "") {
      setModalMeetingStates({
        ...modalMeetingStates,
        Attendee: "",
      });
    }

    if (value === "Status" && value != "") {
      let valueCheck = value.replace("");
      if (valueCheck != "") {
        setModalMeetingStates({
          ...modalMeetingStates,
          Status: valueCheck,
        });
      }
    } else if (name === "Status" && value === "") {
      setModalMeetingStates({
        ...modalMeetingStates,
        Status: "",
      });
    }

    // for modaleditmeeting
    if (name === "Titles" && value != "") {
      let valueCheck = value.replace(/[^a-zA-Z ]/g, "");
      if (valueCheck != "") {
        setModalEditMeetingStates({
          ...modalEditMeetingStates,
          Titles: valueCheck,
        });
      }
    } else if (name === "Titles" && value === "") {
      setModalEditMeetingStates({
        ...modalEditMeetingStates,
        Titles: "",
      });
    }

    if (name === "Agendas" && value != "") {
      let valueCheck = value.replace(/[^a-zA-Z ]/g, "");
      if (valueCheck != "") {
        setModalEditMeetingStates({
          ...modalEditMeetingStates,
          Agendas: valueCheck,
        });
      }
    } else if (name === "Agendas" && value === "") {
      setModalEditMeetingStates({
        ...modalEditMeetingStates,
        Agendas: "",
      });
    }

    if (name === "Organizers" && value != "") {
      let valueCheck = value.replace(/[^a-zA-Z ]/g, "");
      if (valueCheck != "") {
        setModalEditMeetingStates({
          ...modalEditMeetingStates,
          Organizers: valueCheck,
        });
      }
    } else if (name === "Organizers" && value === "") {
      setModalEditMeetingStates({
        ...modalEditMeetingStates,
        Organizers: "",
      });
    }

    if (value === "Statuses" && value != "") {
      let valueCheck = value.replace("");
      if (valueCheck != "") {
        setModalEditMeetingStates({
          ...modalEditMeetingStates,
          Statuses: valueCheck,
        });
      }
    } else if (name === "Statuses" && value === "") {
      setModalEditMeetingStates({
        ...modalEditMeetingStates,
        Statuses: "",
      });
    }
  };
  const handleMeetingUpdate = () => {
    dispatch(updateOrganizationMeeting(isMeetingId, isMeetingStatusId, t));
    setMeetingModal(false);
  };
  const options = [
    { value: 1, title: t("Select-Roles") },
    { value: 2, title: t("Title") },
    { value: 3, title: t("Agenda") },
    { value: 4, title: t("Status") },
    { value: 5, title: t("Host") },
    { value: 6, title: t("Attendee") },
    { value: 7, title: t("Date-To-From") },
  ];

  // table meetings columns in allMeeting
  const AllMeetingColumn = [
    {
      title: t("Title"),
      dataIndex: "title",
      key: "title",
      // width: "50px",
      align: "left",
      sorter: (a, b) => a.title.localeCompare(b.title.toLowerCase),
      render: (text, record) => {
        return <p className={styles["meeting-title"]}>{text}</p>;
      },
    },
    {
      title: t("Agenda"),
      dataIndex: "agenda",
      key: "agenda",
      align: "left",
      render: (text, record) => {
        return (
          <p className={styles["agenda-title"]}>
            {record.meetingAgenda[0].objMeetingAgenda.title}
          </p>
        );
      },
    },
    {
      title: t("Status"),
      dataIndex: "status",
      key: "status",
      align: "left",
      render: (text, record) => {
        if (record.status === "1") {
          return <p className="m-0">UpComing</p>;
        } else if (record.status === "2") {
          return <p className="m-0">Start</p>;
        } else if (record.status === "3") {
          return <p className="m-0">End</p>;
        } else if (record.status === "4") {
          return <p className="m-0">Cancel</p>;
        } else if (record.status === "5") {
          return <p className="m-0">Reschudule</p>;
        } else if (record.status === "6") {
          return <p className="m-0">Close</p>;
        } else if (record.status === "7") {
          return <p className="m-0">Delete</p>;
        }
      },
    },
    {
      title: t("Host"),
      dataIndex: "host",
      key: "host",
      align: "left",
      sorter: (a, b) => a.host.localeCompare(b.host.toLowerCase),
    },
    {
      title: t("Date"),
      dataIndex: "dateOfMeeting",
      key: "dateOfMeeting",
      align: "left",
      render: (text, record) => {
        if (record.dateOfMeeting != null) {
          return moment(record.dateOfMeeting, "YYYYMMDD").format(
            "Do MMM, YYYY"
          );
        }
      },
    },
    // {
    //   // title: t("Edit"),
    //   dataIndex: "Edit",
    //   key: "Edit",
    //   align: "left",
    //   render: (text, record) => {
    //     console.log("textDelete123123", text, record);
    //     return (
    //       <i>
    //         <img
    //           src={EditIcon}
    //           onClick={() => handleEditOrganizatioMeeting(record)}
    //         />
    //       </i>
    //     );
    //   },
    // },
    {
      // title: t("Delete"),
      dataIndex: "Delete",
      key: "Delete",
      align: "left",
      render: (text, record) => {
        console.log("textDelete123123", text, record);
        return (
          <>
            <i>
              <Trash
                size={21}
                onClick={() => openDeleteModal(record.pK_MDID, record.status)}
              />
              <i className="ms-3">
                <img
                  src={EditIcon}
                  onClick={() => handleEditOrganizatioMeeting(record)}
                />
              </i>
            </i>
          </>
        );
      },
    },
  ];

  //for search datahandler
  // const searchHandler = (e) => {
  //   let name = e.target.name;
  //   let value = e.target.value;
  //   if (name === "Title") {
  //     setSearchModalData({
  //       ...searchModalData,
  //       [name]: value,
  //       // UserID: parseInt(UserID),
  //     });
  //   } else if (name === "Agenda") {
  //     setSearchModalData({
  //       ...searchModalData,
  //       [name]: value,
  //       // UserID: parseInt(UserID),
  //     });
  //   }
  // };

  //handler for enter key

  const enterKeyHandler = (event, nextInput) => {
    if (event.key === "Enter") {
      nextInput.current.focus();
    }
  };

  //open filter modal on icon click
  const openFilterModal = async () => {
    // setModalMeetingStates("");
    setFilterBarMeetingModal(true);
    setModalMeetingStates({
      Title: "",
      Agenda: "",
      Status: "",
      Date: "",
      Host: "",
      Attendee: "",
      From: "",
      To: "",
    });
    setToDate("");
    setFromDate("");
    setMeetingSelectedStatusOption([]);
  };

  // //Open modal on reset button it's created temperary to check modal
  // const openOnResetBtn = async () => {
  //   setMeetingModal(true);
  //   setModalEditMeetingStates("");
  // };
  const handleEditOrganizatioMeeting = (Data) => {
    console.log(Data, "DataDatadasdasj");
    let Time = TimeDisplayFormat(Data.meetingStartTime);
    setMeetingId(Data.pK_MDID);
    setMeetingModal(true);
    setModalEditMeetingStates({
      Titles: Data.title,
      Agendas: "",
      Organizers: Data.host,
      DateTime:
        moment(Data.dateOfMeeting, "YYYYMMDD").format("Do MMM, YYYY") +
        " " +
        Time,
      Status: JSON.parse(Data.status),
    });
  };
  console.log("setMeetingIdsetMeetingIdsetMeetingId", isMeetingId);
  //open Delete modal on click
  const openDeleteModal = async (meetingID, StatusID) => {
    console.log(meetingID, StatusID, "asdasdasd");
    setMeetingDeleteModal(true);
    setMeetingModal(false);
    setFilterBarMeetingModal(false);
    setMeetingId(meetingID);
    setMeetingStatusId(StatusID);
  };
  const handleMeetingAtendees = (a, modalMeetingStates) => {
    let newVAl = false;
    let arr = a.meetingAttendees.map((aA) => {
      if (
        aA.user.name
          .toLowerCase()
          .includes(modalMeetingStates.Attendee.toLowerCase())
      ) {
        newVAl = true;
      }
    });
    return newVAl;
  };
  const handleMeetingAgenda = (a, modalMeetingStates) => {
    let newVAl = false;

    let arr = a.meetingAgenda.map((aA) => {
      if (
        aA.objMeetingAgenda.title
          .toLowerCase()
          .includes(modalMeetingStates.toLowerCase())
      ) {
        newVAl = true;
      }
    });
    // let hasTrue = arr.some(function (val) {
    //   if (val === true) {
    //     newVAl = true;
    //   }
    // });
    return newVAl;
  };
  const handleAllMeetingAtendees = (a, value) => {
    let newVAl = false;
    let arr = a.meetingAttendees.map((aA) => {
      if (aA.user.name.toLowerCase().includes(value.toLowerCase())) {
        newVAl = true;
      }
    });
    console.log("value", newVAl);
    return newVAl;
  };
  const handleAllMeetingAgenda = (a, value) => {
    let newVAl = false;
    let arr = a.meetingAgenda.map((aA) => {
      if (
        aA.objMeetingAgenda.title.toLowerCase().includes(value.toLowerCase())
      ) {
        newVAl = true;
      }
    });
    return newVAl;
  };
  const searchFunc = () => {
    var y = [...allMeetingData];
    let x = y.filter((a) => {
      console.log("filter", a);
      console.log("filter", modalMeetingStates);
      return (
        (modalMeetingStates.Status != ""
          ? a.status
              .toLowerCase()
              .includes(modalMeetingStates.Status.toLowerCase())
          : a.status) &&
        (modalMeetingStates.Title != ""
          ? a.title
              .toLowerCase()
              .includes(modalMeetingStates.Title.toLowerCase())
          : a.title) &&
        (modalMeetingStates.Attendee != ""
          ? handleMeetingAtendees(a, modalMeetingStates)
          : a.meetingAttendees) &&
        (modalMeetingStates.Host != ""
          ? a.host.toLowerCase().includes(modalMeetingStates.Host.toLowerCase())
          : a.host) &&
        (modalMeetingStates.Agenda != ""
          ? handleMeetingAgenda(a, modalMeetingStates)
          : a.meetingAgenda) &&
        (modalMeetingStates.From != "" && modalMeetingStates.To != ""
          ? a.dateOfMeeting >= modalMeetingStates.From &&
            a.dateOfMeeting <= modalMeetingStates.To
          : a.dateOfMeeting) &&
        (modalMeetingStates.To != "" && modalMeetingStates.From === ""
          ? a.dateOfMeeting <= modalMeetingStates.To
          : a.dateOfMeeting) &&
        (modalMeetingStates.From != "" && modalMeetingStates.To === ""
          ? a.dateOfMeeting >= modalMeetingStates.From
          : a.dateOfMeeting)
      );
    });

    console.log("filteredData", x);

    setRows([...x]);
    setFilterBarMeetingModal(false);
    setModalMeetingStates({
      Title: "",
      Agenda: "",
      Status: "",
      Date: "",
      Host: "",
      Attendee: "",
      From: "",
      To: "",
    });
    setMeetingSelectedStatusOption([]);
    setToDate("");
    setFromDate("");
    console.log("items", x);
  };
  const onAllSearch = (e) => {
    let value = e.target.value;
    var y = [...allMeetingData];
    let x = y.filter((a) => {
      return (
        (value != ""
          ? a.status.toLowerCase().includes(value.toLowerCase())
          : a.status) ||
        (value != ""
          ? a.title.toLowerCase().includes(value.toLowerCase())
          : a.title) ||
        (value != ""
          ? handleAllMeetingAtendees(a, value)
          : a.meetingAttendees) ||
        (value != ""
          ? a.host.toLowerCase().includes(value.toLowerCase())
          : a.host) ||
        (value != "" ? handleAllMeetingAgenda(a, value) : a.meetingAgenda) ||
        (value != ""
          ? a.dateOfMeeting >= value && a.dateOfMeeting <= value
          : a.dateOfMeeting)
      );
    });

    console.log("filteredData", x);
    setRows([...x]);
  };
  const handleReset = () => {
    setModalMeetingStates({
      Title: "",
      Agenda: "",
      Status: "",
      Date: "",
      Host: "",
      Attendee: "",
      From: "",
      To: "",
    });
    setToDate("");
    setFromDate("");
    setMeetingSelectedStatusOption([]);
  };

  useEffect(() => {
    dispatch(OrganizationMeetings(navigate, t));
    dispatch(GetMeetingStatus(t));
  }, []);

  useEffect(() => {
    let newOptionStatus = adminReducer.AllMeetingsStatus;
    if (Object.keys(newOptionStatus).length > 0) {
      let tem = [];
      newOptionStatus.map((data) => {
        let newData = { label: data.description, value: data.pK_MSID };
        tem.push(newData);
      });
      setMeetingStatusOption(tem);
    }
  }, [adminReducer.AllMeetingsStatus]);

  useEffect(() => {
    if (adminReducer.UpdateOrganizationMessageResponseMessage != "") {
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
    }
  }, [adminReducer.UpdateOrganizationMessageResponseMessage]);
  useEffect(() => {
    if (adminReducer.DeleteOrganizationMessageResponseMessage != "") {
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
    }
  }, [adminReducer.DeleteOrganizationMessageResponseMessage]);
  useEffect(() => {
    if (adminReducer.AllOrganizationResponseMessage != "") {
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
    }
  }, [adminReducer.AllOrganizationResponseMessage]);

  useEffect(() => {
    if (adminReducer.ResponseMessage != "") {
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
    }
  }, [adminReducer.ResponseMessage]);
  useEffect(() => {
    if (
      adminReducer.AllOrganizationMeeting != null &&
      adminReducer.AllOrganizationMeeting.length > 0
    ) {
      setRows(adminReducer.AllOrganizationMeeting);
      setAllMeetingData(adminReducer.AllOrganizationMeeting);
    }
  }, [adminReducer.AllOrganizationMeeting]);

  const closeOnUpdateBtn = () => {
    dispatch(
      deleteOrganiationMessage(isMeetingId, isMeetingStatusId, t, navigate)
    );
    setMeetingDeleteModal(false);
  };

  const handleMeetingStatus = (slectStatus) => {
    if (Object.keys(slectStatus).length > 0) {
      setMeetingSelectedStatusOption(slectStatus);
      setModalMeetingStates({
        ...modalMeetingStates,
        ["Status"]: slectStatus.value.toString(),
      });
    }
  };
  const changeStatusEditModal = (e) => {
    console.log("eee", e);
    setModalEditMeetingStates({
      Status: e.value,
    });
    setMeetingStatusId(e.value);
  };
  const dateHandler = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    console.log("eee", name);

    setModalMeetingStates({
      ...modalMeetingStates,
      [name]: removeDashesFromDate(value),
    });
    if (name === "To") {
      setToDate(value);
    } else {
      setFromDate(value);
    }
  };
  return (
    <>
      <Container>
        <Row className="mt-5 mb-3 d-flex align-items-center">
          <Col lg={3} md={3} sm={6} xs={12}>
            <label className={styles["Meeting-Main-Heading"]}>
              {t("All-meetings")}
            </label>
          </Col>
          <Col
            lg={6}
            md={6}
            sm={6}
            xs={12}
            className={styles["searchbar-Meeting-textfield"]}
          >
            <TextField
              applyClass="form-control2"
              className="mx-1"
              labelClass="filter"
              change={onAllSearch}
            />
            <div className={styles["MeetingfilterModal"]}>
              <Sliders2 onClick={openFilterModal} />
            </div>
          </Col>
        </Row>

        <Row className={styles["allMeeting-cloumn-row"]}>
          <Col xs={12} sm={12} md={12} lg={12}>
            <Table
              rows={rows}
              column={AllMeetingColumn}
              scroll={{ x: "max-content" }}
              pagination={{
                pageSize: rowSize,
                showSizeChanger: true,
                pageSizeOptions: ["100 ", "150", "200"],
              }}
              expandable={{
                expandedRowRender: (record) => {
                  return record.meetingAgenda.map((data) => (
                    <p className="meeting-expanded-row">
                      {data.objMeetingAgenda.title}
                    </p>
                  ));
                },
                rowExpandable: (record) => record.pK_MDID != "host",
              }}
            />
          </Col>
        </Row>

        <Modal
          show={meetingModal || filterBarMeetingModal || meetingDeleteModal}
          setShow={() => {
            setMeetingModal();
            setFilterBarMeetingModal();
            setMeetingDeleteModal();
          }}
          ButtonTitle={ModalTitle}
          centered
          size={
            meetingModal && meetingDeleteModal === "sm"
              ? meetingModal && meetingDeleteModal === "sm"
              : "md"
          }
          ModalBody={
            <>
              {meetingModal ? (
                <>
                  <Container className={styles["Meeting-modal-container"]}>
                    <Row>
                      <Col
                        lg={12}
                        md={12}
                        sm={12}
                        xs={12}
                        className="d-flex justify-content-start"
                      >
                        <label className={styles["Meeting-label-heading"]}>
                          {t("Edit")}
                        </label>
                      </Col>
                    </Row>

                    <Row className="mt-3 border-bottom">
                      <Col lg={6} md={6} sm={6} xs={12}>
                        <p className={styles["Meeting-Name-label"]}>
                          {t("Title")}
                        </p>
                      </Col>

                      <Col lg={6} md={6} sm={12} xs={12}>
                        <Form.Control
                          ref={Titles}
                          onKeyDown={(event) => enterKeyHandler(event, Agendas)}
                          className={styles["formcontrol-names-fields-Meeting"]}
                          maxLength={200}
                          disabled={true}
                          applyClass="form-control2"
                          name="Titles"
                          onChange={fieldValidate}
                          value={modalEditMeetingStates.Titles}
                          // onChange={EditUserHandler}
                          // value={editUserSection.Name}
                        />
                      </Col>
                    </Row>

                    <Row className="border-bottom">
                      <Col lg={6} md={6} sm={12} xs={12}>
                        <p className={styles["Meeting-Name-label"]}>
                          {t("Agenda")}
                        </p>
                      </Col>

                      <Col lg={6} md={6} sm={12} xs={12}>
                        <Form.Control
                          className={styles["formcontrol-names-fields-Meeting"]}
                          ref={Agendas}
                          onKeyDown={(event) =>
                            enterKeyHandler(event, Organizers)
                          }
                          maxLength={200}
                          applyClass="form-control2"
                          name="Agendas"
                          disabled={true}
                          onChange={fieldValidate}
                          value={modalEditMeetingStates.Agendas}
                          // onChange={EditUserHandler}
                          // value={editUserSection.Designation}
                        />
                      </Col>
                    </Row>

                    <Row className="border-bottom">
                      <Col lg={6} md={6} sm={12} xs={12}>
                        <p className={styles["Meeting-Name-label"]}>
                          {t("Organizer")}
                        </p>
                      </Col>

                      <Col lg={6} md={6} sm={12} xs={12}>
                        <Form.Control
                          className={styles["formcontrol-names-fields-Meeting"]}
                          ref={Organizers}
                          onKeyDown={(event) =>
                            enterKeyHandler(event, Statuses)
                          }
                          maxLength={200}
                          disabled={true}
                          applyClass="form-control2"
                          name="Organizers"
                          onChange={fieldValidate}
                          value={modalEditMeetingStates.Organizers}
                        />
                      </Col>
                    </Row>

                    <Row className="border-bottom">
                      <Col lg={6} md={6} sm={12} xs={12}>
                        <p className={styles["Meeting-Name-label"]}>
                          {t("Date/Time")}
                        </p>
                      </Col>
                      <Col lg={6} md={6} sm={12} xs={12}>
                        <Form.Control
                          disabled
                          applyClass="form-control2"
                          className={styles["formcontrol-names-fields-Meeting"]}
                          value={modalEditMeetingStates.DateTime}
                        />
                      </Col>
                    </Row>

                    <Row className="border-bottom">
                      <Col lg={6} md={6} sm={12} xs={12}>
                        <p className={styles["Meeting-Name-label"]}>
                          {t("Status")}
                        </p>
                      </Col>
                      <Col lg={6} md={6} sm={12} xs={12}>
                        <Select
                          ref={Statuses}
                          options={meetingStatusOption}
                          onKeyDown={(event) => enterKeyHandler(event, Titles)}
                          name="Statuses"
                          className={
                            styles["selectbox-Meeting-organizationrole"]
                          }
                          placeholder={t("Please-Select")}
                          applyClass="form-control2"
                          onChange={changeStatusEditModal}
                          // onChange={fieldValidate}
                          value={{
                            label:
                              1 === modalEditMeetingStates.Status
                                ? "UpComing"
                                : 2 === modalEditMeetingStates.Status
                                ? "Start"
                                : 3 === modalEditMeetingStates.Status
                                ? "End"
                                : 4 === modalEditMeetingStates.Status
                                ? "Cancel"
                                : 5 === modalEditMeetingStates.Status
                                ? "Reschudule"
                                : 6 === modalEditMeetingStates.Status
                                ? "Close"
                                : 7 === modalEditMeetingStates.Status
                                ? "Delete"
                                : null,
                            value: modalEditMeetingStates.Status,
                          }}
                        />
                      </Col>
                    </Row>
                  </Container>
                </>
              ) : filterBarMeetingModal ? (
                <>
                  <Container>
                    <Row>
                      <Col lg={12} md={12} sm={12} xs={12}>
                        <Form.Control
                          className={
                            styles["formcontrol-fieldfor-filtermodalmeeting"]
                          }
                          ref={Title}
                          onKeyDown={(event) => enterKeyHandler(event, Agenda)}
                          name="Title"
                          placeholder={t("Title")}
                          applyClass="form-control2"
                          onChange={fieldValidate}
                          value={modalMeetingStates.Title}
                        />
                      </Col>
                    </Row>

                    <Row>
                      <Col lg={12} md={12} sm={12} xs={12}>
                        <Form.Control
                          className={
                            styles["formcontrol-fieldfor-filtermodalmeeting"]
                          }
                          ref={Agenda}
                          onKeyDown={(event) => enterKeyHandler(event, Status)}
                          name="Agenda"
                          placeholder={t("Agenda")}
                          applyClass="form-control2"
                          onChange={fieldValidate}
                          value={modalMeetingStates.Agenda}
                        />
                      </Col>
                    </Row>

                    <Row>
                      <Col lg={3} md={3} sm={12} xs={12}>
                        <Select
                          ref={Status}
                          onKeyDown={(event) => enterKeyHandler(event, Host)}
                          className={
                            styles[
                              "formcontrol-fieldselectfor-filtermodalmeeting"
                            ]
                          }
                          options={meetingStatusOption}
                          name="Status"
                          placeholder={t("Select")}
                          applyClass="form-control2"
                          onChange={handleMeetingStatus}
                          value={meetingSelectedStatusOption}
                        />
                      </Col>
                      <Col lg={9} md={9} sm={12} xs={12}>
                        <Form.Control
                          className={
                            styles["formcontrol-fieldfor-filtermodalmeeting"]
                          }
                          ref={Host}
                          onKeyDown={(event) =>
                            enterKeyHandler(event, Attendee)
                          }
                          name="Host"
                          placeholder={t("Host")}
                          applyClass="form-control2"
                          onChange={fieldValidate}
                          value={modalMeetingStates.Host}
                        />
                      </Col>
                    </Row>

                    <Row>
                      <Col lg={12} md={12} sm={12} xs={12}>
                        <Form.Control
                          className={
                            styles["formcontrol-fieldfor-filtermodalmeeting"]
                          }
                          ref={Attendee}
                          onKeyDown={(event) => enterKeyHandler(event, From)}
                          name="Attendee"
                          placeholder={t("Attendee")}
                          applyClass="form-control2"
                          onChange={fieldValidate}
                          value={modalMeetingStates.Attendee}
                        />
                      </Col>
                    </Row>

                    <Row className="mt-2">
                      <Col lg={6} md={6} sm={12} xs={12}>
                        <span className="mt-3">From</span>
                        <Form.Control
                          ref={From}
                          onKeyDown={(event) => enterKeyHandler(event, To)}
                          className={
                            styles["formcontrol-Date-filtermodalmeeting"]
                          }
                          type="date"
                          name="From"
                          placeholder={t("From")}
                          applyClass="form-control2"
                          onChange={dateHandler}
                          value={fromDate}
                        />
                      </Col>
                      <Col lg={6} md={6} sm={12} xs={12}>
                        <span className="mt-3">To</span>
                        <Form.Label className="d-none"></Form.Label>
                        <Form.Control
                          ref={To}
                          onKeyDown={(event) => enterKeyHandler(event, Title)}
                          className={
                            styles["formcontrol-Date-filtermodalmeeting"]
                          }
                          type="date"
                          name="To"
                          placeholder={t("To")}
                          applyClass="form-control2"
                          onChange={dateHandler}
                          value={toDate}
                        />
                      </Col>
                    </Row>
                  </Container>
                </>
              ) : meetingDeleteModal ? (
                <>
                  <Container>
                    <>
                      <Row>
                        <Col
                          lg={12}
                          md={12}
                          sm={12}
                          className="d-flex justify-content-center"
                        >
                          <p className={styles["delete-modal-title"]}>
                            {t("Are-you-sure-you-want-to-Delete-this-Meeting?")}
                          </p>
                        </Col>
                      </Row>
                    </>
                  </Container>
                </>
              ) : null}
            </>
          }
          ModalFooter={
            <>
              {meetingModal ? (
                <Row>
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    xs={12}
                    className="d-flex justify-content-end"
                  >
                    <Button
                      text={t("Update")}
                      onClick={() =>
                        handleMeetingUpdate(
                          isMeetingId,
                          modalEditMeetingStates.Status
                        )
                      }
                      className={styles["Meeting-Update-Btn"]}
                    />
                  </Col>
                </Row>
              ) : filterBarMeetingModal ? (
                <Row className="mt-3 mb-4 me-3">
                  <Col
                    lg={6}
                    md={6}
                    sm={6}
                    xs={12}
                    className="d-flex justify-content-end"
                  >
                    <Button
                      text={t("Reset")}
                      className={styles["icon-modalmeeting-ResetBtn"]}
                      onClick={handleReset}
                    />
                  </Col>

                  <Col
                    lg={6}
                    md={6}
                    sm={6}
                    xs={12}
                    className="d-flex justify-content-start"
                  >
                    <Button
                      className={styles["icon-modalmeeting-SearchBtn"]}
                      text={t("Search")}
                      onClick={searchFunc}
                    />
                  </Col>
                </Row>
              ) : meetingDeleteModal ? (
                <Col sm={12} md={12} lg={12}>
                  <Row className="mb-4">
                    <Col
                      lg={6}
                      md={6}
                      sm={6}
                      xs={12}
                      className="d-flex justify-content-end"
                    >
                      <Button
                        text={t("Discard")}
                        className={styles["icon-modalmeeting-ResetBtn"]}
                        // onClick={closeOnUpdateBtn}
                      />
                    </Col>

                    <Col
                      lg={6}
                      md={6}
                      sm={6}
                      xs={12}
                      className="d-flex justify-content-start"
                    >
                      <Button
                        text={t("Confirm")}
                        className={styles["icon-modalmeeting-confirm"]}
                        onClick={closeOnUpdateBtn}
                      />
                    </Col>
                  </Row>
                </Col>
              ) : null}
            </>
          }
        />
      </Container>
      {adminReducer.Loading ? (
        <Loader />
      ) : rows.length < 0 && rows.length === 0 ? (
        <Loader />
      ) : null}
      <Notification setOpen={setOpen} open={open.open} message={open.message} />
    </>
  );
};

export default AllMeetings;
