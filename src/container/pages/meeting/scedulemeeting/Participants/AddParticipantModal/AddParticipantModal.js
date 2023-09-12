import React, { useState } from "react";
import styles from "./AddParticipant.module.css";
import {
  Modal,
  Table,
  TextField,
  Button,
  Loader,
  Notification,
} from "../../../../../../components/elements";
import {
  showAddParticipantsModal,
  showAddUserModal,
} from "../../../../../../store/actions/NewMeetingActions";
import BlackCrossIcon from "../../../../../../assets/images/BlackCrossIconModals.svg";
import committeicon from "../../../../../../assets/images/Group 2584.png";
import { useDispatch, useSelector } from "react-redux";
import GroupIcon from "../../../../../../assets/images/Path 636.png";
import profile from "../../../../../../assets/images/newprofile.png";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import CrossIcon from "../../../../../../assets/images/CrossIcon.svg";

const AddParticipantModal = () => {
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

  const RemovedParticipant = (index) => {
    const updatedPartipants = [...membersParticipants];
    updatedPartipants.splice(index, 1);
    setMembersParticipants(updatedPartipants);
  };

  const [addParticipant, setAddParticipant] = useState({
    SearhParticipant: "",
  });

  const handleCrossIcon = () => {
    dispatch(showAddParticipantsModal(false));
  };
  return (
    <section>
      <Modal
        show={NewMeetingreducer.participantModal}
        setShow={dispatch(showAddParticipantsModal)}
        modalFooterClassName={"d-block"}
        onHide={() => {
          dispatch(showAddParticipantsModal(false));
        }}
        size={"md"}
        ModalBody={
          <>
            <Row>
              <Col
                lg={12}
                md={12}
                sm={12}
                className={styles["OverAll_padding"]}
              >
                <Row>
                  <Col lg={5} md={5} sm={12}>
                    <span className={styles["Add_organization"]}>
                      {t("Add-participants")}
                    </span>
                  </Col>
                  <Col
                    lg={7}
                    md={7}
                    sm={12}
                    className="d-flex justify-content-end"
                  >
                    <img
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
                                  className={styles["OverAll_Padding"]}
                                >
                                  <Row>
                                    <Col lg={12} md={12} sm={12}>
                                      <Row className={styles["Card_border2"]}>
                                        <Col sm={12} md={10} lg={10}>
                                          <img
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
                                            src={CrossIcon}
                                            width="14px"
                                            height="14px"
                                            className="cursor-pointer"
                                            onClick={() =>
                                              RemovedParticipant(index)
                                            }
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
              <Col lg={12} md={12} sm={12}>
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

export default AddParticipantModal;
