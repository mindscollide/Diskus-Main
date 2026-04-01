import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, Container } from "react-bootstrap";
import { Button } from "../../../../../elements";
import "./videoPanelFooter.css";
import VideoCallWhiteIcon from "./../../../../../../assets/images/Video-White-Icon.png";
import { X } from "react-bootstrap-icons";
import { useTranslation } from "react-i18next";

/**
 * @component VideoPanelFooter
 * @description Footer action bar for the Talk module's video panel contact
 * view. Renders a call-initiation button (with a video icon) on the right
 * side of the row. The button is hidden while `VideoMainReducer.Loading` is
 * `true` to prevent duplicate call requests. A "Deselect all" control
 * (currently commented out) was intended for clearing multi-user selections.
 *
 * @param {Function} groupCallClick - Handler invoked when the call button is
 *   clicked to initiate a group or direct video call.
 * @param {string} groupbtnClassName - CSS class name applied to the call
 *   button for styling.
 * @param {string} buttonText - Label text rendered inside the call button.
 * @param {Function} deselectAllUsers - Handler to clear all selected
 *   participants (currently unused/commented out in the UI).
 * @param {Array} groupCallUsers - Array of currently selected users, used to
 *   conditionally show the deselect control (currently commented out).
 */
const VideoPanelFooter = ({
  groupCallClick,
  groupbtnClassName,
  buttonText,
  deselectAllUsers,
  groupCallUsers,
}) => {
  const dispatch = useDispatch();

  const { videoFeatureReducer, VideoMainReducer } = useSelector(
    (state) => state
  );

  const { t } = useTranslation();

  return (
    <>
      <Container>
        <Row>
          <Col lg={5} md={5} sm={12}>
            {/* {VideoMainReducer.Loading === false ? (
              <div className="deselect-all" onClick={deselectAllUsers}>
                {groupCallUsers.length > 0 ? (
                  <p>
                    {t("Deselect-all")}
                    <X />
                  </p>
                ) : null}
              </div>
            ) : null} */}
          </Col>
          <Col lg={7} md={7} sm={12} className="text-end">
            {VideoMainReducer.Loading === false ? (
              <div className="group-call">
                <Button
                  text={buttonText}
                  className={groupbtnClassName}
                  onClick={groupCallClick}
                  icon2={<img src={VideoCallWhiteIcon} />}
                />
              </div>
            ) : null}
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default VideoPanelFooter;
