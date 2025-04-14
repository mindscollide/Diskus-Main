import React, { useState, useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import styles from "./ModalShareFile.module.css";
import newprofile from "../../../assets/images/Mask Group 67.svg";
import crossIcon from "../../../assets/images/CrossIcon.svg";
import download from "../../../assets/images/Icon feather-download.svg";
import star from "../../../assets/images/startd.png";
import pdf from "../../../assets/images/222.svg";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  Button,
  Checkbox,
  Modal,
  Notification,
  TextField,
} from "../../../components/elements";
import ParticipantInfoShareFolder from "../../../components/elements/ParticipantInfoShareFolder/ParticipantInfoShareFolder";
import { allAssignessList } from "../../../store/actions/Get_List_Of_Assignees";
import {
  createFileLink_fail,
  createFolderLinkApi,
  shareFilesApi,
  updateGeneralAccessApi,
} from "../../../store/actions/DataRoom_actions";
import { useNavigate } from "react-router-dom";
import copyToClipboard from "../../../hooks/useClipBoard";
import { showMessage } from "../../../components/elements/snack_bar/utill";

const ModalShareFile = ({
  ModalTitle,
  shareFile,
  setShareFile,
  folderId,
  fileName,
}) => {
  const { assignees } = useSelector((state) => state);
  const getSharedFileUsers = useSelector(
    (state) => state.DataRoomReducer.getSharedFileUsers
  );
  const getCreateFileLink = useSelector(
    (state) => state.DataRoomReducer.getCreateFileLink
  );
  const [showaccessrequest, setShowaccessrequest] = useState(false);
  const [showrequestsend, setShowrequestsend] = useState(false);
  const [linkedcopied, setLinkedcopied] = useState(false);
  const [inviteedit, setInviteedit] = useState(false);
  const [notifyPeople, setNotifyPeople] = useState(false);
  const [ownerInfo, setOwnerInfo] = useState(null);
  const [message, setMessage] = useState("");
  const [EditNotification, setEditNotification] = useState(false);
  const [accessupdate, setAccessupdate] = useState(false);
  const [open, setOpen] = useState({
    open: false,
    message: "",
    severity: "error",
  });
  const [fileData, setFileData] = useState({
    Files: [],
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [personValue, setPersonValue] = useState({
    value: 0,
    label: "",
  });
  const { t } = useTranslation();

  const [permissionID, setPermissionID] = useState({
    label: t("Editor"),
    value: 2,
  });
  const [generalAccess, setGeneralAccess] = useState({
    label: t("Restricted"),
    value: 1,
  });
  const [getAllAssignees, setGetAllAssignees] = useState([]);

  const [isMembers, setMembers] = useState([]);

  let organizationName = localStorage.getItem("organizatioName");
  let userID = localStorage.getItem("userID");
  const options = [
    { value: 1, label: t("Viewer") },
    { value: 2, label: t("Editor") },
  ];

  const optionsgeneralAccess = [
    { value: 1, label: t("Restricted") },
    { value: 2, label: organizationName },
    { value: 3, label: t("Any-one-with-link") },
  ];

  //  Copy Link  useEffect
  useEffect(() => {
    if (linkedcopied === true) {
      setTimeout(() => {
        setLinkedcopied(false);
      }, 2000);
    }
  }, [linkedcopied]);

  // Copy Link text useEffect
  useEffect(() => {
    if (getCreateFileLink !== "") {
      copyToClipboard(getCreateFileLink);
      setTimeout(() => {
        dispatch(createFileLink_fail(""));
      }, 2000);
    }
  }, [getCreateFileLink]);

  // Get All Assignee Api Calling
  useEffect(() => {
    dispatch(allAssignessList(navigate, t, false));
  }, []);

  // set All User in state which was coming from api
  useEffect(() => {
    if (assignees.user.length > 0) {
      let usersDataArr = [];
      assignees.user
        .filter((assignee) => assignee.pK_UID !== Number(userID))
        .map((usersData, index) => {
          usersDataArr.push({
            value: usersData.pK_UID,
            label: usersData.name,
            name: usersData.name,
          });
        });
      setGetAllAssignees(usersDataArr);
    }
  }, [assignees, userID]);
  // set All Shared data with are coming from api
  useEffect(() => {
    try {
      if (getSharedFileUsers !== null && getSharedFileUsers !== undefined) {
        let ownerInfo = getSharedFileUsers.owner;
        setOwnerInfo(ownerInfo);
        if (assignees.user.length > 0) {
          if (getSharedFileUsers.listOfUsers.length > 0) {
            let newData = [];
            let newMembersData = [];

            let usersList = getSharedFileUsers.listOfUsers;

            let allMembers = assignees.user;

            usersList.forEach((userData, index) => {
              newData.push({
                FK_FileID: ownerInfo.fileID,
                FK_PermissionID: userData.permissionID,
                FK_UserID: userData.userID,
                ExpiryDateTime: "",
              });

              allMembers.forEach((newData, index) => {
                if (newData.pK_UID === userData.userID) {
                  newMembersData.push(newData);
                }
              });
            });
            setFileData((prev) => {
              return { ...prev, Files: newData };
            });
            setMembers(newMembersData);
          }
        }
      }
    } catch {}
  }, [getSharedFileUsers, assignees]);

  // change Handler for user rights
  const handlechange = (SelectedOptions) => {
    setPermissionID({
      label: SelectedOptions.label,
      value: SelectedOptions.value,
    });
  };

  // copy link api calling
  const NotificationForlinkCopied = () => {
    let Data = {
      ID: Number(folderId),
      PermissionID: Number(permissionID.value),
      isFolder: false,
    };

    dispatch(createFolderLinkApi(navigate, t, Data, setLinkedcopied));
  };

  //Input Field Assignee Change
  const onChangeSearch = (e) => {
    setPersonValue(e);
  };

  const openAccessRequestModalClick = () => {
    let ShareFilesData = {
      FileID: Number(folderId),
      Files: fileData.Files,
      Message: message,
    };
    dispatch(shareFilesApi(navigate, ShareFilesData, t, setShareFile));
  };

  const handleAddMember = () => {
    let findIndexData = fileData.Files.findIndex(
      (listData, index) => listData.FK_UserID === personValue.value
    );
    if (permissionID.value !== 0) {
      if (personValue.value !== 0) {
        if (findIndexData === -1) {
          let Data = {
            FK_PermissionID: JSON.parse(permissionID.value),
            FK_UserID: personValue.value,
            ExpiryDateTime: "",
          };
          if (personValue.value !== 0) {
            if (assignees.user.length > 0) {
              assignees.user.map((data, index) => {
                if (data.pK_UID === personValue.value) {
                  setMembers([...isMembers, data]);
                }
              });
            }
          }
          setFileData((prev) => {
            return { ...prev, Files: [...prev.Files, Data] };
          });
        } else {
          showMessage(t("User-is-already-exist"), "error", setOpen);
        }
        setPersonValue({
          value: 0,
          label: "",
        });
        setPermissionID({
          label: t("Editor"),
          value: 2,
        });
        setGeneralAccess({
          label: t("Restricted"),
          value: 1,
        });
      } else {
        // showMessage(t("User-select-must"), "error", setOpen);
      }
    } else {
      showMessage(t("All-options-must-be-selected"), "error", setOpen);
    }
  };

  const handleChangeGeneralAccess = (selectedValue) => {
    setGeneralAccess({
      label: selectedValue.label,
      value: selectedValue.value,
    });
    let Data = { FileID: Number(folderId), AccessID: selectedValue.value };
    dispatch(updateGeneralAccessApi(navigate, t, Data));
  };

  const handleRemoveMember = (memberData) => {
    let findIndexfromsendData = fileData.Files.findIndex(
      (data, index) => data.FK_UserID === memberData.pK_UID
    );
    let findIndexfromViewData = isMembers.findIndex(
      (data, index) => data.pK_UID === memberData.pK_UID
    );
    fileData.Files.splice(findIndexfromsendData, 1);
    isMembers.splice(findIndexfromViewData, 1);
    setMembers([...isMembers]);
    setFileData((prev) => {
      return { ...prev, Files: [...prev.Files] };
    });
  };

  return (
    <>
      <Container>
        <Modal
          show={shareFile}
          onHide={() => {
            setShareFile(false);
          }}
          setShow={setShareFile}
          ButtonTitle={ModalTitle}
          modalFooterClassName='d-block position-relative'
          modalTitleClassName={styles["ModalHeader"]}
          modalHeaderClassName={styles["ModalRequestHeader"]}
          centered
          size={
            showaccessrequest
              ? "md"
              : inviteedit === true ||
                (showaccessrequest === true && showrequestsend === true)
              ? "md"
              : "lg"
          }
          ModalBody={
            <>
              <Container>
                <Row>
                  <Col lg={12} md={12} sm={12}>
                    <span className={styles["Share_folder_modal_Heading"]}>
                      {t("Share")} <span>{fileName}</span>
                    </span>
                  </Col>
                </Row>
                <Row className='mt-3'>
                  <Col lg={7} md={7} sm={12}>
                    <Select
                      isSearchable={true}
                      value={personValue.value !== 0 ? personValue : null}
                      placeholder={t("Select-members")}
                      options={getAllAssignees}
                      onChange={onChangeSearch}
                    />
                  </Col>
                  <Col lg={3} md={3} sm={3}>
                    <Select
                      value={{
                        value: permissionID.value,
                        label: permissionID.label,
                      }}
                      defaultValue={{
                        value: permissionID.value,
                        label: permissionID.label,
                      }}
                      options={options}
                      isSearchable={false}
                      placeholder={t("Editor")}
                      onChange={handlechange}
                      classNamePrefix={
                        permissionID.value === 0
                          ? "shareFolderEditor_Selector_empty"
                          : "shareFolderEditor_Selector"
                      }
                    />
                  </Col>

                  <Col lg={2} md={2} sm={2}>
                    <Button
                      text={t("Add")}
                      className={styles["shareFolderAddMemberBtn"]}
                      onClick={handleAddMember}
                    />
                  </Col>
                </Row>
                <Row className='mt-2'>
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className={styles["Scroller_particiapnt_shared_folder"]}>
                    <Row>
                      {ownerInfo !== null && (
                        <Col sm={4} md={4} lg={4}>
                          <ParticipantInfoShareFolder
                            participantname={ownerInfo?.userName}
                            particiapantdesignation={ownerInfo?.designation}
                            userPic={ownerInfo?.base64Img}
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
                                      draggable='false'
                                      src={crossIcon}
                                      height='14px'
                                      width='14px'
                                      className={styles["cross_icon_modal"]}
                                      onClick={() => handleRemoveMember(data)}
                                      alt=''
                                    />
                                  }
                                />
                              </Col>
                            );
                          })
                        : null}
                    </Row>
                  </Col>
                </Row>
                <Row className='mt-2'>
                  <Col lg={12} md={12} sm={12} className='CreateMeetingInput '>
                    <TextField
                      applyClass='text-area-create-group'
                      type='text'
                      as={"textarea"}
                      rows='4'
                      value={message}
                      change={(e) => setMessage(e.target.value)}
                      placeholder={t("Messege")}
                      required={true}
                    />
                  </Col>
                </Row>
                <Row className='mt-3'>
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className='d-flex gap-3 align-items-center'>
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
                  <Col lg={6} md={6} sm={6}>
                    <Select
                      value={{
                        label:
                          generalAccess.value === 1 ? (
                            <>
                              <Row>
                                <Col>{generalAccess.label}</Col>
                                <Col>
                                  {t(
                                    "Only-people-with-access-can-open-with-the-link"
                                  )}
                                </Col>
                              </Row>
                            </>
                          ) : generalAccess.value === 2 ? (
                            generalAccess.label
                          ) : generalAccess.value === 3 ? (
                            <>
                              <Row>
                                <Col>{generalAccess.label}</Col>
                                <Col>
                                  {t(
                                    "Anyone-on-the-internet-with-the-link-can-view"
                                  )}
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
                      onChange={handleChangeGeneralAccess}
                      classNamePrefix={
                        generalAccess.value === 0
                          ? "shareFolderEditor_Selector_empty"
                          : "shareFolderEditor_Selector"
                      }
                    />
                  </Col>
                </Row>
              </Container>
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
                      className='d-flex justify-content-end'>
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
                      className='d-flex justify-content-start'>
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
                      className='d-flex justify-content-end'>
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
                          className={styles["Background_notification"]}>
                          <Row className='mt-2'>
                            <Col
                              lg={12}
                              md={12}
                              sm={12}
                              className='d-flex justify-content-center'>
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
                          className={styles["Back_ground_editNotification"]}>
                          <Row>
                            <Col
                              lg={12}
                              md={12}
                              sm={12}
                              className='d-flex justify-content-center mt-2'>
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
                          className={styles["Back_ground_accessupdate"]}>
                          <Row>
                            <Col
                              lg={12}
                              md={12}
                              sm={12}
                              className='d-flex justify-content-center mt-2'>
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
      <Notification open={open} setOpen={setOpen} />
    </>
  );
};

export default ModalShareFile;
