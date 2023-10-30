import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import styles from "./ViewUpdateCommittee.module.css";
import Newprofile from "../../../assets/images/newprofile.png";
import { Paper } from "@material-ui/core";
import { Button } from "./../../../components/elements";
import { useTranslation } from "react-i18next";
import pdfIcon from "../../../assets/images/pdf_icon.svg";
import file_image from "../../../assets/images/file_image.svg";
import featherupload from "../../../assets/images/featherupload.svg";
import Committee from "../../../container/Committee/Committee";
import { useDispatch, useSelector } from "react-redux";
import { allAssignessList } from "../../../store/actions/Get_List_Of_Assignees";
import { useNavigate } from "react-router-dom";
import { Upload } from "antd";

const ViewUpdateCommittee = ({ setViewGroupPage }) => {
  const { Dragger } = Upload;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [fileAttachments, setFileAttachments] = useState([]);
  const [viewCommitteeClose, setViewCommitteeClose] = useState(true);
  const { CommitteeReducer } = useSelector((state) => state);
  const [committeeData, setCommitteeData] = useState({
    committeeTitle: "",
    committeeDescription: "",
    isTalkGroup: false,
    committeeType: "",
    committeeStatus: 0,
    committeeID: 0,
    committeeMembers: [],
  });
  const closebtn = async () => {
    setViewGroupPage(false);
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
        committeeID: 0,
        committeeMembers: committeedetails.committeMembers,
      });
    }
  }, [CommitteeReducer.getCommitteeByCommitteeID]);

  const props = {
    name: "file",
    multiple: true,
    showUploadList: false,
    onChange(data) {
      const { status } = data.file;
      console.log(data.file.originFileObj.name, "customRequestcustomRequest");
      const File = data.file.originFileObj.name;
      setFileAttachments([...fileAttachments, File]);
    },
    onDrop(e) {},
    customRequest() {},
  };

  console.log(fileAttachments, "fileAttachmentsfileAttachments");

  return (
    <>
      <section className="MontserratSemiBold-600 color-5a5a5a">
        <Row className="mt-3">
          <Col lg={12} md={12} sm={12}>
            <span className={styles["View-Committee-heading"]}>
              {t("View-committee")}
            </span>
          </Col>
        </Row>

        <Paper className={styles["View-Committee-paper"]}>
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
                          <Col lg={4} md={4} sm={12} className="mt-2">
                            <Row>
                              <Col lg={2} md={2} sm={12}>
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
                          <Col lg={4} md={4} sm={12} className="mt-2">
                            <Row>
                              <Col lg={2} md={2} sm={12}>
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
                          <Col lg={4} md={4} sm={12} className="mt-2">
                            <Row>
                              <Col lg={2} md={2} sm={12}>
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
                        {t("Choose-file")}
                      </span>
                      <span className={styles["here_text"]}>{t("Here")}</span>
                    </p>
                  </Dragger>
                </Col>
              </Row>
              <Row className="mt-4">
                <Col lg={12} md={12} sm={12} className="d-flex gap-2">
                  {fileAttachments.length > 0
                    ? fileAttachments.map((data, index) => {
                        console.log(data, "datadatadata");
                        return (
                          <>
                            <Col lg={4} md={4} sm={4}>
                              <section className={styles["Outer_Box"]}>
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
                                        src={pdfIcon}
                                        height="10px"
                                        width="10px"
                                        className={styles["IconPDF"]}
                                      />
                                      <span className={styles["FileName"]}>
                                        {data}
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
          <Row className="mt-5">
            <Col lg={12} md={12} sm={12} className="d-flex justify-content-end">
              <Button
                className={styles["Close-ViewCommittee-btn"]}
                text={t("Close")}
                onClick={closebtn}
              />
            </Col>
          </Row>
        </Paper>
      </section>
    </>
  );
};

export default ViewUpdateCommittee;
