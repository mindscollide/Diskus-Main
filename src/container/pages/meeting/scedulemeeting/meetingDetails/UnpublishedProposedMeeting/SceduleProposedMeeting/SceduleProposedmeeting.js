import React, { useState } from "react";
import styles from "./SceduleProposedMeeting.module.css";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
import { Modal, Button } from "../../../../../../../components/elements";
import { useSelector } from "react-redux";
import { showSceduleProposedMeeting } from "../../../../../../../store/actions/NewMeetingActions";
import BlueTick from "../../../../../../../assets/images/BlueTick.svg";
const SceduleProposedmeeting = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { NewMeetingreducer } = useSelector((state) => state);
  const [sceduleProposedmeetingData, setSceduleProposedmeetingData] = useState([
    {
      date: [
        {
          dataFormeeting: "22-july-2023",
        },
        {
          dataFormeeting: "25-march-2023",
        },
        {
          dataFormeeting: "28-October-2023",
        },
      ],
      members: [
        {
          name: "Mr Abdul Qadir",
          designation: "CFO",
          isTick: true,
        },
        {
          name: "Mr Huzaeifa Jahangir",
          designation: "Team Lead",
          isTick: true,
        },
        {
          name: "Mr Saif Ul Islam",
          designation: "Software Engineer",
          isTick: true,
        },
      ],

      Selected: true,
    },
  ]);
  return (
    <section>
      <Modal
        show={NewMeetingreducer.sceduleproposedMeeting}
        setShow={dispatch(showSceduleProposedMeeting)}
        modalHeaderClassName={"d-block"}
        modalFooterClassName={"d-block"}
        onHide={() => {
          dispatch(showSceduleProposedMeeting(false));
        }}
        size={"md"}
        ModalTitle={
          <>
            <Row>
              <Col lg={12} md={12} sm={12}>
                <span className={styles["Scedule_Proposed_meeting_heading"]}>
                  {t("Schedule-proposed-meetings")}
                </span>
              </Col>
            </Row>
            <Row className="mt-3">
              <Col lg={12} md={12} sm={12}>
                {sceduleProposedmeetingData.length > 0
                  ? sceduleProposedmeetingData.map((tableData, tableIndex) => {
                      return (
                        <>
                          <table class={styles["custom-table"]}>
                            <tr>
                              <th></th>
                              {tableData.date.map((dateData, dateIndex) => {
                                return (
                                  <>
                                    <th>
                                      <>
                                        <Row>
                                          <Col lg={12} md={12} sm={12}>
                                            <Button
                                              text={dateData.dataFormeeting}
                                              className={
                                                styles[
                                                  "DateButtonSceduleProposedMeeting"
                                                ]
                                              }
                                            />
                                          </Col>
                                        </Row>
                                      </>
                                    </th>
                                  </>
                                );
                              })}
                            </tr>
                            {tableData.members.map(
                              (membersData, membersIndex) => {
                                return (
                                  <>
                                    <tr>
                                      <td>
                                        <>
                                          <section
                                            className={
                                              styles["SectionLineHeight"]
                                            }
                                          >
                                            <Row>
                                              <Col lg={12} md={12} sm={12}>
                                                <span
                                                  className={
                                                    styles["ParticipantName"]
                                                  }
                                                >
                                                  {membersData.name}
                                                </span>
                                              </Col>
                                            </Row>
                                            <Row>
                                              <Col lg={12} md={12} sm={12}>
                                                <span
                                                  className={
                                                    styles["Designation"]
                                                  }
                                                >
                                                  {membersData.designation}
                                                </span>
                                              </Col>
                                            </Row>
                                          </section>
                                        </>
                                      </td>
                                      <td>
                                        <>
                                          <Row>
                                            <Col
                                              lg={12}
                                              md={12}
                                              sm={12}
                                              className="d-flex justify-content-center"
                                            >
                                              {membersData.isTick === true ? (
                                                <>
                                                  <img
                                                    src={BlueTick}
                                                    height="14.21px"
                                                    width="20.7px"
                                                  />
                                                </>
                                              ) : null}
                                            </Col>
                                          </Row>
                                        </>
                                      </td>
                                    </tr>
                                  </>
                                );
                              }
                            )}
                          </table>
                        </>
                      );
                    })
                  : null}
              </Col>
            </Row>
          </>
        }
      />
    </section>
  );
};

export default SceduleProposedmeeting;
