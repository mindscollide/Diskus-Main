import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import RemoveImage from "../../../../../assets/images/Recent Activity Icons/Video/RemoveImage.png";
import { guestVideoNavigationScreen } from "../../../../../store/actions/Guest_Video";
import { Button } from "../../../../elements";
import "./GuestRemoveByHost.css";

/**
 * @component GuestRemoveByHost
 * @description Informational screen shown to a guest participant after the
 * meeting host has forcibly removed them from the active video call. Displays
 * a removal illustration and an explanatory message, and provides a
 * "Request to rejoin" button that navigates the guest back to the join lobby
 * (navigation screen 1) via the `guestVideoNavigationScreen` Redux action.
 */
const GuestRemoveByHost = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // Set by the GUEST_REMOVED_FROM_PRESENTATION handler so this screen uses the presentation text
  const removedFromPresentation =
    sessionStorage.getItem("removedFromPresentation") === "true";

  const navigateToJoinScreen = () => {
    // sessionStorage.setItem("isRejoining", "true");
    // sessionStorage.setItem("guestName", joinName || "");

    sessionStorage.removeItem("removedFromPresentation");
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
                        {removedFromPresentation
                          ? t("Guest-removed-from-presentation")
                          : t("You’ve-been-removed")}
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
                        {removedFromPresentation
                          ? t("Guest-removed-from-presentation-message")
                          : t(
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
