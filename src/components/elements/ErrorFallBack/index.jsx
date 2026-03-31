import { Col, Container, Row } from "react-bootstrap";
import { useErrorBoundary } from "react-error-boundary";
import { ExclamationTriangleFill } from "react-bootstrap-icons";
import CustomButton from "../button/Button";
import "./ErrorLog.css";
import { useTranslation } from "react-i18next";

/**
 * @component ErrorFallback
 * @description The UI rendered by a `react-error-boundary` `<ErrorBoundary>`
 * when a descendant component throws an uncaught error during rendering.
 * Displays a red exclamation-triangle icon, a translated "Something went wrong"
 * heading, and a "Try again" button that calls `resetBoundary()` to clear the
 * error state and re-render the failing subtree.
 *
 * This component must be passed to `<ErrorBoundary fallbackComponent={ErrorFallback}>`.
 * It consumes the `useErrorBoundary` hook from `react-error-boundary` to gain
 * access to the `resetBoundary` function.
 *
 * @param {Error} error - The Error object thrown by the failed child component,
 *                        logged to the console for debugging purposes.
 *
 * @example
 * import { ErrorBoundary } from "react-error-boundary";
 * import { ErrorFallback, logErrors } from "./ErrorFallBack";
 *
 * <ErrorBoundary FallbackComponent={ErrorFallback} onError={logErrors}>
 *   <SomeFeatureComponent />
 * </ErrorBoundary>
 */
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

/**
 * Error logging callback intended for use with the `onError` prop of
 * `<ErrorBoundary>`. Logs both the raw Error object and the component stack
 * info to the console. Replace or extend with a remote logging service
 * (e.g. Sentry, Datadog) for production error tracking.
 *
 * @param {Error}  error - The Error object thrown by the failing component.
 * @param {object} info  - React error info object containing `componentStack`.
 */
export const logErrors = (error, info) => {
  console.log("logErrors error :", error);
  console.log("logErrors error :", JSON.stringify(info));
};
