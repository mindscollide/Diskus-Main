import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import styles from "./ViewUpdateGroup.module.css";
import Newprofile from "../../../assets/images/newprofile.png";
import pdfIcon from "../../../assets/images/pdf_icon.svg";
import file_image from "../../../assets/images/file_image.svg";
import featherupload from "../../../assets/images/featherupload.svg";
import { useTranslation } from "react-i18next";
import { Paper } from "@material-ui/core";
import { Upload } from "antd";

import {
  TextField,
  Button,
  Checkbox,
  SelectBox,
  InputSearchFilter,
  Loader,
} from "./../../../components/elements";
import CrossIcon from "../../../assets/images/cancel_meeting_icon.svg";
import { useDispatch, useSelector } from "react-redux";
import { allAssignessList } from "../../../store/actions/Get_List_Of_Assignees";
import { useNavigate } from "react-router-dom";
import {
  RetriveDocumentsGroupsApiFunc,
  SaveGroupsDocumentsApiFunc,
  uploadDocumentsGroupsApi,
} from "../../../store/actions/Groups_actions";
import {
  getFileExtension,
  getIconSource,
} from "../../../container/DataRoom/SearchFunctionality/option";
const ViewUpdateGroup = ({ setViewGroupPage }) => {
  let userID = localStorage.getItem("userID");
  console.log(userID, "userIDuserIDuserID");
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
    flag: false,
    message: "",
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

  const { GroupsReducer, DataRoomReducer } = useSelector((state) => state);

  useEffect(() => {
    if (GroupsReducer.getGroupByGroupIdResponse !== null) {
      console.log(GroupsReducer, "getGroupByGroupIdResponse");
      let groupDetails = GroupsReducer.getGroupByGroupIdResponse;
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
  }, [GroupsReducer]);

  const props = {
    name: "file",
    multiple: true,
    showUploadList: false,
    onChange(data) {
      const { status } = data.file;
      let fileSizeArr;
      if (fileAttachments.length > 9) {
        setOpen({
          flag: true,
          message: t("Not-allowed-more-than-10-files"),
        });
      } else if (fileAttachments.length > 0) {
        let flag = false;
        let sizezero;
        let size;
        fileAttachments.forEach((arData, index) => {
          if (arData.DisplayAttachmentName === data.file.originFileObj.name) {
            flag = true;
          }
        });
        if (data.file.size > 10485760) {
          size = false;
        } else if (data.file.size === 0) {
          sizezero = false;
        }
        if (size === false) {
          setTimeout(
            setOpen({
              flag: true,
              message: t("File-size-should-not-be-greater-then-zero"),
            }),
            3000
          );
        } else if (sizezero === false) {
          setTimeout(
            setOpen({
              flag: true,
              message: t("File-size-should-not-be-zero"),
            }),
            3000
          );
        } else if (flag === true) {
          setTimeout(
            setOpen({
              flag: true,
              message: t("File-already-exists"),
            }),
            3000
          );
        } else {
          let file = {
            DisplayAttachmentName: data.file.name,
            OriginalAttachmentName: data.file.name,
            fileSize: data.file.originFileObj.size,
            fk_UserID: Number(userID),
          };
          setFileAttachments([...fileAttachments, file]);
          fileSizeArr = data.file.originFileObj.size + fileSize;
          setFileForSend([...fileForSend, data.file.originFileObj]);
          setFileSize(fileSizeArr);
          // dispatch(FileUploadToDo(navigate, data.file.originFileObj, t));
        }
      } else {
        let sizezero;
        let size;
        if (data.file.size > 10485760) {
          size = false;
        } else if (data.file.size === 0) {
          sizezero = false;
        }
        if (size === false) {
          setTimeout(
            setOpen({
              flag: true,
              message: t("File-size-should-not-be-greater-then-zero"),
            }),
            3000
          );
        } else if (sizezero === false) {
          setTimeout(
            setOpen({
              flag: true,
              message: t("File-size-should-not-be-zero"),
            }),
            3000
          );
        } else {
          let file = {
            DisplayAttachmentName: data.file.name,
            OriginalAttachmentName: data.file.name,
            fileSize: data.file.originFileObj.size,
            fk_UserID: Number(userID),
          };
          setFileAttachments([...fileAttachments, file]);
          fileSizeArr = data.file.originFileObj.size + fileSize;
          setFileForSend([...fileForSend, data.file.originFileObj]);
          setFileSize(fileSizeArr);
        }
      }
    },
    onDrop(e) {},
    customRequest() {},
  };
  console.log(fileAttachments, "fileAttachmentsfileAttachments1212");

  console.log(fileAttachments, "fileAttachmentsfileAttachments");

  const handleDoubleCLickFile = (data) => {
    let ext = data.DisplayAttachmentName.split(".").pop();
    let pdfData = {
      taskId: data.pK_FileID,
      commingFrom: 4,
      fileName: data.DisplayAttachmentName,
      attachmentID: data.pK_FileID,
    };
    const pdfDataJson = JSON.stringify(pdfData);
    if (ext === "pdf") {
      window.open(
        `/#/DisKus/documentViewer?pdfData=${encodeURIComponent(pdfDataJson)}`,
        "_blank",
        "noopener noreferrer"
      );
    }
  };

  useEffect(() => {
    if (
      GroupsReducer.groupDocuments !== null &&
      GroupsReducer.groupDocuments !== undefined
    ) {
      console.log(GroupsReducer.groupDocuments, "groupDocumentsgroupDocuments");
      if (GroupsReducer.groupDocuments.data.length > 0) {
        setFolderID(GroupsReducer.groupDocuments.folderID);
        let retirveArray = [];
        let PrevIds = [];
        GroupsReducer.groupDocuments.data.map((docsData, docsDataindex) => {
          console.log(docsData, "docsDatadocsDatadocsDatassss");
          retirveArray.push({
            pK_FileID: docsData.pK_FileID,
            DisplayAttachmentName: docsData.displayFileName,
            fk_UserID: docsData.fK_UserID,
          });
          PrevIds.push({
            pK_FileID: docsData.pK_FileID,
            DisplayAttachmentName: docsData.displayFileName,
          });
        });
        setPreviousFileIDs(PrevIds);
        setFileAttachments(retirveArray);
      }
    }
  }, [GroupsReducer.groupDocuments]);

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
    const uploadPromises = fileForSend.map(async (newData) => {
      await dispatch(
        uploadDocumentsGroupsApi(navigate, t, newData, folderID, newfile)
      );
    });
    // Wait for all promises to resolve
    await Promise.all(uploadPromises);

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
      <section className="MontserratSemiBold-600 color-5a5a5a">
        {/* <Row className="mt-3">
        <Col lg={12} md={12} sm={12}>
          <span className={styles["View-Group-heading"]}>
            {t("View-group")}
          </span>
        </Col>
      </Row> */}

        {/* <Paper className={styles["View-group-paper"]}> */}
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
                  {...props}
                  className={styles["dragdrop_attachment_create_resolution"]}
                >
                  <p className="ant-upload-drag-icon">
                    <span className={styles["create_resolution_dragger"]}>
                      <img
                        src={featherupload}
                        width="18.87px"
                        height="18.87px"
                        draggable="false"
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
            <Row className="mt-4">
              <Col lg={12} md={12} sm={12} className={styles["Scroller_files"]}>
                {fileAttachments.length > 0
                  ? fileAttachments.map((data, index) => {
                      console.log(data, "fileAttachmentsfileAttachments");
                      return (
                        <>
                          <Col
                            lg={4}
                            md={4}
                            sm={4}
                            className="position-relative gap-2 mt-2 "
                          >
                            {Number(data.fk_UserID) === Number(userID) && (
                              <>
                                <span className={styles["Crossicon_Class"]}>
                                  <img
                                    src={CrossIcon}
                                    height="12.68px"
                                    width="12.68px"
                                    onClick={() => handleRemoveFile(data)}
                                  />
                                </span>
                              </>
                            )}

                            <section
                              className={styles["Outer_Box"]}
                              onDoubleClick={() => handleDoubleCLickFile(data)}
                            >
                              <Row>
                                <Col lg={12} md={12} sm={12}>
                                  <img
                                    src={file_image}
                                    width={"100%"}
                                    alt=""
                                    draggable="false"
                                  />
                                </Col>
                              </Row>

                              <section
                                className={styles["backGround_name_Icon"]}
                              >
                                <Row className="mb-2">
                                  <Col
                                    lg={12}
                                    md={12}
                                    sm={12}
                                    className={styles["IconTextClass"]}
                                  >
                                    <img
                                      src={getIconSource(
                                        getFileExtension(
                                          data.DisplayAttachmentName
                                        )
                                      )}
                                      height="10px"
                                      width="10px"
                                      className={styles["IconPDF"]}
                                      alt=""
                                      draggable="false"
                                    />
                                    <span className={styles["FileName"]}>
                                      {data.DisplayAttachmentName}
                                    </span>
                                  </Col>
                                </Row>
                              </section>
                            </section>
                          </Col>
                        </>
                      );
                    })
                  : null}
              </Col>
            </Row>
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
            <Button
              className={styles["Close-ViewGroup-btn"]}
              text={t("Save")}
              onClick={handleViewSave}
            />
          </Col>
        </Row>
        {/* </Paper> */}
      </section>
    </>
  );
};

export default ViewUpdateGroup;
