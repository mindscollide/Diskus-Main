import React, { useState, useEffect, useRef } from "react";
import { Col, Container, Row } from "react-bootstrap";
import styles from "./ModalShareFolder.module.css";
import newprofile from "../../../assets/images/Mask Group 67.svg";
import clock from "../../../assets/images/DataRoom-clock_icon.png";
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
import gregorian_ar from "react-date-object/locales/gregorian_ar";
import DatePicker, { DateObject } from "react-multi-date-picker";

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
import {
  createFileLinkApi,
  createFolderLinkApi,
  createFolderLink_fail,
  shareFoldersApi,
} from "../../../store/actions/DataRoom_actions";
import { useNavigate } from "react-router-dom";
import ChevronDown from "../../../assets/images/chevron-down.svg";
import ChevronDownWhite from "../../../assets/images/chevron_down_white.svg";
import moment from "moment";
import EditIcon from "../../../assets/images/Edit-Icon.png";
import copyToClipboard from "../../../hooks/useClipBoard";
import { updateFolderGeneralAccessApi } from "../../../store/actions/DataRoom_actions";
const ModalShareFolder = ({
  ModalTitle,
  sharefolder,
  setSharefolder,
  folderId,
  folderName,
}) => {
  const { t } = useTranslation();
  const [showaccessrequest, setShowaccessrequest] = useState(false);
  const { assignees } = useSelector((state) => state);
  const getSharedFolderUsers = useSelector(
    (state) => state.DataRoomReducer.getSharedFolderUsers
  );
  const getCreateFolderLink = useSelector(
    (state) => state.DataRoomReducer.getCreateFolderLink
  );
  const [showrequestsend, setShowrequestsend] = useState(false);
  const [generalaccessdropdown, setGeneralaccessdropdown] = useState(false);
  const [linkedcopied, setLinkedcopied] = useState(false);
  const [expirationheader, setExpirationheader] = useState(true);
  const [calenderdate, setCalenderdate] = useState(false);
  const [inviteedit, setInviteedit] = useState(false);
  const [notifyPeople, setNotifyPeople] = useState(false);
  const [folderData, setFolderData] = useState({
    Folders: [],
  });
  const [open, setOpen] = useState({
    flag: false,
    message: "",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const datePickerRef = useRef();
  const [getAllAssignees, setGetAllAssignees] = useState([]);
  const [calendarValue, setCalendarValue] = useState(gregorian);
  const [localValue, setLocalValue] = useState(gregorian_en);
  const [meetingDate, setMeetingDate] = useState("");
  const [EditNotification, setEditNotification] = useState(false);
  const [accessupdate, setAccessupdate] = useState(false);
  const [taskAssignedToInput, setTaskAssignedToInput] = useState("");
  const [taskAssignedTo, setTaskAssignedTo] = useState(0);
  const [permissionID, setPermissionID] = useState({
    label: t("Editor"),
    value: 1,
  });
  const [generalAccess, setGeneralAccess] = useState({
    label: t("Restricted"),
    value: 1,
  });
  const [taskAssignedName, setTaskAssignedName] = useState("");
  const [organizationMembers, setOrganizationMembers] = useState([]);
  const [isMembers, setMembers] = useState([]);
  const [ownerInfo, setOwnerInfo] = useState(null);
  const [flag, setFlag] = useState(1);
  const [onclickFlag, setOnclickFlag] = useState(false);
  let organizationName = localStorage.getItem("OrganizatioName");
  let currentLanguage = localStorage.getItem("i18nextLng");
  let userID = localStorage.getItem("userID");
  const [AccessExpireDate, setAccessExpireDate] = useState(null);

  const showcalender = () => {
    // setCalenderdate(!calenderdate);
    // setInviteedit(!inviteedit);
    // setExpirationheader(false);
  };

  useEffect(() => {
    if (getCreateFolderLink !== "") {
      copyToClipboard(getCreateFolderLink);
      setTimeout(() => {
        dispatch(createFolderLink_fail(""));
      }, 2000);
    }
  }, [getCreateFolderLink]);
  useEffect(() => {
    if (linkedcopied === true) {
      setTimeout(() => {
        setLinkedcopied(false);
      }, 2000);
    }
  }, [linkedcopied]);
  useEffect(() => {
    if (currentLanguage !== null) {
      if (currentLanguage === "en") {
        setCalendarValue(gregorian);
        setLocalValue(gregorian_en);
      } else if (currentLanguage === "ar") {
        setCalendarValue(gregorian);
        setLocalValue(gregorian_ar);
      }
    }
  }, [currentLanguage]);

  const handlechange = (SelectedOptions) => {
    setPermissionID({
      label: SelectedOptions.label,
      value: SelectedOptions.value,
    });
    if (SelectedOptions.value === 1) {
      setEditNotification(false);
      setAccessupdate(true);
    } else if (SelectedOptions.value === 2) {
      setEditNotification(true);
      setAccessupdate(false);
    }
  };

  const NotificationForlinkCopied = () => {
    console.log("Hello NotificationForlinkCopied");
    let Data = {
      FolderID: Number(folderId),
      PermissionID: Number(permissionID.value),
    };
    console.log("Hello NotificationForlinkCopied", Data);

    dispatch(createFolderLinkApi(navigate, t, Data, setLinkedcopied));
    // setLinkedcopied(true);
  };

  const options = [
    { value: 2, label: t("Viewer") },
    { value: 1, label: t("Editor") },
  ];

  const optionsgeneralAccess = [
    { value: 1, label: t("Restricted") },
    { value: 2, label: organizationName },
    { value: 3, label: t("Any-one-with-link") },
  ];

  useEffect(() => {
    dispatch(allAssignessList(navigate, t));
  }, []);

  useEffect(() => {
    if (assignees.user.length > 0) {
      setGetAllAssignees(assignees.user);
    }
  }, [assignees]);

  useEffect(() => {
    try {
      if (getSharedFolderUsers !== null && getSharedFolderUsers !== undefined) {
        if (assignees.user.length > 0) {
          if (getSharedFolderUsers.listOfUsers.length > 0) {
            let newData = [];
            let newMembersData = [];

            let usersList = getSharedFolderUsers.listOfUsers;
            let ownerInfo = getSharedFolderUsers.owner;
            let allMembers = assignees.user;
            console.log(ownerInfo, usersList, "getAllAssigneesgetAllAssignees");
            usersList.forEach((userData, index) => {
              newData.push({
                FK_PermissionID: userData.permissionID,
                FK_UserID: userData.userID,
                ExpiryDateTime: "",
              });
              let findOwner = allMembers.find(
                (data, index) => data.pK_UID === ownerInfo.userID
              );
              setOwnerInfo(findOwner);
              allMembers.forEach((newData, index) => {
                if (newData.pK_UID === userData.userID) {
                  newMembersData.push(newData);
                }
              });
            });
            setFolderData((prev) => {
              return { ...prev, Folders: newData };
            });
            setMembers(newMembersData);
          }
        }
      }
    } catch {}
  }, [getSharedFolderUsers, assignees]);

  const searchFilterHandler = (value) => {
    if (
      getAllAssignees.length > 0 &&
      getAllAssignees !== undefined &&
      getAllAssignees !== null
    ) {
      return getAllAssignees
        .filter((item) => {
          const searchTerm = value.toLowerCase();
          const assigneesName = item.name.toLowerCase();
          return searchTerm && assigneesName.startsWith(searchTerm);
        })
        .slice(0, 10)
        .map((item) => (
          <div
            onClick={() => onSearch(item.name, item.pK_UID)}
            className="dropdown-row-assignee d-flex align-items-center flex-row"
            key={item.pK_UID}
          >
            {console.log("itemitem", item)}
            <img
              draggable="false"
              src={`data:image/jpeg;base64,${item.displayProfilePictureName}`}
              alt=""
              className="user-img"
            />
            <p className="p-0 m-0">{item.name}</p>
          </div>
        ));
    } else {
      console.log("not found");
    }
  };

  const onSearch = (name, id) => {
    setOnclickFlag(true);
    console.log("name id", name, id);
    setTaskAssignedToInput(name);
    setTaskAssignedTo(id);
    setTaskAssignedName(name);
  };

  //Input Field Assignee Change
  const onChangeSearch = (e) => {
    setOnclickFlag(false);
    if (e.target.value.trimStart() !== "") {
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
      let ShareFolderData = {
        FolderID: Number(folderId),
        Folders: folderData.Folders,
      };
      dispatch(shareFoldersApi(navigate, ShareFolderData, t, setSharefolder));
    }
  };

  const openAccessRequestModalClick = () => {
    if (folderData.Folders.length > 0) {
      let ShareFolderData = {
        FolderID: Number(folderId),
        Folders: folderData.Folders,
      };

      dispatch(shareFoldersApi(navigate, ShareFolderData, t, setSharefolder));
    } else {
      setOpen({
        flag: true,
        message: t("Atleast-one-user-should-be-selected-to-share-the-folder"),
      });
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
            FK_PermissionID: JSON.parse(permissionID.value),
            FK_UserID: taskAssignedTo,
            ExpiryDateTime: "",
          };
          if (taskAssignedTo !== 0) {
            if (assignees.user.length > 0) {
              assignees.user.forEach((data, index) => {
                if (data.pK_UID === taskAssignedTo) {
                  setMembers([...isMembers, data]);
                }
              });
            }
          }
          setFolderData((prev) => {
            return { ...prev, Folders: [...prev.Folders, Data] };
          });
          setTaskAssignedToInput("");
          setTaskAssignedTo(0);
          setTaskAssignedName("");
          setPermissionID({
            label: t("Editor"),
            value: 1,
          });
          setGeneralAccess({
            label: t("Restricted"),
            value: 1,
          });
        } else {
          setOpen({
            flag: true,
            message: t("User-is-already-exist"),
          });
          setTaskAssignedToInput("");
          setTaskAssignedTo(0);
          setTaskAssignedName("");
          setPermissionID({
            label: t("Editor"),
            value: 1,
          });
          setGeneralAccess({
            label: t("Restricted"),
            value: 1,
          });
        }
      } else {
        setOpen({
          flag: true,
          message: t("Please-select-user"),
        });
      }
    } else {
      setOpen({
        flag: true,
        message: t("All-options-must-be-selected"),
      });
    }

    // setTaskAssignedToInput("");
    // setTaskAssignedTo(0);
    // setTaskAssignedName("");
    // setPermissionID({
    //   label: t("Editor"),
    //   value: 2,
    // });
    // setGeneralAccess({
    //   label: t("Restricted"),
    //   value: 1,
    // });
  };

  const closebtn = async () => {
    setSharefolder(false);
  };

  const handleChangeGeneralAccess = async (selectValue) => {
    setGeneralAccess({
      label: selectValue.label,
      value: selectValue.value,
    });
    let data = { FolderID: Number(folderId), AccessID: selectValue.value };
    await dispatch(updateFolderGeneralAccessApi(navigate, t, data));
  };

  const CustomIcon = () => (
    <div className="custom-icon-wrapper">
      <img
        src={EditIcon}
        alt="Edit Icon"
        height="11.11px"
        width="11.54px"
        className="custom-icon cursor-pointer"
        onClick={handleIconClick}
        draggable="false"
      />
    </div>
  );

  const handleIconClick = () => {
    console.log("handleIconClick");
    if (datePickerRef.current) {
      datePickerRef.current.openCalendar();
    }
  };

  const handleRemoveMember = (memberData) => {
    let findIndexfromsendData = folderData.Folders.findIndex(
      (data, index) => data.FK_UserID === memberData.pK_UID
    );
    let findIndexfromViewData = isMembers.findIndex(
      (data, index) => data.pK_UID === memberData.pK_UID
    );
    folderData.Folders.splice(findIndexfromsendData, 1);
    isMembers.splice(findIndexfromViewData, 1);
    setMembers([...isMembers]);
    setFolderData((prev) => {
      return { ...prev, Folders: [...prev.Folders] };
    });
  };

  const AccessExpireDateChangeHandler = (date) => {
    let meetingDateValueFormat = new DateObject(date).format("DD/MM/YYYY");
    setAccessExpireDate(meetingDateValueFormat);
  };
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
          size={showaccessrequest ? "md" : inviteedit === true ? "md" : "lg"}
          // ModalTitle={
          //   <>
          //     {/* <MultiDatePicker
          //               // onChange={meetingDateHandler}
          //               name="MeetingDate"
          //               value={meetingDate}
          //               calendar={calendarValue}
          //               locale={localValue}
          //               // newValue={createMeeting.MeetingDate}
          //             /> */}
          //     <Row>
          //       <Col
          //         lg={12}
          //         md={12}
          //         sm={12}
          //         className={styles["Expiration_header_background"]}
          //       >
          //         <Row>
          //           <Col
          //             lg={12}
          //             md={12}
          //             sm={12}
          //             className="d-flex justify-content-center align-items-center gap-3"
          //           >
          //             <img
          //               draggable="false"
          //               src={clock}
          //               height="14.66px"
          //               width="14.97px"
          //               alt=""
          //               onClick={handleIconClick}
          //             />
          //             <span className={styles["Text_for_header_expiration"]}>
          //               {`${t("Access-expires-on")} ${AccessExpireDate}`}
          //               {/* {t("Access-expires-on")} */}
          //               {/* {} */}
          //             </span>
          //             <DatePicker
          //               format={"DD/MM/YYYY"}
          //               minDate={moment().toDate()}
          //               placeholder="DD/MM/YYYY"
          //               render={<CustomIcon />}
          //               calendarPosition="bottom-right"
          //               editable={true}
          //               className="datePickerTodoCreate2"
          //               onOpenPickNewDate={false}
          //               highlightToday={false}
          //               inputMode=""
          //               showOtherDays
          //               calendar={calendarValue}
          //               locale={localValue}
          //               ref={datePickerRef}
          //               onClick={handleIconClick}
          //               onChange={(value) =>
          //                 AccessExpireDateChangeHandler(value)
          //               }
          //             />
          //             <img
          //               draggable="false"
          //               src={DeleteiCon}
          //               width="9.47px"
          //               alt=""
          //               height="11.75px"
          //             />
          //           </Col>
          //         </Row>
          //       </Col>
          //     </Row>
          //   </>
          // }
          ModalBody={
            <>
              {inviteedit ? (
                <>
                  <Row>
                    <Col lg={12} md={12} sm={12}>
                      <span className={styles["Shared_Document_Heading"]}>
                        Saad Fudda {t("Shared-a-document")}
                      </span>
                    </Col>
                  </Row>

                  <Row className="mt-3">
                    <Col lg={12} md={12} sm={12} className="d-flex gap-2">
                      <img
                        draggable="false"
                        src={newprofile}
                        height="40px"
                        width="41px"
                        alt=""
                      />
                      <Row className="mt-1">
                        <Col
                          lg={12}
                          md={12}
                          sm={12}
                          className={styles["Line-height"]}
                        >
                          <Row>
                            <Col lg={12} md={12} sm={12}>
                              <span className={styles["InvitetoEdit_Heading"]}>
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
                              <span className={styles["InvitetoEdit_Heading"]}>
                                {t("The-following-document-until")} 27 Apr 2023,
                                11:59 GMT
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
                              <img
                                draggable="false"
                                src={pdf}
                                height="16px"
                                alt=""
                                width="14.23px"
                              />
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
                                alt=""
                                draggable="false"
                                src={download}
                                height="11px"
                                width="12.15px"
                              />
                              <img
                                draggable="false"
                                src={star}
                                height="10.22px"
                                alt=""
                                width="12.07px"
                              />
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </>
              ) : (
                <>
                  <Row>
                    <Col lg={12} md={12} sm={12}>
                      <span className={styles["Share_folder_modal_Heading"]}>
                        {t("Share")} <span>{folderName}</span>
                      </span>
                    </Col>
                  </Row>
                  <Row className="mt-2">
                    <Col lg={7} md={7} sm={12}>
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
                      <Select
                        isSearchable={false}
                        value={{
                          value: permissionID.value,
                          label: permissionID.label,
                        }}
                        options={options}
                        placeholder={t("Editor")}
                        className={styles["Editor_select"]}
                        onChange={handlechange}
                        classNamePrefix={
                          permissionID.value === 0
                            ? "shareFolderEditor_Selector_empty"
                            : "shareFolderEditor_Selector"
                        }
                      />
                      {/* )} */}
                    </Col>
                    {/* <Col lg={3} md={3} sm={3}>
                      <Select
                        value={{
                          label: generalAccess.label,
                          value: generalAccess.value,
                        }}
                        isSearchable={false}
                        options={optionsgeneralAccess}
                        placeholder={t("General-access")}
                        className={styles["Editor_select"]}
                        classNamePrefix={
                          generalAccess.value === 0
                            ? "shareFolderEditor_Selector_empty"
                            : "shareFolderEditor_Selector"
                        }
                        onChange={handleChangeGeneralAccess}
                      />
                    </Col> */}
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
                        {ownerInfo !== null && (
                          <Col sm={4} md={4} lg={4}>
                            <ParticipantInfoShareFolder
                              participantname={ownerInfo?.name}
                              particiapantdesignation={ownerInfo?.designation}
                              userPic={ownerInfo?.displayProfilePictureName}
                            />{" "}
                          </Col>
                        )}

                        {isMembers.length > 0
                          ? isMembers.map((data, index) => {
                              return (
                                <Col lg={4} md={4} sm={4} key={data.pK_UID}>
                                  <ParticipantInfoShareFolder
                                    participantname={data.name}
                                    particiapantdesignation={data.designation}
                                    userPic={data.displayProfilePictureName}
                                    icon={
                                      <img
                                        draggable="false"
                                        src={crossIcon}
                                        height="14px"
                                        width="14px"
                                        alt=""
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
                                <img draggable="false"
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
                      <Checkbox
                        checked={notifyPeople}
                        onChange={() => setNotifyPeople(!notifyPeople)}
                      />
                      <span className={styles["Notify_people_styles"]}>
                        {t("Notify-people")}
                      </span>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg={8} md={8} sm={8}>
                      <Select
                        value={{
                          label:
                            generalAccess.value === 1 ? (
                              <>
                                <Row>
                                  <Col sm={12} md={12} lg={12}>
                                    {generalAccess.label}
                                  </Col>
                                  <Col
                                    sm={12}
                                    md={12}
                                    lg={12}
                                    className={styles["generalAccess-value"]}
                                  >
                                    ({" "}
                                    {t(
                                      "Only-people-with-access-can-open-with-the-link"
                                    )}
                                    )
                                  </Col>
                                </Row>
                              </>
                            ) : generalAccess.value === 2 ? (
                              generalAccess.label
                            ) : generalAccess.value === 3 ? (
                              <>
                                <Row>
                                  <Col sm={12} md={12} lg={12}>
                                    {generalAccess.label}
                                  </Col>
                                  <Col
                                    sm={12}
                                    md={12}
                                    lg={12}
                                    className={styles["generalAccess-value"]}
                                  >
                                    (
                                    {`${t(
                                      "Anyone-on-the-internet-with-the-link-can-view"
                                    )}`}
                                    )
                                  </Col>
                                </Row>
                              </>
                            ) : (
                              ""
                            ),
                          value: generalAccess.value,
                        }}
                        isSearchable={false}
                        options={optionsgeneralAccess}
                        placeholder={t("General-access")}
                        className={styles["Editor_select"]}
                        classNamePrefix={
                          generalAccess.value === 0
                            ? "shareFolderEditor_Selector_empty"
                            : "shareFolderEditor_Selector"
                        }
                        onChange={handleChangeGeneralAccess}
                      />
                    </Col>
                  </Row>
                </>
              )}
            </>
          }
          ModalFooter={
            <>
              {inviteedit ? (
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
      <Notification open={open.flag} message={open.message} setOpen={setOpen} />
    </>
  );
};

export default ModalShareFolder;
