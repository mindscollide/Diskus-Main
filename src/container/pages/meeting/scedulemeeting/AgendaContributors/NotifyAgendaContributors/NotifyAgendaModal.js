import React, { useState } from "react";
import {
  Modal,
  Button,
  TextField,
  Checkbox,
} from "../../../../../../components/elements";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import BlackCrossIcon from "../../../../../../assets/images/BlackCrossIconModals.svg";
import { useNavigate } from "react-router-dom";
import profile from "../../../../../../assets/images/newprofile.png";
import {
  showAgendaContributorsModals,
  showNotifyOrganizors,
} from "../../../../../../store/actions/NewMeetingActions";
import UpperArrow from "../../../../../../assets/images/blueUp.svg";
import { Col, Row } from "react-bootstrap";
import styles from "./NotifyAgendaModal.module.css";
import { validateInput } from "../../../../../../commen/functions/regex";

const NotifyAgendaModal = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { NewMeetingreducer } = useSelector((state) => state);
  const [members, setMembers] = useState([
    {
      name: "saif",
    },
    {
      name: "owais wAJID",
    },
    {
      name: "ALI RAZA",
    },
    {
      name: "huzeifa",
    },
    {
      name: "mamdani",
    },
    {
      name: "aun",
    },
    {
      name: "saroush",
    },
  ]);

  const [agendaMessege, setAgendaMessege] = useState({
    Messege: "",
  });

  const handleCrossIcon = () => {
    dispatch(showAgendaContributorsModals(false));
  };

  const HandleChange = (e, index) => {
    let name = e.target.name;
    let value = e.target.value;
    if (name === "AgendaMessege") {
      let valueCheck = validateInput(value);
      if (valueCheck !== "") {
        setAgendaMessege({
          ...agendaMessege,
          Messege: valueCheck,
        });
      } else {
        setAgendaMessege({
          ...agendaMessege,
          Messege: "",
        });
      }
    }
  };

  return (
    <section>
      <Modal
        show={NewMeetingreducer.notifyAgendaContributors}
        setShow={dispatch(showAgendaContributorsModals)}
        modalFooterClassName={"d-block"}
        onHide={() => {
          dispatch(showAgendaContributorsModals(false));
        }}
        ModalBody={
          <>
            <Row>
              <Col lg={7} md={7} sm={12}>
                <span className={styles["Notify_organisors"]}>
                  {t("Notify-agenda-contributor")}
                </span>
              </Col>
              <Col lg={5} md={5} sm={12} className="d-flex justify-content-end">
                <img
                  src={BlackCrossIcon}
                  className={styles["Cross_Icon_Styling"]}
                  width="16px"
                  height="16px"
                  onClick={handleCrossIcon}
                />
              </Col>
            </Row>
            <Row>
              <Col lg={12} md={12} sm={12}>
                <TextField
                  applyClass="text-area-create-Notify-organizors"
                  type="text"
                  as={"textarea"}
                  rows="4"
                  placeholder={t("AgendaMessege")}
                  value={agendaMessege.Messege}
                  change={HandleChange}
                  required={true}
                  maxLength={500}
                />
              </Col>
            </Row>
            <Row className="mt-4">
              <Col
                lg={12}
                md={12}
                sm={12}
                className="d-flex justify-content-end align-items-center gap-2"
              >
                <span className={styles["Hide_names"]}>{t("Hide-names")}</span>
                <img
                  src={UpperArrow}
                  width="18.4px"
                  height="9.2px"
                  className="cursor-pointer"
                />
              </Col>
            </Row>
            <Row className="mt-3">
              <Col
                lg={12}
                md={12}
                sm={12}
                className={styles["Scroller_notify"]}
              >
                <Row>
                  {members.map((data, index) => {
                    return (
                      <Col lg={6} md={6} sm={12} className="mt-2">
                        <Row className="m-0 p-0">
                          <Col
                            lg={12}
                            md={12}
                            sm={12}
                            className={styles["Box_for_Assignee"]}
                          >
                            <Row>
                              <Col
                                lg={10}
                                md={10}
                                sm={12}
                                className="d-flex gap-2 align-items-center"
                              >
                                <img
                                  src={profile}
                                  width="33px"
                                  height="33px"
                                  className={styles["ProfilePic"]}
                                />
                                <span className={styles["Participants_Name"]}>
                                  {data.name}
                                </span>
                              </Col>
                              <Col lg={2} md={2} sm={12}>
                                <Checkbox />
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
          </>
        }
        ModalFooter={
          <>
            <Row>
              <Col
                lg={12}
                md={12}
                sm={12}
                className="d-flex justify-content-end gap-2"
              >
                <Button
                  text={t("Cancel")}
                  className={styles["Cancel_button_Notify"]}
                />
                <Button text={t("Send")} className={styles["Send_Notify"]} />
              </Col>
            </Row>
          </>
        }
      />
    </section>
  );
};

export default NotifyAgendaModal;
