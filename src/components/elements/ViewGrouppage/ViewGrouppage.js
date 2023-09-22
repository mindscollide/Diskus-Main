import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import styles from "./ViewGrouppage.module.css";
import Newprofile from "../../../assets/images/newprofile.png";
import { useTranslation } from "react-i18next";
import { Paper } from "@material-ui/core";
import {
  TextField,
  Button,
  Checkbox,
  SelectBox,
  InputSearchFilter,
} from "./../../../components/elements";
import { useDispatch, useSelector } from "react-redux";
import { allAssignessList } from "../../../store/actions/Get_List_Of_Assignees";
import { useNavigate } from "react-router-dom";
const ViewGrouppage = ({ setViewGroupPage }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [viewGroupDetails, setViewGroupDetails] = useState({
    Title: "",
    Description: "",
    GroupMembers: [],
    GroupHeads: [],
    GroupStatus: null,
    GroupType: null,
    isTalk: false,
  });

  const { GroupsReducer } = useSelector((state) => state);

  useEffect(() => {
    if (GroupsReducer.getGroupByGroupIdResponse !== null) {
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
      });
    }
  }, [GroupsReducer]);
  useEffect(() => {
    let UserID = JSON.parse(localStorage.getItem("userID"));
    try {
      dispatch(allAssignessList(navigate, t));
    } catch {}
  }, []);
  return (
    <section className="MontserratSemiBold-600 color-5a5a5a">
      <Row className="mt-3">
        <Col lg={12} md={12} sm={12}>
          <span className={styles["View-Group-heading"]}>
            {t("View-group")}
          </span>
        </Col>
      </Row>

      <Paper className={styles["View-group-paper"]}>
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
                      <Col
                        lg={4}
                        md={4}
                        sm={12}
                        className={styles["group-head-info"]}
                      >
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
                          <Col lg={10} md={10} sm={12} className="mt-1">
                            <Row>
                              <Col lg={12} md={12} sm={12}>
                                <span className={styles["name-create-group"]}>
                                  {data?.userName}
                                </span>
                              </Col>
                            </Row>
                            <Row>
                              <Col lg={12} md={12} sm={12}>
                                <span
                                  className={styles["Designation-create-group"]}
                                >
                                  {data?.designation}
                                </span>
                              </Col>
                            </Row>
                            <Row>
                              <Col lg={12} md={12} sm={12}>
                                <span className={styles["email-create-group"]}>
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
                      <Col lg={4} md={4} sm={12} className="mt-3">
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
                            lg={10}
                            md={10}
                            sm={12}
                            className={styles["group-head-info"]}
                          >
                            <Row className="mt-1">
                              <Col lg={12} md={12} sm={12}>
                                <span className={styles["name-create-group"]}>
                                  {data?.userName}
                                </span>
                              </Col>
                            </Row>
                            <Row>
                              <Col lg={12} md={12} sm={12}>
                                <span
                                  className={styles["Designation-create-group"]}
                                >
                                  {data?.designation}
                                </span>
                              </Col>
                            </Row>
                            <Row>
                              <Col lg={12} md={12} sm={12}>
                                <span className={styles["email-create-group"]}>
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
        <Row className="mt-4">
          <Col lg={12} md={12} sm={12} className="d-flex justify-content-end">
            <Button
              className={styles["Close-ViewGroup-btn"]}
              text={t("Close")}
              onClick={() => setViewGroupPage(false)}
            />
          </Col>
          {/* <Col lg={1} md={1} sm={1}></Col> */}
        </Row>
      </Paper>
    </section>
  );
};

export default ViewGrouppage;
