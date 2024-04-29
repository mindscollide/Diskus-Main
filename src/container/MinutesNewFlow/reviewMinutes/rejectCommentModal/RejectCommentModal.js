import React, { useState } from "react";
import {
  Modal,
  Button,
  TextArea,
  SelectComment,
} from "../../../../components/elements";
import styles from "./RejectCommentModal.module.css";
import { rejectCommentModal } from "../../../../store/actions/Minutes_action";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Col, Row } from "react-bootstrap";
import CrossIcon from "./../../Images/Cross_Icon.png";

const RejectCommentModal = () => {
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const [commentText, setCommentText] = useState("");

  const handleCommentSelect = (selectedText) => {
    setCommentText((prevText) => prevText + selectedText + " ");
  };

  return (
    <section>
      <Modal
        show={true}
        setShow={dispatch(rejectCommentModal)}
        modalFooterClassName={"d-block"}
        modalHeaderClassName={"d-block"}
        className="SelectAgendaModal"
        onHide={() => {
          dispatch(rejectCommentModal(false));
        }}
        size={"md"}
        ModalTitle={
          <>
            <Row>
              <Col lg={12} md={12} sm={12} className="position-relative">
                <p className={styles["RejectCommentTitle"]}>
                  {t("Leave-a-comment")}
                </p>
                <img
                  onClick={() => dispatch(rejectCommentModal(false))}
                  className={styles["image-close"]}
                  src={CrossIcon}
                  alt=""
                />
              </Col>
            </Row>
          </>
        }
        ModalBody={
          <>
            <TextArea
              name="textField-RejectComment"
              className={styles["textField-RejectComment"]}
              type="text"
              placeholder={t("Write-a-reason")}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)} // Update text area value if typed directly
              labelClassName={"d-none"}
              timeClass={"d-none"}
            />
            <SelectComment
              text="Incomplete information"
              onClick={() => handleCommentSelect("Incomplete information")}
            />
            <SelectComment
              text="Requires further details"
              onClick={() => handleCommentSelect("Requires further details")}
            />
            <SelectComment
              text="Lack of clarity"
              onClick={() => handleCommentSelect("Lack of clarity")}
            />
            <SelectComment
              text="Please provide all required details"
              onClick={() =>
                handleCommentSelect("Please provide all required details")
              }
            />
          </>
        }
        ModalFooter={
          <>
            <Row className="mt-4">
              <Col
                lg={12}
                md={12}
                sm={12}
                className="d-flex justify-content-end gap-2"
              >
                <Button
                  onClick={() => dispatch(rejectCommentModal(false))}
                  text={t("Reject")}
                  className={styles["Reject_Comment_Modal"]}
                />
              </Col>
            </Row>
          </>
        }
      />
    </section>
  );
};

export default RejectCommentModal;
