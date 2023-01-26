import React, { useState, useEffect } from "react";
import "./chat-modal.css";
import { Modal, InputDatePicker } from "./../../elements";
import { Row, Col, Container } from "react-bootstrap";
import { Radio } from "antd";

const ChatModal = ({ setShow, show, save, print, email }) => {
  //On Change Checkbox
  function onChange(e) {
    console.log("hello");
  }

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
                      <Radio.Group
                        name="Android_ISO"
                        // value={ADCDisputes.Android_ISO}
                        onChange={onChange}
                      >
                        <Radio value={1}>Today</Radio>
                        <Radio value={2}>All</Radio>
                        <Radio value={3}>Custom</Radio>
                      </Radio.Group>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col lg={6} md={6} sm={12}>
                    {" "}
                    <InputDatePicker
                      name="TransactionDate"
                      size="large"
                      width="100%"
                      DateRange
                      placeholder={"Transaction Date *"}
                      change={onChangeDate}
                    />{" "}
                  </Col>
                  <Col lg={6} md={6} sm={12}>
                    {" "}
                    <InputDatePicker
                      name="TransactionDate"
                      size="large"
                      width="100%"
                      DateRange
                      placeholder={"Transaction Date *"}
                      change={onChangeDate}
                    />{" "}
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
