import React, { useEffect, useState } from "react";
import styles from "./ViewDetails.module.css";
import crossIcon from "../../../assets/images/BlackCrossIconModals.svg";
import profilepic from "../../../assets/images/newprofile.png";
import GlobeIcon from "../../../assets/images/Globe.svg";
import Organization from "../../../assets/images/organization.svg";
import PDFIcon from "../../../assets/images/pdf_icon.svg";
import { Paper } from "@material-ui/core";
import { Col, Row } from "react-bootstrap";
import { Button, TextField } from "../../../components/elements";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { newTimeFormaterAsPerUTCTalkDate } from "../../../commen/functions/date_formater";
import { getFileExtension, getIconSource } from "../SearchFunctionality/option";
import folderColor from "../../../assets/images/folder_color.svg";

const ViewDetailsModal = ({ setDetailView }) => {
  const { t } = useTranslation();
  const { DatafileandFolderDetails } = useSelector(
    (state) => state.DataRoomFileAndFoldersDetailsReducer
  );
  const [activityState, setActivityState] = useState(false);
  const [detailsState, setDetailsState] = useState(true);
  const [documentDetails, setDocumentDetails] = useState({
    sharedUsers: [],
    ownerDetails: {
      fileID: 0,
      userID: 0,
      organizationID: 0,
      userName: "",
      emailAddress: "",
      orignalProfilePictureName: "",
      base64Img: "",
    },
    generalAccess: 0,
    type: "",
    location: "",
    modifiedDate: "",
    modifiedByUser: "",
    openedDate: "",
    openedByUser: "",
    createdDate: "",
    downloadPermission: "",
    size: 0,
    sizeOnDisk: 0,
    description: "",
    name: "",
  });

  const handleDetialsButton = () => {
    setDetailsState(true);
    setActivityState(false);
  };

  const handleActivityButton = () => {
    setActivityState(true);
    setDetailsState(false);
  };

  const handleClose = () => {
    setDetailView(false);
  };
  useEffect(() => {
    try {
      if (DatafileandFolderDetails !== null) {
        setDocumentDetails({
          sharedUsers: DatafileandFolderDetails.sharedUsers,
          ownerDetails: {
            fileID: DatafileandFolderDetails.ownerDetails.fileID,
            userID: DatafileandFolderDetails.ownerDetails.userID,
            organizationID:
              DatafileandFolderDetails.ownerDetails.organizationID,
            userName: DatafileandFolderDetails.ownerDetails.userName,
            emailAddress: DatafileandFolderDetails.ownerDetails.emailAddress,
            orignalProfilePictureName:
              DatafileandFolderDetails.ownerDetails.orignalProfilePictureName,
            base64Img: DatafileandFolderDetails.ownerDetails.base64Img,
          },
          generalAccess: DatafileandFolderDetails.generalAccess,
          type: DatafileandFolderDetails.type,
          location: DatafileandFolderDetails.location,
          modifiedDate: DatafileandFolderDetails.modifiedDate,
          modifiedByUser: DatafileandFolderDetails.modifiedByUser,
          openedDate: DatafileandFolderDetails.openedDate,
          openedByUser: DatafileandFolderDetails.openedByUser,
          createdDate: DatafileandFolderDetails.createdDate,
          downloadPermission: DatafileandFolderDetails.downloadPermission,
          size: DatafileandFolderDetails.size,
          sizeOnDisk: DatafileandFolderDetails.sizeOnDisk,
          description: DatafileandFolderDetails.description,
          name: DatafileandFolderDetails.name,
        });
      }
    } catch {}
  }, [DatafileandFolderDetails]);
  return (
    <section>
      <Row>
        <Col lg={12} md={12} sm={12}>
          <Paper className={styles["ViewDetails_paper"]}>
            <Row>
              <Col
                lg={11}
                md={11}
                sm={11}
                className="d-flex gap-2 align-items-center"
              >
                {documentDetails.type
                  .toLowerCase()
                  .includes("Folder".toLowerCase()) ? (
                  <img src={folderColor} alt="" height="28px" width="28px" />
                ) : (
                  <img
                    src={getIconSource(getFileExtension(documentDetails?.name))}
                    alt=""
                    height="28px"
                    width="28px"
                  />
                )}
                {/* <img
                  src={getIconSource(getFileExtension(documentDetails?.name))}
                  alt=""
                  height="28px"
                  width="28px"
                /> */}
                <span className={styles["Title-file"]}>
                  {documentDetails?.name}
                </span>
              </Col>
              <Col lg={1} md={1} sm={1}>
                <img
                  src={crossIcon}
                  alt=""
                  height="18.91px"
                  width="18.91px"
                  className="cursor-pointer"
                  onClick={handleClose}
                />
              </Col>
            </Row>
            <Row className="mt-5">
              <Col lg={12} md={12} sm={12} className="d-flex gap-2">
                <Button
                  text={t("Details")}
                  className={
                    detailsState
                      ? styles["ViewDetials_Buttons_active"]
                      : styles["ViewDetials_Buttons"]
                  }
                  onClick={handleDetialsButton}
                />
                <Button
                  text={t("Activity")}
                  className={
                    activityState
                      ? styles["Activity_Buttons_active"]
                      : styles["Activity_Buttons"]
                  }
                  onClick={handleActivityButton}
                />
              </Col>
            </Row>
            <Row>
              <Col lg={12} md={12} sm={12}>
                {detailsState ? (
                  <>
                    <Row>
                      <Col
                        lg={12}
                        md={12}
                        sm={12}
                        className={styles["Scroller"]}
                      >
                        <Row className="mt-3">
                          <Col lg={12} md={12} sm={12}>
                            <span className={styles["Access_heading"]}>
                              {t("Who-has-access")}
                            </span>
                          </Col>
                        </Row>
                        <Row className="mt-2">
                          <Col lg={2} md={2} sm={2} className="gap-3 d-flex">
                            <img
                              src={`data:image/jpeg;base64,${documentDetails.ownerDetails.base64Img}`}
                              alt=""
                              height="30px"
                              width="30px"
                              className={styles["profileClass"]}
                            />
                            <span
                              className={styles["Vertical_Seperator"]}
                            ></span>
                          </Col>
                          <Col lg={10} md={10} sm={10} className="d-flex gap-2">
                            {documentDetails?.sharedUsers.length > 0 &&
                              documentDetails?.sharedUsers.map(
                                (data, index) => {
                                  return (
                                    <img
                                      src={`data:image/jpeg;base64,${data.base64Img}`}
                                      alt=""
                                      height="30px"
                                      width="30px"
                                      className={styles["profileClass"]}
                                    />
                                  );
                                }
                              )}

                            {/* Globe Icon */}
                            {/* <img
                              src={GlobeIcon}
                              alt=""
                              height="30px"
                              width="30px"
                              className={styles["profileClass"]}
                            /> */}
                            {/* <span>
                              <img
                                src={Organization}
                                alt=""
                                height="30px"
                                width="30px"
                                className={styles["organization_cion"]}
                              />
                            </span> */}
                          </Col>
                        </Row>
                        <Row className="mt-2">
                          <Col lg={12} md={12} sm={12}>
                            <span className={styles["owned_heading"]}>
                              Owned by you, Shared with Saif and Salman
                            </span>
                          </Col>
                        </Row>
                        <Row className="mt-2">
                          <Col lg={12} md={12} sm={12}>
                            <Button
                              text={t("Manage-access")}
                              className={styles["Manage_access_button"]}
                            />
                          </Col>
                        </Row>
                        <span className={styles["Horizontal_seperator"]}></span>
                        <Row className="mt-4">
                          <Col lg={12} mg={12} sm={12}>
                            <span className={styles["File_Detials_Heading"]}>
                              {documentDetails.type
                                .toLowerCase()
                                .includes("Folder".toLowerCase()) ? (
                                <>{t("Folder-details")}</>
                              ) : (
                                <>{t("File-details")}</>
                              )}
                            </span>
                          </Col>
                        </Row>
                        <Row>
                          <Col lg={7} md={7} sm={7}>
                            <Row>
                              <Col
                                lg={12}
                                sm={12}
                                md={12}
                                className="d-flex flex-column flex-wrap"
                              >
                                <span className={styles["DetialsHeading"]}>
                                  {t("Type")}:
                                </span>
                                <span
                                  className={
                                    styles["DetialsHeading_subHeading"]
                                  }
                                >
                                  {documentDetails?.type}
                                </span>
                              </Col>
                            </Row>
                            <Row className="mt-2">
                              <Col
                                lg={12}
                                sm={12}
                                md={12}
                                className="d-flex flex-column flex-wrap"
                              >
                                <span className={styles["DetialsHeading"]}>
                                  {t("Storage-used")}:
                                </span>
                                <span
                                  className={
                                    styles["DetialsHeading_subHeading"]
                                  }
                                >
                                  200KB
                                </span>
                              </Col>
                            </Row>
                            <Row className="mt-2">
                              <Col
                                lg={12}
                                sm={12}
                                md={12}
                                className="d-flex flex-column flex-wrap"
                              >
                                <span className={styles["DetialsHeading"]}>
                                  {t("Owner")}:
                                </span>
                                <span
                                  className={
                                    styles["DetialsHeading_subHeading"]
                                  }
                                >
                                  Me
                                </span>
                              </Col>
                            </Row>
                            <Row className="mt-2">
                              <Col
                                lg={12}
                                sm={12}
                                md={12}
                                className="d-flex flex-column flex-wrap"
                              >
                                <span className={styles["DetialsHeading"]}>
                                  {t("Opened")}:
                                </span>
                                <span
                                  className={
                                    styles["DetialsHeading_subHeading"]
                                  }
                                >
                                  March 27, 2023 by Me
                                </span>
                              </Col>
                            </Row>
                            <Row className="mt-2">
                              <Col
                                lg={12}
                                sm={12}
                                md={12}
                                className="d-flex flex-column flex-wrap"
                              >
                                <span className={styles["DetialsHeading"]}>
                                  {t("Download-permissions")}:
                                </span>
                                <span
                                  className={
                                    styles["DetialsHeading_subHeading"]
                                  }
                                >
                                  {documentDetails?.downloadPermission}
                                </span>
                              </Col>
                            </Row>
                          </Col>
                          <Col lg={5} md={5} sm={5}>
                            <Row>
                              <Col
                                lg={12}
                                sm={12}
                                md={12}
                                className="d-flex flex-column flex-wrap"
                              >
                                <span className={styles["DetialsHeading"]}>
                                  {t("Size")}:
                                </span>
                                <span
                                  className={
                                    styles["DetialsHeading_subHeading"]
                                  }
                                >
                                  {documentDetails?.size}
                                </span>
                              </Col>
                            </Row>
                            <Row className="mt-2">
                              <Col
                                lg={12}
                                sm={12}
                                md={12}
                                className="d-flex flex-column flex-wrap"
                              >
                                <span className={styles["DetialsHeading"]}>
                                  {t("Location")}:
                                </span>
                                <span
                                  className={
                                    styles["DetialsHeading_subHeading"]
                                  }
                                >
                                  {documentDetails?.location}
                                </span>
                              </Col>
                            </Row>
                            <Row className="mt-2">
                              <Col
                                lg={12}
                                sm={12}
                                md={12}
                                className="d-flex flex-column flex-wrap"
                              >
                                <span className={styles["DetialsHeading"]}>
                                  {t("Modified")}:
                                </span>
                                <span
                                  className={
                                    styles["DetialsHeading_subHeading"]
                                  }
                                >
                                  March 27, 2023 by Me
                                </span>
                              </Col>
                            </Row>
                            <Row className="mt-2">
                              <Col
                                lg={12}
                                sm={12}
                                md={12}
                                className="d-flex flex-column flex-wrap"
                              >
                                <span className={styles["DetialsHeading"]}>
                                  {t("Created")}:
                                </span>
                                <span
                                  className={
                                    styles["DetialsHeading_subHeading"]
                                  }
                                >
                                  {newTimeFormaterAsPerUTCTalkDate(
                                    documentDetails?.createdDate + "000000"
                                  )}
                                </span>
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                        <Row>
                          <Col lg={12} md={12} sm={12}>
                            <TextField
                              applyClass="text-area-create-Notify-organizors"
                              type="text"
                              as={"textarea"}
                              rows="4"
                              value={documentDetails?.description}
                              placeholder={t("Add-description")}
                              name={"Description"}
                              required={true}
                              maxLength={500}
                            />
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </>
                ) : null}
              </Col>
            </Row>
          </Paper>
        </Col>
      </Row>
    </section>
  );
};

export default ViewDetailsModal;
