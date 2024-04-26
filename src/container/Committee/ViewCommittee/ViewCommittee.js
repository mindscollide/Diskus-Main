import React, { useEffect, useState } from "react";
import {
  AttachmentViewer,
  Button,
  Notification,
} from "../../../components/elements";
import { Paper } from "@material-ui/core";

import styles from "./ViewCommittee.module.css";
import { Upload } from "antd";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import {
  saveCommitteeDocumentsApi,
  saveFilesCommitteesApi,
  uploadDocumentsCommitteesApi,
} from "../../../store/actions/Committee_actions";
import { Col, Row } from "react-bootstrap";
import pdfIcon from "../../../assets/images/pdf_icon.svg";
import CrossIcon from "../../../assets/images/CrossIcon.svg";
import file_image from "../../../assets/images/file_image.svg";
import featherupload from "../../../assets/images/featherupload.svg";
import {
  getFileExtension,
  getIconSource,
} from "../../DataRoom/SearchFunctionality/option";
import { DataRoomDownloadFileApiFunc } from "../../../store/actions/DataRoom_actions";
const ViewCommitteeDetails = ({ setViewGroupPage, committeeStatus }) => {
  const { Dragger } = Upload;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [fileAttachments, setFileAttachments] = useState([]);
  const [viewCommitteeClose, setViewCommitteeClose] = useState(true);
  const { CommitteeReducer } = useSelector((state) => state);
  const [folderID, setFolderId] = useState(0);
  const [filesSending, setFilesSending] = useState([]);
  const [fileSize, setFileSize] = useState(0);
  const [fileForSend, setFileForSend] = useState([]);
  let currentUserID = localStorage.getItem("userID");
  const [open, setOpen] = useState({
    flag: false,
    message: "",
  });
  const [committeeData, setCommitteeData] = useState({
    committeeTitle: "",
    committeeDescription: "",
    isTalkGroup: false,
    committeeType: "",
    committeeStatus: 0,
    committeeID: 0,
    committeeMembers: [],
  });

  console.log(
    { fileAttachments, filesSending, fileForSend },
    "fileAttachmentsfileAttachments"
  );
  const closebtn = async () => {
    setViewGroupPage(false);
    localStorage.removeItem("ViewCommitteeID");
  };

  const handleSave = async () => {
    let newFolder = [...filesSending];
    let fileObj = [];
    if (fileForSend.length > 0) {
      const uploadPromises = fileForSend.map(async (newData) => {
        await dispatch(
          uploadDocumentsCommitteesApi(navigate, t, newData, folderID, fileObj)
        );
      });

      // Wait for all promises to resolve
      await Promise.all(uploadPromises);

      await dispatch(
        saveFilesCommitteesApi(navigate, t, fileObj, folderID, newFolder)
      );
    }

    let newData = {
      CommitteeID: Number(committeeData.committeeID),
      UpdateFileList: newFolder.map((fileID) => ({
        PK_FileID: fileID.pK_FileID,
      })),
    };
    await dispatch(saveCommitteeDocumentsApi(navigate, t, newData));
  };
  const handleRemoveFile = (data) => {
    try {
      setFileForSend((prevFiles) =>
        prevFiles.filter(
          (fileSend) => fileSend.name !== data.DisplayAttachmentName
        )
      );

      setFilesSending((prevFiles) =>
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
    } catch (error) {}
  };

  const handleClickDownloadDoc = (data) => {
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
  const handleClickOpenDoc = (data) => {
    let ext = data.DisplayAttachmentName.split(".")[1];
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
  const handleDoubleCLickFile = (data) => {
    let ext = data.DisplayAttachmentName.split(".")[1];
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
    } else {
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
    }
  };
  useEffect(() => {
    if (
      CommitteeReducer.getCommitteeByCommitteeID !== null &&
      CommitteeReducer.getCommitteeByCommitteeID !== undefined
    ) {
      let committeedetails = CommitteeReducer.getCommitteeByCommitteeID;
      setCommitteeData({
        committeeTitle: committeedetails.committeeTitle,
        committeeDescription: committeedetails.committeeDescription,
        isTalkGroup: committeedetails.isTalkChatGroup,
        committeeType: committeedetails.committeeType.committeeTypeId,
        committeeStatus: committeedetails.committeeStatus.committeeStatusID,
        committeeID: committeedetails.committeMembers[0].committeeID,
        committeeMembers: committeedetails.committeMembers,
      });
    }
  }, [CommitteeReducer.getCommitteeByCommitteeID]);

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

      let fileSizeArr = fileSize; // Assuming fileSize is already defined somewhere
      let flag = false;
      let sizezero = true;
      let size = true;

      if (fileAttachments.length > 9) {
        setOpen({
          flag: true,
          message: t("Not-allowed-more-than-10-files"),
        });
        return;
      }

      fileList.forEach((fileData, index) => {
        if (fileData.size > 10485760) {
          size = false;
        } else if (fileData.size === 0) {
          sizezero = false;
        }

        let fileExists = fileAttachments.some(
          (oldFileData) => oldFileData.DisplayAttachmentName === fileData.name
        );

        if (!size) {
          setTimeout(() => {
            setOpen({
              flag: true,
              message: t("File-size-should-not-be-greater-then-zero"),
            });
          }, 3000);
        } else if (!sizezero) {
          setTimeout(() => {
            setOpen({
              flag: true,
              message: t("File-size-should-not-be-zero"),
            });
          }, 3000);
        } else if (fileExists) {
          setTimeout(() => {
            setOpen({
              flag: true,
              message: t("File-already-exists"),
            });
          }, 3000);
        } else {
          let file = {
            DisplayAttachmentName: fileData.name,
            OriginalAttachmentName: fileData.name,
            fileSize: fileData.originFileObj.size,
            pK_FileID: 0,
            fk_UserID: Number(currentUserID),
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

  useEffect(() => {
    try {
      if (
        CommitteeReducer.reteriveCommitteeDocuments !== null &&
        CommitteeReducer.reteriveCommitteeDocuments !== undefined
      ) {
        if (CommitteeReducer.reteriveCommitteeDocuments.data.length > 0) {
          let newfolderID =
            CommitteeReducer.reteriveCommitteeDocuments.folderID;
          let filesArr = CommitteeReducer.reteriveCommitteeDocuments.data;
          let newArr = [];
          let fileSend = [];
          setFolderId(newfolderID);
          filesArr.forEach((fileData, index) => {
            newArr.push({
              pK_FileID: fileData.pK_FileID,
              DisplayAttachmentName: fileData.displayFileName,
              fk_UserID: fileData.fK_UserID,
            });
            fileSend.push({
              pK_FileID: fileData.pK_FileID,
              DisplayAttachmentName: fileData.displayFileName,
            });
          });
          setFileAttachments(newArr);
          setFilesSending(fileSend);
        } else {
          setFileAttachments([]);
          setFilesSending([]);
          setFolderId(0);
        }
      } else {
        setFileAttachments([]);
        setFilesSending([]);
        setFolderId(0);
      }
    } catch {}
  }, [CommitteeReducer.reteriveCommitteeDocuments]);

  return (
    <>
      <section className=" color-5a5a5a">
        {/* <Paper className={styles["View-Committee-paper"]}> */}
        <Row>
          <Col lg={6} md={6} sm={6}>
            <Row>
              <Col lg={12} md={12} sm={12}>
                <span className={styles["View-Committee-Subheading"]}>
                  {t("Details")}
                </span>
              </Col>
            </Row>
            <Row className="mt-2">
              <Col lg={12} md={12} sm={12}>
                <span className={styles["Management-Heading-View-Committee"]}>
                  {committeeData?.committeeTitle}
                </span>
              </Col>
            </Row>
            <Row className="mt-1">
              <Col lg={12} md={12} sm={12}>
                <p className={styles["paragraph-content-View-Committee"]}>
                  {committeeData?.committeeDescription}
                </p>
              </Col>
            </Row>
            <Row>
              <Col
                lg={12}
                md={12}
                sm={12}
                className={styles["scroll-bar-ViewGroup"]}
              >
                {/* Executive Members */}
                <Row className="mt-2">
                  <Col lg={12} md={12} sm={12}>
                    <span className={styles["View-Committee-Head-Heading"]}>
                      {t("Executive-member")}
                    </span>
                  </Col>
                </Row>
                <Row className="mt-2">
                  {committeeData?.committeeMembers
                    .filter(
                      (filterData, index) =>
                        filterData.committeeRole.committeeRoleID === 2
                    )
                    .map((data, index) => {
                      return (
                        <Col lg={6} md={6} sm={6} className="mt-2">
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
                              className={styles["ViewCommittee-head-info"]}
                            >
                              <Row>
                                <Col lg={12} md={12} sm={12} className="mt-1">
                                  <Row>
                                    <Col lg={12} md={12} sm={12}>
                                      <span
                                        className={
                                          styles["name-ViewCommittee-group"]
                                        }
                                      >
                                        {data?.userName}
                                      </span>
                                    </Col>
                                  </Row>
                                  <Row>
                                    <Col lg={12} md={12} sm={12}>
                                      <span
                                        className={
                                          styles[
                                            "Designation-ViewCommittee-group"
                                          ]
                                        }
                                      >
                                        {data?.designation}
                                      </span>
                                    </Col>
                                  </Row>
                                  <Row>
                                    <Col lg={12} md={12} sm={12}>
                                      <span
                                        className={
                                          styles["email-ViewCommittee-group"]
                                        }
                                      >
                                        <a>{data?.emailAddress}</a>
                                      </span>
                                    </Col>
                                  </Row>
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                        </Col>
                      );
                    })}
                </Row>
                {/* Regular Members */}
                <Row className="mt-2">
                  <Col lg={12} md={12} sm={12}>
                    <span
                      className={styles["members-ViewCommittee-group-page"]}
                    >
                      {t("Regular-members")}
                    </span>
                  </Col>
                </Row>
                <Row className="mt-2">
                  {committeeData?.committeeMembers
                    .filter(
                      (filterData, index) =>
                        filterData.committeeRole.committeeRoleID === 1
                    )
                    .map((data, index) => {
                      return (
                        <Col lg={6} md={6} sm={6} className="mt-2">
                          <Row>
                            <Col lg={3} md={3} sm={3}>
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
                              className={styles["ViewCommittee-head-info"]}
                            >
                              <Row>
                                <Col lg={12} md={12} sm={12} className="mt-1">
                                  <Row>
                                    <Col lg={12} md={12} sm={12}>
                                      <span
                                        className={
                                          styles["name-ViewCommittee-group"]
                                        }
                                      >
                                        {data?.userName}
                                      </span>
                                    </Col>
                                  </Row>
                                  <Row>
                                    <Col lg={12} md={12} sm={12}>
                                      <span
                                        className={
                                          styles[
                                            "Designation-ViewCommittee-group"
                                          ]
                                        }
                                      >
                                        {data?.designation}
                                      </span>
                                    </Col>
                                  </Row>
                                  <Row>
                                    <Col lg={12} md={12} sm={12}>
                                      <span
                                        className={
                                          styles["email-ViewCommittee-group"]
                                        }
                                      >
                                        <a>{data?.emailAddress}</a>
                                      </span>
                                    </Col>
                                  </Row>
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                        </Col>
                      );
                    })}
                </Row>
                {/* Chair Person Members */}
                <Row className="mt-2">
                  <Col lg={12} md={12} sm={12}>
                    <span
                      className={styles["members-ViewCommittee-group-page"]}
                    >
                      {t("Chair-person-members")}
                    </span>
                  </Col>
                </Row>
                <Row className="mt-2">
                  {committeeData?.committeeMembers
                    .filter(
                      (filterData, index) =>
                        filterData.committeeRole.committeeRoleID === 3
                    )
                    .map((data, index) => {
                      console.log(
                        data,
                        "ChairPersonChairPersonChairPersonChairPerson"
                      );
                      return (
                        <Col lg={6} md={6} sm={12} className="mt-2">
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
                              className={styles["ViewCommittee-head-info"]}
                            >
                              <Row>
                                <Col lg={12} md={12} sm={12} className="mt-1">
                                  <Row>
                                    <Col lg={12} md={12} sm={12}>
                                      <span
                                        className={
                                          styles["name-ViewCommittee-group"]
                                        }
                                      >
                                        {data?.userName}
                                      </span>
                                    </Col>
                                  </Row>
                                  <Row>
                                    <Col lg={12} md={12} sm={12}>
                                      <span
                                        className={
                                          styles[
                                            "Designation-ViewCommittee-group"
                                          ]
                                        }
                                      >
                                        {data?.designation}
                                      </span>
                                    </Col>
                                  </Row>
                                  <Row>
                                    <Col lg={12} md={12} sm={12}>
                                      <span
                                        className={
                                          styles["email-ViewCommittee-group"]
                                        }
                                      >
                                        <a>{data?.emailAddress}</a>
                                      </span>
                                    </Col>
                                  </Row>
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                        </Col>
                      );
                    })}
                </Row>
                {/* Vice Chair Person Members */}
                <Row className="mt-2">
                  <Col lg={12} md={12} sm={12}>
                    <span
                      className={styles["members-ViewCommittee-group-page"]}
                    >
                      {t("Vice-chair-person-members")}
                    </span>
                  </Col>
                </Row>
                <Row className="mt-2">
                  {committeeData?.committeeMembers
                    .filter(
                      (filterData, index) =>
                        filterData.committeeRole.committeeRoleID === 4
                    )
                    .map((data, index) => {
                      console.log(
                        data,
                        "ChairPersonChairPersonChairPersonChairPerson"
                      );
                      return (
                        <Col lg={6} md={6} sm={12} className="mt-2">
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
                              className={styles["ViewCommittee-head-info"]}
                            >
                              <Row>
                                <Col lg={12} md={12} sm={12} className="mt-1">
                                  <Row>
                                    <Col lg={12} md={12} sm={12}>
                                      <span
                                        className={
                                          styles["name-ViewCommittee-group"]
                                        }
                                      >
                                        {data?.userName}
                                      </span>
                                    </Col>
                                  </Row>
                                  <Row>
                                    <Col lg={12} md={12} sm={12}>
                                      <span
                                        className={
                                          styles[
                                            "Designation-ViewCommittee-group"
                                          ]
                                        }
                                      >
                                        {data?.designation}
                                      </span>
                                    </Col>
                                  </Row>
                                  <Row>
                                    <Col lg={12} md={12} sm={12}>
                                      <span
                                        className={
                                          styles["email-ViewCommittee-group"]
                                        }
                                      >
                                        <a>{data?.emailAddress}</a>
                                      </span>
                                    </Col>
                                  </Row>
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                        </Col>
                      );
                    })}
                </Row>
                {/* Secretary Members */}
                <Row className="mt-2">
                  <Col lg={12} md={12} sm={12}>
                    <span
                      className={styles["members-ViewCommittee-group-page"]}
                    >
                      {t("Secretary")}
                    </span>
                  </Col>
                </Row>
                <Row className="mt-2">
                  {committeeData?.committeeMembers
                    .filter(
                      (filterData, index) =>
                        filterData.committeeRole.committeeRoleID === 5
                    )
                    .map((data, index) => {
                      return (
                        <Col
                          lg={6}
                          md={6}
                          sm={12}
                          className="mt-2 position-relative"
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
                            <Col
                              lg={9}
                              md={9}
                              sm={12}
                              className={styles["ViewCommittee-head-info"]}
                            >
                              <Row>
                                <Col lg={12} md={12} sm={12} className="mt-1">
                                  <Row>
                                    <Col lg={12} md={12} sm={12}>
                                      <span
                                        className={
                                          styles["name-ViewCommittee-group"]
                                        }
                                      >
                                        {data?.userName}
                                      </span>
                                    </Col>
                                  </Row>
                                  <Row>
                                    <Col lg={12} md={12} sm={12}>
                                      <span
                                        className={
                                          styles[
                                            "Designation-ViewCommittee-group"
                                          ]
                                        }
                                      >
                                        {data?.designation}
                                      </span>
                                    </Col>
                                  </Row>
                                  <Row>
                                    <Col lg={12} md={12} sm={12}>
                                      <span
                                        className={
                                          styles["email-ViewCommittee-group"]
                                        }
                                      >
                                        <a>{data?.emailAddress}</a>
                                      </span>
                                    </Col>
                                  </Row>
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                        </Col>
                      );
                    })}
                </Row>
              </Col>
            </Row>
          </Col>
          <Col lg={6} md={6} sm={6}>
            <Row className="mt-2">
              <Col lg={12} md={12} sm={12}>
                <Dragger
                  disabled={committeeStatus === 3 ? false : true}
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
              <Col
                lg={12}
                md={12}
                sm={12}
                style={{
                  height: "375px",
                  overflow: "hidden auto",
                }}
              >
                <section className={styles["files_View"]}>
                  {fileAttachments.length > 0
                    ? fileAttachments.map((data, index) => {
                        let fileExt = data.DisplayAttachmentName.split(".")[1];

                        return (
                          <>
                            <AttachmentViewer
                              handleClickRemove={() => handleRemoveFile(data)}
                              name={data.DisplayAttachmentName}
                              handleEyeIcon={() => handleClickOpenDoc(data)}
                              handleClickDownload={() =>
                                handleClickDownloadDoc(data)
                              }
                              id={data.pK_FileID}
                              data={data}
                            />
                            {/* <Col lg={4} md={4} sm={4}>
                            <section
                              className={styles["Outer_Box"]}
                              onClick={() => handleDoubleCLickFile(data)}
                            >
                              {Number(data.fk_UserID) ===
                                Number(currentUserID) && (
                                <span className={styles["Crossicon_Class"]}>
                                  <img
                                    src={CrossIcon}
                                    height="12.68px"
                                    alt=""
                                    width="12.68px"
                                    onClick={() => handleRemoveFile(data)}
                                  />
                                </span>
                              )}

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
                                      alt=""
                                      height="10px"
                                      width="10px"
                                      className={styles["IconPDF"]}
                                    />
                                    <span className={styles["FileName"]}>
                                      {data.DisplayAttachmentName}
                                    </span>
                                  </Col>
                                </Row>
                              </section>
                            </section>
                          </Col> */}
                          </>
                        );
                      })
                    : null}
                </section>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row className="mt-3">
          <Col
            lg={12}
            md={12}
            sm={12}
            className="d-flex gap-3 justify-content-end"
          >
            <Button
              className={styles["Close-ViewCommittee-btn"]}
              text={t("Close")}
              onClick={closebtn}
            />
            <Button
              className={styles["Close-ViewCommittee-btn"]}
              text={t("Save")}
              onClick={handleSave}
            />
          </Col>
        </Row>
        {/* </Paper> */}
      </section>
      <Notification open={open.flag} message={open.message} setOpen={setOpen} />
    </>
  );
};

export default ViewCommitteeDetails;
