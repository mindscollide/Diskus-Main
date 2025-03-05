import { Col, Container, Row } from "react-bootstrap";
import { useErrorBoundary } from "react-error-boundary";
import { ExclamationTriangleFill } from "react-bootstrap-icons";
import CustomButton from "../button/Button";
import "./ErrorLog.css";
import { useTranslation } from "react-i18next";

export const ErrorFallback = ({ error }) => {
  const { t } = useTranslation();
  const { resetBoundary } = useErrorBoundary();
  console.log(error, "ErrorFallback");
  return (
    <section className='ErrorWrapperContainer'>
      <Row>
        <Col
          sm={12}
          lg={12}
          md={12}
          className='d-flex justify-content-center align-items-center mb-2'>
          <ExclamationTriangleFill fontSize={40} color='red' />
        </Col>
        <Col
          sm={12}
          lg={12}
          md={12}
          className='d-flex justify-content-center align-items-center mb-3 error-heading'>
          {t("Something-went-wrong")}
        </Col>

        <Col
          sm={12}
          lg={12}
          md={12}
          className='d-flex justify-content-center align-items-center '>
          <CustomButton
            className={"ErrorLogBtn"}
            onClick={resetBoundary}
            text={t("Try-again")}
          />
        </Col>
      </Row>
    </section>
  );
};

export const logErrors = (error, info) => {
  console.log("logErrors error :", error);
  console.log("logErrors error :", JSON.stringify(info));
};
