import React, { useEffect, useState } from "react";
import styles from "./AgendaContributors.module.css";
import EditIcon from "../../../../../assets/images/Edit-Icon.png";
import addmore from "../../../../../assets/images/addmore.png";
import emptyContributorState from "../../../../../assets/images/emptyStateContributor.svg";
import redcrossIcon from "../../../../../assets/images/Artboard 9.png";
import greenMailIcon from "../../../../../assets/images/greenmail.svg";
import redMailIcon from "../../../../../assets/images/redmail.svg";
import NotificationIcon from "../../../../../assets/images/greenmail.svg";
import RspvIcon from "../../../../../assets/images/rspvGreen.svg";
import RspcAbstainIcon from "../../../../../assets/images/rspvAbstain.svg";
import Select from "react-select";
import { Col, Row } from "react-bootstrap";
import { Button, Table, TextField } from "../../../../../components/elements";
import { useTranslation } from "react-i18next";
import AgendaContributorsModal from "./AgdendaContributorsModal/AgendaContributorsModal";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getAllAgendaContributorApi,
  showAddAgendaContributor,
  showAgendaContributorsModals,
  showCancelModalAgendaContributor,
  showCancelModalOrganizers,
  showCrossConfirmationModal,
} from "../../../../../store/actions/NewMeetingActions";
import ModalCrossIcon from "../Organizers/ModalCrossIconClick/ModalCrossIcon";
import tick from "../../../../../assets/images/PNG tick.png";
import NotifyAgendaModal from "./NotifyAgendaContributors/NotifyAgendaModal";
import { notification } from "antd";
import AgendaContributorView from "./AgendaContributorsView/AgendaContributorView";
import CancelAgendaContributor from "./CancelButtonAgendaContributor/CancelAgendaContributor";
import { saveAgendaContributors } from "../../../../../store/actions/NewMeetingActions";
const AgendaContributers = ({
  setParticipants,
  setAgendaContributors,
  setSceduleMeeting,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [specificUser, setSpecifiUser] = useState(0);
  const { NewMeetingreducer, MeetingOrganizersReducer } = useSelector(
    (state) => state
  );
  const [isEdit, setIsEdit] = useState(false);
  const [notifyMessageField, setNotifyMessageField] = useState("");
  const [notificationTable, setNotificationTable] = useState(false);
  const [rspvTable, setrspvTable] = useState(false);
  const [selectedOption, setSelectedOption] = useState({
    value: 1,
    label: (
      <>
        <Row>
          <Col lg={12} md={12} sm={12}>
            <span className={styles["Options_classs_contributors"]}>
              {t("Grant-access-to-all-agenda-items-and-files")}
            </span>
          </Col>
        </Row>
      </>
    ),
  });

  const [rowsData, setRowsData] = useState([]);

  const [notifiedMembersData, setNotificedMembersData] = useState(null);

  const [viewAgendaContributors, setViewAgendaContributors] = useState(false);

  const [inputValues, setInputValues] = useState({});
  console.log(
    specificUser,
    "specificUserspecificUserspecificUserspecificUserspecificUser"
  );
  const shownotifyAgendaContrubutors = (id) => {
    dispatch(showAgendaContributorsModals(true));
    setSpecifiUser(id);
  };

  // const openCrossIconModal = () => {
  //   dispatch(showCrossConfirmationModal(true));
  // };
  let currentMeetingID = localStorage.getItem("meetingID");

  useEffect(() => {
    let getAllData = {
      MeetingID: currentMeetingID !== null ? Number(currentMeetingID) : 1686,
    };
    dispatch(getAllAgendaContributorApi(navigate, t, getAllData));
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
            Title: newValue,
          };
        }
        return row;
      });
    });
  };

  const handleRemoveContributor = (record) => {
    let removeData = rowsData.filter(
      (data, index) => data.userID !== record.userID
    );
    setRowsData(removeData);
  };
  const AgendaColoumns = [
    {
      title: t("Name"),
      dataIndex: "userName",
      key: "userName",
      width: "80px",
    },
    {
      title: t("Email"),
      dataIndex: "email",
      key: "email",
      width: "80px",
    },
    {
      title: t("contributor-title"),
      dataIndex: "Title",
      key: "Title",
      width: "80px",
      render: (text, record) => (
        <Row>
          <Col lg={12} md={12} sm={12}>
            <TextField
              disable={record.isEdit ? true : false}
              placeholder={t("Content-title")}
              labelClass={"d-none"}
              width={"100%"}
              applyClass={"Organizer_table"}
              value={inputValues[record.userID] || ""} // Use the controlled value
              change={(e) => handleInputChange(record.userID, e.target.value)} // Update the inputValues when the user types
            />
          </Col>
        </Row>
      ),
    },
    {
      dataIndex: "isNotifed",
      key: "isNotified",
      width: "80px",
      render: (text, record) => {
        console.log("recordrecordrecordrecord", record);
        if (record.isContributedNotified) {
          return (
            <Row>
              <Col
                lg={12}
                md={12}
                sm={12}
                className="d-flex justify-content-center"
              >
                <img
                  draggable={false}
                  src={greenMailIcon}
                  height="30px"
                  width="30px"
                  alt=""
                  onClick={() => shownotifyAgendaContrubutors(record.userID)}
                />
              </Col>
            </Row>
          );
        } else {
          return (
            <Row>
              <Col
                lg={12}
                md={12}
                sm={12}
                className="d-flex justify-content-center"
              >
                <img
                  draggable={false}
                  src={redMailIcon}
                  height="30px"
                  alt=""
                  width="30px"
                  onClick={() => shownotifyAgendaContrubutors(record.userID)}
                />
              </Col>
            </Row>
          );
        }
      },
    },
    {
      dataIndex: "Close",
      key: "Close",
      width: "80px",
      render: (text, record) => {
        return (
          <>
            <Row>
              <Col
                lg={12}
                md={12}
                sm={12}
                className="d-flex justify-content-center"
              >
                {!record.isEdit && (
                  <img
                    draggable={false}
                    src={redcrossIcon}
                    width="21.79px"
                    alt=""
                    className="cursor-pointer"
                    height="21.79px"
                    onClick={() => handleRemoveContributor(record)}
                  />
                )}
              </Col>
            </Row>
          </>
        );
      },
    },
  ];

  // const rspvData = [
  //   {
  //     key: "1",
  //     Name: <label className={styles["Title_desc"]}>Muahmmad Saif</label>,
  //     Email: (
  //       <label className="column-boldness">Saifiiyousuf4002@gmail.com</label>
  //     ),
  //     OrganizerTitle: <label className="column-boldness">Organizer</label>,
  //     Notification: (
  //       <>
  //         <Row>
  //           <Col lg={12} md={12} sm={12}>
  //             <img
  //               draggable={false}
  //               src={NotificationIcon}
  //               width="17.64px"
  //               height="12.4px"
  //             />
  //             {/* <img draggable = {false} src={redMailIcon} width="17.64px" height="12.4px" /> */}
  //           </Col>
  //         </Row>
  //       </>
  //     ),
  //     rsvp: (
  //       <>
  //         <img draggable={false} src={RspvIcon} height="30px" width="30px" />
  //         {/* <img draggable = {false} src={RspcAbstainIcon} height="30px" width="30px" /> */}
  //       </>
  //     ),
  //   },
  // ];
  // const [rspvRows, setrspvRows] = useState(rspvData);

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  // React select tick option handled
  const CustomOption = ({ innerProps, label, isSelected }) => (
    <div {...innerProps} className={styles["option"]}>
      {console.log(label, "labellabellabel")}
      <Row>
        <Col lg={12} md={12} sm={12} className={styles["OverAll_padding"]}>
          <Row className="mt-2">
            <Col lg={11} md={11} sm={11}>
              <span className={styles["label_Styles"]}>{label}</span>
            </Col>
            <Col lg={1} md={1} sm={1}>
              {isSelected && <img alt="" draggable={false} src={tick} />}
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );

  const options = [
    {
      value: 1,
      label: (
        <>
          <Row>
            <Col lg={12} md={12} sm={12}>
              <span className={styles["Options_classs_contributors"]}>
                {t("Grant-access-to-all-agenda-items-and-files")}
              </span>
            </Col>
          </Row>
        </>
      ),
    },
    {
      value: 2,
      label: (
        <>
          <Row>
            <Col lg={12} md={12} sm={12}>
              <span className={styles["Options_classs_contributors"]}>
                {t("Grant-access-to-their-own-agenda-items-and-files-only")}
              </span>
            </Col>
          </Row>
        </>
      ),
    },
  ];

  const handleNextButton = () => {
    setAgendaContributors(false);
    setParticipants(true);
  };

  const openAddAgendaModal = () => {
    dispatch(showAddAgendaContributor(true));
  };

  const enableNotificatoinTable = () => {
    // setNotificationTable(!notificationTable);
    dispatch(showCancelModalAgendaContributor(true));
  };

  //You Can Enable Rspv Table From Here
  // const anableRspvTable = () => {
  //   setrspvTable(!rspvTable);
  // };

  const EnableViewAgendaContributors = () => {
    setViewAgendaContributors(!viewAgendaContributors);
  };

  const handleEditBtn = () => {
    setRowsData((prevRowsData) => {
      return prevRowsData.map((row) => {
        return {
          ...row,
          isEdit: false,
        };
      });
    });
  };

  const handleCancelBtn = () => {
    if (NewMeetingreducer.getAllAgendaContributors.length > 0) {
      let agendaContributorData = [
        ...NewMeetingreducer.getAllAgendaContributors,
      ];

      // Initial values
      const initialValues = {};
      agendaContributorData.forEach((organizer) => {
        initialValues[organizer.userID] = organizer.contributorTitle;
      });

      setInputValues({ ...initialValues });

      let newArr = [];
      agendaContributorData.forEach((AgConData, index) => {
        newArr.push({
          userName: AgConData.userName,
          userID: AgConData.userID,
          displayPicture: "",
          email: AgConData.emailAddress,
          IsPrimaryOrganizer: false,
          IsOrganizerNotified: false,
          Title: AgConData.contributorTitle,
          isRSVP: AgConData.rsvp,
          isEdit: true,
        });
      });
      setRowsData(newArr);
    }
    // let removenewData = rowsData.filter((data, index) => data.isEdit === true);
    // setRowsData(removenewData);
    // let getAllData = {
    //   MeetingID: currentMeetingID !== null ? Number(currentMeetingID) : 1686,
    // };
    // dispatch(getAllAgendaContributorApi(navigate, t, getAllData));
    // Create a copy of data with was coming
  };

  const handleSaveBtn = () => {
    let newData = [];
    let copyData = [...rowsData];
    copyData.forEach((data, index) => {
      newData.push({
        UserID: data.userID,
        Title: data.Title,
        AgendaListRightsAll: data.isRSVP,
        MeetingID: currentMeetingID !== null ? Number(currentMeetingID) : 1686,
      });
    });
    let Data = {
      AgendaContributors: newData,
    };
    dispatch(saveAgendaContributors(navigate, t, Data));
  };

  useEffect(() => {
    if (
      NewMeetingreducer.getAllAgendaContributors !== null &&
      NewMeetingreducer.getAllAgendaContributors !== undefined &&
      NewMeetingreducer.getAllAgendaContributors.length > 0
    ) {
      // Create a copy of data with was coming
      let agendaContributorData = [
        ...NewMeetingreducer.getAllAgendaContributors,
      ];

      // Initial values
      const initialValues = {};
      agendaContributorData.forEach((organizer) => {
        initialValues[organizer.userID] = organizer.contributorTitle;
      });

      setInputValues({ ...initialValues });

      let newArr = [];
      agendaContributorData.forEach((AgConData, index) => {
        newArr.push({
          userName: AgConData.userName,
          userID: AgConData.userID,
          displayPicture: "",
          email: AgConData.emailAddress,
          Title: AgConData.contributorTitle,
          isRSVP: AgConData.rsvp,
          isEdit: true,
          isContributedNotified: AgConData.isContributorNotified,
        });
      });
      setRowsData(newArr);
    }
  }, [NewMeetingreducer.getAllAgendaContributors]);

  useEffect(() => {
    if (rowsData.length > 0) {
      let getifTrue = rowsData.some((data, index) => data.isEdit === false);
      setIsEdit(getifTrue);
    } else {
      setIsEdit(false);
    }
  }, [rowsData]);

  return (
    <>
      {viewAgendaContributors ? (
        <AgendaContributorView />
      ) : (
        <>
          <section className="position-relative">
            <Row className="mt-5">
              <Col lg={4} md={4} sm={12}>
                <Select
                  options={options}
                  value={selectedOption}
                  onChange={handleOptionSelect}
                  isSearchable={false}
                  components={{
                    Option: CustomOption,
                  }}
                />
              </Col>
              <Col
                lg={8}
                md={8}
                sm={12}
                className="d-flex justify-content-end gap-3"
              >
                {isEdit ? (
                  <>
                    <Button
                      text={t("Cancel")}
                      className={styles["Cancel_button"]}
                      onClick={handleCancelBtn}
                    />
                    <Button
                      text={t("Save")}
                      onClick={handleSaveBtn}
                      className={styles["Save_button"]}
                    />
                  </>
                ) : (
                  <>
                    <Button
                      text={t("Edit")}
                      className={styles["Edit_button"]}
                      onClick={handleEditBtn}
                    />
                    <Button
                      text={t("Add-more")}
                      icon={<img draggable={false} src={addmore} alt="" />}
                      className={styles["AddMoreBtn"]}
                      onClick={openAddAgendaModal}
                    />
                  </>
                )}
              </Col>
            </Row>
            <Row>
              <Col lg={12} md={12} sm={12}>
                <Table
                  column={AgendaColoumns}
                  scroll={{ y: "62vh" }}
                  pagination={false}
                  locale={{
                    emptyText: (
                      <>
                        <Row>
                          <Col
                            lg={12}
                            md={12}
                            sm={12}
                            className="d-flex justify-content-center"
                          >
                            <img
                              draggable={false}
                              src={emptyContributorState}
                              width="274.05px"
                              alt=""
                              height="230.96px"
                            />
                          </Col>
                        </Row>
                        <Row>
                          <Col
                            lg={12}
                            md={12}
                            sm={12}
                            className="d-flex justify-content-center"
                          >
                            <span className={styles["Empty_state_heading"]}>
                              {t("No-agenda-contributor")}
                            </span>
                          </Col>
                        </Row>
                        <Row>
                          <Col
                            lg={12}
                            md={12}
                            sm={12}
                            className="d-flex justify-content-center"
                          >
                            <span className={styles["Empty_state_Subheading"]}>
                              {t("There-are-no-agenda-contributors")}
                            </span>
                          </Col>
                        </Row>
                      </>
                    ),
                  }}
                  className="Polling_table"
                  rows={rowsData}
                />
              </Col>
            </Row>
          </section>
          <Row>
            <Col lg={12} md={12} sm={12}>
              {!isEdit ? (
                <section className={styles["Footer_Class"]}>
                  <Button
                    text={t("Cancel")}
                    className={styles["Cancel_Organization"]}
                    onClick={enableNotificatoinTable}
                  />
                  <Button
                    text={t("Save")}
                    className={styles["Cancel_Organization"]}
                  />
                  <Button
                    text={t("Save-and-publish")}
                    className={styles["Cancel_Organization"]}
                    onClick={EnableViewAgendaContributors}
                  />
                  <Button
                    text={t("Save-and-next")}
                    className={styles["Next_Organization"]}
                    onClick={handleNextButton}
                  />
                </section>
              ) : (
                <section className={styles["Footer_Class2"]}></section>
              )}
            </Col>
          </Row>
        </>
      )}

      {NewMeetingreducer.agendaContributors && (
        <AgendaContributorsModal
          SelectedRSVP={selectedOption}
          rowsData={rowsData}
          setRowsData={setRowsData}
          setNotificedMembersData={setNotificedMembersData}
        />
      )}
      {NewMeetingreducer.crossConfirmation && <ModalCrossIcon />}
      {NewMeetingreducer.notifyAgendaContributors && (
        <NotifyAgendaModal
          notifiedMembersData={rowsData}
          setRowsData={setRowsData}
          notifyMessageField={notifyMessageField}
          setNotifyMessageField={setNotifyMessageField}
          specificUser={specificUser}
          setSpecifiUser={setSpecifiUser}
        />
      )}
      {NewMeetingreducer.cancelAgendaContributor && (
        <CancelAgendaContributor setSceduleMeeting={setSceduleMeeting} />
      )}
    </>
  );
};

export default AgendaContributers;
