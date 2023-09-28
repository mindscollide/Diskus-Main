import React, { useState } from "react";
import styles from "./AgendaContritbutorsModal.module.css";
import { Modal, Button } from "../../../../../../components/elements";
import { showAddAgendaContributor } from "../../../../../../store/actions/NewMeetingActions";
import BlackCrossIcon from "../../../../../../assets/images/BlackCrossIconModals.svg";
import { useDispatch, useSelector } from "react-redux";
import CrossIcon from "../../../../../../assets/images/CrossIcon.svg";
import profile from "../../../../../../assets/images/newprofile.png";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
import Select from "react-select";
import makeAnimated from "react-select/animated";

const AgendaContributorsModal = () => {
  const animatedComponents = makeAnimated();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { NewMeetingreducer } = useSelector((state) => state);
  const [membersParticipants, setMembersParticipants] = useState([
    {
      name: "SAIF UL ISLAM",
    },

    {
      name: "HUZEIFA JAHANGIR",
    },
    {
      name: "OWAIS KHAN",
    },
    {
      name: "ALI MAMDANI",
    },
    {
      name: "ALI MAMDANI",
    },
    {
      name: "ALI MAMDANI",
    },
    {
      name: "ALI MAMDANI",
    },
    {
      name: "ALI MAMDANI",
    },

    {
      name: "ALI MAMDANI",
    },
  ]);

  const handleCrossIcon = () => {
    dispatch(showAddAgendaContributor(false));
  };
  return (
    <section>
      <Modal
        show={NewMeetingreducer.agendaContributors}
        setShow={dispatch(showAddAgendaContributor)}
        modalFooterClassName={"d-block"}
        onHide={() => {
          dispatch(showAddAgendaContributor(false));
        }}
        size={"md"}
        ModalBody={
          <>
            <Row>
              <Col
                lg={12}
                md={12}
                sm={12}
                className={styles["OverAll_Padding"]}
              >
                <Row>
                  <Col lg={7} md={7} sm={12}>
                    <span className={styles["Add_organization"]}>
                      {t("Add-agenda-contributors")}
                    </span>
                  </Col>
                  <Col
                    lg={5}
                    md={5}
                    sm={12}
                    className="d-flex justify-content-end"
                  >
                    <img
                      draggable={false}
                      src={BlackCrossIcon}
                      className={"cursor-pointer"}
                      width="16px"
                      height="16px"
                      onClick={handleCrossIcon}
                    />
                  </Col>
                </Row>
                <Row className="mt-5">
                  <Col lg={12} md={12} sm={12}>
                    <Select
                      closeMenuOnSelect={false}
                      classNamePrefix={"ModalOrganizerSelect"}
                      components={animatedComponents}
                      isMulti
                    />
                  </Col>
                </Row>

                <Row className={styles["Scroller_For_CreatePollModal2"]}>
                  {membersParticipants.length > 0
                    ? membersParticipants.map((data, index) => {
                        return (
                          <>
                            <Col lg={6} md={6} sm={12} className="mt-2">
                              <Row>
                                <Col
                                  lg={12}
                                  md={12}
                                  sm={12}
                                  className={styles["padding_class"]}
                                >
                                  <Row>
                                    <Col lg={12} md={12} sm={12}>
                                      <Row className={styles["Card_border2"]}>
                                        <Col sm={12} md={10} lg={10}>
                                          <img
                                            draggable={false}
                                            src={profile}
                                            width="33px"
                                            height="33px"
                                          />
                                          <span
                                            className={styles["Name_cards"]}
                                          >
                                            {data.name}
                                          </span>
                                        </Col>
                                        <Col sm={12} md={2} lg={2}>
                                          <img
                                            draggable={false}
                                            src={CrossIcon}
                                            width="14px"
                                            height="14px"
                                          />
                                        </Col>
                                      </Row>
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
              </Col>
            </Row>
          </>
        }
        ModalFooter={
          <>
            <Row>
              <Col
                lg={12}
                md={12}
                sm={12}
                className={styles["OverAll_Padding"]}
              >
                <Row className="mt-2">
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className="d-flex justify-content-end"
                  >
                    <Button
                      text={t("Done")}
                      className={styles["Done_btn_organizor_modal"]}
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
          </>
        }
      />
    </section>
  );
};

export default AgendaContributorsModal;
