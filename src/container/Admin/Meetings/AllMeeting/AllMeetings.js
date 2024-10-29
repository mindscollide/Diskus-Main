import React, { useState, useRef, useEffect } from "react";
import styles from "./AllMeeting.module.css";
import {
  Button,
  TextField,
  Notification,
  ResultMessage,
  Table,
  Loader,
  Modal,
} from "../../../../components/elements";
import "./../../../../i18n";
import { useTranslation } from "react-i18next";
import { Container, Row, Col, Form } from "react-bootstrap";
import NoMeetingsIcon from "../../../../assets/images/No-Meetings.png";
import { Trash } from "react-bootstrap-icons";
import DatePicker from "react-datepicker";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import Paymenthistoryhamberge from "../../../../assets/images/newElements/paymenthistoryhamberge.png";
import { useNavigate } from "react-router-dom";
import EditIcon2 from "../../../../assets/images/Edit-Icon-blck.png";
import "react-phone-input-2/lib/style.css";
import {
  OrganizationMeetings,
  deleteOrganiationMessage,
  GetMeetingStatus,
  updateOrganizationMeeting,
} from "../../../../store/actions/Admin_AllMeeting";
import moment from "moment";
import {
  editResolutionDate,
  newTimeFormaterAsPerUTCFullDate,
  removeDashesFromDate,
} from "../../../../commen/functions/date_formater";
import { cleareMessage } from "../../../../store/actions/Admin_AddUser";
import { Pagination } from "antd";
import { showMessage } from "../../../../components/elements/snack_bar/utill";

const AllMeetings = ({ show, setShow, ModalTitle }) => {
  //for translation
  const { t } = useTranslation();
  const dispatch = useDispatch();
  let currentLanguage = localStorage.getItem("i18nextLng");
  moment.locale(currentLanguage);
  const [filterBarMeetingModal, setFilterBarMeetingModal] = useState(false);
  const [meetingModal, setMeetingModal] = useState(false);
  const [meetingDeleteModal, setMeetingDeleteModal] = useState(false);
  const navigate = useNavigate();
  const { adminReducer, LanguageReducer } = useSelector((state) => state);
  const [allMeetingData, setAllMeetingData] = useState([]);
  const [isMeetingId, setMeetingId] = useState(0);
  const [isMeetingStatusId, setMeetingStatusId] = useState(0);
  const [open, setOpen] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  const [meetingStatusOption, setMeetingStatusOption] = useState([]);
  const [meetingSelectedStatusOption, setMeetingSelectedStatusOption] =
    useState([]);

  //for enter key
  const Title = useRef(null);
  const Agenda = useRef(null);
  const Organizers = useRef(null);
  const Status = useRef(null);
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
  const [totalRecords, setTotalRecords] = useState(0);
  let currentPageSize = localStorage.getItem("MeetingPageSize");
  let currentPage = JSON.parse(localStorage.getItem("MeetingCurrentPage"));

  const [modalEditMeetingStates, setModalEditMeetingStates] = useState({
    Titles: "",
    Agendas: "",
    Organizers: "",
    DateTime: "",
    Status: "",
  });
  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (currentPage !== null && currentPageSize !== null) {
      dispatch(OrganizationMeetings(navigate, currentPage, currentPageSize, t));
    } else {
      dispatch(OrganizationMeetings(navigate, 1, 50, t));
      localStorage.setItem("MeetingPageSize", 50);
      localStorage.setItem("MeetingCurrentPage", 1);
    }
    dispatch(GetMeetingStatus(navigate, t));
  }, []);

  useEffect(() => {
    if (
      adminReducer.AllOrganizationMeeting != null &&
      adminReducer.AllOrganizationMeeting !== undefined
    ) {
      setTotalRecords(adminReducer.AllOrganizationMeeting.totalRecords);
      if (adminReducer.AllOrganizationMeeting.organizationMeetings.length > 0) {
        setRows(adminReducer.AllOrganizationMeeting.organizationMeetings);
        setAllMeetingData(
          adminReducer.AllOrganizationMeeting.organizationMeetings
        );
      } else {
        setAllMeetingData([]);
      }
    } else {
      setAllMeetingData([]);
    }
  }, [adminReducer.AllOrganizationMeeting]);

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
          Status: valueCheck,
        });
      }
    } else if (name === "Statuses" && value === "") {
      setModalEditMeetingStates({
        ...modalEditMeetingStates,
        Status: "",
      });
    }
  };

  const handleMeetingUpdate = () => {
    dispatch(
      updateOrganizationMeeting(navigate, isMeetingId, isMeetingStatusId, t)
    );
    setMeetingModal(false);
  };

  // table meetings columns in allMeeting
  const AllMeetingColumn = [
    {
      title: t("Title"),
      dataIndex: "title",
      key: "title",
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
    },
    {
      title: t("Status"),
      dataIndex: "status",
      key: "status",
      align: "left",
    },
    {
      title: t("Organizer"),
      dataIndex: "host",
      key: "host",
      align: "left",
      className: "FontArabicRegular",
    },
    {
      title: t("Date-or-time"),
      dataIndex: "dateOfMeeting",
      key: "dateOfMeeting",
      align: "left",
      width: "220px",
      className: "dateTimeColumn FontArabicRegular",
      render: (text, record) => {
        if (record?.createdTime !== null && record?.createdDate !== null) {
          return newTimeFormaterAsPerUTCFullDate(
            record?.createdDate + record?.createdTime
          );
        }
      },
    },
    {
      dataIndex: "Delete",
      key: "Delete",
      align: "left",
      width: "120px",
      render: (text, record) => {
        console.log(record, "recordrecordrecord");
        return (
          <>
            <div
              onClick={() => {
                handleEditOrganizatioMeeting(record);
              }}
              className="edit-icon-edituser icon-edit-list icon-size-one beachGreen "
            >
              <i>
                <img draggable="false" alt="" src={EditIcon2} />
              </i>
            </div>
            <i style={{ cursor: "pointer", color: "#000" }}>
              <Trash
                size={22}
                onClick={() => {
                  openDeleteModal(record?.meetingID);
                }}
              />
            </i>
          </>
        );
      },
    },
  ];

  //handler for enter key

  const enterKeyHandler = (event, nextInput) => {
    if (event.key === "Enter") {
      nextInput.current.focus();
    }
  };

  //open filter modal on icon click
  const openFilterModal = async () => {
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

  const handleEditOrganizatioMeeting = (Data) => {
    setMeetingId(Data.meetingID);
    setMeetingModal(true);
    setModalEditMeetingStates({
      Titles: Data.title,
      Agendas: Data.agenda,
      Organizers: Data.host,
      DateTime: newTimeFormaterAsPerUTCFullDate(
        Data.createdDate + Data.createdTime
      ),
      Status: JSON.parse(Data.fK_StatusID),
    });
  };

  //open Delete modal on click
  const openDeleteModal = async (meetingID) => {
    setMeetingDeleteModal(true);
    setMeetingModal(false);
    setFilterBarMeetingModal(false);
    setMeetingId(meetingID);
  };

  const handleMeetingAtendees = (a, modalMeetingStates) => {
    let newVAl = false;
    a.meetingAttendees.map((aA) => {
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
    a.meetingAgenda.map((aA) => {
      if (
        aA.objMeetingAgenda.title
          .toLowerCase()
          .includes(modalMeetingStates.Agenda.toLowerCase())
      ) {
        newVAl = true;
      }
    });
    return newVAl;
  };

  const handleAllMeetingAtendees = (a, value) => {
    let newVAl = false;
    a.meetingAttendees.map((aA) => {
      if (aA.user.name.toLowerCase().includes(value.toLowerCase())) {
        newVAl = true;
      }
    });
    return newVAl;
  };

  const handleAllMeetingAgenda = (a, value) => {
    let newVAl = false;
    a.meetingAgenda.map((aA) => {
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
        (fromDate != "" && toDate != ""
          ? removeDashesFromDate(
              editResolutionDate(a.dateOfMeeting + a.meetingStartTime)
            ) >= removeDashesFromDate(editResolutionDate(fromDate)) &&
            removeDashesFromDate(
              editResolutionDate(a.dateOfMeeting + a.meetingStartTime)
            ) <= removeDashesFromDate(editResolutionDate(toDate))
          : removeDashesFromDate(
              editResolutionDate(a.dateOfMeeting + a.meetingStartTime)
            )) &&
        (toDate != "" && fromDate === ""
          ? removeDashesFromDate(
              editResolutionDate(a.dateOfMeeting + a.meetingStartTime)
            ) <= removeDashesFromDate(editResolutionDate(toDate))
          : removeDashesFromDate(
              editResolutionDate(a.dateOfMeeting + a.meetingStartTime)
            )) &&
        (fromDate != "" && toDate === ""
          ? removeDashesFromDate(
              editResolutionDate(a.dateOfMeeting + a.meetingStartTime)
            ) >= removeDashesFromDate(editResolutionDate(fromDate))
          : removeDashesFromDate(
              editResolutionDate(a.dateOfMeeting + a.meetingStartTime)
            ))
      );
    });

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
    if (adminReducer.UpdateOrganizationMessageResponseMessage !== "") {
      showMessage(
        adminReducer.UpdateOrganizationMessageResponseMessage,
        "success",
        setOpen
      );
      dispatch(cleareMessage());
    }
  }, [adminReducer.UpdateOrganizationMessageResponseMessage]);

  useEffect(() => {
    if (adminReducer.DeleteOrganizationMessageResponseMessage !== "") {
      showMessage(
        adminReducer.DeleteOrganizationMessageResponseMessage,
        "success",
        setOpen
      );

      dispatch(cleareMessage());
    }
  }, [adminReducer.DeleteOrganizationMessageResponseMessage]);

  useEffect(() => {
    if (
      adminReducer.AllOrganizationResponseMessage != "" &&
      adminReducer.AllOrganizationResponseMessage !== "" &&
      adminReducer.AllOrganizationResponseMessage !==
        t("No-data-available-against-this-organization")
    ) {
      showMessage(
        adminReducer.AllOrganizationResponseMessage,
        "success",
        setOpen
      );

      dispatch(cleareMessage());
    }
  }, [adminReducer.AllOrganizationResponseMessage]);

  useEffect(() => {
    if (
      adminReducer.ResponseMessage !== "" &&
      adminReducer.ResponseMessage !==
        t("No-data-available-against-this-organization")
    ) {
      showMessage(adminReducer.ResponseMessage, "success", setOpen);

      dispatch(cleareMessage());
    }
  }, [adminReducer.ResponseMessage]);

  const closeOnUpdateBtn = () => {
    dispatch(deleteOrganiationMessage(navigate, isMeetingId, 7, t));
    setMeetingDeleteModal(false);
  };

  const handleMeetingStatus = (slectStatus) => {
    if (Object.keys(slectStatus).length > 0) {
      setMeetingSelectedStatusOption(slectStatus);
      setModalMeetingStates({
        ...modalMeetingStates,
        Status: slectStatus.value.toString(),
      });
    }
  };

  const changeStatusEditModal = (e) => {
    setModalEditMeetingStates({
      Status: e.value,
    });
    setMeetingStatusId(e.value);
  };

  const handleClose = () => {
    setMeetingModal(false);
    setFilterBarMeetingModal(false);
    setMeetingDeleteModal(false);
  };

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

  const AdminMeetingPagination = async (current, pageSize) => {
    await dispatch(OrganizationMeetings(navigate, current, pageSize, t));
    localStorage.setItem("MeetingPageSize", pageSize);
    localStorage.setItem("MeetingCurrentPage", current);
  };

  return (
    <>
      <Container>
        <Row className="mt-3 row">
          <Col lg={3} md={3} sm={6} xs={12} className="p-0">
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
              placeholder={t("Title")}
              labelclass="filter"
              change={onAllSearch}
            />
            <div className={styles["MeetingfilterModal"]}>
              <img
                draggable="false"
                src={Paymenthistoryhamberge}
                width={18}
                height={18}
                alt=""
                onClick={openFilterModal}
              />
            </div>
          </Col>
        </Row>

        <Row className={styles["allMeeting-cloumn-row"]}>
          <Col xs={12} sm={12} md={12} lg={12}>
            {rows.length === 0 && !adminReducer.Loading ? (
              <>
                <ResultMessage
                  icon={
                    <img
                      draggable="false"
                      src={NoMeetingsIcon}
                      alt=""
                      className="nodata-table-icon"
                    />
                  }
                  title={
                    adminReducer.searchRecordFound === true
                      ? t("No-records-found")
                      : t("No-new-meetings")
                  }
                  subTitle={t("Anything-important-thats-needs-discussion")}
                />
              </>
            ) : (
              <>
                <Table
                  rows={rows}
                  column={AllMeetingColumn}
                  className="AllUserTable"
                  scroll={{ y: 320 }}
                  pagination={false}
                />
              </>
            )}
          </Col>
        </Row>
        {rows.length > 0 && (
          <Row>
            <Col
              sm={12}
              md={12}
              lg={12}
              className="d-flex justify-content-center my-2 pagination-groups-table"
            >
              <Pagination
                total={totalRecords}
                locale={{
                  items_per_page: t("items_per_page"),
                  page: t("page"),
                }}
                onChange={AdminMeetingPagination}
                current={currentPage !== null ? currentPage : 1}
                showSizeChanger
                pageSizeOptions={["30", "50", "100", "200"]}
                pageSize={currentPageSize !== null ? currentPageSize : 50}
                className={styles["PaginationStyle-AllMeeting"]}
              />
            </Col>
          </Row>
        )}

        <Modal
          show={meetingModal || filterBarMeetingModal || meetingDeleteModal}
          setShow={() => {
            setMeetingModal();
            setFilterBarMeetingModal();
            setMeetingDeleteModal();
          }}
          onHide={handleClose}
          ButtonTitle={ModalTitle}
          centered
          modalHeaderClassName="Edit-Meetings-Modal"
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

                    <Row className="border-bottom margin-left-20 margin-right-20">
                      <Col lg={6} md={6} sm={6} xs={12} className="p-0">
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
                        />
                      </Col>
                    </Row>

                    <Row className="border-bottom margin-left-20 margin-right-20">
                      <Col lg={6} md={6} sm={12} xs={12} className="p-0">
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
                        />
                      </Col>
                    </Row>

                    <Row className="border-bottom margin-left-20 margin-right-20">
                      <Col lg={6} md={6} sm={12} xs={12} className="p-0">
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

                    <Row className="border-bottom margin-left-20 margin-right-20">
                      <Col lg={6} md={6} sm={12} xs={12} className="p-0">
                        <p className={styles["Meeting-Name-label"]}>
                          {t("Date-or-time")}
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

                    <Row className="border-bottom margin-left-20 margin-right-20">
                      <Col lg={6} md={6} sm={12} xs={12} className="p-0">
                        <p className={styles["Status-Name-label"]}>
                          {t("Status")}
                        </p>
                      </Col>
                      <Col
                        lg={6}
                        md={6}
                        sm={12}
                        xs={12}
                        className="All-meeting-col"
                      >
                        <Select
                          ref={Statuses}
                          options={meetingStatusOption}
                          onKeyDown={(event) => enterKeyHandler(event, Titles)}
                          name="Statuses"
                          className={
                            styles["selectbox-Meeting-organizationrole"]
                          }
                          placeholder={t("Please-select")}
                          applyClass="form-control2"
                          onChange={changeStatusEditModal}
                          styles={borderChanges}
                          value={{
                            label:
                              1 === modalEditMeetingStates.Status
                                ? "UpComing"
                                : 2 === modalEditMeetingStates.Status
                                ? "Start"
                                : 3 === modalEditMeetingStates.Status
                                ? "Completed"
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
                      <Col
                        lg={3}
                        md={3}
                        sm={12}
                        xs={12}
                        className="All-meeting-col"
                      >
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
                          styles={borderChanges}
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
                          placeholder={t("Organizer")}
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
                      <Col
                        lg={6}
                        md={6}
                        sm={12}
                        xs={12}
                        className="PaymentHistory-Datpickers"
                      >
                        <span className="mt-3 FontArabicRegular">
                          {t("From")}
                        </span>
                        <DatePicker
                          ref={From}
                          onKeyDown={(event) => enterKeyHandler(event, To)}
                          selected={fromDate}
                          onChange={(date) => setFromDate(date)}
                          className="form-control "
                          name="From"
                          placeholder={t("From")}
                        />
                      </Col>
                      <Col
                        lg={6}
                        md={6}
                        sm={12}
                        xs={12}
                        className="PaymentHistory-Datpickers"
                      >
                        <span className="mt-3 FontArabicRegular">
                          {t("To")}
                        </span>
                        <Form.Label className="d-none"></Form.Label>
                        <DatePicker
                          ref={To}
                          onKeyDown={(event) => enterKeyHandler(event, To)}
                          selected={toDate}
                          onChange={(date) => setToDate(date)}
                          className="form-control FontArabicRegular"
                          name="To"
                          placeholder={t("To")}
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
                            {t("Are-you-sure-you-want-to-delete-this-meeting")}
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
                        onClick={() => setMeetingDeleteModal(false)}
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
      {adminReducer.Loading || LanguageReducer.Loading ? (
        <Loader />
      ) : (rows.length < 0 && rows.length === 0) || LanguageReducer.Loading ? (
        <Loader />
      ) : null}
      <Notification open={open} setOpen={setOpen} />
    </>
  );
};

export default AllMeetings;
