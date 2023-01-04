import React, { useState, useRef } from "react";
import styles from "./AllMeeting.module.css";
import {
  Button,
  TextField,
  FilterBar,
  SearchInput,
  Table,
  Modal,
} from "../../../../components/elements";
import "./../../../../i18n";
import { useTranslation } from "react-i18next";
import { Container, Row, Col, Form } from "react-bootstrap";
import { Sliders2 } from "react-bootstrap-icons";
import { Select } from "antd";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const AllMeetings = ({ show, setShow, ModalTitle }) => {
  //for translation
  const { t } = useTranslation();
  const [filterBarMeetingModal, setFilterBarMeetingModal] = useState(false);
  const [meetingModal, setMeetingModal] = useState(false);
  const [meetingDeleteModal, setMeetingDeleteModal] = useState(false);

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

  const [modalEditMeetingStates, setModalEditMeetingStates] = useState({
    Titles: "",
    Agendas: "",
    Organizers: "",
    DataTransfer: "",
    Statuses: "",
  });

  // validations for fields
  const fieldValidate = (e) => {
    let name = e.target.name;
    let value = e.target.value;

    if (name === "Title" && value !== "") {
      let valueCheck = value.replace(/[^a-zA-Z ]/g, "");
      if (valueCheck !== "") {
        setModalMeetingStates({
          ...modalMeetingStates,
          Title: valueCheck,
        });
      }
    } else if (name === "Title" && value === "") {
      setModalMeetingStates({
        ...modalMeetingStates,
        Title: "",
      });
    }

    if (name === "Agenda" && value !== "") {
      let valueCheck = value.replace(/[^a-zA-Z ]/g, "");
      if (valueCheck !== "") {
        setModalMeetingStates({
          ...modalMeetingStates,
          Agenda: valueCheck,
        });
      }
    } else if (name === "Agenda" && value === "") {
      setModalMeetingStates({
        ...modalMeetingStates,
        Agenda: "",
      });
    }

    if (name === "Host" && value !== "") {
      let valueCheck = value.replace(/[^a-zA-Z ]/g, "");
      if (valueCheck !== "") {
        setModalMeetingStates({
          ...modalMeetingStates,
          Host: valueCheck,
        });
      }
    } else if (name === "Host" && value === "") {
      setModalMeetingStates({
        ...modalMeetingStates,
        Host: "",
      });
    }

    if (name === "Attendee" && value !== "") {
      let valueCheck = value.replace(/[^a-zA-Z ]/g, "");
      if (valueCheck !== "") {
        setModalMeetingStates({
          ...modalMeetingStates,
          Attendee: valueCheck,
        });
      }
    } else if (name === "Attendee" && value === "") {
      setModalMeetingStates({
        ...modalMeetingStates,
        Attendee: "",
      });
    }

    if (value === "Status" && value !== "") {
      let valueCheck = value.replace("");
      if (valueCheck !== "") {
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
    if (name === "Titles" && value !== "") {
      let valueCheck = value.replace(/[^a-zA-Z ]/g, "");
      if (valueCheck !== "") {
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

    if (name === "Agendas" && value !== "") {
      let valueCheck = value.replace(/[^a-zA-Z ]/g, "");
      if (valueCheck !== "") {
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

    if (name === "Organizers" && value !== "") {
      let valueCheck = value.replace(/[^a-zA-Z ]/g, "");
      if (valueCheck !== "") {
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

    if (value === "Statuses" && value !== "") {
      let valueCheck = value.replace("");
      if (valueCheck !== "") {
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
      dataIndex: "Title",
      key: "Title",
      align: "center",
      sorter: (a, b) => a.title.localeCompare(b.title.toLowerCase),

      // render: (text, record) => (
      //   <i
      //     className="meeting-title"
      //     onClick={(e) => viewModalHandler(record.pK_MDID)}
      //   >
      //     {text}
      //   </i>
      // ),
    },
    {
      title: t("Agenda"),
      dataIndex: "Agenda",
      key: "Agenda",
      align: "center",
    },
    {
      title: t("Status"),
      dataIndex: "Status",
      key: "Status",
      align: "center",
    },
    {
      title: t("Host"),
      dataIndex: "Host",
      key: "Host",
      align: "center",
      sorter: (a, b) => a.title.localeCompare(b.title.toLowerCase),
    },
    {
      title: t("Date"),
      dataIndex: "Date",
      key: "Date",
      align: "center",
    },
    {
      title: t("Edit"),
      dataIndex: "Edit",
      key: "Edit",
      align: "center",
    },
    {
      title: t("Delete"),
      dataIndex: "Delete",
      key: "Delete",
      align: "center",
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
    setModalMeetingStates("");
    setFilterBarMeetingModal(true);
  };

  //Open modal on reset button it's created temperary to check modal
  const openOnResetBtn = async () => {
    setMeetingModal(true);
    setModalEditMeetingStates("");
  };

  //open Delete modal on click
  const openDeleteModal = async () => {
    setMeetingDeleteModal(true);
    setMeetingModal(false);
    setFilterBarMeetingModal(false);
  };

  return (
    <Container>
      <Row className={styles["allMeeting-filter-row"]}>
        <Col lg={3} md={3} sm={6} xs={12}>
          <label className={styles["Meeting-Main-Heading"]}>
            {t("All-Meeting")}
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
            className="mx-2"
            labelClass="filter"
          />
          <div className={styles["MeetingfilterModal"]}>
            <Sliders2 onClick={openFilterModal} />
          </div>
        </Col>
        <Col
          lg={3}
          md={3}
          sm={6}
          xs={12}
          className="d-flex justify-content-end"
        >
          <Button
            className={styles["btnMeetingReset"]}
            text={t("Reset")}
            onClick={openOnResetBtn}
          />
        </Col>
      </Row>

      <Row className={styles["allMeeting-cloumn-row"]}>
        <Col lg={12} md={12} sm={12}>
          <Table
            column={AllMeetingColumn}
            scroll={{ x: "max-content" }}
            pagination={{pageSize: 50,  showSizeChanger: true, pageSizeOptions: ['100 ', '150', '200'] }}
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
          meetingModal && filterBarMeetingModal && meetingDeleteModal === "sm"
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
                      sm={6}
                      xs={12}
                      className="d-flex justify-content-start"
                    >
                      <label className={styles["Meeting-label-heading"]}>
                        {t("Edit")}
                      </label>
                    </Col>
                  </Row>

                  <Row className="mt-3">
                    <Col lg={6} md={6} sm={6} xs={12}>
                      <p className={styles["Meeting-Name-label"]}>
                        {t("Title")}
                      </p>
                    </Col>

                    <Col lg={6} md={6} sm={6} xs={12}>
                      <Form.Control
                        ref={Titles}
                        onKeyDown={(event) => enterKeyHandler(event, Agendas)}
                        className={styles["formcontrol-names-fields-Meeting"]}
                        maxLength={200}
                        applyClass="form-control2"
                        name="Titles"
                        onChange={fieldValidate}
                        value={modalEditMeetingStates.Titles}
                        // onChange={EditUserHandler}
                        // value={editUserSection.Name}
                      />
                    </Col>
                  </Row>

                  <Row>
                    <Col lg={6} md={6} sm={6} xs={12}>
                      <p className={styles["Meeting-Name-label"]}>
                        {t("Agenda")}
                      </p>
                    </Col>

                    <Col lg={6} md={6} sm={6} xs={12}>
                      <Form.Control
                        className={styles["formcontrol-names-fields-Meeting"]}
                        ref={Agendas}
                        onKeyDown={(event) =>
                          enterKeyHandler(event, Organizers)
                        }
                        maxLength={200}
                        applyClass="form-control2"
                        name="Agendas"
                        onChange={fieldValidate}
                        value={modalEditMeetingStates.Agendas}
                        // onChange={EditUserHandler}
                        // value={editUserSection.Designation}
                      />
                    </Col>
                  </Row>

                  <Row>
                    <Col lg={6} md={6} sm={6} xs={12}>
                      <p className={styles["Meeting-Name-label"]}>
                        {t("Organizer")}
                      </p>
                    </Col>

                    <Col lg={6} md={6} sm={6} xs={12}>
                      <Form.Control
                        className={styles["formcontrol-names-fields-Meeting"]}
                        ref={Organizers}
                        onKeyDown={(event) => enterKeyHandler(event, Statuses)}
                        maxLength={200}
                        applyClass="form-control2"
                        name="Organizers"
                        onChange={fieldValidate}
                        value={modalEditMeetingStates.Organizers}
                      />
                    </Col>
                  </Row>

                  <Row>
                    <Col lg={6} md={6} sm={6} xs={12}>
                      <p className={styles["Meeting-Name-label"]}>
                        {t("Date/Time")}
                      </p>
                    </Col>
                    <Col lg={6} md={6} sm={6} xs={12}>
                      <Form.Control
                        disabled
                        applyClass="form-control2"
                        className={styles["formcontrol-names-fields-Meeting"]}
                      />
                    </Col>
                  </Row>

                  <Row>
                    <Col lg={6} md={6} sm={6} xs={12}>
                      <p className={styles["Meeting-Name-label"]}>
                        {t("Status")}
                      </p>
                    </Col>
                    <Col lg={6} md={6} sm={12}>
                      <Select
                        ref={Statuses}
                        onKeyDown={(event) => enterKeyHandler(event, Titles)}
                        name="Statuses"
                        className={styles["selectbox-Meeting-organizationrole"]}
                        placeholder={t("Please-Select")}
                        applyClass="form-control2"
                        onChange={fieldValidate}
                        value={modalEditMeetingStates.Statuses}
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
                        name="Status"
                        placeholder={t("Please-Select")}
                        applyClass="form-control2"
                        // onChange={fieldValidate}
                        // value={modalMeetingStates.Status}
                      />
                    </Col>
                    <Col lg={9} md={9} sm={12} xs={12}>
                      <Form.Control
                        className={
                          styles["formcontrol-fieldfor-filtermodalmeeting"]
                        }
                        ref={Host}
                        onKeyDown={(event) => enterKeyHandler(event, Attendee)}
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

                  <Row>
                    <Col lg={6} md={6} sm={12} xs={12}>
                      <Select
                        ref={From}
                        onKeyDown={(event) => enterKeyHandler(event, To)}
                        className={
                          styles[
                            "formcontrol-fieldselectfor-filtermodalmeeting"
                          ]
                        }
                        name="Status"
                        placeholder={t("Please-Select")}
                        applyClass="form-control2"
                      />
                    </Col>
                    <Col lg={6} md={6} sm={12} xs={12}>
                      <Select
                        ref={To}
                        onKeyDown={(event) => enterKeyHandler(event, Title)}
                        className={
                          styles[
                            "formcontrol-fieldselectfor-filtermodalmeeting"
                          ]
                        }
                        name="Status"
                        placeholder={t("Please-Select")}
                        applyClass="form-control2"
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
                    onClick={openDeleteModal}
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
                    className={styles["icon-modalmeeting-ResetBtn"]}
                    text={t("Search")}
                  />
                </Col>
              </Row>
            ) : meetingDeleteModal ? (
              <Col sm={12} md={12} lg={12}>
                <Row className="mb-4">
                  <Col
                    lg={6}
                    md={6}
                    sm={12}
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
                    sm={12}
                    xs={12}
                    className="d-flex justify-content-start"
                  >
                    <Button
                      text={t("Confirm")}
                      className={styles["icon-modalmeeting-ResetBtn"]}
                      // onClick={closeOnUpdateBtn}
                    />
                  </Col>
                </Row>
              </Col>
            ) : null}
          </>
        }
      />
    </Container>
  );
};

export default AllMeetings;
