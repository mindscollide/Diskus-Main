import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, Container } from "react-bootstrap";
import { Button } from "../../../../../elements";
import "./videoPanelFooter.css";
import VideoCallWhiteIcon from "./../../../../../../assets/images/Video-White-Icon.png";
import { X } from "react-bootstrap-icons";
import { useTranslation } from "react-i18next";

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
