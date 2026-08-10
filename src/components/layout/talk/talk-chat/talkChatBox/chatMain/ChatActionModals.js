import React from "react";
import { useTranslation } from "react-i18next";
import { Row, Col } from "react-bootstrap";
import { Checkbox } from "antd";
import enUS from "antd/es/date-picker/locale/en_US";
import { Button, InputDatePicker } from "../../../../../elements";
import {
  DateDisplayFormat,
} from "../../../../../../commen/functions/date_formater";
import CrossIcon from "../../../../../../assets/images/Cross_Icon.png";

/**
 * Unifies the Save / Print / Email / Delete-single / Leave-group popups that
 * used to be 5 separate near-identical inline JSX blocks in chatMain.js.
 * `kind` selects which one renders. Save/Print/Email are kept as distinct
 * render branches (rather than one fully-parameterized template) because
 * their labels had already drifted from each other in the original code
 * (some translated via t(), some literal strings; slightly different column
 * widths; Save's date pickers passed a `locale` prop the others didn't) —
 * preserved exactly as-is here rather than silently "fixed" during this
 * extraction.
 */
const ChatActionModals = ({
  kind,
  todayCheckState,
  allCheckState,
  customCheckState,
  onCheckToday,
  onCheckAll,
  onCheckCustom,
  chatDateState,
  endDatedisable,
  onDateChange,
  onConfirm,
  onCancel,
}) => {
  const { t } = useTranslation();

  if (kind === "save") {
    return (
      <div className="chat-menu-popups">
        <Row className="mt-3">
          <Col className="d-flex justify-content-end crossIcon-class">
            <img src={CrossIcon} width={10} height={10} onClick={onCancel} />
          </Col>
        </Row>
        <Row>
          <Col lg={12} md={12} sm={12}>
            {" "}
            <div className="chat-modal-Heading">
              <h1>{t("Save-Messages")}</h1>
            </div>
          </Col>
        </Row>
        <Row>
          <Col lg={12} md={12} sm={12}>
            <div className="chat-options">
              <Checkbox checked={todayCheckState} onChange={onCheckToday}>
                {t("Today")}
              </Checkbox>
              <Checkbox checked={allCheckState} onChange={onCheckAll}>
                {t("All")}
              </Checkbox>
              <Checkbox checked={customCheckState} onChange={onCheckCustom}>
                {t("Custom")}
              </Checkbox>
            </div>
            {customCheckState === true ? (
              <Row>
                <Col lg={1} md={1} sm={12}></Col>
                <Col lg={5} md={5} sm={12}>
                  <label style={{ marginLeft: "5px" }}>
                    <b style={{ fontSize: "0.7rem" }}>{t("Date-from")}</b>
                  </label>{" "}
                  <InputDatePicker
                    name="StartDate"
                    size="large"
                    width="100%"
                    value={
                      chatDateState.StartDate
                        ? DateDisplayFormat(chatDateState.StartDate)
                        : null
                    }
                    DateRange
                    placeholder={t("Select-date")}
                    change={onDateChange}
                    locale={enUS}
                  />
                </Col>
                <Col lg={5} md={5} sm={12}>
                  <label style={{ marginLeft: "5px" }}>
                    <b style={{ fontSize: "0.7rem" }}>{t("Date-to")}</b>
                  </label>
                  <InputDatePicker
                    name="EndDate"
                    size="large"
                    width="100%"
                    value={
                      chatDateState.EndDate
                        ? DateDisplayFormat(chatDateState.EndDate)
                        : null
                    }
                    DateRange
                    placeholder={t("Select Date")}
                    change={onDateChange}
                    disable={endDatedisable}
                    locale={enUS}
                  />
                </Col>
                <Col lg={1} md={1} sm={12}></Col>
              </Row>
            ) : null}
          </Col>
        </Row>
        <Row>
          <Col lg={12} md={12} sm={12} className="d-flex justify-content-center gap-2">
            <Button className="Ok-btn" text={t("Okay")} onClick={onConfirm} />
          </Col>
        </Row>
      </div>
    );
  }

  if (kind === "print") {
    return (
      <div className="chat-menu-popups">
        <Row className="mt-3">
          <Col className="d-flex justify-content-end crossIcon-class">
            <img src={CrossIcon} width={10} height={10} onClick={onCancel} />
          </Col>
        </Row>
        <Row>
          <Col lg={12} md={12} sm={12}>
            {" "}
            <div className="chat-modal-Heading">
              <h1>{t("Print-Messages")}</h1>
            </div>
          </Col>
        </Row>
        <Row>
          <Col lg={12} md={12} sm={12}>
            {" "}
            <div className="chat-options">
              <Checkbox checked={todayCheckState} onChange={onCheckToday}>
                {t("Today")}
              </Checkbox>
              <Checkbox checked={allCheckState} onChange={onCheckAll}>
                {t("All")}
              </Checkbox>
              <Checkbox checked={customCheckState} onChange={onCheckCustom}>
                {t("Custom")}
              </Checkbox>
            </div>
            {customCheckState === true ? (
              <Row>
                <Col lg={6} md={6} sm={12}>
                  <label style={{ marginLeft: "5px" }}>
                    <b style={{ fontSize: "0.7rem" }}>{t("Date-From")}</b>
                  </label>{" "}
                  <InputDatePicker
                    name="StartDate"
                    size="large"
                    width="100%"
                    value={
                      chatDateState.StartDate
                        ? DateDisplayFormat(chatDateState.StartDate)
                        : null
                    }
                    DateRange
                    placeholder={t("Select-Date")}
                    change={onDateChange}
                  />
                </Col>
                <Col lg={6} md={6} sm={12}>
                  <label style={{ marginLeft: "5px" }}>
                    <b style={{ fontSize: "0.7rem" }}>{t("Date-to")}</b>
                  </label>
                  <InputDatePicker
                    name="EndDate"
                    size="large"
                    width="100%"
                    value={
                      chatDateState.EndDate
                        ? DateDisplayFormat(chatDateState.EndDate)
                        : null
                    }
                    DateRange
                    placeholder={t("Select-Date")}
                    change={onDateChange}
                    disable={endDatedisable}
                  />
                </Col>
              </Row>
            ) : null}
          </Col>
        </Row>
        <Row>
          <Col lg={12} md={12} sm={12} className="d-flex justify-content-center gap-2">
            <Button className=" Ok-btn" text={t("Okay")} onClick={onConfirm} />
          </Col>
        </Row>
      </div>
    );
  }

  if (kind === "email") {
    return (
      <div className="chat-menu-popups">
        <Row className="mt-3">
          <Col className="d-flex justify-content-end crossIcon-class">
            <img src={CrossIcon} width={10} height={10} onClick={onCancel} />
          </Col>
        </Row>
        <Row>
          <Col lg={12} md={12} sm={12}>
            {" "}
            <div className="chat-modal-Heading">
              <h1>{t("Email-Messages")}</h1>
            </div>
          </Col>
        </Row>
        <Row>
          <Col lg={12} md={12} sm={12}>
            {" "}
            <div className="chat-options">
              <Checkbox checked={todayCheckState} onChange={onCheckToday}>
                {t("Today")}
              </Checkbox>
              <Checkbox checked={allCheckState} onChange={onCheckAll}>
                {t("All")}
              </Checkbox>
              <Checkbox checked={customCheckState} onChange={onCheckCustom}>
                Custom
              </Checkbox>
            </div>
            {customCheckState === true ? (
              <Row>
                <Col lg={6} md={6} sm={12}>
                  <label style={{ marginLeft: "5px" }}>
                    <b style={{ fontSize: "0.7rem" }}>Date From</b>
                  </label>{" "}
                  <InputDatePicker
                    name="StartDate"
                    size="large"
                    width="100%"
                    value={
                      chatDateState.StartDate
                        ? DateDisplayFormat(chatDateState.StartDate)
                        : null
                    }
                    DateRange
                    placeholder={"Select Date"}
                    change={onDateChange}
                  />
                </Col>
                <Col lg={6} md={6} sm={12}>
                  <label style={{ marginLeft: "5px" }}>
                    <b style={{ fontSize: "0.7rem" }}>Date To</b>
                  </label>
                  <InputDatePicker
                    name="EndDate"
                    size="large"
                    width="100%"
                    value={
                      chatDateState.EndDate
                        ? DateDisplayFormat(chatDateState.EndDate)
                        : null
                    }
                    DateRange
                    placeholder={"Select Date"}
                    change={onDateChange}
                    disable={endDatedisable}
                  />
                </Col>
              </Row>
            ) : null}
          </Col>
        </Row>
        <Row>
          <Col lg={12} md={12} sm={12} className="d-flex justify-content-center gap-2">
            <Button className=" Ok-btn" text="Okay" onClick={onConfirm} />
          </Col>
        </Row>
      </div>
    );
  }

  if (kind === "deleteSingle") {
    return (
      <div className="chat-menu-popups">
        <Row>
          <Col lg={12} md={12} sm={12}>
            <div className="chat-modal-Heading">
              <h1>Delete Messages</h1>
            </div>
          </Col>
        </Row>
        <Row>
          <Col lg={2} md={2} sm={12}></Col>
          <Col lg={4} md={4} sm={12}>
            <Button className=" Ok-btn" text="Delete" onClick={onConfirm} />
          </Col>
          <Col lg={4} md={4} sm={12}>
            <Button className=" White-btn" text="Cancel" onClick={onCancel} />
          </Col>
          <Col lg={2} md={2} sm={12}></Col>
        </Row>
      </div>
    );
  }

  if (kind === "leave") {
    return (
      <div className="chat-menu-popups">
        <Row>
          <Col lg={12} md={12} sm={12}>
            {" "}
            <div className="chat-modal-Heading">
              <h1>{t("Are-you-sure-you-want-to-leave-group")}</h1>
            </div>
          </Col>
        </Row>
        <Row>
          <Col lg={12} md={12} sm={12} className="text-center">
            <Button
              className=" Ok-btn mx-2"
              text={t("Yes")}
              onClick={onConfirm}
            />
            <Button
              className=" White-btn"
              text={t("Cancel")}
              onClick={onCancel}
            />
          </Col>
        </Row>
      </div>
    );
  }

  return null;
};

export default ChatActionModals;
