import React, { useState, useEffect } from "react";
import "./chat-modal.css";
import { Modal, InputDatePicker, Button } from "./../../elements";
import { Row, Col, Container } from "react-bootstrap";
import { Checkbox } from "antd";

const ChatModal = ({ setShow, show, save, print, email }) => {
  const [todayCheckState, setTodayCheckState] = useState(false);
  const [allCheckState, setAllCheckState] = useState(false);
  const [customCheckState, setCustomCheckState] = useState(false);

  function onChangeToday(e) {
    setTodayCheckState(e.target.checked);
    setAllCheckState(false);
    setCustomCheckState(false);
    console.log(
      "checkState today",
      todayCheckState,
      allCheckState,
      customCheckState
    );
  }

  function onChangeAll(e) {
    setAllCheckState(e.target.checked);
    setTodayCheckState(false);
    setCustomCheckState(false);
    console.log(
      "checkState all",
      todayCheckState,
      allCheckState,
      customCheckState
    );
  }

  function onChangeCustom(e) {
    setCustomCheckState(e.target.checked);
    setTodayCheckState(false);
    setAllCheckState(false);
    console.log(
      "checkState custom",
      todayCheckState,
      allCheckState,
      customCheckState
    );
  }

  const handleCancel = () => {
    setShow(false);
  };

  const onChangeDate = (e) => {
    console.log(e.target.value);
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
                    {customCheckState === true ? <p>Aur bhye</p> : null}
                  </Col>
                </Row>
                <Row>
                  <Col lg={12} md={12} sm={12} className="text-center">
                    <Button
                      className="MontserratSemiBold Ok-btn"
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
