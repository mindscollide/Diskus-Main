import React, { useState } from "react";
import "./chat-modal.css";
import { Modal, InputDatePicker, Button } from "./../../elements";
import { Row, Col, Container } from "react-bootstrap";
import { Checkbox } from "antd";
import {
  DateDisplayFormat,
  DateSendingFormat,
} from "../../../commen/functions/date_formater";

const ChatModal = ({ setShow, show, save, print, email }) => {
  const [todayCheckState, setTodayCheckState] = useState(false);
  const [allCheckState, setAllCheckState] = useState(false);
  const [customCheckState, setCustomCheckState] = useState(false);

  function onChangeToday(e) {
    setTodayCheckState(e.target.checked);
    setAllCheckState(false);
    setCustomCheckState(false);
  }

  function onChangeAll(e) {
    setAllCheckState(e.target.checked);
    setTodayCheckState(false);
    setCustomCheckState(false);
  }

  function onChangeCustom(e) {
    setCustomCheckState(e.target.checked);
    setTodayCheckState(false);
    setAllCheckState(false);
  }

  const handleCancel = () => {
    setShow(false);
  };

  const [endDatedisable, setEndDatedisable] = useState(true);
  const [chatDateState, setChatDateState] = useState({
    StartDate: "",
    EndDate: "",
  });

  const onChangeDate = (e) => {
    let value = e.target.value;
    let name = e.target.name;

    if (name === "StartDate" && value != "") {
      setChatDateState({
        ...chatDateState,
        [name]: DateSendingFormat(value),
      });
    }
    if (name === "EndDate" && value != "") {
      setChatDateState({
        ...chatDateState,
        [name]: DateSendingFormat(value),
      });
    }
    if (chatDateState.StartDate !== "") {
      setEndDatedisable(false);
    } else {
      setEndDatedisable(true);
    }
  };

  return (
    <>
      <Container>
        <Modal
          show={show}
          setShow={setShow}
          save={save}
          print={print}
          email={email}
          backdrop={false}
          className="chat-menu-modal"
          modalBodyClassName="chat-menu-body"
          modalFooterClassName="chat-menu-footer"
          size="sm"
          ModalBody={
            save === true ? (
              <>
                <Row>
                  <Col lg={12} md={12} sm={12}>
                    {" "}
                    <div className="chat-modal-Heading">
                      <h1>Save Messages</h1>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col lg={12} md={12} sm={12}>
                    {" "}
                    <div className="chat-options">
                      <Checkbox
                        checked={todayCheckState}
                        onChange={onChangeToday}
                      >
                        Today
                      </Checkbox>
                      <Checkbox checked={allCheckState} onChange={onChangeAll}>
                        All
                      </Checkbox>
                      <Checkbox
                        checked={customCheckState}
                        onChange={onChangeCustom}
                      >
                        Custom
                      </Checkbox>
                    </div>
                    {customCheckState === true ? (
                      <Row>
                        <Col lg={6} md={6} sm={12}>
                          <label style={{ marginLeft: "5px" }}>
                            <b style={{ fontSize: "0.7rem" }}>Date From</b>
                          </label>{" "}
                          <InputDatePicker
                            name="StartDate"
                            size="large"
                            width="100%"
                            value={
                              chatDateState.StartDate
                                ? DateDisplayFormat(chatDateState.StartDate)
                                : null
                            }
                            DateRange
                            placeholder={"Select Date"}
                            change={onChangeDate}
                          />
                        </Col>
                        <Col lg={6} md={6} sm={12}>
                          <label style={{ marginLeft: "5px" }}>
                            <b style={{ fontSize: "0.7rem" }}>Date To</b>
                          </label>
                          <InputDatePicker
                            name="EndDate"
                            size="large"
                            width="100%"
                            value={
                              chatDateState.EndDate
                                ? DateDisplayFormat(chatDateState.EndDate)
                                : null
                            }
                            DateRange
                            placeholder={"Select Date"}
                            change={onChangeDate}
                            disable={endDatedisable}
                          />
                        </Col>
                      </Row>
                    ) : null}
                  </Col>
                </Row>
                <Row>
                  <Col lg={12} md={12} sm={12} className="text-center">
                    <Button
                      className=" Ok-btn"
                      text="Okay"
                      onClick={handleCancel}
                    />
                  </Col>
                </Row>
              </>
            ) : print === true ? (
              <h1>Print Modal</h1>
            ) : email === true ? (
              <h1>Email Modal</h1>
            ) : null
          }
        />
      </Container>
    </>
  );
};

export default ChatModal;
