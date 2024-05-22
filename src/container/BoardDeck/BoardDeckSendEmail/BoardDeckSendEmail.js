import React, { useState } from "react";
import styles from "./BoardDeckSendEmail.module.css";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import makeAnimated from "react-select/animated";
import Select from "react-select";
import CrossEmail from "./../../pages/meeting/viewMeetings/AgendaViewer/AV-Images/Cross-Email.png";
import { Col, Container, Row } from "react-bootstrap";
import { Button, Modal, TextField } from "../../../components/elements";
import { boardDeckEmailModal } from "../../../store/actions/NewMeetingActions";
import crossIcon from "../../../assets/images/BlackCrossIconModals.svg";
import { validateInput } from "../../../commen/functions/regex";
import blueCrossIcon from "../../../assets/images/BlueCross.png";
import { Checkbox } from "antd";
const BoardDeckSendEmail = () => {
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const animatedComponents = makeAnimated();

  const { NewMeetingreducer } = useSelector((state) => state);

  const [selectedsearch, setSelectedsearch] = useState([]);
  const [tags, setTags] = useState([]);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notifyPeople, setNotifyPeople] = useState({
    notifyPeople: false,
  });

  // for selection of data
  const handleSelectValue = (value) => {
    console.log(value, "handleSelectValue");
    setSelectedsearch(value);
  };

  console.log(tags, "tagstags");

  //Default options react select
  const options = [
    { value: "chocolate", label: "Chocolate" },
    { value: "strawberry", label: "Strawberry" },
    { value: "vanilla", label: "Vanilla" },
  ];

  //handle Change For TextArea
  const HandleChange = (e, index) => {
    let name = e.target.name;
    let value = e.target.value;
    if (name === "Message") {
      let valueCheck = validateInput(value);
      if (valueCheck !== "") {
        setNotificationMessage(valueCheck);
      } else {
        setNotificationMessage("");
      }
    }
  };

  const onChangenotifyPeople = (e) => {
    let value = e.target.checked;
    setNotifyPeople({
      ...notifyPeople,
      notifyPeople: value,
    });
  };

  const customFilter = (option, searchText) => {
    if (searchText) {
      return option.label.toLowerCase().includes(searchText.toLowerCase());
    }
    return true;
  };

  const handleAddTag = () => {
    if (selectedsearch && selectedsearch.length > 0) {
      setTags((prevTags) => [...prevTags, ...selectedsearch]);
      setSelectedsearch([]);
    }
  };

  const removeTag = (indexToRemove) => {
    setTags((prevTags) =>
      prevTags.filter((_, index) => index !== indexToRemove)
    );
  };

  return (
    <Container>
      <Modal
        show={NewMeetingreducer.boardDeckEmailModal}
        setShow={dispatch(boardDeckEmailModal)}
        modalFooterClassName={"d-block"}
        modalHeaderClassName={"d-block"}
        onHide={() => {
          dispatch(boardDeckEmailModal(false));
        }}
        size={"md"}
        ModalTitle={
          <>
            <Row>
              <Col lg={12} md={12} sm={12} className="position-relative">
                <p className={styles["FileModalTitle"]}>{t("Board-deck-IT")}</p>
                <img className={styles["image-close"]} src={crossIcon} alt="" />
              </Col>
            </Row>
          </>
        }
        ModalBody={
          <>
            <Row>
              <Col lg={10} md={10} sm={10}>
                <Select
                  onChange={handleSelectValue}
                  value={selectedsearch}
                  classNamePrefix={"selectMemberAgendaView"}
                  closeMenuOnSelect={false}
                  components={animatedComponents}
                  isMulti
                  options={options}
                  isSearchable={true}
                  filterOption={customFilter}
                />
              </Col>
              <Col
                lg={2}
                md={2}
                sm={2}
                className="d-flex justify-content-center align-items-center"
              >
                <Button
                  text={t("Add")}
                  className={styles["AddButton"]}
                  onClick={handleAddTag}
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <div
                  className={
                    tags.length <= 4
                      ? styles["tags-input-container"]
                      : styles["tags-input-containerr"]
                  }
                >
                  {tags.map((tag, index) => (
                    <div className={styles["tag-item"]} key={index}>
                      <span className={styles["text"]}>{tag.label}</span>
                      <span
                        className={styles["close"]}
                        onClick={() => removeTag(index)}
                      >
                        <img src={blueCrossIcon} alt="Remove" />
                      </span>
                    </div>
                  ))}
                </div>
              </Col>
            </Row>
            <Row className="m-0">
              <Col className="p-0">
                <p className={`${styles["NonOrganizationUsers"]} m-0`}>
                  {t("Message-optional")}
                </p>
              </Col>
            </Row>
            <Row>
              <Col
                lg={12}
                md={12}
                sm={12}
                className={styles["text-area-organizer"]}
              >
                <TextField
                  applyClass="text-area-create-Notify-organizors"
                  type="text"
                  as={"textarea"}
                  rows="4"
                  placeholder={t("Message")}
                  change={HandleChange}
                  value={notificationMessage}
                  required={true}
                  name="Message"
                  maxLength={500}
                />
              </Col>
            </Row>
            <Row className="mt-3">
              <Col lg={12} md={12} sm={12}>
                <Checkbox
                  onChange={onChangenotifyPeople}
                  checked={notifyPeople.notifyPeople}
                >
                  <span className={styles["Class_CheckBox_notify_people"]}>
                    {t("Notify-people")}
                  </span>
                </Checkbox>
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
                className="d-flex justify-content-end"
              >
                <Button text={t("Send")} className={styles["SendButton"]} />
              </Col>
            </Row>
          </>
        }
      />
    </Container>
  );
};

export default BoardDeckSendEmail;
