import React, { useState, useEffect } from "react";
import styles from "./Organizers.module.css";
import {
  Button,
  Table,
  TextField,
  Switch,
  Loader,
  Notification,
} from "../../../../../components/elements";
import EditIcon from "../../../../../assets/images/Edit-Icon.png";
import addmore from "../../../../../assets/images/addmore.png";
import redcrossIcon from "../../../../../assets/images/Artboard 9.png";
import greenMailIcon from "../../../../../assets/images/greenmail.svg";
import redMailIcon from "../../../../../assets/images/redmail.svg";
import rspvGreenIcon from "../../../../../assets/images/rspvGreen.svg";
import rspvAbstainIcon from "../../../../../assets/images/rspvAbstain.svg";
import CrossResolution from "../../../../../assets/images/resolutions/cross_icon_resolution.svg";
import NORSVP from "../../../../../assets/images/No-RSVP.png";
import mail from "../../../../../assets/images/mail.svg";
import { useTranslation } from "react-i18next";
import { Col, Row } from "react-bootstrap";
import { Tooltip } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  showAddUserModal,
  showCancelModalOrganizers,
  showCrossConfirmationModal,
  showNotifyOrganizors,
  sendRecentNotificationOrganizerModal,
} from "../../../../../store/actions/NewMeetingActions";
import ModalOrganizor from "./ModalAddUserOrganizer/ModalOrganizor";
import ModalCrossIcon from "./ModalCrossIconClick/ModalCrossIcon";
import NotifyOrganizers from "./NotifyOrganizers/NotifyOrganizers";
import SendNotificationOrganizer from "./NotifyOrganizers/SendRecentNotification";
import OrganizersViewPage from "./OrganizerViewPage/OrganizersViewPage";
import {
  SaveMeetingOrganizers,
  clearResponseMessage,
  UpdateOrganizersMeeting,
  GetAllMeetingOrganizers,
  meetingOrganizers,
  selectedMeetingOrganizers,
  saveMeetingFlag,
  editMeetingFlag,
  notificationSendData,
} from "../../../../../store/actions/MeetingOrganizers_action";
import CancelModalOrganizer from "./CancelModalOrganizer/CancelModalOrganizer";

const Organizers = ({
  setAgendaContributors,
  setmeetingDetails,
  setorganizers,
  setParticipants,
  setAgenda,
  setMinutes,
  setactionsPage,
  setAttendance,
  setPolls,
  setMeetingMaterial,
  setSceduleMeeting,
  currentMeeting,
  setCurrentMeetingID,
}) => {
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const navigate = useNavigate();

  let currentLanguage = localStorage.getItem("i18nextLng");

  let currentUserEmail = localStorage.getItem("userEmail");
  let currentUserID = Number(localStorage.getItem("userID"));
  let currentUserName = localStorage.getItem("name");

  const [viewOrganizers, setviewOrganizers] = useState(false);

  const [editState, setEditState] = useState(false);

  const { NewMeetingreducer, MeetingOrganizersReducer } = useSelector(
    (state) => state
  );

  const openCrossIconModal = () => {
    dispatch(showCrossConfirmationModal(true));
  };

  const openNotifyOrganizorModal = () => {
    dispatch(showNotifyOrganizors(true));
  };

  const handleCancelOrganizer = () => {
    // dispatch(showCancelModalOrganizers(true));
    setSceduleMeeting(false);
    dispatch(saveMeetingFlag(false));
    dispatch(editMeetingFlag(false));
  };

  const [inputValues, setInputValues] = useState({});

  const currentOrganizerData = {
    displayPicture: "",
    email: currentUserEmail,
    isChecked: true,
    isPrimaryOrganizer: true,
    isOrganizerNotified: true,
    isRSVP: true,
    organizerTitle: "",
    userID: currentUserID,
    userName: currentUserName,
    isDeletable: false,
  };

  const [rowsData, setRowsData] = useState([currentOrganizerData]);

  const [transformedData, setTransformedData] = useState({
    MeetingOrganizers: [],
  });

  const [open, setOpen] = useState({
    open: false,
    message: "",
  });

  useEffect(() => {
    let Data = { MeetingID: currentMeeting };
    dispatch(GetAllMeetingOrganizers(Data, navigate, t));
  }, []);

  const handleInputChange = (userID, newValue) => {
    setInputValues((prevInputValues) => ({
      ...prevInputValues,
      [userID]: newValue,
    }));
    setRowsData((prevRowsData) => {
      return prevRowsData.map((row) => {
        if (row.userID === userID) {
          return {
            ...row,
            organizerTitle: newValue,
          };
        }
        return row;
      });
    });
  };

  const handleSwitchChange = (checked, rowIndex) => {
    const updatedRowsData = rowsData.map((row, index) => {
      if (index === rowIndex) {
        return {
          ...row,
          isPrimaryOrganizer: checked,
        };
      }
      return {
        ...row,
        isPrimaryOrganizer: false,
      };
    });
    setRowsData(updatedRowsData);
  };

  const MeetingColoumns = [
    {
      title: (
        <>
          <Row>
            <Col lg={12} md={12} sm={12}>
              <span>{t("Name")}</span>
            </Col>
          </Row>
        </>
      ),
      dataIndex: "userName",
      key: "userName",
      width: "200px",
      render: (text) => <label className={styles["Title_desc"]}>{text}</label>,
    },

    {
      title: t("Email"),
      dataIndex: "email",
      key: "email",
      width: "250px",
      render: (text) => <label className="column-boldness">{text}</label>,
    },
    {
      title: t("Organizer-title"),
      dataIndex: "organizerTitle",
      key: "organizerTitle",
      width: "250px",
      render: (text, record) => (
        <Row>
          <Col lg={12} md={12} sm={12}>
            <TextField
              placeholder={t("Content-title")}
              labelClass={"d-none"}
              applyClass={"Organizer_table"}
              value={inputValues[record.userID] || ""} // Use the controlled value
              change={(e) => handleInputChange(record.userID, e.target.value)} // Update the inputValues when the user types
              disable={record.disabledTitle === true ? true : false}
            />
          </Col>
        </Row>
      ),
    },

    {
      dataIndex: "isPrimaryOrganizer",
      key: "isPrimaryOrganizer",
      width: "200px",
      render: (text, record, rowIndex) => (
        <Row>
          <Col
            lg={12}
            md={12}
            sm={12}
            className="d-flex gap-3 align-items-center"
          >
            <Switch
              checkedValue={text}
              onChange={(checked) => handleSwitchChange(checked, rowIndex)}
              disabled={record.disabledSwitch === true ? true : false}
            />
            <label className="column-boldness">Primary</label>
          </Col>
        </Row>
      ),
    },
    {
      title: t("RSVP"),
      dataIndex: "rsvp",
      key: "rsvp",
      width: "120px",
      render: (text, record) => {
        console.log("RSVP", text, record);
        if (record.isRSVP === true) {
          return (
            <img
              draggable={false}
              src={rspvGreenIcon}
              height="30px"
              width="30px"
            />
          );
        } else {
          return (
            <img draggable={false} src={NORSVP} height="30px" width="30px" />
          );
        }
      },
    },

    {
      title: t("Notification"),
      dataIndex: "isOrganizerNotified",
      key: "isOrganizerNotified",
      width: "180px",
      render: (text, record) => {
        console.log("RSVP", text, record);
        if (record.isOrganizerNotified === true) {
          return (
            <Row>
              <Col
                lg={7}
                md={7}
                sm={7}
                className="d-flex justify-content-center"
              >
                {record.disabledNotification === true ? (
                  <img
                    draggable={false}
                    src={greenMailIcon}
                    height="30px"
                    width="30px"
                    // onClick={() => sendRecentNotification(record)}
                    className="cursor-pointer"
                  />
                ) : (
                  <img
                    draggable={false}
                    src={greenMailIcon}
                    height="30px"
                    width="30px"
                    onClick={() => sendRecentNotification(record)}
                    className="cursor-pointer"
                  />
                )}
              </Col>
            </Row>
          );
        } else if (record.isOrganizerNotified === false) {
          return (
            <Row>
              <Col
                lg={7}
                md={7}
                sm={7}
                className="d-flex justify-content-center"
              >
                {record.disabledNotification === true ? (
                  <img
                    draggable={false}
                    src={redMailIcon}
                    height="30px"
                    width="30px"
                    className="cursor-pointer"
                  />
                ) : (
                  <img
                    draggable={false}
                    src={redMailIcon}
                    height="30px"
                    width="30px"
                    onClick={() => sendRecentNotification(record)}
                    className="cursor-pointer"
                  />
                )}
              </Col>
            </Row>
          );
        }
      },
    },
    {
      // title: t('RSVP'),
      dataIndex: "isDeletable",
      key: "isDeletable",
      width: "120px",
      render: (text, record) => {
        if (record.isDeletable === true) {
          return (
            <img
              draggable={false}
              src={CrossResolution}
              height="30px"
              width="30px"
              className="cursor-pointer"
              onClick={() => deleteRow(record)}
            />
          );
        } else {
          return null;
        }
      },
    },
  ];

  const sendRecentNotification = (record) => {
    console.log("Mail Clicked");
    dispatch(sendRecentNotificationOrganizerModal(true));
    dispatch(notificationSendData([record]));
  };

  // const deleteRow = (record) => {}

  const deleteRow = (recordToDelete) => {
    setRowsData((prevRowsData) =>
      prevRowsData.filter((record) => record !== recordToDelete)
    );
  };

  const openAddUserModal = () => {
    console.log("Add User Modal");
    dispatch(showAddUserModal(true));
    dispatch(saveMeetingFlag(true));
    console.log("Add User Modal");
  };

  const previousTabOrganizer = () => {
    setAgendaContributors(false);
    setmeetingDetails(true);
    setorganizers(false);
    setParticipants(false);
    setAgenda(false);
    setMinutes(false);
    setactionsPage(false);
    setAttendance(false);
    setPolls(false);
    setMeetingMaterial(false);
    setRowsData([]);
    dispatch(saveMeetingFlag(false));
    dispatch(editMeetingFlag(false));
  };

  const handlePublishButton = () => {
    // console.log('For Save Data', transformedData)
    // dispatch(SaveMeetingOrganizers(navigate, transformedData, t))
    dispatch(saveMeetingFlag(false));
    dispatch(editMeetingFlag(false));
    let Data = { meetingID: currentMeeting, StatusID: 1 };
    dispatch(UpdateOrganizersMeeting(navigate, Data, t, currentMeeting));
    // setorganizers(false)
    // setAgendaContributors(true)
    setRowsData([]);
  };

  const nextTabOrganizer = () => {
    // setviewOrganizers(!viewOrganizers)
    // let Data = { meetingID: currentMeeting, StatusID: 1 };
    // dispatch(UpdateOrganizersMeeting(navigate, Data, t));
    // setRowsData([]);
    setAgendaContributors(true);
    setmeetingDetails(false);
    setorganizers(false);
    setParticipants(false);
    setAgenda(false);
    setMinutes(false);
    setactionsPage(false);
    setAttendance(false);
    setPolls(false);
    setMeetingMaterial(false);
    setRowsData([]);
    dispatch(saveMeetingFlag(false));
    dispatch(editMeetingFlag(false));
  };

  const enableEditButton = () => {
    const updatedRowsData = rowsData.map((row) => ({
      ...row,
      disabledNotification: true,
      disabledRSVP: true,
      disabledSwitch: false,
      disabledTitle: false,
      isDeletable: true,
    }));
    dispatch(editMeetingFlag(true));
    setRowsData(updatedRowsData);
  };

  const handleEditDone = () => {
    setEditState(false);
  };

  const handleCancelEdit = () => {
    setCurrentMeetingID(0);
    setEditState(false);
    dispatch(meetingOrganizers([]));
    dispatch(selectedMeetingOrganizers([]));
    dispatch(saveMeetingFlag(false));
    dispatch(editMeetingFlag(false));
    const allMeetingOrganizers =
      MeetingOrganizersReducer.AllMeetingOrganizersData.meetingOrganizers;

    const updatedMeetingOrganizers = allMeetingOrganizers.map((organizer) => ({
      ...organizer,
      disabledNotification: false,
      disabledTitle: true,
      disabledSwitch: true,
      disabledRSVP: false,
      isDeletable: false,
    }));

    setRowsData(updatedMeetingOrganizers);
  };

  const saveMeetingOrganizers = () => {
    let Data = {
      MeetingOrganizers: rowsData.map((item) => ({
        IsPrimaryOrganizer: item.isPrimaryOrganizer,
        IsOrganizerNotified: item.isOrganizerNotified,
        Title: item.organizerTitle,
        UserID: item.userID,
      })),
      MeetingID: currentMeeting,
      IsOrganizerAddFlow: true,
      NotificationMessage: rowsData[0].NotificationMessage,
    };
    dispatch(SaveMeetingOrganizers(navigate, Data, t));
    dispatch(saveMeetingFlag(false));
    dispatch(editMeetingFlag(false));
    console.log("Save API call", Data);
  };

  const editMeetingOrganizers = () => {
    let Data = {
      MeetingOrganizers: rowsData.map((item) => ({
        IsPrimaryOrganizer: item.isPrimaryOrganizer,
        IsOrganizerNotified: item.isOrganizerNotified,
        Title: item.organizerTitle,
        UserID: item.userID,
      })),
      MeetingID: currentMeeting,
      IsOrganizerAddFlow: false,
      NotificationMessage: rowsData[0].NotificationMessage,
    };
    dispatch(SaveMeetingOrganizers(navigate, Data, t, currentMeeting));
    dispatch(saveMeetingFlag(false));
    dispatch(editMeetingFlag(false));
    console.log("Save API call", Data);
  };

  useEffect(() => {
    if (
      MeetingOrganizersReducer.AllMeetingOrganizersData !== undefined &&
      MeetingOrganizersReducer.AllMeetingOrganizersData !== null &&
      MeetingOrganizersReducer.AllMeetingOrganizersData.length !== 0
    ) {
      const allMeetingOrganizers =
        MeetingOrganizersReducer.AllMeetingOrganizersData.meetingOrganizers;

      const updatedMeetingOrganizers = allMeetingOrganizers.map(
        (organizer) => ({
          ...organizer,
          disabledNotification: false,
          disabledTitle: true,
          disabledSwitch: true,
          disabledRSVP: false,
          isDeletable: false,
          NotificationMessage: "",
        })
      );

      setRowsData(updatedMeetingOrganizers);
      console.log("updated Rows Data", updatedMeetingOrganizers);
    }
  }, [MeetingOrganizersReducer.AllMeetingOrganizersData]);

  useEffect(() => {
    if (
      MeetingOrganizersReducer.MeetingOrganizersData !== undefined &&
      MeetingOrganizersReducer.MeetingOrganizersData !== null &&
      MeetingOrganizersReducer.MeetingOrganizersData.length !== 0
    ) {
      const updatedRowsData = rowsData.map((organizer) => {
        const matchingOrganizer =
          MeetingOrganizersReducer.MeetingOrganizersData.find(
            (user) => user.userID === organizer.userID
          );

        if (matchingOrganizer) {
          // If a matching organizer is found in the global state, update the properties
          return {
            ...organizer,
            disabledTitle: matchingOrganizer.disabledTitle,
            disabledNotification: matchingOrganizer.disabledNotification,
            disabledSwitch: matchingOrganizer.disabledSwitch,
            disabledRSVP: matchingOrganizer.disabledRSVP,
            email: matchingOrganizer.email,
            isDeletable: matchingOrganizer.isDeletable,
            isOrganizerNotified: matchingOrganizer.isOrganizerNotified,
            isPrimaryOrganizer: matchingOrganizer.isPrimaryOrganizer,
            meetingID: currentMeeting,
            organizerTitle: matchingOrganizer.organizerTitle,
            rsvp: matchingOrganizer.rsvp,
            userName: matchingOrganizer.userName,
            NotificationMessage: matchingOrganizer.NotificationMessage,
          };
        }

        return organizer;
      });

      // Check for any new organizers in MeetingOrganizersData that are not in rowsData
      MeetingOrganizersReducer.MeetingOrganizersData.forEach((organizer) => {
        if (!updatedRowsData.some((user) => user.userID === organizer.userID)) {
          updatedRowsData.push({
            ...organizer,
            disabledTitle: organizer.disabledTitle,
            disabledNotification: organizer.disabledNotification,
            disabledSwitch: organizer.disabledSwitch,
            disabledRSVP: organizer.disabledRSVP,
            email: organizer.email,
            isDeletable: organizer.isDeletable,
            isOrganizerNotified: organizer.isOrganizerNotified,
            isPrimaryOrganizer: organizer.isPrimaryOrganizer,
            meetingID: currentMeeting,
            organizerTitle: organizer.organizerTitle,
            rsvp: organizer.rsvp,
            userName: organizer.userName,
            NotificationMessage: organizer.NotificationMessage,
          });
        }
      });

      // Set the updated rowsData
      setRowsData(updatedRowsData);
      console.log("updated Rows Data", updatedRowsData);
    }
  }, [MeetingOrganizersReducer.MeetingOrganizersData]);

  useEffect(() => {
    const updatedRowsData = [...rowsData];

    MeetingOrganizersReducer.NotificationUpdateData.forEach((data) => {
      const index = updatedRowsData.findIndex(
        (rowData) => rowData.userID === data.userID
      );

      if (index !== -1) {
        updatedRowsData[index] = {
          ...updatedRowsData[index],
          isOrganizerNotified: true,
        };
      }
    });

    // Update the rowsData state with the modified data
    setRowsData(updatedRowsData);
  }, [MeetingOrganizersReducer.NotificationUpdateData]);

  useEffect(() => {
    if (
      MeetingOrganizersReducer.ResponseMessage ===
      "Organizers-saved-successfully"
    ) {
      setTimeout(
        setOpen({
          open: true,
          message: t("Organizers-saved-successfully"),
        }),
        3000
      );
    } else if (
      MeetingOrganizersReducer.ResponseMessage ===
      "Notification-sent-successfully"
    ) {
      setTimeout(
        setOpen({
          open: true,
          message: t("Notification-sent-successfully"),
        }),
        3000
      );
    } else if (
      MeetingOrganizersReducer.ResponseMessage ===
      "Notification-not-sent-successfully"
    ) {
      setTimeout(
        setOpen({
          open: true,
          message: t("Notification-not-sent-successfully"),
        }),
        3000
      );
    }
    dispatch(clearResponseMessage(""));
  }, [MeetingOrganizersReducer.ResponseMessage]);

  console.log("MeetingOrganizersReducer", MeetingOrganizersReducer);

  console.log("NewMeetingreducer", NewMeetingreducer);

  console.log("Table Data", rowsData);

  return (
    <>
      {viewOrganizers ? (
        <OrganizersViewPage />
      ) : (
        <>
          <section className="position-relative">
            <Row className="mt-4 m-0 p-0">
              <Col
                lg={12}
                md={12}
                sm={12}
                className="d-flex justify-content-end gap-4"
              >
                {MeetingOrganizersReducer.SaveMeetingFlag === true &&
                MeetingOrganizersReducer.EditMeetingFlag === false ? (
                  <>
                    <Row className="d-flex align-items-center gap-2">
                      <Col lg={12} md={12} sm={12}>
                        <Button
                          text={"Cancel"}
                          className={styles["publish_button_Organization"]}
                          style={{ marginRight: "10px" }}
                          onClick={handleCancelEdit}
                        />

                        <Button
                          text={t("Save")}
                          className={styles["Next_Organization"]}
                          onClick={saveMeetingOrganizers}
                        />
                      </Col>
                    </Row>
                  </>
                ) : MeetingOrganizersReducer.SaveMeetingFlag === false &&
                  MeetingOrganizersReducer.EditMeetingFlag === true ? (
                  <>
                    <Row className="d-flex align-items-center gap-2">
                      <Col lg={12} md={12} sm={12}>
                        <Button
                          text={"Cancel"}
                          className={styles["publish_button_Organization"]}
                          style={{ marginRight: "10px" }}
                          onClick={handleCancelEdit}
                        />

                        <Button
                          text={t("Save")}
                          className={styles["Next_Organization"]}
                          onClick={editMeetingOrganizers}
                        />
                      </Col>
                    </Row>
                  </>
                ) : (
                  <>
                    <Button
                      text={t("Edit")}
                      className={styles["Edit_Button_Organizers"]}
                      icon={
                        <img
                          draggable={false}
                          src={EditIcon}
                          width="11.75px"
                          height="11.75px"
                        />
                      }
                      onClick={enableEditButton}
                    />
                    <Button
                      text={t("Add-more")}
                      icon={<img draggable={false} src={addmore} />}
                      className={styles["AddMoreBtn"]}
                      onClick={openAddUserModal}
                    />
                  </>
                )}
              </Col>
            </Row>
            <Row>
              <Col lg={12} md={12} sm={12}>
                <Table
                  column={MeetingColoumns}
                  scroll={{ y: "62vh" }}
                  pagination={false}
                  className="Polling_table"
                  rows={rowsData}
                />
              </Col>
            </Row>
          </section>
          {NewMeetingreducer.notifyOrganizors === false &&
          MeetingOrganizersReducer.SaveMeetingFlag === false &&
          MeetingOrganizersReducer.EditMeetingFlag === false ? (
            <Row>
              <Col lg={12} md={12} sm={12}>
                <section className={styles["Footer_button"]}>
                  <Button
                    text={t("Cancel")}
                    className={styles["Cancel_Organization"]}
                    onClick={handleCancelOrganizer}
                  />

                  <Button
                    text={"Previous"}
                    className={styles["Cancel_Organization"]}
                    onClick={previousTabOrganizer}
                  />

                  <Button
                    text={"Next"}
                    className={styles["publish_button_Organization"]}
                    onClick={nextTabOrganizer}
                  />

                  <Button
                    text={t("Publish")}
                    className={styles["Next_Organization"]}
                    onClick={handlePublishButton}
                  />
                </section>
              </Col>
            </Row>
          ) : null}
        </>
      )}

      <Notification setOpen={setOpen} open={open.open} message={open.message} />

      {NewMeetingreducer.adduserModal && <ModalOrganizor />}
      {NewMeetingreducer.crossConfirmation && <ModalCrossIcon />}
      {NewMeetingreducer.notifyOrganizors && <NotifyOrganizers />}
      {NewMeetingreducer.sendNotificationOrganizerModal === true ? (
        <SendNotificationOrganizer />
      ) : null}
      {NewMeetingreducer.cancelModalOrganizer && (
        <CancelModalOrganizer setSceduleMeeting={setSceduleMeeting} />
      )}
    </>
  );
};

export default Organizers;
