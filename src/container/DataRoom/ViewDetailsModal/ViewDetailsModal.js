import React, { useEffect, useState } from "react";
import styles from "./ViewDetails.module.css";
import crossIcon from "../../../assets/images/BlackCrossIconModals.svg";
import profilepic from "../../../assets/images/newprofile.png";
import { Paper } from "@mui/material";
import { Col, Row } from "react-bootstrap";
import { Button, TextField } from "../../../components/elements";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { newTimeFormaterAsPerUTCTalkDate } from "../../../commen/functions/date_formater";
import { getFileExtension, getIconSource } from "../SearchFunctionality/option";
import folderColor from "../../../assets/images/folder_color.svg";
import OrganizationIcon from "../../../assets/images/organization.svg";
import AnyineIcon from "../../../assets/images/Globe.svg";
import { useDispatch } from "react-redux";
import {
  getDataAnalyticsApi,
  updateFileandFolderDetailsApi,
} from "../../../store/actions/DataRoom2_actions";
import { useNavigate } from "react-router-dom";
import {
  getSharedFileUsersApi,
  getSharedFolderUsersApi,
} from "../../../store/actions/DataRoom_actions";

const ViewDetailsModal = ({
  setDetailView,
  setFolderId,
  setFolderName,
  setSharefoldermodal,
  setShareFileModal,
  setFileName,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { DatafileandFolderDetails, getDataAnalyticsDetails } = useSelector(
    (state) => state.DataRoomFileAndFoldersDetailsReducer
  );
  const [activityState, setActivityState] = useState(false);
  const [detailsState, setDetailsState] = useState(true);
  const currentUserID = localStorage.getItem("userID");
  const [documentDetails, setDocumentDetails] = useState({
    sharedUsers: [],
    ownerDetails: {
      id: 0,
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
  const [documentActivityDetails, setDocumentActivityDetails] = useState(null);

  const handleDetialsButton = () => {
    setDetailsState(true);
    setActivityState(false);
  };

  const handleActivityButton = () => {
    let Data = {
      FileID: documentDetails?.ownerDetails?.id,
    };
    dispatch(
      getDataAnalyticsApi(navigate, t, Data, setActivityState, setDetailsState)
    );
  };

  const handleClose = () => {
    setDetailView(false);
  };

  const handleChandeDescription = (e) => {
    setDocumentDetails({
      ...documentDetails,
      description: e.target.value,
    });
  };

  const handleBluronDescription = (event) => {
    let descriptionValue = event.target.value;
    if (descriptionValue.trim() !== "") {
      let Data = {
        ID: documentDetails?.ownerDetails?.id,
        isFolder: documentDetails.type
          .toLowerCase()
          .includes("Folder".toLowerCase())
          ? true
          : false,
        isOpened: false,
        Description: descriptionValue,
      };
      dispatch(updateFileandFolderDetailsApi(navigate, t, Data));
    }
  };

  const ManageAccessBtn = () => {
    if (documentDetails.type.toLowerCase().includes("File".toLowerCase())) {
      let Data = { FileID: documentDetails?.ownerDetails?.id };
      setFolderId(documentDetails?.ownerDetails?.id);
      setFileName(documentDetails?.name);
      dispatch(getSharedFileUsersApi(navigate, Data, t, setShareFileModal));
    } else if (
      documentDetails.type.toLowerCase().includes("Folder".toLowerCase())
    ) {
      let Data = { FolderID: documentDetails?.ownerDetails?.id };

      setFolderId(documentDetails?.ownerDetails?.id);
      setFolderName(documentDetails?.name);
      dispatch(getSharedFolderUsersApi(navigate, Data, t, setSharefoldermodal));
    }
  };

  useEffect(() => {
    try {
      if (getDataAnalyticsDetails !== null) {
        setDocumentActivityDetails(getDataAnalyticsDetails);
      }
    } catch {}
  }, [getDataAnalyticsDetails]);
  useEffect(() => {
    try {
      if (DatafileandFolderDetails !== null) {
        setDocumentDetails({
          ...documentDetails,
          sharedUsers: DatafileandFolderDetails.sharedUsers,
          ownerDetails: {
            id:
              DatafileandFolderDetails.type.toLowerCase() ===
              "Folder".toLowerCase()
                ? DatafileandFolderDetails.ownerDetails.folderID
                : DatafileandFolderDetails.ownerDetails.fileID,
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
            <Row className="mt-3">
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
                            {Number(documentDetails.generalAccess) === 1 ? (
                              <>
                                {" "}
                                {documentDetails?.sharedUsers.length > 0 &&
                                  documentDetails?.sharedUsers.map(
                                    (data, index) => {
                                      console.log(data, "datadatadata");
                                      return (
                                        <img
                                          src={`data:image/jpeg;base64,${data.base64Img}`}
                                          alt=""
                                          height="30px"
                                          width="30px"
                                          className={`${styles["profileClass"]} title_tooltip`}
                                          title={`${data.userName} can ${
                                            data.permissionID === 1
                                              ? "view"
                                              : data.permissionID === 2
                                              ? "edit"
                                              : data.permissionID === 3
                                              ? "view and edit"
                                              : null
                                          }`}
                                        />
                                      );
                                    }
                                  )}
                              </>
                            ) : Number(documentDetails.generalAccess) === 2 ? (
                              <>
                                {/* <Tooltip title="Hello"> */}
                                <span className={styles["icon_outer_circle"]}>
                                  <img
                                    src={OrganizationIcon}
                                    alt=""
                                    width={20}
                                    height={20}
                                    className=""
                                    title={t(
                                      "Anyone-in-my-organization-can-find-and-view"
                                    )}
                                  />
                                </span>
                                {/* </Tooltip> */}
                              </>
                            ) : Number(documentDetails.generalAccess) === 3 ? (
                              <>
                                <span className={styles["icon_outer_circle"]}>
                                  {/* <Tooltip title="Hello"> */}
                                  <img
                                    src={AnyineIcon}
                                    alt=""
                                    width={17}
                                    height={17}
                                    title={t(
                                      "Anyone-on-the-internet-with-link-can-view"
                                    )}
                                  />
                                  {/* </Tooltip> */}
                                </span>
                              </>
                            ) : null}
                          </Col>
                        </Row>
                        <Row className="mt-2">
                          <Col lg={12} md={12} sm={12}>
                            <span className={styles["owned_heading"]}>
                              {t("Owned-by-you-shared-with")}{" "}
                              {documentDetails.sharedUsers.length > 0
                                ? documentDetails.sharedUsers.map(
                                    (data, index) => (
                                      <React.Fragment key={index}>
                                        {data.userName}
                                        {index <
                                          documentDetails.sharedUsers.length -
                                            1 && " and "}{" "}
                                        {/* Add comma if not the last user */}
                                      </React.Fragment>
                                    )
                                  )
                                : "No shared users"}
                            </span>
                          </Col>
                        </Row>
                        <Row className="mt-2">
                          {documentDetails.sharedUsers.map(
                            (sharedData, index) => {
                              if (
                                Number(sharedData.userID) ===
                                  Number(currentUserID) &&
                                Number(sharedData.permissionID) === 2
                              ) {
                                return (
                                  <Col lg={12} md={12} sm={12} key={index}>
                                    <Button
                                      text={t("Manage-access")}
                                      className={styles["Manage_access_button"]}
                                      onClick={ManageAccessBtn}
                                    />
                                  </Col>
                                );
                              } else {
                                return null; // Optionally return null if the condition is not met
                              }
                            }
                          )}
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
                                  {Number(
                                    documentDetails?.ownerDetails?.userID
                                  ) === Number(currentUserID)
                                    ? t("Me")
                                    : documentDetails?.ownerDetails?.userName}
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
                                  {`${
                                    documentDetails?.openedDate !== ""
                                      ? newTimeFormaterAsPerUTCTalkDate(
                                          documentDetails?.openedDate + "000000"
                                        )
                                      : ""
                                  } ${t("By")} ${
                                    Number(
                                      documentDetails?.ownerDetails?.userID
                                    ) === Number(currentUserID)
                                      ? t("Me")
                                      : documentDetails?.openedByUser
                                  }`}
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
                                  {`${
                                    documentDetails?.modifiedDate !== ""
                                      ? newTimeFormaterAsPerUTCTalkDate(
                                          documentDetails?.modifiedDate +
                                            "000000"
                                        )
                                      : ""
                                  } ${t("By")} ${
                                    Number(
                                      documentDetails?.ownerDetails?.userID
                                    ) === Number(currentUserID)
                                      ? t("Me")
                                      : documentDetails?.modifiedByUser
                                  }`}
                                  {/* March 27, 2023 by Me */}
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
                              onBlur={handleBluronDescription}
                              change={handleChandeDescription}
                              name={"Description"}
                              required={true}
                              maxLength={500}
                            />
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </>
                ) : activityState ? (
                  <>
                    <Row className="mt-2">
                      <Col
                        lg={12}
                        md={12}
                        sm={12}
                        className={styles["Scroller"]}
                      >
                        {documentActivityDetails?.today?.length > 0 && (
                          <Row>
                            <Col lg={12} md={12} sm={12}>
                              <span className={styles["Today_heading"]}>
                                {t("Today")}
                              </span>
                            </Col>
                          </Row>
                        )}

                        {documentActivityDetails?.today?.length > 0 &&
                          documentActivityDetails?.today.map(
                            (todayData, index) => {
                              console.log(
                                todayData,
                                "todayDatatodayDatatodayData"
                              );
                              return (
                                <>
                                  <Row className="mt-2">
                                    <Col lg={1} md={1} sm={1}>
                                      <img
                                        src={`data:image/jpeg;base64,${todayData.base64ImgOwner}`}
                                        alt=""
                                        height="30px"
                                        width="30px"
                                        className={styles["profileClass"]}
                                      />
                                    </Col>
                                    <Col
                                      lg={11}
                                      md={11}
                                      sm={11}
                                      className="d-flex flex-column  flex-wrap px-4"
                                    >
                                      {Number(todayData.actionID) === 1 ? (
                                        <>
                                          <span
                                            className={
                                              styles["activity_heading"]
                                            }
                                          >
                                            {todayData?.description}
                                          </span>
                                          <span
                                            className={styles["date_heading"]}
                                          >
                                            {todayData.createdDateTime !== "" &&
                                              newTimeFormaterAsPerUTCTalkDate(
                                                todayData.createdDateTime
                                              )}
                                          </span>
                                          <Row>
                                            <Col
                                              lg={12}
                                              md={12}
                                              sm={12}
                                              className="d-flex gap-2 align-items-center"
                                            >
                                              <img
                                                src={getIconSource(
                                                  getFileExtension(
                                                    todayData?.displayFileName
                                                  )
                                                )}
                                                alt=""
                                                height="17px"
                                                width="17px"
                                              />
                                              <span
                                                className={
                                                  styles["Filename_heading"]
                                                }
                                              >
                                                {todayData?.displayFileName}
                                              </span>
                                            </Col>
                                          </Row>
                                        </>
                                      ) : Number(todayData.actionID) === 2 ? (
                                        <>
                                          <span
                                            className={
                                              styles["activity_heading"]
                                            }
                                          >
                                            {todayData?.description}
                                          </span>
                                          <span
                                            className={styles["date_heading"]}
                                          >
                                            {todayData.createdDateTime !== "" &&
                                              newTimeFormaterAsPerUTCTalkDate(
                                                todayData.createdDateTime
                                              )}
                                          </span>
                                          <Row>
                                            <Col
                                              lg={12}
                                              md={12}
                                              sm={12}
                                              className="d-flex gap-2 align-items-center"
                                            >
                                              <img
                                                src={getIconSource(
                                                  getFileExtension(
                                                    todayData?.displayFileName
                                                  )
                                                )}
                                                alt=""
                                                height="17px"
                                                width="17px"
                                              />
                                              <span
                                                className={
                                                  styles["Filename_heading"]
                                                }
                                              >
                                                {todayData?.displayFileName}
                                              </span>
                                            </Col>
                                          </Row>
                                        </>
                                      ) : Number(todayData.actionID) === 3 ? (
                                        <>
                                          {" "}
                                          <span
                                            className={
                                              styles["activity_heading"]
                                            }
                                          >
                                            {todayData?.description}
                                          </span>
                                          <span
                                            className={styles["date_heading"]}
                                          >
                                            {todayData.createdDateTime !== "" &&
                                              newTimeFormaterAsPerUTCTalkDate(
                                                todayData.createdDateTime
                                              )}
                                          </span>
                                          <Row>
                                            <Col
                                              lg={12}
                                              md={12}
                                              sm={12}
                                              className="d-flex gap-2 align-items-center"
                                            >
                                              <img
                                                src={getIconSource(
                                                  getFileExtension(
                                                    todayData?.displayFileName
                                                  )
                                                )}
                                                alt=""
                                                height="17px"
                                                width="17px"
                                              />
                                              <span
                                                className={
                                                  styles["Filename_heading"]
                                                }
                                              >
                                                {todayData?.displayFileName}
                                              </span>
                                            </Col>
                                          </Row>
                                        </>
                                      ) : Number(todayData.actionID) === 4 ? (
                                        <>
                                          {" "}
                                          <span
                                            className={
                                              styles["activity_heading"]
                                            }
                                          >
                                            {todayData?.description}
                                          </span>
                                          <span
                                            className={styles["date_heading"]}
                                          >
                                            {todayData.createdDateTime !== "" &&
                                              newTimeFormaterAsPerUTCTalkDate(
                                                todayData.createdDateTime
                                              )}
                                          </span>
                                          <Row>
                                            <Col
                                              lg={12}
                                              md={12}
                                              sm={12}
                                              className="d-flex gap-2 align-items-center"
                                            >
                                              <img
                                                src={getIconSource(
                                                  getFileExtension(
                                                    todayData?.displayFileName
                                                  )
                                                )}
                                                alt=""
                                                height="17px"
                                                width="17px"
                                              />
                                              <span
                                                className={
                                                  styles["Filename_heading"]
                                                }
                                              >
                                                {todayData?.displayFileName}
                                              </span>
                                            </Col>
                                          </Row>
                                        </>
                                      ) : (
                                        <>
                                          {" "}
                                          <span
                                            className={
                                              styles["activity_heading"]
                                            }
                                          >
                                            {todayData?.description}
                                          </span>
                                          <span
                                            className={styles["date_heading"]}
                                          >
                                            {todayData.createdDateTime !== "" &&
                                              newTimeFormaterAsPerUTCTalkDate(
                                                todayData.createdDateTime
                                              )}
                                          </span>
                                          <Row>
                                            <Col
                                              lg={12}
                                              md={12}
                                              sm={12}
                                              className="d-flex gap-2 align-items-center"
                                            >
                                              <img
                                                src={getIconSource(
                                                  getFileExtension(
                                                    todayData?.displayFileName
                                                  )
                                                )}
                                                alt=""
                                                height="17px"
                                                width="17px"
                                              />
                                              <span
                                                className={
                                                  styles["Filename_heading"]
                                                }
                                              >
                                                {todayData?.displayFileName}
                                              </span>
                                            </Col>
                                          </Row>
                                        </>
                                      )}
                                    </Col>
                                  </Row>
                                </>
                              );
                            }
                          )}

                        {/* Yesterday */}
                        {documentActivityDetails?.yesterday?.length > 0 && (
                          <Row>
                            <Col lg={12} md={12} sm={12}>
                              <span className={styles["Today_heading"]}>
                                {t("Yesterday")}
                              </span>
                            </Col>
                          </Row>
                        )}

                        {documentActivityDetails?.yesterday?.length > 0 &&
                          documentActivityDetails?.yesterday.map(
                            (YesterDayData, index) => {
                              return (
                                <>
                                  <Row className="mt-2">
                                    <Col lg={1} md={1} sm={1}>
                                      <img
                                        src={`data:image/jpeg;base64,${YesterDayData.base64ImgOwner}`}
                                        alt=""
                                        height="30px"
                                        width="30px"
                                        className={styles["profileClass"]}
                                      />
                                    </Col>
                                    <Col
                                      lg={11}
                                      md={11}
                                      sm={11}
                                      className="d-flex flex-column  flex-wrap px-4"
                                    >
                                      {Number(YesterDayData.actionID) === 1 ? (
                                        <>
                                          <span
                                            className={
                                              styles["activity_heading"]
                                            }
                                          >
                                            {YesterDayData?.description}
                                          </span>
                                          <span
                                            className={styles["date_heading"]}
                                          >
                                            {YesterDayData.createdDateTime !==
                                              "" &&
                                              newTimeFormaterAsPerUTCTalkDate(
                                                YesterDayData.createdDateTime
                                              )}
                                          </span>
                                          <Row>
                                            <Col
                                              lg={12}
                                              md={12}
                                              sm={12}
                                              className="d-flex gap-2 align-items-center"
                                            >
                                              <img
                                                src={getIconSource(
                                                  getFileExtension(
                                                    YesterDayData?.displayFileName
                                                  )
                                                )}
                                                alt=""
                                                height="17px"
                                                width="17px"
                                              />
                                              <span
                                                className={
                                                  styles["Filename_heading"]
                                                }
                                              >
                                                {YesterDayData?.displayFileName}
                                              </span>
                                            </Col>
                                          </Row>
                                        </>
                                      ) : Number(YesterDayData.actionID) ===
                                        2 ? (
                                        <>
                                          <span
                                            className={
                                              styles["activity_heading"]
                                            }
                                          >
                                            {YesterDayData?.description}
                                          </span>
                                          <span
                                            className={styles["date_heading"]}
                                          >
                                            {YesterDayData.createdDateTime !==
                                              "" &&
                                              newTimeFormaterAsPerUTCTalkDate(
                                                YesterDayData.createdDateTime
                                              )}
                                          </span>
                                          <Row>
                                            <Col
                                              lg={12}
                                              md={12}
                                              sm={12}
                                              className="d-flex gap-2 align-items-center"
                                            >
                                              <img
                                                src={getIconSource(
                                                  getFileExtension(
                                                    YesterDayData?.displayFileName
                                                  )
                                                )}
                                                alt=""
                                                height="17px"
                                                width="17px"
                                              />
                                              <span
                                                className={
                                                  styles["Filename_heading"]
                                                }
                                              >
                                                {YesterDayData?.displayFileName}
                                              </span>
                                            </Col>
                                          </Row>
                                        </>
                                      ) : Number(YesterDayData.actionID) ===
                                        3 ? (
                                        <>
                                          <span
                                            className={
                                              styles["activity_heading"]
                                            }
                                          >
                                            {YesterDayData?.description}
                                          </span>
                                          <span
                                            className={styles["date_heading"]}
                                          >
                                            {YesterDayData.createdDateTime !==
                                              "" &&
                                              newTimeFormaterAsPerUTCTalkDate(
                                                YesterDayData.createdDateTime
                                              )}
                                          </span>
                                          <Row>
                                            <Col
                                              lg={12}
                                              md={12}
                                              sm={12}
                                              className="d-flex gap-2 align-items-center"
                                            >
                                              <img
                                                src={getIconSource(
                                                  getFileExtension(
                                                    YesterDayData?.displayFileName
                                                  )
                                                )}
                                                alt=""
                                                height="17px"
                                                width="17px"
                                              />
                                              <span
                                                className={
                                                  styles["Filename_heading"]
                                                }
                                              >
                                                {YesterDayData?.displayFileName}
                                              </span>
                                            </Col>
                                          </Row>
                                        </>
                                      ) : Number(YesterDayData.actionID) ===
                                        4 ? (
                                        <>
                                          <span
                                            className={
                                              styles["activity_heading"]
                                            }
                                          >
                                            {YesterDayData?.description}
                                          </span>
                                          <span
                                            className={styles["date_heading"]}
                                          >
                                            {YesterDayData.createdDateTime !==
                                              "" &&
                                              newTimeFormaterAsPerUTCTalkDate(
                                                YesterDayData.createdDateTime
                                              )}
                                          </span>
                                          <Row>
                                            <Col
                                              lg={12}
                                              md={12}
                                              sm={12}
                                              className="d-flex gap-2 align-items-center"
                                            >
                                              <img
                                                src={getIconSource(
                                                  getFileExtension(
                                                    YesterDayData?.displayFileName
                                                  )
                                                )}
                                                alt=""
                                                height="17px"
                                                width="17px"
                                              />
                                              <span
                                                className={
                                                  styles["Filename_heading"]
                                                }
                                              >
                                                {YesterDayData?.displayFileName}
                                              </span>
                                            </Col>
                                          </Row>
                                        </>
                                      ) : (
                                        <>
                                          <span
                                            className={
                                              styles["activity_heading"]
                                            }
                                          >
                                            {YesterDayData?.description}
                                          </span>
                                          <span
                                            className={styles["date_heading"]}
                                          >
                                            {YesterDayData.createdDateTime !==
                                              "" &&
                                              newTimeFormaterAsPerUTCTalkDate(
                                                YesterDayData.createdDateTime
                                              )}
                                          </span>
                                          <Row>
                                            <Col
                                              lg={12}
                                              md={12}
                                              sm={12}
                                              className="d-flex gap-2 align-items-center"
                                            >
                                              <img
                                                src={getIconSource(
                                                  getFileExtension(
                                                    YesterDayData?.displayFileName
                                                  )
                                                )}
                                                alt=""
                                                height="17px"
                                                width="17px"
                                              />
                                              <span
                                                className={
                                                  styles["Filename_heading"]
                                                }
                                              >
                                                {YesterDayData?.displayFileName}
                                              </span>
                                            </Col>
                                          </Row>
                                        </>
                                      )}
                                    </Col>
                                  </Row>
                                </>
                              );
                            }
                          )}

                        {/* this Week */}
                        {documentActivityDetails?.thisWeek?.length > 0 && (
                          <Row>
                            <Col lg={12} md={12} sm={12}>
                              <span className={styles["Today_heading"]}>
                                {t("This-week")}
                              </span>
                            </Col>
                          </Row>
                        )}

                        {documentActivityDetails?.thisWeek?.length > 0 &&
                          documentActivityDetails?.thisWeek.map(
                            (thisweekData, index) => {
                              return (
                                <>
                                  <Row className="mt-2">
                                    <Col lg={1} md={1} sm={1}>
                                      <img
                                        src={`data:image/jpeg;base64,${thisweekData.base64ImgOwner}`}
                                        alt=""
                                        height="30px"
                                        width="30px"
                                        className={styles["profileClass"]}
                                      />
                                    </Col>
                                    <Col
                                      lg={11}
                                      md={11}
                                      sm={11}
                                      className="d-flex flex-column  flex-wrap px-4"
                                    >
                                      {Number(thisweekData.actionID) === 1 ? (
                                        <>
                                          {" "}
                                          <span
                                            className={
                                              styles["activity_heading"]
                                            }
                                          >
                                            {thisweekData?.description}
                                          </span>
                                          <span
                                            className={styles["date_heading"]}
                                          >
                                            {thisweekData.createdDateTime !==
                                              "" &&
                                              newTimeFormaterAsPerUTCTalkDate(
                                                thisweekData.createdDateTime
                                              )}
                                          </span>
                                          <Row>
                                            <Col
                                              lg={12}
                                              md={12}
                                              sm={12}
                                              className="d-flex gap-2 align-items-center"
                                            >
                                              <img
                                                src={getIconSource(
                                                  getFileExtension(
                                                    thisweekData?.displayFileName
                                                  )
                                                )}
                                                alt=""
                                                height="17px"
                                                width="17px"
                                              />
                                              <span
                                                className={
                                                  styles["Filename_heading"]
                                                }
                                              >
                                                {thisweekData?.displayFileName}
                                              </span>
                                            </Col>
                                          </Row>
                                        </>
                                      ) : Number(thisweekData.actionID) ===
                                        2 ? (
                                        <>
                                          <span
                                            className={
                                              styles["activity_heading"]
                                            }
                                          >
                                            {thisweekData?.description}
                                          </span>
                                          <span
                                            className={styles["date_heading"]}
                                          >
                                            {thisweekData.createdDateTime !==
                                              "" &&
                                              newTimeFormaterAsPerUTCTalkDate(
                                                thisweekData.createdDateTime
                                              )}
                                          </span>
                                          <Row>
                                            <Col
                                              lg={12}
                                              md={12}
                                              sm={12}
                                              className="d-flex gap-2 align-items-center"
                                            >
                                              <img
                                                src={getIconSource(
                                                  getFileExtension(
                                                    thisweekData?.displayFileName
                                                  )
                                                )}
                                                alt=""
                                                height="17px"
                                                width="17px"
                                              />
                                              <span
                                                className={
                                                  styles["Filename_heading"]
                                                }
                                              >
                                                {thisweekData?.displayFileName}
                                              </span>
                                            </Col>
                                          </Row>
                                        </>
                                      ) : Number(thisweekData.actionID) ===
                                        3 ? (
                                        <>
                                          <span
                                            className={
                                              styles["activity_heading"]
                                            }
                                          >
                                            {thisweekData?.description}
                                          </span>
                                          <span
                                            className={styles["date_heading"]}
                                          >
                                            {thisweekData.createdDateTime !==
                                              "" &&
                                              newTimeFormaterAsPerUTCTalkDate(
                                                thisweekData.createdDateTime
                                              )}
                                          </span>
                                          <Row>
                                            <Col
                                              lg={12}
                                              md={12}
                                              sm={12}
                                              className="d-flex gap-2 align-items-center"
                                            >
                                              <img
                                                src={getIconSource(
                                                  getFileExtension(
                                                    thisweekData?.displayFileName
                                                  )
                                                )}
                                                alt=""
                                                height="17px"
                                                width="17px"
                                              />
                                              <span
                                                className={
                                                  styles["Filename_heading"]
                                                }
                                              >
                                                {thisweekData?.displayFileName}
                                              </span>
                                            </Col>
                                          </Row>
                                        </>
                                      ) : Number(thisweekData.actionID) ===
                                        4 ? (
                                        <>
                                          {" "}
                                          <span
                                            className={
                                              styles["activity_heading"]
                                            }
                                          >
                                            {thisweekData?.description}
                                          </span>
                                          <span
                                            className={styles["date_heading"]}
                                          >
                                            {thisweekData.createdDateTime !==
                                              "" &&
                                              newTimeFormaterAsPerUTCTalkDate(
                                                thisweekData.createdDateTime
                                              )}
                                          </span>
                                          <Row>
                                            <Col
                                              lg={12}
                                              md={12}
                                              sm={12}
                                              className="d-flex gap-2 align-items-center"
                                            >
                                              <img
                                                src={getIconSource(
                                                  getFileExtension(
                                                    thisweekData?.displayFileName
                                                  )
                                                )}
                                                alt=""
                                                height="17px"
                                                width="17px"
                                              />
                                              <span
                                                className={
                                                  styles["Filename_heading"]
                                                }
                                              >
                                                {thisweekData?.displayFileName}
                                              </span>
                                            </Col>
                                          </Row>
                                        </>
                                      ) : (
                                        <>
                                          {" "}
                                          <span
                                            className={
                                              styles["activity_heading"]
                                            }
                                          >
                                            {thisweekData?.description}
                                          </span>
                                          <span
                                            className={styles["date_heading"]}
                                          >
                                            {thisweekData.createdDateTime !==
                                              "" &&
                                              newTimeFormaterAsPerUTCTalkDate(
                                                thisweekData.createdDateTime
                                              )}
                                          </span>
                                          <Row>
                                            <Col
                                              lg={12}
                                              md={12}
                                              sm={12}
                                              className="d-flex gap-2 align-items-center"
                                            >
                                              <img
                                                src={getIconSource(
                                                  getFileExtension(
                                                    thisweekData?.displayFileName
                                                  )
                                                )}
                                                alt=""
                                                height="17px"
                                                width="17px"
                                              />
                                              <span
                                                className={
                                                  styles["Filename_heading"]
                                                }
                                              >
                                                {thisweekData?.displayFileName}
                                              </span>
                                            </Col>
                                          </Row>
                                        </>
                                      )}
                                    </Col>
                                  </Row>
                                </>
                              );
                            }
                          )}

                        {/* This Month */}
                        {documentActivityDetails?.thisMonth?.length > 0 && (
                          <Row>
                            <Col lg={12} md={12} sm={12}>
                              <span className={styles["Today_heading"]}>
                                {t("This-month")}
                              </span>
                            </Col>
                          </Row>
                        )}

                        {documentActivityDetails?.thisMonth?.length > 0 &&
                          documentActivityDetails?.thisMonth.map(
                            (thisMonthData, index) => {
                              return (
                                <>
                                  <Row className="mt-2">
                                    <Col lg={1} md={1} sm={1}>
                                      <img
                                        src={profilepic}
                                        alt=""
                                        height="30.25px"
                                        width="30.25px"
                                        className={styles["profileClass"]}
                                      />
                                    </Col>
                                    <Col
                                      lg={11}
                                      md={11}
                                      sm={11}
                                      className="d-flex flex-column  flex-wrap px-4"
                                    >
                                      {Number(thisMonthData.actionID) === 1 ? (
                                        <>
                                          <span
                                            className={
                                              styles["activity_heading"]
                                            }
                                          >
                                            {thisMonthData?.description}
                                          </span>
                                          <span
                                            className={styles["date_heading"]}
                                          >
                                            {thisMonthData.createdDateTime !==
                                              "" &&
                                              newTimeFormaterAsPerUTCTalkDate(
                                                thisMonthData.createdDateTime
                                              )}
                                          </span>
                                          <Row>
                                            <Col
                                              lg={12}
                                              md={12}
                                              sm={12}
                                              className="d-flex gap-2 align-items-center"
                                            >
                                              <img
                                                src={getIconSource(
                                                  getFileExtension(
                                                    thisMonthData?.displayFileName
                                                  )
                                                )}
                                                alt=""
                                                height="17px"
                                                width="17px"
                                              />
                                              <span
                                                className={
                                                  styles["Filename_heading"]
                                                }
                                              >
                                                {thisMonthData?.displayFileName}
                                              </span>
                                            </Col>
                                          </Row>
                                        </>
                                      ) : Number(thisMonthData.actionID) ===
                                        2 ? (
                                        <>
                                          <span
                                            className={
                                              styles["activity_heading"]
                                            }
                                          >
                                            {thisMonthData?.description}
                                          </span>
                                          <span
                                            className={styles["date_heading"]}
                                          >
                                            {thisMonthData.createdDateTime !==
                                              "" &&
                                              newTimeFormaterAsPerUTCTalkDate(
                                                thisMonthData.createdDateTime
                                              )}
                                          </span>
                                          <Row>
                                            <Col
                                              lg={12}
                                              md={12}
                                              sm={12}
                                              className="d-flex gap-2 align-items-center"
                                            >
                                              <img
                                                src={getIconSource(
                                                  getFileExtension(
                                                    thisMonthData?.displayFileName
                                                  )
                                                )}
                                                alt=""
                                                height="17px"
                                                width="17px"
                                              />
                                              <span
                                                className={
                                                  styles["Filename_heading"]
                                                }
                                              >
                                                {thisMonthData?.displayFileName}
                                              </span>
                                            </Col>
                                          </Row>
                                        </>
                                      ) : Number(thisMonthData.actionID) ===
                                        3 ? (
                                        <>
                                          <span
                                            className={
                                              styles["activity_heading"]
                                            }
                                          >
                                            {thisMonthData?.description}
                                          </span>
                                          <span
                                            className={styles["date_heading"]}
                                          >
                                            {thisMonthData.createdDateTime !==
                                              "" &&
                                              newTimeFormaterAsPerUTCTalkDate(
                                                thisMonthData.createdDateTime
                                              )}
                                          </span>
                                          <Row>
                                            <Col
                                              lg={12}
                                              md={12}
                                              sm={12}
                                              className="d-flex gap-2 align-items-center"
                                            >
                                              <img
                                                src={getIconSource(
                                                  getFileExtension(
                                                    thisMonthData?.displayFileName
                                                  )
                                                )}
                                                alt=""
                                                height="17px"
                                                width="17px"
                                              />
                                              <span
                                                className={
                                                  styles["Filename_heading"]
                                                }
                                              >
                                                {thisMonthData?.displayFileName}
                                              </span>
                                            </Col>
                                          </Row>
                                        </>
                                      ) : Number(thisMonthData.actionID) ===
                                        4 ? (
                                        <>
                                          <span
                                            className={
                                              styles["activity_heading"]
                                            }
                                          >
                                            {thisMonthData?.description}
                                          </span>
                                          <span
                                            className={styles["date_heading"]}
                                          >
                                            {thisMonthData.createdDateTime !==
                                              "" &&
                                              newTimeFormaterAsPerUTCTalkDate(
                                                thisMonthData.createdDateTime
                                              )}
                                          </span>
                                          <Row>
                                            <Col
                                              lg={12}
                                              md={12}
                                              sm={12}
                                              className="d-flex gap-2 align-items-center"
                                            >
                                              <img
                                                src={getIconSource(
                                                  getFileExtension(
                                                    thisMonthData?.displayFileName
                                                  )
                                                )}
                                                alt=""
                                                height="17px"
                                                width="17px"
                                              />
                                              <span
                                                className={
                                                  styles["Filename_heading"]
                                                }
                                              >
                                                {thisMonthData?.displayFileName}
                                              </span>
                                            </Col>
                                          </Row>
                                        </>
                                      ) : (
                                        <>
                                          <span
                                            className={
                                              styles["activity_heading"]
                                            }
                                          >
                                            {thisMonthData?.description}
                                          </span>
                                          <span
                                            className={styles["date_heading"]}
                                          >
                                            {thisMonthData.createdDateTime !==
                                              "" &&
                                              newTimeFormaterAsPerUTCTalkDate(
                                                thisMonthData.createdDateTime
                                              )}
                                          </span>
                                          <Row>
                                            <Col
                                              lg={12}
                                              md={12}
                                              sm={12}
                                              className="d-flex gap-2 align-items-center"
                                            >
                                              <img
                                                src={getIconSource(
                                                  getFileExtension(
                                                    thisMonthData?.displayFileName
                                                  )
                                                )}
                                                alt=""
                                                height="17px"
                                                width="17px"
                                              />
                                              <span
                                                className={
                                                  styles["Filename_heading"]
                                                }
                                              >
                                                {thisMonthData?.displayFileName}
                                              </span>
                                            </Col>
                                          </Row>
                                        </>
                                      )}
                                    </Col>
                                  </Row>
                                </>
                              );
                            }
                          )}

                        {/* Pervious Month */}
                        {documentActivityDetails?.previousMonth?.length > 0 && (
                          <Row>
                            <Col lg={12} md={12} sm={12}>
                              <span className={styles["Today_heading"]}>
                                {t("This-month")}
                              </span>
                            </Col>
                          </Row>
                        )}

                        {documentActivityDetails?.previousMonth?.length > 0 &&
                          documentActivityDetails?.previousMonth.map(
                            (previousMonthData, index) => {
                              return (
                                <>
                                  <Row className="mt-2">
                                    <Col lg={1} md={1} sm={1}>
                                      <img
                                        src={`data:image/jpeg;base64,${previousMonthData.base64ImgOwner}`}
                                        alt=""
                                        height="30px"
                                        width="30px"
                                        className={styles["profileClass"]}
                                      />
                                    </Col>
                                    <Col
                                      lg={11}
                                      md={11}
                                      sm={11}
                                      className="d-flex flex-column  flex-wrap px-3"
                                    >
                                      {Number(previousMonthData.actionID) ===
                                      1 ? (
                                        <>
                                          <span
                                            className={
                                              styles["activity_heading"]
                                            }
                                          >
                                            {previousMonthData?.description}
                                          </span>
                                          <span
                                            className={styles["date_heading"]}
                                          >
                                            {previousMonthData.createdDateTime !==
                                              "" &&
                                              newTimeFormaterAsPerUTCTalkDate(
                                                previousMonthData.createdDateTime
                                              )}
                                          </span>
                                          <Row>
                                            <Col
                                              lg={12}
                                              md={12}
                                              sm={12}
                                              className="d-flex gap-2 align-items-center"
                                            >
                                              <img
                                                src={getIconSource(
                                                  getFileExtension(
                                                    previousMonthData?.displayFileName
                                                  )
                                                )}
                                                alt=""
                                                height="17px"
                                                width="17px"
                                              />
                                              <span
                                                className={
                                                  styles["Filename_heading"]
                                                }
                                              >
                                                {
                                                  previousMonthData?.displayFileName
                                                }
                                              </span>
                                            </Col>
                                          </Row>
                                        </>
                                      ) : Number(previousMonthData.actionID) ===
                                        2 ? (
                                        <>
                                          <span
                                            className={
                                              styles["activity_heading"]
                                            }
                                          >
                                            {previousMonthData?.description}
                                          </span>
                                          <span
                                            className={styles["date_heading"]}
                                          >
                                            {previousMonthData.createdDateTime !==
                                              "" &&
                                              newTimeFormaterAsPerUTCTalkDate(
                                                previousMonthData.createdDateTime
                                              )}
                                          </span>
                                          <Row>
                                            <Col
                                              lg={12}
                                              md={12}
                                              sm={12}
                                              className="d-flex gap-2 align-items-center"
                                            >
                                              <img
                                                src={getIconSource(
                                                  getFileExtension(
                                                    previousMonthData?.displayFileName
                                                  )
                                                )}
                                                alt=""
                                                height="17px"
                                                width="17px"
                                              />
                                              <span
                                                className={
                                                  styles["Filename_heading"]
                                                }
                                              >
                                                {
                                                  previousMonthData?.displayFileName
                                                }
                                              </span>
                                            </Col>
                                          </Row>
                                        </>
                                      ) : Number(previousMonthData.actionID) ===
                                        3 ? (
                                        <>
                                          <span
                                            className={
                                              styles["activity_heading"]
                                            }
                                          >
                                            {previousMonthData?.description}
                                          </span>
                                          <span
                                            className={styles["date_heading"]}
                                          >
                                            {previousMonthData.createdDateTime !==
                                              "" &&
                                              newTimeFormaterAsPerUTCTalkDate(
                                                previousMonthData.createdDateTime
                                              )}
                                          </span>
                                          <Row>
                                            <Col
                                              lg={12}
                                              md={12}
                                              sm={12}
                                              className="d-flex gap-2 align-items-center"
                                            >
                                              <img
                                                src={getIconSource(
                                                  getFileExtension(
                                                    previousMonthData?.displayFileName
                                                  )
                                                )}
                                                alt=""
                                                height="17px"
                                                width="17px"
                                              />
                                              <span
                                                className={
                                                  styles["Filename_heading"]
                                                }
                                              >
                                                {
                                                  previousMonthData?.displayFileName
                                                }
                                              </span>
                                            </Col>
                                          </Row>
                                        </>
                                      ) : Number(previousMonthData.actionID) ===
                                        4 ? (
                                        <>
                                          <span
                                            className={
                                              styles["activity_heading"]
                                            }
                                          >
                                            {previousMonthData?.description}
                                          </span>
                                          <span
                                            className={styles["date_heading"]}
                                          >
                                            {previousMonthData.createdDateTime !==
                                              "" &&
                                              newTimeFormaterAsPerUTCTalkDate(
                                                previousMonthData.createdDateTime
                                              )}
                                          </span>
                                          <Row>
                                            <Col
                                              lg={12}
                                              md={12}
                                              sm={12}
                                              className="d-flex gap-2 align-items-center"
                                            >
                                              <img
                                                src={getIconSource(
                                                  getFileExtension(
                                                    previousMonthData?.displayFileName
                                                  )
                                                )}
                                                alt=""
                                                height="17px"
                                                width="17px"
                                              />
                                              <span
                                                className={
                                                  styles["Filename_heading"]
                                                }
                                              >
                                                {
                                                  previousMonthData?.displayFileName
                                                }
                                              </span>
                                            </Col>
                                          </Row>
                                        </>
                                      ) : (
                                        <>
                                          <span
                                            className={
                                              styles["activity_heading"]
                                            }
                                          >
                                            {previousMonthData?.description}
                                          </span>
                                          <span
                                            className={styles["date_heading"]}
                                          >
                                            {previousMonthData.createdDateTime !==
                                              "" &&
                                              newTimeFormaterAsPerUTCTalkDate(
                                                previousMonthData.createdDateTime
                                              )}
                                          </span>
                                          <Row>
                                            <Col
                                              lg={12}
                                              md={12}
                                              sm={12}
                                              className="d-flex gap-2 align-items-center"
                                            >
                                              <img
                                                src={getIconSource(
                                                  getFileExtension(
                                                    previousMonthData?.displayFileName
                                                  )
                                                )}
                                                alt=""
                                                height="17px"
                                                width="17px"
                                              />
                                              <span
                                                className={
                                                  styles["Filename_heading"]
                                                }
                                              >
                                                {
                                                  previousMonthData?.displayFileName
                                                }
                                              </span>
                                            </Col>
                                          </Row>
                                        </>
                                      )}
                                    </Col>
                                  </Row>
                                </>
                              );
                            }
                          )}
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
