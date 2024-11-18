import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import RemoveImage from "../../../../../assets/images/Recent Activity Icons/Video/RemoveImage.png";
import { guestVideoNavigationScreen } from "../../../../../store/actions/Guest_Video";
import { Button } from "../../../../elements";
import "./GuestRemoveByHost.css";

const GuestRemoveByHost = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const navigateToJoinScreen = () => {
    // sessionStorage.setItem("isRejoining", "true");
    // sessionStorage.setItem("guestName", joinName || "");

    dispatch(guestVideoNavigationScreen(1));
  };

  return (
    <>
      <Container fluid>
        <Row>
          <Col lg={1} md={1} sm={12} />
          <Col lg={10} md={10} sm={12}>
            <>
              <div className="Guest-Removed-Video">
                <Container>
                  <Row>
                    <Col
                      lg={12}
                      md={12}
                      sm={12}
                      className="d-flex justify-content-center"
                    >
                      <img src={RemoveImage} />
                    </Col>
                  </Row>

                  <Row>
                    <Col
                      lg={12}
                      md={12}
                      sm={12}
                      className="d-flex justify-content-center"
                    >
                      <p className="Removed-Main-Heading">
                        {t("You’ve-been-removed")}
                      </p>
                    </Col>
                  </Row>

                  <Row>
                    <Col lg={1} md={1} sm={12} />
                    <Col
                      lg={9}
                      md={9}
                      sm={12}
                      className="d-flex justify-content-center"
                    >
                      <p className="Sub-Removed-Main-Heading">
                        {t(
                          "The-organizer-has-removed-you-from-the-meeting-click-here-to-request-permission-to-rejoin"
                        )}
                      </p>
                    </Col>
                    <Col lg={1} md={1} sm={12} />
                  </Row>
                  <Row>
                    <Col className="d-flex justify-content-center">
                      <Button
                        text={t("Request-to-rejoin")}
                        onClick={navigateToJoinScreen}
                        className="Rejoin-Button-Class"
                      />
                    </Col>
                  </Row>
                </Container>
              </div>
            </>
          </Col>
          <Col lg={1} md={1} sm={12} />
        </Row>
      </Container>
    </>
  );
};

export default GuestRemoveByHost;
