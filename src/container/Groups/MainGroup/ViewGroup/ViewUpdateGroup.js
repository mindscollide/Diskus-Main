import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import styles from "./ViewUpdateGroup.module.css";
import featherupload from "../../../../assets/images/featherupload.svg";
import { useTranslation } from "react-i18next";
import { Upload } from "antd";

import {
  Button,
  AttachmentViewer,
  Notification,
} from "./../../../../components/elements";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  SaveGroupsDocumentsApiFunc,
  saveFilesGroupsApi,
  uploadDocumentsGroupsApi,
} from "../../../../store/actions/Groups_actions";
import { DataRoomDownloadFileApiFunc } from "../../../../store/actions/DataRoom_actions";
import { maxFileSize } from "../../../../commen/functions/utils";
import { showMessage } from "../../../../components/elements/snack_bar/utill";
const ViewUpdateGroup = ({ setViewGroupPage, groupStatus }) => {
  console.log(groupStatus, "groupStatus");
  const { Dragger } = Upload;
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [fileAttachments, setFileAttachments] = useState([]);
  const [previousFileIDs, setPreviousFileIDs] = useState([]);

  const [folderID, setFolderID] = useState(0);
  const [fileForSend, setFileForSend] = useState([]);
  const [fileSize, setFileSize] = useState(0);
  const [open, setOpen] = useState({
    open: false,
    message: "",
    severity: "error",
  });
  const [viewGroupDetails, setViewGroupDetails] = useState({
    Title: "",
    Description: "",
    GroupMembers: [],
    GroupHeads: [],
    GroupStatus: null,
    GroupType: null,
    isTalk: false,
    GroupID: 0,
  });

  const { GroupsReducer } = useSelector((state) => state);

  const GroupsReducergetGroupByGroupIdResponse = useSelector(
    (state) => state.GroupsReducer.getGroupByGroupIdResponse
  );

  const GroupsReducergroupDocuments = useSelector(
    (state) => state.GroupsReducer.groupDocuments
  );

  useEffect(() => {
    try {
      if (GroupsReducergetGroupByGroupIdResponse !== null) {
        let groupDetails = GroupsReducergetGroupByGroupIdResponse;
        let groupHeadsData = groupDetails.groupMembers.filter(
          (data, index) => data.groupRole.groupRoleID === 2
        );
        let groupMembersData = groupDetails.groupMembers.filter(
          (data, index) => data.groupRole.groupRoleID === 1
        );
        setViewGroupDetails({
          Title: groupDetails.title,
          Description: groupDetails.description,
          GroupMembers: groupMembersData,
          GroupHeads: groupHeadsData,
          GroupStatus: groupDetails.groupStatus,
          GroupType: groupDetails.groupType,
          isTalk: groupDetails.isTalk,
          GroupID: groupDetails.groupID,
        });
      }
    } catch (error) {
      console.log(error, "error");
    }
  }, [GroupsReducer]);

  const props = {
    name: "file",
    multiple: true,
    showUploadList: false,
    onChange(data) {
      const { fileList } = data;

      // Check if the fileList is the same as the previous one
      if (JSON.stringify(fileList) === JSON.stringify(previousFileList)) {
        return; // Skip processing if it's the same fileList
      }
      let totalFiles = fileList.length + fileAttachments.length;
      let fileSizeArr = fileSize; // Assuming fileSize is already defined somewhere
      let sizezero = true;
      let size = true;
      if (totalFiles > 15) {
        showMessage(t("Not-allowed-more-than-15-files"), "error", setOpen);
        return;
      }

      fileList.forEach((fileData, index) => {
        if (fileData.size > maxFileSize) {
          size = false;
        } else if (fileData.size === 0) {
          sizezero = false;
        }

        let fileExists = fileAttachments.some(
          (oldFileData) => oldFileData.DisplayAttachmentName === fileData.name
        );

        if (!size) {
          showMessage(
            t("File-size-should-not-be-greater-then-1-5GB"),
            "error",
            setOpen
          );
        } else if (!sizezero) {
          showMessage(t("File-size-should-not-be-zero"), "error", setOpen);
        } else if (fileExists) {
          showMessage(t("File-already-exists"), "error", setOpen);
        } else {
          let file = {
            DisplayAttachmentName: fileData.name,
            OriginalAttachmentName: fileData.name,
            fileSize: fileData.originFileObj.size,
          };
          setFileAttachments((prevAttachments) => [...prevAttachments, file]);
          fileSizeArr += fileData.originFileObj.size;
          setFileForSend((prevFiles) => [...prevFiles, fileData.originFileObj]);
          setFileSize(fileSizeArr);
        }
      });

      // Update previousFileList to current fileList
      previousFileList = fileList;
    },
    onDrop(e) {},
    customRequest() {},
  };
  // Initialize previousFileList to an empty array
  let previousFileList = [];
  //Sliders For Attachments

  const handleClickViewIcon = (data) => {
    let ext = data.DisplayAttachmentName.split(".").pop();
    let pdfData = {
      taskId: data.pK_FileID,
      commingFrom: 4,
      fileName: data.DisplayAttachmentName,
      attachmentID: data.pK_FileID,
    };
    const pdfDataJson = JSON.stringify(pdfData);
    let fileExtension = ["pdf", "doc", "docx", "xls", "xlsx"].includes(ext);
    if (fileExtension) {
      window.open(
        `/#/DisKus/documentViewer?pdfData=${encodeURIComponent(pdfDataJson)}`,
        "_blank",
        "noopener noreferrer"
      );
    }
  };

  const handleClickDownloadfunc = (data) => {
    let data2 = {
      FileID: Number(data.pK_FileID),
    };
    dispatch(
      DataRoomDownloadFileApiFunc(
        navigate,
        data2,
        t,
        data.DisplayAttachmentName
      )
    );
  };

  useEffect(() => {
    try {
      if (
        GroupsReducergroupDocuments !== null &&
        GroupsReducergroupDocuments !== undefined
      ) {
        if (GroupsReducergroupDocuments.data.length > 0) {
          setFolderID(GroupsReducergroupDocuments.folderID);
          let retirveArray = [];
          let PrevIds = [];
          GroupsReducergroupDocuments.data.forEach(
            (docsData, docsDataindex) => {
              retirveArray.push({
                pK_FileID: docsData.pK_FileID,
                DisplayAttachmentName: docsData.displayFileName,
                fk_UserID: docsData.fK_UserID,
              });
              PrevIds.push({
                pK_FileID: docsData.pK_FileID,
                DisplayAttachmentName: docsData.displayFileName,
              });
            }
          );
          setPreviousFileIDs(PrevIds);
          setFileAttachments(retirveArray);
        } else {
          setPreviousFileIDs([]);
          setFileAttachments([]);
          setFolderID(0);
        }
      } else {
        setPreviousFileIDs([]);
        setFileAttachments([]);
        setFolderID(0);
      }
    } catch {}
  }, [GroupsReducergroupDocuments]);

  const handleRemoveFile = (data) => {
    setFileForSend((prevFiles) =>
      prevFiles.filter(
        (fileSend) => fileSend.name !== data.DisplayAttachmentName
      )
    );

    setPreviousFileIDs((prevFiles) =>
      prevFiles.filter(
        (fileSend) =>
          fileSend.DisplayAttachmentName !== data.DisplayAttachmentName
      )
    );

    setFileAttachments((prevFiles) =>
      prevFiles.filter(
        (fileSend) =>
          fileSend.DisplayAttachmentName !== data.DisplayAttachmentName
      )
    );
  };

  const handleViewSave = async () => {
    let newfile = [...previousFileIDs];
    let fileObj = [];
    if (fileForSend.length > 0) {
      const uploadPromises = fileForSend.map(async (newData) => {
        await dispatch(
          uploadDocumentsGroupsApi(navigate, t, newData, folderID, fileObj)
        );
      });
      // Wait for all promises to resolve
      await Promise.all(uploadPromises);
      await dispatch(
        saveFilesGroupsApi(navigate, t, fileObj, folderID, newfile)
      );
    }

    let Data = {
      GroupID: Number(viewGroupDetails.GroupID),
      UpdateFileList: newfile.map((data, index) => {
        return { PK_FileID: Number(data.pK_FileID) };
      }),
    };
    dispatch(SaveGroupsDocumentsApiFunc(navigate, Data, t, setViewGroupPage));
  };
  const handleClose = () => {
    localStorage.removeItem("ViewGroupID");
    setViewGroupPage(false);
  };
  return (
    <>
      <section className=" color-5a5a5a">
        <Row>
          <Col lg={6} md={6} sm={6}>
            <Row>
              <Col lg={12} md={12} sm={12}>
                <span className={styles["View-group-Subheading"]}>
                  {t("Details")}
                </span>
              </Col>
            </Row>
            <Row className="mt-2">
              <Col lg={12} md={12} sm={12}>
                <span className={styles["Management-Heading-View-Group"]}>
                  {viewGroupDetails?.Title}
                </span>
              </Col>
            </Row>
            <Row className="mt-1">
              <Col lg={12} md={12} sm={12}>
                <p className={styles["paragraph-content-View-Group"]}>
                  {viewGroupDetails?.Description}
                </p>
              </Col>
            </Row>
            <Row>
              <Col
                lg={12}
                md={12}
                sm={12}
                className={styles["scroll-bar-creategroup"]}
              >
                <Row className="mt-2">
                  <Col lg={12} md={12} sm={12}>
                    <span className={styles["Create-group-Head-Heading"]}>
                      {t("Group-head")}
                    </span>
                  </Col>
                </Row>
                <Row className="mt-3">
                  {viewGroupDetails.GroupHeads !== null
                    ? viewGroupDetails.GroupHeads.map((data, index) => {
                        return (
                          <>
                            <Col
                              lg={6}
                              md={6}
                              sm={12}
                              className={styles["group-head-info"]}
                            >
                              <Row>
                                <Col lg={3} md={3} sm={12}>
                                  <img
                                    src={`data:image/jpeg;base64,${data.userProfilePicture.displayProfilePictureName}`}
                                    width={50}
                                    height={50}
                                    alt=""
                                    draggable="false"
                                  />
                                </Col>
                                <Col lg={9} md={9} sm={9} className="mt-1">
                                  <Row>
                                    <Col lg={12} md={12} sm={12}>
                                      <span
                                        className={styles["name-create-group"]}
                                      >
                                        {data?.userName}
                                      </span>
                                    </Col>
                                  </Row>
                                  <Row>
                                    <Col lg={12} md={12} sm={12}>
                                      <span
                                        className={
                                          styles["Designation-create-group"]
                                        }
                                      >
                                        {data?.designation}
                                      </span>
                                    </Col>
                                  </Row>
                                  <Row>
                                    <Col lg={12} md={12} sm={12}>
                                      <span
                                        className={styles["email-create-group"]}
                                      >
                                        <a>{data?.emailAddress}</a>
                                      </span>
                                    </Col>
                                  </Row>
                                </Col>
                              </Row>
                            </Col>
                          </>
                        );
                      })
                    : null}
                </Row>
                <Row className="mt-3">
                  <Col lg={12} md={12} sm={12}>
                    <span className={styles["members-create-group-page"]}>
                      {t("Members")}
                    </span>
                  </Col>
                </Row>
                <Row className="mt-3">
                  {viewGroupDetails.GroupMembers !== null
                    ? viewGroupDetails.GroupMembers.map((data, index) => {
                        return (
                          <Col lg={6} md={6} sm={12} className="mt-3">
                            <Row>
                              <Col lg={3} md={3} sm={12}>
                                <img
                                  src={`data:image/jpeg;base64,${data.userProfilePicture.displayProfilePictureName}`}
                                  width={50}
                                  height={50}
                                  alt=""
                                  draggable="false"
                                />
                              </Col>
                              <Col
                                lg={9}
                                md={9}
                                sm={12}
                                className={styles["group-head-info"]}
                              >
                                <Row className="mt-1">
                                  <Col lg={12} md={12} sm={12}>
                                    <span
                                      className={styles["name-create-group"]}
                                    >
                                      {data?.userName}
                                    </span>
                                  </Col>
                                </Row>
                                <Row>
                                  <Col lg={12} md={12} sm={12}>
                                    <span
                                      className={
                                        styles["Designation-create-group"]
                                      }
                                    >
                                      {data?.designation}
                                    </span>
                                  </Col>
                                </Row>
                                <Row>
                                  <Col lg={12} md={12} sm={12}>
                                    <span
                                      className={styles["email-create-group"]}
                                    >
                                      <a>{data?.emailAddress}</a>
                                    </span>
                                  </Col>
                                </Row>
                              </Col>
                            </Row>
                          </Col>
                        );
                      })
                    : null}
                </Row>
              </Col>
            </Row>
          </Col>
          <Col lg={6} md={6} sm={6}>
            <Row className="mt-2">
              <Col lg={12} md={12} sm={12}>
                <Dragger
                  disabled={groupStatus === 3 ? false : true}
                  {...props}
                  fileList={[]}
                  className={styles["dragdrop_attachment_create_resolution"]}
                >
                  <p className="ant-upload-drag-icon">
                    <span className={styles["create_resolution_dragger"]}>
                      <img
                        src={featherupload}
                        width="18.87px"
                        height="18.87px"
                        draggable="false"
                        alt=""
                      />
                    </span>
                  </p>
                  <p className={styles["ant-upload-text"]}>
                    {t("Drag-&-drop-or")}
                    <span className={styles["Choose_file_style"]}>
                      {t("Choose-file")} {""}
                    </span>
                    <span className={styles["here_text"]}>{t("Here")}</span>
                  </p>
                </Dragger>
              </Col>
            </Row>
            <section className={styles["Scroller_files"]}>
              <Row className="mt-2">
                {fileAttachments.length > 0
                  ? fileAttachments.map((data, index) => {
                      return (
                        <>
                          <Col lg={4} md={4} sm={4}>
                            <AttachmentViewer
                              data={data}
                              fk_UID={data.fk_UserID}
                              handleEyeIcon={() => handleClickViewIcon(data)}
                              id={data.pK_FileID}
                              handleClickRemove={() => handleRemoveFile(data)}
                              handleClickDownload={() =>
                                handleClickDownloadfunc(data)
                              }
                              name={data.DisplayAttachmentName}
                            />
                          </Col>
                        </>
                      );
                    })
                  : null}
              </Row>
            </section>
          </Col>
        </Row>
        <Row className="mt-4">
          <Col
            lg={12}
            md={12}
            sm={12}
            className="d-flex justify-content-end gap-2"
          >
            <Button
              className={styles["Close-ViewGroup-btn"]}
              text={t("Close")}
              onClick={handleClose}
            />
            {groupStatus !== 1 && (
              <Button
                className={styles["Save-ViewGroup-btn"]}
                text={t("Save")}
                onClick={handleViewSave}
              />
            )}
          </Col>
        </Row>
      </section>
      <Notification open={open} setOpen={setOpen} />
    </>
  );
};

export default ViewUpdateGroup;
