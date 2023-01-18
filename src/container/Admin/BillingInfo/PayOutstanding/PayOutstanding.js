import React, { Fragment, useState } from "react";
import { Container, Col, Row } from "react-bootstrap";
import { File, FilePdf, FilePdfFill } from "react-bootstrap-icons";
import { Button } from "../../../../components/elements";
import SelectedPackageCard from "../../../../components/elements/selectedpackagecard/SelectedPackageCard";
import "./../../../../i18n";
import { useTranslation } from "react-i18next";
import styles from "./PayOutstanding.module.css";
const PayOutstanding = () => {
  // for translation
  const { t } = useTranslation();

  const [payOutStanding, setPayOutStanding] = useState({
    Invoice: "1965423",
    DueDate: "12-05-23",
    InvoiceAmount: t("50") + "$",
    LateCharges: "10$",
    BalanceDue: "60$",
  });
  return (
    <Fragment>
      <Row className="my-5 m-0">
        <Col sm={12} md={4} lg={4} className="mx-auto">
          <SelectedPackageCard
            PackageHeading={t("Outstanding-Invoice-Details")}
            RowsData={
              <>
                <Row className={styles["selected_package_details"]}>
                  <Col sm={4}>
                    <p className="fw-bold">{t("Invoice-#")}</p>
                  </Col>
                  <Col sm={8}>
                    <p>{payOutStanding.Invoice}</p>
                  </Col>
                </Row>
                <Row className={styles["selected_package_details"]}>
                  <Col sm={4}>
                    <p className="fw-bold">{t("Due-Date")}</p>
                  </Col>
                  <Col sm={8}>
                    <p>{payOutStanding.DueDate}</p>
                  </Col>
                </Row>
                <Row className={styles["selected_package_details"]}>
                  <Col sm={4}>
                    <p className="fw-bold">{t("Invoice-Amount")}</p>
                  </Col>
                  <Col sm={8}>
                    <p>{payOutStanding.InvoiceAmount}</p>
                  </Col>
                </Row>
                <Row className={styles["selected_package_details"]}>
                  <Col sm={4}>
                    <p className="fw-bold">{t("Late-Charges")}</p>
                  </Col>
                  <Col sm={8}>
                    <p>{payOutStanding.LateCharges}</p>
                  </Col>
                </Row>
                <Row className={styles["selected_package_details"]}>
                  <Col sm={4}>
                    <p className="fw-bold">{t("Balance-Due")}</p>
                  </Col>
                  <Col sm={8}>
                    <p>{payOutStanding.BalanceDue}</p>
                  </Col>
                </Row>
              </>
            }
          />
          <Col sm={12} md={12} lg={12} className="mt-5 p-0">
            <Button
              text={t("Pay-Invoice-Now")}
              className={styles["PayInvoiceButton"]}
            />
          </Col>

          <Row className="my-4">
            <Col sm={12} md={6} lg={6} className="mt-2">
              <Button
                text={t("View-Invoice-Detail")}
                icon2={<FilePdfFill className="mx-2" />}
                className={styles["viewInvocieButton"]}
              />
            </Col>
            <Col sm={12} md={6} lg={6} className="mt-2">
              <Button
                text={t("Download-Invoice")}
                icon2={<FilePdfFill className="mx-2" />}
                className={styles["DownloadInvoiceButton"]}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    </Fragment>
  );
};

export default PayOutstanding;
