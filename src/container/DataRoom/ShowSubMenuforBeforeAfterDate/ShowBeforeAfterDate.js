import React from "react";
import { Col, Row } from "react-bootstrap";
import Select from "react-select";
import styles from "./ShowBeforeAfterDate.module.css";
import { useTranslation } from "react-i18next";
import line from "../../../assets/images/Path 1810.svg";
import { Button } from "../../../components/elements";

const ShowBeforeAfterDate = ({ showsubmenu, setShowsubmenu }) => {
  const { t } = useTranslation();
  return (
    <Row>
      <Col className={styles["Drop_down_Documents"]}>
        <Row className="mt-3">
          <Col lg={12} md={12} sm={12}>
            <Select placeholder={t("After")} />
          </Col>
        </Row>

        <Row className="mt-3">
          <Col lg={12} md={12} sm={12}>
            <Select placeholder={t("Before")} />
          </Col>
        </Row>

        <Row className="mt-5">
          <Col
            lg={12}
            md={12}
            sm={12}
            className="d-flex justify-content-center"
          >
            <Row>
              <Col lg={12} md={12} sm={12} className={styles["Line_down"]}>
                <img draggable="false" src={line} width="151px" alt="" />
              </Col>
            </Row>
          </Col>
        </Row>
        <Row className="mt-4">
          <Col
            lg={12}
            md={12}
            sm={12}
            className="d-flex justify-content-center gap-2"
          >
            <Button
              text={t("Cancel")}
              onClick={() => setShowsubmenu(false)}
              className={styles["cancell_button_expandDropdown"]}
            />
            <Button
              text={t("Apply")}
              className={styles["Apply_button_expandDropdown"]}
            />
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default ShowBeforeAfterDate;
