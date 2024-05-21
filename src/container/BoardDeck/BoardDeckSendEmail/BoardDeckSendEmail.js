import React, { useState } from "react";
import styles from "./BoardDeckSendEmail.module.css";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import makeAnimated from "react-select/animated";
import Select from "react-select";
import { Col, Container, Row } from "react-bootstrap";
import {
  Modal,
  TextField,
  UploadTextField,
} from "../../../components/elements";
import { boardDeckEmailModal } from "../../../store/actions/NewMeetingActions";
import crossIcon from "../../../assets/images/BlackCrossIconModals.svg";
import { validateInput } from "../../../commen/functions/regex";
const BoardDeckSendEmail = () => {
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const animatedComponents = makeAnimated();

  const { NewMeetingreducer } = useSelector((state) => state);

  const [selectedsearch, setSelectedsearch] = useState([]);
  const [notificationMessage, setNotificationMessage] = useState("");

  // for selection of data
  const handleSelectValue = (value) => {
    setSelectedsearch(value);
  };

  //Default options react select
  const options = [
    { value: "chocolate", label: "Chocolate" },
    { value: "strawberry", label: "Strawberry" },
    { value: "vanilla", label: "Vanilla" },
  ];

  //Custom Filter React select
  const customFilter = (option, searchText) => {
    if (option && option.label && searchText) {
      return option.label.toLowerCase().includes(searchText.toLowerCase());
    }
    return false;
  };

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
              <Col lg={12} md={12} sm={12}>
                <Select
                  onChange={handleSelectValue}
                  //   isDisabled={
                  //     MeetingOrganizersReducer.AllUserCommitteesGroupsData
                  //       .length === 0
                  //       ? true
                  //       : false
                  //   }
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
          </>
        }
      />
    </Container>
  );
};

export default BoardDeckSendEmail;
