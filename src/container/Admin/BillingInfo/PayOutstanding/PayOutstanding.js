import React, { Fragment, useState } from "react";
import { Container, Col, Row } from "react-bootstrap";
import { File, FilePdf, FilePdfFill } from "react-bootstrap-icons";
import { Button } from "../../../../components/elements";
import SelectedPackageCard from "../../../../components/elements/selectedpackagecard/SelectedPackageCard";
import "./../../../../i18n";
import PDFIcon from '../../../../assets/images/newElements/pdf.png'
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
      <Row className="my-3 m-0">
        <Col sm={12} md={4} lg={4} className="mx-auto">
          <Row>
            <Col sm={12} md={12} lg={12} className={styles["PayOutstanding_Heading"]}>
              Pay Outstanding
            </Col>
          </Row>
          <SelectedPackageCard
            PackageHeading={t("Outstanding-Invoice-Details")}
            PackageHeadingClass={styles["PackageHeadingClassName"]}
            RowsData={
              <>
                <Row className={styles["selected_package_details"]}>
                  <Col sm={5}>
                    <p className={styles["selected_package_details_p1"]}>{t("Invoice-#")}</p>
                  </Col>
                  <Col sm={7}>
                    <p className={styles["selected_package_details_p2"]}>{payOutStanding.Invoice}</p>
                  </Col>
                </Row>
                <Row className={styles["selected_package_details"]}>
                  <Col sm={5}>
                    <p className={styles["selected_package_details_p1"]}>{t("Due-Date")}</p>
                  </Col>
                  <Col sm={7}>
                    <p className={styles["selected_package_details_p2"]}>{payOutStanding.DueDate}</p>
                  </Col>
                </Row>
                <Row className={styles["selected_package_details"]}>
                  <Col sm={5}>
                    <p className={styles["selected_package_details_p1"]}>{t("Invoice-Amount")}</p>
                  </Col>
                  <Col sm={7}>
                    <p className={styles["selected_package_details_p2"]}>{payOutStanding.InvoiceAmount}</p>
                  </Col>
                </Row>
                <Row className={styles["selected_package_details"]}>
                  <Col sm={5}>
                    <p className={styles["selected_package_details_p1"]}>{t("Late-Charges")}</p>
                  </Col>
                  <Col sm={7}>
                    <p className={styles["selected_package_details_p2"]}>{payOutStanding.LateCharges}</p>
                  </Col>
                </Row>
                <Row className={styles["selected_package_details"]}>
                  <Col sm={5}>
                    <p className={styles["selected_package_details_p1"]}>{t("Balance-Due")}</p>
                  </Col>
                  <Col sm={7}>
                    <p className={styles["selected_package_details_p2"]}>{payOutStanding.BalanceDue}</p>
                  </Col>
                </Row>
              </>
            }
          />
          <Row>
            <Col sm={12} md={12} lg={12} className="mt-5 p-0">
              <Button
                text={t("Pay-Invoice-Now")}
                className={styles["PayInvoiceButton"]}
              />
            </Col>
          </Row>
          

          <Row className="p-0 my-3">
            <Col sm={12} md={6} lg={6} className="mt-2 ps-0">
              <Button
                text={t("View-Invoice-Detail")}
                pdfIcon={PDFIcon}
                className={styles["viewInvocieButton"]}
                pdfIconClass={styles["pdfIconstyle"]}
              />
            </Col>
            <Col sm={12} md={6} lg={6} className="mt-2 pe-0">
              <Button
              pdfIconClass={styles["pdfIconstyle"]}
                text={t("Download-Invoice")}
                pdfIcon={PDFIcon}
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
