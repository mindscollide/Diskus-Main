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
import {
  SendNotificationApiFunc,
  showAgendaContributorsModals,
} from "../../../../../../store/actions/NewMeetingActions";
import UpperArrow from "../../../../../../assets/images/blueUp.svg";
import { Col, Row } from "react-bootstrap";
import styles from "./NotifyAgendaModal.module.css";
import { validateInput } from "../../../../../../commen/functions/regex";
import BlueDownArrow from "../../../../../../assets/images/blueDownDirect.png";

const NotifyAgendaModal = ({
  notifiedMembersData,
  setRowsData,
  setNotifyMessageField,
  notifyMessageField,
  specificUser,
  setSpecifiUser,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { NewMeetingreducer } = useSelector((state) => state);
  const [hidemembes, setHidemembes] = useState(false);
  let userID = localStorage.getItem("userID");

  const HandleChange = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    if (name === "AgendaMessege") {
      let valueCheck = validateInput(value);
      if (valueCheck !== "") {
        setNotifyMessageField(valueCheck);
      } else {
        setNotifyMessageField("");
      }
    }
  };

  const handleExpandNames = () => {
    setHidemembes(!hidemembes);
  };

  const handleCheckAll = (e) => {
    setRowsData((prevRowsData) => {
      return prevRowsData.map((row, index) => {
        return {
          ...row,
          isContributorNotified: e.target.checked,
        };
      });
    });
  };

  const handleChangeBox = (e, userID) => {
    setRowsData((prevRowsData) => {
      return prevRowsData.map((row, index) => {
        if (row.userID === userID) {
          return {
            ...row,
            isContributorNotified: e.target.checked,
          };
        }
        return row;
      });
    });
  };

  const handleSendIcon = () => {
    if (specificUser !== 0) {
      let Data = {
        UserID: Number(userID),
        Message: notifyMessageField,
        IsAgendaContributor: false,
      };

      dispatch(SendNotificationApiFunc(Data, navigate, t));
      dispatch(showAgendaContributorsModals(false));
      setSpecifiUser(0);
    } else {
      dispatch(showAgendaContributorsModals(false));
    }
  };

  const handleCancel = () => {
    dispatch(showAgendaContributorsModals(false));
    setSpecifiUser(0);
  };

  return (
    <section>
      <Modal
        show={NewMeetingreducer.notifyAgendaContributors}
        setShow={dispatch(showAgendaContributorsModals)}
        modalFooterClassName={"d-block"}
        onHide={() => {
          dispatch(showAgendaContributorsModals(false));
          setNotifyMessageField("");
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
                  draggable={false}
                  src={BlackCrossIcon}
                  className={styles["Cross_Icon_Styling"]}
                  width="16px"
                  height="16px"
                  onClick={handleCancel}
                  alt=""
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
                  placeholder={t("Message-for-agenda-contributor")}
                  name={"AgendaMessege"}
                  value={notifyMessageField}
                  change={HandleChange}
                  required={true}
                />
              </Col>
            </Row>
            {specificUser === 0 && (
              <>
                {" "}
                <Row className="mt-4">
                  <Col
                    lg={6}
                    md={6}
                    sm={6}
                    className="d-flex justify-content-start align-items-center gap-2"
                  >
                    <>
                      <Checkbox
                        checked={notifiedMembersData.every(
                          (data) => data.isContributorNotified === true
                        )}
                        onChange={handleCheckAll}
                      />
                      <p className={styles["Check_box_title"]}>
                        {t("All-agenda-contributors")}
                      </p>
                    </>
                  </Col>
                  <Col
                    lg={6}
                    md={6}
                    sm={6}
                    className="d-flex justify-content-end align-items-center gap-2"
                  >
                    <span className={styles["Hide_names"]}>
                      {hidemembes ? t("Show-names") : t("Hide-names")}
                    </span>
                    <img
                      draggable={false}
                      src={hidemembes ? BlueDownArrow : UpperArrow}
                      width="18.4px"
                      height="9.2px"
                      alt=""
                      className="cursor-pointer"
                      onClick={handleExpandNames}
                    />
                  </Col>
                </Row>
              </>
            )}

            {hidemembes ? null : (
              <>
                <Row className="mt-3">
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className={styles["Scroller_notify"]}
                  >
                    <Row>
                      {specificUser !== 0
                        ? notifiedMembersData
                            .filter((data) => data.userID === specificUser)
                            .map((mapData, index) => {
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
                                            draggable={false}
                                            src={`data:image/jpeg;base64,${mapData?.displayPicture.displayProfilePictureName}`}
                                            width="33px"
                                            height="33px"
                                            className={styles["ProfilePic"]}
                                            alt=""
                                          />
                                          <span
                                            className={
                                              styles["Participants_Name"]
                                            }
                                          >
                                            {mapData.userName}
                                          </span>
                                        </Col>
                                        <Col lg={2} md={2} sm={12}>
                                          <Checkbox
                                            checked={
                                              mapData.isContributorNotified
                                            }
                                            onChange={(checked) =>
                                              handleChangeBox(
                                                checked,
                                                mapData.userID
                                              )
                                            }
                                          />
                                        </Col>
                                      </Row>
                                    </Col>
                                  </Row>
                                </Col>
                              );
                            })
                        : notifiedMembersData
                            .filter((data) => data.isEdit === false)
                            .map((data) => {
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
                                            draggable={false}
                                            src={`data:image/jpeg;base64,${data?.displayPicture}`}
                                            width="33px"
                                            height="33px"
                                            className={styles["ProfilePic"]}
                                            alt=""
                                          />
                                          <span
                                            className={
                                              styles["Participants_Name"]
                                            }
                                          >
                                            {data.userName}
                                          </span>
                                        </Col>
                                        <Col lg={2} md={2} sm={12}>
                                          <Checkbox
                                            checked={data.isContributorNotified}
                                            onChange={(checked) =>
                                              handleChangeBox(
                                                checked,
                                                data.userID
                                              )
                                            }
                                          />
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
            )}
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
                  onClick={handleCancel}
                />
                <Button
                  text={t("Send")}
                  className={styles["Send_Notify"]}
                  onClick={handleSendIcon}
                />
              </Col>
            </Row>
          </>
        }
      />
    </section>
  );
};

export default NotifyAgendaModal;
