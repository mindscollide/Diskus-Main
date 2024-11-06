import React from "react";
import styles from "./DeleteOrganizationAdmin.module.css";
import { Card, Col, Container, Row } from "react-bootstrap";
import FailedIcon from "../../../../../assets/images/failed.png";
import { Button, Loader } from "../../../../../components/elements";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
const DeleteOrganizationAdmin = () => {
  const { t } = useTranslation();


  const UserMangementReducerLoadingData = useSelector(
    (state) => state.UserMangementReducer.Loading
  );

  return (
    <Container>
      <Row>
        <Col sm={12} md={12} lg={12} className="mx-auto">
          <Row className="mt-3">
            <Col
              sm={12}
              md={12}
              lg={12}
              className="d-flex justify-content-center"
            >
              <span className={styles["DeleteOrganizationheading"]}>
                {t("Delete-organization")}
              </span>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col lg={12} md={12} sm={12}>
              <Card className={styles["DeleteOrganizationCardStyles"]}>
                <Row>
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    xs={12}
                    className="d-flex justify-content-center"
                  >
                    <img draggable="false" src={FailedIcon} alt="" />
                  </Col>
                </Row>
                <Row className="mt-4">
                  <Col
                    sm={12}
                    lg={12}
                    md={12}
                    xs={12}
                    className={"text-center"}
                  >
                    <span className={styles["DeleteOrgniazationMessege"]}>
                      {t("Opting-to")}{" "}
                      <span>{t("Delete-the-organization")}</span>
                      <span>
                        {" "}
                        {t(
                          "will-delete-and-remove-all-relevant-data-including-but-not"
                        )}
                      </span>
                    </span>{" "}
                    <br />
                    <span className={styles["DeleteOrgniazationMessege"]}>
                      {t(
                        "limited-to-users-meetings-documents-related-to-your-organization-account-please-make-sure-that"
                      )}
                    </span>{" "}
                    <br />
                    <span className={styles["DeleteOrgniazationMessege"]}>
                      {t(
                        "we-do-not-retain-any-backup-of-data-and-will-not-be-able-to-entertain-backup-recovery-request"
                      )}
                    </span>
                  </Col>
                </Row>
                <Row className="mt-4">
                  <Col lg={12} md={12} sm={12} xs={12} className="text-center">
                    <span className={styles["DeleteOrgniazationMessege"]}>
                      {t(
                        "It-is-requested-that-you-please-make-backup-of-all-your-data-before-proceeding-to-delete-the"
                      )}
                    </span>{" "}
                    <br />
                    <span className={styles["DeleteOrgniazationMessege"]}>
                      {t(
                        "account-please-proceed-with-caution-and-at-your-own-risk"
                      )}
                    </span>
                  </Col>
                </Row>
                <Row className="mt-5">
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    xs={12}
                    className="d-flex justify-content-center"
                  >
                    <Button
                      className={styles["deleteOrganization_btn"]}
                      text={t("Proceed-to-deletion")}
                    />
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
      {/* {UserMangementReducerLoadingData ? <Loader /> : null} */}
    </Container>
  );
};

export default DeleteOrganizationAdmin;
