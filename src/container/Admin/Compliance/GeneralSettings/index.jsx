import React, { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import styles from "./generalSetting.module.css";
import { useTranslation } from "react-i18next";
import { Button } from "../../../../components/elements";
// import ResolutionIcon from "../../../../assets/images/new_ResolutionIcon2.svg";
import exclamationIcon from "../../../../assets/images/Vector.png";
import calenderIcon from "../../../../assets/images/Group 1258.png";
import workingDaysIcon from "../../../../assets/images/Vector Suitcase.png";

import FiscalYear from "./FiscalYear";
import WorkingDays from "./WorkingDays";
import DueDateAlert from "./DueDateAlert";
import line from "../../../../assets/images/Line 27.svg";

const GeneralSetting = () => {
  const { t } = useTranslation();
  const [viewState, setViewState] = useState(1);
  return (
    <>
      <Container>
        <Row className="mt-3">
          <Col lg={6} md={6} sm={12} xs={12}>
            <div className="d-flex gap-3 align-items-center w-100 justify-content-start">
              <label className={styles["General_Setting-Main-Heading"]}>
                {t("General-setting")}
              </label>
            </div>
          </Col>
        </Row>
        <Row className="mt-3">
          <Col lg={12} md={12} sm={12}>
            <Row>
              <Col lg={3} md={3} sm={3}>
                <>
                  <div
                    onClick={() => setViewState(1)}
                    className="cursor-pointer my-3 gap-4 d-flex align-items-center"
                  >
                    <img
                      draggable="false"
                      src={calenderIcon}
                      alt=""
                      width="28.46px"
                      height="28.47px"
                    />

                    <span
                      className={
                        viewState === 1
                          ? styles["Options_headings_active"]
                          : styles["Options_headings"]
                      }
                    >
                      {t("Fiscal-year")}
                    </span>
                  </div>
                  <hr />
                </>

                {/* Due Date Alert */}
                <Col>
                  <div
                    onClick={() => setViewState(2)}
                    className="cursor-pointer mb-3 gap-4 d-flex align-items-center"
                  >
                    <img
                      draggable="false"
                      src={exclamationIcon}
                      alt=""
                      width="25px"
                      height="25px"
                    />

                    <span
                      className={
                        viewState === 2
                          ? styles["Options_headings_active"]
                          : styles["Options_headings"]
                      }
                    >
                      {t("Due-date-alert")}
                    </span>
                  </div>
                  <hr />
                </Col>

                {/* Working Days */}
                <Col>
                  <div
                    onClick={() => setViewState(3)}
                    className="cursor-pointer gap-4 d-flex align-items-center"
                  >
                    <img
                      draggable="false"
                      src={workingDaysIcon}
                      alt=""
                      width="25px"
                      height="22.5px"
                    />
                    <span
                      className={
                        viewState === 3
                          ? styles["Options_headings_active"]
                          : styles["Options_headings"]
                      }
                    >
                      {t("Working-days")}
                    </span>
                  </div>
                  <hr />
                </Col>
              </Col>
              <Col
                lg={1}
                md={1}
                sm={1}
                className="d-flex justify-content-center"
              >
                <img
                  draggable="false"
                  alt=""
                  src={line}
                  className={styles["general-setting-row"]}
                />
              </Col>
              <Col sm={12} md={8} lg={8}>
                {viewState === 1 && <FiscalYear />}
                {viewState === 2 && <DueDateAlert />}
                {viewState === 3 && <WorkingDays />}
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col lg={12} md={12} sm={12} className="d-flex justify-content-end">
            <Button
              text={t("Update")}
              className={styles["New_settings_Update_Button"]}
              // onClick={updateOrganizationLevelSettings}
            />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default GeneralSetting;
