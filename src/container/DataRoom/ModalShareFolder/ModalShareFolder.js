import React, { useState, useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import styles from "./ModalShareFolder.module.css";
import newprofile from "../../../assets/images/Mask Group 67.svg";
import clock from "../../../assets/images/Icon metro-alarm.svg";
import DeleteiCon from "../../../assets/images/Icon material-delete.svg";
import userImage from "../../../assets/images/user.png";
import crossIcon from "../../../assets/images/CrossIcon.svg";
import arabic from "react-date-object/calendars/arabic";
import arabic_ar from "react-date-object/locales/arabic_ar";
import download from "../../../assets/images/Icon feather-download.svg";
import star from "../../../assets/images/startd.png";
import pdf from "../../../assets/images/222.svg";
import gregorian from "react-date-object/calendars/gregorian";
import gregorian_en from "react-date-object/locales/gregorian_en";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  Button,
  Checkbox,
  MultiDatePicker,
  Modal,
  TextField,
  Notification,
  InputSearchFilter,
} from "../../../components/elements";
import { style } from "@mui/system";
import ParticipantInfoShareFolder from "../../../components/elements/ParticipantInfoShareFolder/ParticipantInfoShareFolder";
import EditIconNote from "../../../assets/images/EditIconNotes.svg";
import { allAssignessList } from "../../../store/actions/Get_List_Of_Assignees";
import { shareFoldersApi } from "../../../store/actions/DataRoom_actions";
import { useNavigate } from "react-router-dom";
import ChevronDown from "../../../assets/images/chevron-down.svg";
import ChevronDownWhite from "../../../assets/images/chevron_down_white.svg";

const ModalShareFolder = ({
  ModalTitle,
  sharefolder,
  setSharefolder,
  folderId,
  folderName,
}) => {
  const [showaccessrequest, setShowaccessrequest] = useState(false);
  const { assignees } = useSelector((state) => state);
  const [showrequestsend, setShowrequestsend] = useState(false);
  const [generalaccessdropdown, setGeneralaccessdropdown] = useState(false);
  const [linkedcopied, setLinkedcopied] = useState(false);
  const [expirationheader, setExpirationheader] = useState(false);
  const [calenderdate, setCalenderdate] = useState(false);
  const [inviteedit, setInviteedit] = useState(false);
  const [notifyPeople, setNotifyPeople] = useState(false)
  const [folderData, setFolderData] = useState({
    Folders: [],
  });
  const [open, setOpen] = useState({
    flag: false,
    message: ""
  })
  console.log(folderData, "datadatadata");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [calendarValue, setCalendarValue] = useState(gregorian);
  const [localValue, setLocalValue] = useState(gregorian_en);
  const [meetingDate, setMeetingDate] = useState("");
  const [EditNotification, setEditNotification] = useState(false);
  const [accessupdate, setAccessupdate] = useState(false);
  const [taskAssignedToInput, setTaskAssignedToInput] = useState("");
  const [taskAssignedTo, setTaskAssignedTo] = useState(0);
  const [permissionID, setPermissionID] = useState({
    label: "",
    value: 0,
  });
  const [generalAccess, setGeneralAccess] = useState({
    label: "",
    value: 0
  })
  const [taskAssignedName, setTaskAssignedName] = useState("");
  const [organizationMembers, setOrganizationMembers] = useState([]);
  const [isMembers, setMembers] = useState([]);
  console.log(isMembers, "isMembersisMembersisMembersisMembers");
  const [flag, setFlag] = useState(1);
  const [onclickFlag, setOnclickFlag] = useState(false);
  let organizationName = localStorage.getItem("OrganizatioName")

  const showcalender = () => {
    // setCalenderdate(!calenderdate);
    setInviteedit(!inviteedit);
    setExpirationheader(false);
  };
  useEffect(() => {
    if (linkedcopied === true) {
      setTimeout(() => {
        setLinkedcopied(false);
      }, 2000);
    }
  }, []);

  const handlechange = (SelectedOptions) => {
    console.log("handlechangehandlechange", SelectedOptions);
    setPermissionID({
      label: SelectedOptions.label,
      value: SelectedOptions.value,
    });
    if (SelectedOptions.value === 3) {
      console.log("yes add expiration selected ");
      setExpirationheader(true);
      setEditNotification(false);
      setAccessupdate(false);
    } else if (SelectedOptions.value === 1) {
      setExpirationheader(false);
      setEditNotification(false);
      setAccessupdate(true);
    } else if (SelectedOptions.value === 2) {
      setExpirationheader(false);
      setEditNotification(true);
      setAccessupdate(false);
    }
  };
  const NotificationForlinkCopied = () => {
    setLinkedcopied(true);
  };
  const options = [
    { value: 1, label: "Viewer" },
    { value: 2, label: "Editor" },
    { value: 3, label: "Add Expiration" },
  ];
  const optionsgeneralAccess = [
    { value: 1, label: "Restricted" },
    { value: 2, label: organizationName },
    { value: 3, label: "Any One With link" },
  ];

  useEffect(() => {
    dispatch(allAssignessList(navigate, t));
  }, []);

  const searchFilterHandler = (value) => {
    let allAssignees = assignees.user;
    console.log("Input Value", allAssignees);
    if (
      allAssignees != undefined &&
      allAssignees != null &&
      allAssignees != NaN &&
      allAssignees != []
    ) {
      return allAssignees
        .filter((item) => {
          const searchTerm = value.toLowerCase();
          const assigneesName = item.name.toLowerCase();
          console.log("Input Value in searchTerm", searchTerm);
          console.log("Input Value in assigneesName", assigneesName);

          return (
            searchTerm && assigneesName.startsWith(searchTerm)
            // assigneesName !== searchTerm.toLowerCase()
          );
        })
        .slice(0, 10)
        .map((item) => (
          <div
            onClick={() => onSearch(item.name, item.pK_UID)}
            className="dropdown-row-assignee d-flex align-items-center flex-row"
            key={item.pK_UID}
          >
            {console.log("itemitem", item)}
            <img src={userImage} />
            <p className="p-0 m-0">{item.name}</p>
          </div>
        ));
    } else {
      console.log("not found");
    }
  };

  const onSearch = (name, id) => {
    setOnclickFlag(true)
    console.log("name id", name, id);
    setTaskAssignedToInput(name);
    setTaskAssignedTo(id);
    setTaskAssignedName(name);
  };


  //Input Field Assignee Change
  const onChangeSearch = (e) => {
    setOnclickFlag(false)
    if (e.target.value.trimStart() != "") {
      setTaskAssignedToInput(e.target.value.trimStart());
    } else {
      setTaskAssignedToInput("");
      setTaskAssignedTo(0);
      setTaskAssignedName("");
    }
    console.log("setTaskAssignedToInput", e.target.value.trimStart());
  };

  const Notificationnaccessrequest = () => {
    console.log("hnbhaiclicktuhorahahy");
    if (folderData.Folders.length > 0) {
      setShowrequestsend(true);
      dispatch(shareFoldersApi(navigate, folderData, t, setShowrequestsend));
    }
  };
  const openAccessRequestModalClick = () => {
    if (folderData.Folders.length > 0) {
      setShowaccessrequest(true);

    } else {
      setOpen({
        flag: true,
        message: t("User-required-must-for-share")
      })
    }
  };

  const handleAddMember = () => {
    let findIndexData = folderData.Folders.findIndex(
      (listData, index) => listData.FK_UserID === taskAssignedTo
    );
    if (permissionID.value !== 0) {
      if (taskAssignedName !== "") {
        if (findIndexData === -1) {

          let Data = {
            FK_FolderID: folderId,
            FK_PermissionID: JSON.parse(permissionID.value),
            FK_UserID: taskAssignedTo,
          };
          if (taskAssignedTo !== 0) {
            if (assignees.user.length > 0) {
              assignees.user.map((data, index) => {
                if (data.pK_UID === taskAssignedTo) {
                  setMembers([...isMembers, data]);
                }
              });
            }
          }
          setFolderData((prev) => {
            return { ...prev, Folders: [...prev.Folders, Data] };
          });
        } else {
          setOpen({
            flag: true,
            message: t("User-is-already-exist")
          })
        }
      } else {
        setOpen({
          flag: true,
          message: t("Please-select-user")
        })
      }
    } else {
      setOpen({
        flag: true,
        message: t("All-options-must-be-selected")
      })
    }



    setTaskAssignedToInput("");
    setTaskAssignedTo(0);
    setTaskAssignedName("");
    setPermissionID({
      label: "",
      value: 0
    })
    setGeneralAccess({
      label: "",
      value: 0
    })
  };

  const { t } = useTranslation();
  const closebtn = async () => {
    setSharefolder(false);
  };
  const handleChangeGeneralAccess = (selectValue) => {
    setGeneralAccess({
      label: selectValue.label,
      value: selectValue.value
    })
  }

  const handleRemoveMember = (memberData) => {
    let findIndexfromsendData = folderData.Folders.findIndex((data, index) => data.FK_UserID === memberData.pK_UID)
    let findIndexfromViewData = isMembers.findIndex((data, index) => data.pK_UID === memberData.pK_UID)
    folderData.Folders.splice(findIndexfromsendData, 1);
    isMembers.splice(findIndexfromViewData, 1);
    setMembers([...isMembers])
    setFolderData((prev) => {
      return { ...prev, Folders: [...prev.Folders] }
    })

  }

  return (
    <>
      <Container>
        <Modal
          show={sharefolder}
          onHide={() => {
            setSharefolder(false);
          }}
          setShow={setSharefolder}
          ButtonTitle={ModalTitle}
          modalFooterClassName="d-block"
          modalTitleClassName={styles["ModalHeader"]}
          modalHeaderClassName={styles["ModalRequestHeader"]}
          centered
          size={sharefolder === true ? "lg" : inviteedit === true ? "sm" : "md"}
          ModalTitle={
            <>
              {expirationheader ? (
                <>
                  {calenderdate ? (
                    <>
                      <MultiDatePicker
                        // onChange={meetingDateHandler}
                        name="MeetingDate"
                        value={meetingDate}
                        calendar={calendarValue}
                        locale={localValue}
                      // newValue={createMeeting.MeetingDate}
                      />
                    </>
                  ) : null}
                  <Row>
                    <Col
                      lg={12}
                      md={12}
                      sm={12}
                      className={styles["Expiration_header_background"]}
                    >
                      <Row>
                        <Col
                          lg={12}
                          md={12}
                          sm={12}
                          className="d-flex justify-content-center gap-3"
                        >
                          <img src={clock} height="14.66px" width="14.97px" />
                          <span
                            className={styles["Text_for_header_expiration"]}
                          >
                            {t("Access-expires-on")} Apr 20 11:11PM
                          </span>
                          <Row className={styles["margin"]}>
                            <Col
                              lg={12}
                              md={12}
                              sm={12}
                              className="d-flex gap-2"
                            >
                              <img
                                src={EditIconNote}
                                height="11.11px"
                                width="11.54px"
                                onClick={showcalender}
                              />
                              <img
                                src={DeleteiCon}
                                width="9.47px"
                                height="11.75px"
                              />
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </>
              ) : null}
            </>
          }
          ModalBody={
            <>
              {showaccessrequest ? (
                showrequestsend ? (
                  <>
                    <Container>
                      {generalaccessdropdown}
                      <Row>
                        <Col lg={12} md={12} sm={12}>
                          <span className={styles["Request_send_heading"]}>
                            {t("Request-send")}
                          </span>
                        </Col>
                      </Row>
                      <Row className="mt-2">
                        <Col md={12} sm={12} lg={12}>
                          <span className={styles["description_request_send"]}>
                            {t(
                              "You-will-get-an-email-letting-you-know-if-file-is-shared-with-you"
                            )}
                          </span>
                        </Col>
                      </Row>
                    </Container>
                  </>
                ) : (
                  <>
                    <Container>
                      <Row>
                        <Col lg={12} md={12} sm={12}>
                          <span
                            className={styles["Access_request_modal_heading"]}
                          >
                            {t("You-need-acccess")}
                          </span>
                        </Col>
                      </Row>
                      <Row>
                        <Col lg={12} md={12} sm={12}>
                          <span
                            className={styles["Sub_line_access_request_modal"]}
                          >
                            {t("Ask-for-access-or-switch-account-with-access")}
                          </span>
                        </Col>
                      </Row>
                      <Row>
                        <Col
                          lg={12}
                          md={12}
                          sm={12}
                          className="CreateMeetingInput "
                        >
                          <TextField
                            applyClass="text-area-create-group"
                            type="text"
                            as={"textarea"}
                            rows="11"
                            placeholder={t("Messege(optional)")}
                            required={true}
                          />
                        </Col>
                      </Row>
                    </Container>
                  </>
                )
              ) : inviteedit ? (
                <>
                  <Container>
                    <Row>
                      <Col lg={12} md={12} sm={12}>
                        <span className={styles["Shared_Document_Heading"]}>
                          Saad Fudda {t("Shared-a-document")}
                        </span>
                      </Col>
                    </Row>

                    <Row className="mt-3">
                      <Col lg={12} md={12} sm={12} className="d-flex gap-2">
                        <img src={newprofile} height="40px" width="41px" />
                        <Row className="mt-1">
                          <Col
                            lg={12}
                            md={12}
                            sm={12}
                            className={styles["Line-height"]}
                          >
                            <Row>
                              <Col lg={12} md={12} sm={12}>
                                <span
                                  className={styles["InvitetoEdit_Heading"]}
                                >
                                  Saad Fudda (Saad@gmail.com)
                                  {t("Has-invited-you-to")}
                                  <span className={styles["Edit_options"]}>
                                    {t("Edit")}
                                  </span>
                                </span>
                              </Col>
                            </Row>
                            <Row>
                              <Col lg={12} md={12} sm={12}>
                                <span
                                  className={styles["InvitetoEdit_Heading"]}
                                >
                                  {t("The-following-document-until")} 27 Apr
                                  2023, 11:59 GMT
                                </span>
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                    <Row className="mt-4">
                      <Col
                        lg={12}
                        md={12}
                        sm={12}
                        className={styles["Box_for_attachments"]}
                      >
                        <Row className="mt-2">
                          <Col lg={12} md={12} sm={12}>
                            <Row>
                              <Col
                                lg={10}
                                md={10}
                                sm={10}
                                className="d-flex justify-content-start gap-2 "
                              >
                                <img src={pdf} height="16px" width="14.23px" />
                                <span className={styles["File_name"]}>
                                  Merger proposal for ABC Industries.pdf
                                </span>
                              </Col>
                              <Col
                                lg={2}
                                md={2}
                                sm={2}
                                className="d-flex justify-content-end gap-2 mt-1"
                              >
                                <img
                                  src={download}
                                  height="11px"
                                  width="12.15px"
                                />
                                <img
                                  src={star}
                                  height="10.22px"
                                  width="12.07px"
                                />
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </Container>
                </>
              ) : (
                <>
                  <Container>
                    <Row>
                      <Col lg={12} md={12} sm={12}>
                        <span className={styles["Share_folder_modal_Heading"]}>
                          {t("Share")} <span>{folderName}</span>
                        </span>
                      </Col>
                    </Row>
                    <Row className="mt-2">
                      <Col lg={4} md={4} sm={4}>
                        <InputSearchFilter
                          labelClass="d-none"
                          flag={flag}
                          applyClass="sharefoldersearchInput"
                          placeholder={t("Search-member-here")}
                          value={taskAssignedToInput}
                          filteredDataHandler={searchFilterHandler(
                            taskAssignedToInput
                          )}
                          change={onChangeSearch}
                          onclickFlag={onclickFlag}
                        />
                      </Col>
                      <Col lg={3} md={3} sm={3}>
                        {permissionID.value !== 0 ? (
                          <div className={styles["dropdown__Document_Value"]}>
                            <span className={styles["overflow-text"]}>
                              {permissionID.label}
                            </span>
                            <img
                              width="12px"
                              height="12px"
                              onClick={() => {
                                setPermissionID({
                                  label: "",
                                  value: 0,
                                });
                              }}
                              src={ChevronDownWhite}
                            />
                          </div>
                        ) : (
                          <Select
                            options={options}
                            placeholder={t("Editor")}
                            className={styles["Editor_select"]}
                            onChange={handlechange}
                            classNamePrefix={"editSelector"}
                          />
                        )}
                      </Col>
                      <Col lg={3} md={3} sm={3}>
                        {generalAccess.value !== 0 ? <div className={styles["dropdown__Document_Value"]}>
                          <span className={styles["overflow-text"]}>
                            {generalAccess.label}
                          </span>
                          <img
                            width="12px"
                            height="12px"
                            onClick={() => {
                              setGeneralAccess({
                                label: "",
                                value: 0,
                              });
                            }}
                            src={ChevronDownWhite}
                          />
                        </div> : <Select
                          options={optionsgeneralAccess}
                          placeholder={t("General-access")}
                          className={styles["Editor_select"]}
                          classNamePrefix={"editSelector"}
                          onChange={handleChangeGeneralAccess}
                        />}

                      </Col>
                      <Col lg={2} md={2} sm={2}>
                        <Button
                          text="Add"
                          className={styles["shareFolderAddMemberBtn"]}
                          onClick={handleAddMember}
                        />
                      </Col>
                    </Row>
                    <Row className="mt-2">
                      <Col
                        lg={12}
                        md={12}
                        sm={12}
                        className={styles["Scroller_particiapnt_shared_folder"]}
                      >
                        <Row>
                          {isMembers.length > 0
                            ? isMembers.map((data, index) => {
                              return (
                                <Col lg={4} md={4} sm={4} key={data.pK_UID}>
                                  <ParticipantInfoShareFolder
                                    participantname={data.name}
                                    particiapantdesignation={data.designation}
                                    icon={
                                      <img
                                        src={crossIcon}
                                        height="14px"
                                        width="14px"
                                        onClick={() => handleRemoveMember(data)}
                                      />
                                    }
                                  />
                                </Col>
                              );
                            })
                            : null}

                          {/* <Col lg={4} md={4} sm={4}>
                            <ParticipantInfoShareFolder
                              participantname="Saad Fudda"
                              particiapantdesignation="Owner"
                              icon={
                                <img
                                  src={crossIcon}
                                  height="14px"
                                  width="14px"
                                />
                              }
                            />
                          </Col> */}
                        </Row>
                      </Col>
                    </Row>
                    <Row className="mt-2">
                      <Col
                        lg={12}
                        md={12}
                        sm={12}
                        className="CreateMeetingInput "
                      >
                        <TextField
                          applyClass="text-area-sharefolder"
                          type="text"
                          as={"textarea"}
                          rows="4"
                          placeholder={t("Messege")}
                          required={true}
                        />
                      </Col>
                    </Row>
                    <Row className="mt-3">
                      <Col
                        lg={12}
                        md={12}
                        sm={12}
                        className="d-flex gap-3 align-items-center"
                      >
                        <Checkbox checked={notifyPeople} onChange={() => setNotifyPeople(!notifyPeople)
                        } />
                        <span className={styles["Notify_people_styles"]}>
                          {t("Notify-people")}
                        </span>
                      </Col>
                    </Row>
                  </Container>
                </>
              )}
            </>
          }
          ModalFooter={
            <>
              {showaccessrequest ? (
                showrequestsend ? null : (
                  <>
                    <Row>
                      <Col
                        lg={12}
                        md={12}
                        sm={12}
                        className="d-flex justify-content-end"
                      >
                        <Button
                          text={t("Request-access")}
                          className={styles["Request_Access_btn"]}
                          onClick={Notificationnaccessrequest}
                        />
                      </Col>
                    </Row>
                  </>
                )
              ) : inviteedit ? (
                <>
                  <Row>
                    <Col
                      lg={11}
                      md={11}
                      sm={11}
                      className="d-flex justify-content-end"
                    >
                      <Button
                        text={t("Open")}
                        className={styles["Open_button"]}
                      />
                    </Col>
                  </Row>
                </>
              ) : (
                <>
                  <Row>
                    <Col
                      lg={6}
                      md={6}
                      sm={6}
                      className="d-flex justify-content-start"
                    >
                      <Button
                        text={t("Copy-link")}
                        className={styles["Copy_Link_btn"]}
                        onClick={NotificationForlinkCopied}
                      />
                    </Col>
                    <Col
                      lg={6}
                      md={6}
                      sm={6}
                      className="d-flex justify-content-end"
                    >
                      <Button
                        text={t("Send")}
                        className={styles["send_btn"]}
                        onClick={openAccessRequestModalClick}
                      />
                    </Col>
                  </Row>
                  {linkedcopied ? (
                    <>
                      <Row>
                        <Col
                          lg={12}
                          sm={12}
                          md={12}
                          className={styles["Background_notification"]}
                        >
                          <Row className="mt-2">
                            <Col
                              lg={12}
                              md={12}
                              sm={12}
                              className="d-flex justify-content-center"
                            >
                              <span className={styles["Link_copied"]}>
                                {t("Link-copied")}
                              </span>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </>
                  ) : null}
                  {EditNotification ? (
                    <>
                      <Row>
                        <Col
                          lg={12}
                          md={12}
                          sm={12}
                          className={styles["Back_ground_editNotification"]}
                        >
                          <Row>
                            <Col
                              lg={12}
                              md={12}
                              sm={12}
                              className="d-flex justify-content-center mt-2"
                            >
                              <span className={styles["Edit_notification"]}>
                                {t("You-dont-have-permission-to-edit")} "Folder
                                1"
                              </span>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </>
                  ) : null}
                  {accessupdate ? (
                    <>
                      <Row>
                        <Col
                          lg={12}
                          md={12}
                          sm={12}
                          className={styles["Back_ground_accessupdate"]}
                        >
                          <Row>
                            <Col
                              lg={12}
                              md={12}
                              sm={12}
                              className="d-flex justify-content-center mt-2"
                            >
                              <span className={styles["Access_updated"]}>
                                {t("Access-updated")}
                              </span>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </>
                  ) : null}
                </>
              )}
            </>
          }
        />
      </Container>
      <Notification open={open.flag} message={open.message}
        setOpen={setOpen} />
    </>
  );
};

export default ModalShareFolder;
