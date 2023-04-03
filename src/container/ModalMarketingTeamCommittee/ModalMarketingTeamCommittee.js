import React, { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import styles from "./ModalMarketingTeamCommittee.module.css";

import { Button, InputSearchFilter, Modal } from "../../components/elements";
import { style } from "@mui/system";
const ModalMarketingTeamCommittee = ({
  ModalTitle,
  MarketingTeam,
  setMarketingTeam,
}) => {
  const closebtn = async () => {
    setMarketingTeam(false);
  };
  return (
    <>
      <Container>
        <Modal
          show={MarketingTeam}
          onHide={() => {
            setMarketingTeam(false);
          }}
          setShow={setMarketingTeam}
          ButtonTitle={ModalTitle}
          modalFooterClassName="d-block"
          centered
          size={MarketingTeam === true ? "md" : "md"}
          ModalBody={
            <>
              <Container>
                <Row>
                  <Col lg={12} md={12} sm={12} className="d-flex text-center ">
                    <span className={styles["Marketing-Modal-Heading"]}>
                      Marketing Team Committee
                    </span>
                  </Col>
                </Row>

                <Row className="mt-4">
                  <Col lg={12} md={12} sm={12}>
                    <Row>
                      <Col
                        lg={8}
                        md={8}
                        sm={12}
                        className="d-flex justify-content-start"
                      >
                        <InputSearchFilter labelClass="d-none" />
                      </Col>
                      <Col lg={4} md={4} sm={12}>
                        <Button
                          className={styles["ADD-MarketingModal-btn"]}
                          text=" ADD"
                        />
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Container>
            </>
          }
          ModalFooter={
            <>
              <Row className="mt-5">
                <Col
                  lg={12}
                  sm={12}
                  md={12}
                  className="d-flex justify-content-end"
                >
                  <Button
                    text="Close"
                    className={styles["Confirm-activegroup-modal"]}
                    onClick={closebtn}
                  />
                </Col>
              </Row>
            </>
          }
        />
      </Container>
    </>
  );
};

export default ModalMarketingTeamCommittee;
