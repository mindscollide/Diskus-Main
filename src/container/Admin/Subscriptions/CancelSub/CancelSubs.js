import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Form, ProgressBar } from "react-bootstrap";
import styles from "./CancelSub.module.css";
import "./../../../../i18n";
import { Loader, Modal, Notification } from "../../../../components/elements";
import { useTranslation } from "react-i18next";
import { Button, WarningMessageBox } from "../../../../components/elements";
import { Link, useNavigate } from "react-router-dom";
import { getSubscribeOrganizationPackage } from "../../../../store/actions/Admin_PackageDetail";
import { useDispatch, useSelector } from "react-redux";
import {
  adminClearMessege,
  CancelSubscriptionPackage,
  revokeprocess,
} from "../../../../store/actions/Admin_CancelSub";
import DismissWarningAlert from "../../../../components/elements/DismissWarningAlert/DismissWarningAlert";
import { cleareMessageSubsPac } from "../../../../store/actions/GetSubscriptionPackages";
import { _justShowDateformat } from "../../../../commen/functions/date_formater";
import { isHTML } from "../../../../commen/functions/html_formater";
import { showMessage } from "../../../../components/elements/snack_bar/utill";

const CancelSubs = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  let revokeCancellationCheck = JSON.parse(
    localStorage.getItem("revokeCancellation")
  );
  const [cancelDailogBox, setCancelDailogBox] = useState(false);
  const [revokeCancellation, setRevokeCancellation] = useState(
    revokeCancellationCheck ? true : false
  );
  const [open, setOpen] = useState({
    open: false,
    message: "",
    severity: "error",
  });
  const [forrevokeCancel, setForRevokeCancel] = useState(false);
  const [enableTextArea, setEnableTextArea] = useState(false);
  const [isReason, setReason] = useState("");
  const { GetSubscriptionPackage, adminReducer } = useSelector(
    (state) => state
  );

  const [maxAdminUser, setMaxAdminUser] = useState(0);
  const [maxBoardMembers, setBoardMembers] = useState(0);
  const [maxOtherUsers, setOtherUsers] = useState(0);
  const [isPackageDetail, setPackageDetail] = useState({
    PackageTitle: "",
    PackageExpiryDate: "",
    PackageSubscriptionDate: "",
    PackageAmount: "",
    PackageDescription: "",
    UsersRangeAdmin: 0,
    UsersRangeBoardMembers: 0,
    OtherUsersRange: 0,
    PackageColorPath1: "",
    PackageColorPath2: "",
  });
  //for translation
  const navigate = useNavigate();
  const handleClickCancelNowBtn = () => {
    setCancelDailogBox(!cancelDailogBox);
    setForRevokeCancel(false);
  };
  const modalClose = () => {
    setCancelDailogBox(false);
    setForRevokeCancel(false);
    setEnableTextArea(false);
    setReason("");
  };
  const handleClickCompleteContractBtn = () => {
    setCancelDailogBox(!cancelDailogBox);
    setForRevokeCancel(true);
  };
  const handleSubmitPrcoceedwithCancellation = () => {
    // setCancelDailogBox(false)
    dispatch(CancelSubscriptionPackage(navigate, 5, isReason, t));
    setCancelDailogBox(false);
  };
  const handleClickCancelBtn = () => {
    // setCancelDailogBox(false)
    dispatch(CancelSubscriptionPackage(navigate, 6, isReason, t));
    setCancelDailogBox(false);
  };

  const handleChangeForRevoke = () => {
    dispatch(revokeprocess(navigate, t));
  };

  useEffect(() => {
    dispatch(getSubscribeOrganizationPackage(navigate, t));
  }, []);

  useEffect(() => {
    let packageDetails =
      GetSubscriptionPackage.getCurrentActiveSubscriptionPackage;
    if (packageDetails !== null && packageDetails !== undefined) {
      setPackageDetail({
        PackageTitle: packageDetails.organizationSelectedPackage.packageName,
        PackageExpiryDate:
          packageDetails.organizationSubscription.subscriptionExpiryDate,
        PackageAmount:
          packageDetails.organizationSelectedPackage.packageActualPrice,
        PackageSubscriptionDate:
          packageDetails.organizationSubscription.subscriptionStartDate,
        PackageDescription:
          packageDetails.organizationSelectedPackage.packageDescriptiveDetails,
        UsersRangeAdmin:
          packageDetails.organizationSelectedPackage.packageOccupiedAdminUsers,
        UsersRangeBoardMembers:
          packageDetails.organizationSelectedPackage
            .packageOccupiedBoardMemberUsers,
        OtherUsersRange:
          packageDetails.organizationSelectedPackage.packageOccupiedOtherUsers,
        PackageColorPath1:
          packageDetails.organizationSelectedPackage.badgeColor.split(
            "_SEPERATOR_"
          )[0],
        PackageColorPath2:
          packageDetails.organizationSelectedPackage.badgeColor.split(
            "_SEPERATOR_"
          )[1],
      });
      setMaxAdminUser(
        packageDetails.organizationSelectedPackage.packageAllowedAdminUsers
      );
      setBoardMembers(
        packageDetails.organizationSelectedPackage
          .packageAllowedBoardMemberUsers
      );
      setOtherUsers(
        packageDetails.organizationSelectedPackage.packageAllowedOtherUsers
      );
    }
  }, [GetSubscriptionPackage.getCurrentActiveSubscriptionPackage]);
  const handleReason = (e) => {
    setReason(e.target.value);
  };

  useEffect(() => {
    if (adminReducer.revokeResponseMessege !== "") {
      showMessage(adminReducer.revokeResponseMessege, "success", setOpen);
      dispatch(adminClearMessege());
    } else {
      dispatch(adminClearMessege());
    }
  }, [adminReducer.revokeResponseMessege]);
  useEffect(() => {
    if (GetSubscriptionPackage.getCancelSubscriptionResponseMessage !== "") {
      showMessage(
        GetSubscriptionPackage.getCancelSubscriptionResponseMessage,
        "success",
        setOpen
      );
      dispatch(cleareMessageSubsPac());
    } else {
      dispatch(cleareMessageSubsPac());
    }
  }, [GetSubscriptionPackage.getCancelSubscriptionResponseMessage]);
  return (
    <>
      <Container className="py-3 position-relative">
        <Row>
          {revokeCancellation ? (
            <>
              <Col sm={3} md={3} lg={3}></Col>
              <Col sm={6} md={6} lg={6}>
                <DismissWarningAlert />
              </Col>
              <Col sm={3} md={3} lg={3}></Col>
            </>
          ) : (
            <Col
              sm={12}
              md={12}
              lg={12}
              className={styles["cancel_subscription"]}
            >
              {t("Cancel-subscription")}
            </Col>
          )}
        </Row>
        <Row>
          <Col
            sm={12}
            md={6}
            lg={6}
            className="d-flex justify-content-center align-items-center mt-2 mx-auto"
          >
            <Col sm={12}>
              <Card className={styles["packagecard"]}>
                <Row>
                  <Col sm={12}>
                    {GetSubscriptionPackage.getCurrentActiveSubscriptionPackage !==
                      null &&
                    GetSubscriptionPackage.getCurrentActiveSubscriptionPackage !==
                      undefined ? (
                      <>
                        <span class="icon-star package-icon-style">
                          <span
                            class="path1"
                            style={{ color: isPackageDetail.PackageColorPath1 }}
                          ></span>
                          <span
                            class="path2"
                            style={{ color: isPackageDetail.PackageColorPath2 }}
                          ></span>
                          <span
                            class="path3"
                            style={{ color: isPackageDetail.PackageColorPath2 }}
                          ></span>
                        </span>
                        <h3 className={styles["packageCard_title"]}>
                          {isPackageDetail.PackageTitle}
                        </h3>{" "}
                      </>
                    ) : null}
                  </Col>
                </Row>
                <Row>
                  <Col sm={12}>
                    <div
                      className={`${styles["packagecard_priceBox_container"]}`}
                    >
                      <div className={styles["selectedPackage_priceDetails"]}>
                        <div className={styles["packagecard_disoucntprice"]}>
                          <h4 className={styles["selectedPackageAmount"]}>
                            ${isPackageDetail.PackageAmount}/
                            <p className="fs-6">{t("Month")}</p>
                          </h4>
                          <p
                            className={
                              styles["selectedpackagecard_disoucntprice_para"]
                            }
                          >
                            {t("Annual-Subscriptions")}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Col>
                  <Col sm={12} className="my-3">
                    <Row>
                      <Col
                        sm={12}
                        md={6}
                        lg={6}
                        className="text-center m-0 p-0 "
                      >
                        <p className={styles["subcriptionkey_1"]}>
                          {t("Subscription-date")}
                        </p>
                        <p className={styles["subcriptionvalue_1"]}>
                          {_justShowDateformat(
                            isPackageDetail.PackageSubscriptionDate + "000000"
                          )}
                        </p>
                      </Col>
                      <Col
                        sm={12}
                        md={6}
                        lg={6}
                        className="text-center m-0 p-0 "
                      >
                        <p className={styles["subcriptionkey_2"]}>
                          {t("Expiry-date")}
                        </p>
                        <p className={styles["subcriptionvalue_2"]}>
                          {_justShowDateformat(
                            isPackageDetail.PackageExpiryDate + "000000"
                          )}
                        </p>
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <Row>
                  <Col
                    sm={12}
                    md={12}
                    lg={12}
                    className={styles["selected-package-text"]}
                  >
                    {isHTML(isPackageDetail.PackageDescription) ? (
                      <p
                        dangerouslySetInnerHTML={{
                          __html: isPackageDetail.PackageDescription,
                        }}
                      ></p>
                    ) : (
                      <p>{isPackageDetail.PackageDescription}</p>
                    )}
                  </Col>
                </Row>
                <Row>
                  <Col sm={12}>
                    <div className={styles["packagecard_usersallows"]}>
                      <Row>
                        <Col sm={12}>
                          <Row>
                            <Col sm={12} md={12} lg={12}>
                              <p className=" text-uppercase font-16 color-5a5a5a Saved_money_Tagline">
                                {t("Users")}
                              </p>
                            </Col>
                            <Col sm={12} md={12} lg={12} className="m-0 p-0">
                              <ProgressBar
                                now={isPackageDetail.UsersRangeAdmin}
                                max={maxAdminUser}
                                className={styles["ExecutiveMembersRange"]}
                              />
                            </Col>
                            <Col
                              sm={12}
                              md={12}
                              lg={12}
                              className=" text-start color-949494 font-11 p-0 Saved_money_Tagline"
                            >
                              {isPackageDetail.UsersRangeAdmin} {t("of")}{" "}
                              {maxAdminUser} {t("Admin-users")}
                            </Col>
                            <Col sm={12} md={12} lg={12} className="m-0 p-0">
                              <ProgressBar
                                now={isPackageDetail.UsersRangeBoardMembers}
                                max={maxBoardMembers}
                                className={styles["BoardMembersRange"]}
                              />
                            </Col>
                            <Col
                              sm={12}
                              md={12}
                              lg={12}
                              className=" text-start color-949494 font-11 p-0 Saved_money_Tagline"
                            >
                              {isPackageDetail.UsersRangeBoardMembers} {t("of")}{" "}
                              {maxBoardMembers} {t("Board-members")}
                            </Col>
                            <Col sm={12} md={12} lg={12} className="m-0 p-0">
                              <ProgressBar
                                now={isPackageDetail.OtherUsersRange}
                                max={maxOtherUsers}
                                className={styles["BoardMembersRange"]}
                              />
                            </Col>
                            <Col
                              sm={12}
                              md={12}
                              lg={12}
                              className=" text-start color-949494 font-11 p-0 Saved_money_Tagline"
                            >
                              {isPackageDetail.OtherUsersRange} {t("of")}{" "}
                              {maxOtherUsers} {t("Other-users")}
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </div>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Col>
        </Row>
        <Row>
          {revokeCancellation ? (
            <Col sm={12} md={6} lg={6} className="mx-auto my-4">
              <Row>
                <Col sm={12} md={12} lg={12}>
                  <Button
                    text={t("Revoke-cancellation")}
                    className={styles["CancelNowBtn"]}
                    onClick={handleChangeForRevoke}
                  />
                </Col>
              </Row>
            </Col>
          ) : (
            <Col sm={12} md={6} lg={6} className="mx-auto my-4">
              <Row>
                <Col sm={12} md={6} lg={6}>
                  <Button
                    text={t("Cancel-now")}
                    onClick={handleClickCancelNowBtn}
                    className={styles["CancelNowBtn"]}
                  />
                </Col>
                <Col sm={12} md={6} lg={6}>
                  <Button
                    text={t("Completion-of-contract")}
                    className={styles["CompleteContract"]}
                    onClick={handleClickCompleteContractBtn}
                  />
                </Col>
              </Row>
            </Col>
          )}
        </Row>
        <Modal
          show={cancelDailogBox}
          setShow={setCancelDailogBox}
          modalBodyClassName={styles["CancelSubModal"]}
          size="xl"
          modalFooterClassName={styles["modalFootercancel-sub"]}
          onHide={modalClose}
          modalHeaderClassName={styles["CancelSubHeaderModal"]}
          ModalBody={
            <Card className={styles["UpgradePackageCard"]}>
              <Row>
                <Col
                  sm={12}
                  md={5}
                  lg={5}
                  className={styles["UpgradePackageCard_box1"]}
                >
                  <Col sm={12} md={12} lg={12} className="mb-4">
                    {GetSubscriptionPackage.getCurrentActiveSubscriptionPackage !==
                      null &&
                    GetSubscriptionPackage.getCurrentActiveSubscriptionPackage !==
                      undefined ? (
                      <>
                        <span class="icon-star package-icon-style">
                          <span
                            class="path1"
                            style={{ color: isPackageDetail.PackageColorPath1 }}
                          ></span>
                          <span
                            class="path2"
                            style={{ color: isPackageDetail.PackageColorPath2 }}
                          ></span>
                          <span
                            class="path3"
                            style={{ color: isPackageDetail.PackageColorPath2 }}
                          ></span>
                        </span>
                        <h3
                          className={`${"margin-top-70"} ${
                            styles["packageCard_title"]
                          }`}
                        >
                          {isPackageDetail.PackageTitle}
                        </h3>{" "}
                      </>
                    ) : null}
                    <h4 className={styles["packageAmountText"]}>
                      ${isPackageDetail.PackageAmount}/
                      <p className={styles["packageAmountText_p"]}>
                        {t("Month")}
                      </p>
                    </h4>
                    <p className={styles["packageAmountText_p2"]}>
                      {t("Annual-Subscriptions")}
                    </p>
                  </Col>
                  <Row>
                    <Col
                      sm={12}
                      md={12}
                      lg={12}
                      className={styles["selected-package-text"]}
                    >
                      {isHTML(isPackageDetail.PackageDescription) ? (
                        <p
                          dangerouslySetInnerHTML={{
                            __html: isPackageDetail.PackageDescription,
                          }}
                        ></p>
                      ) : (
                        <p>{isPackageDetail.PackageDescription}</p>
                      )}
                    </Col>
                  </Row>
                  <Row className="mt-3">
                    <Col
                      sm={12}
                      md={12}
                      lg={12}
                      className="text-center text-uppercase fw-bold my-2 FontArabicRegular"
                    >
                      {t("Users")}
                    </Col>

                    <Col sm={12} md={12} lg={12} className="m-0 p-0">
                      <ProgressBar
                        now={isPackageDetail.UsersRangeAdmin}
                        max={maxAdminUser}
                        className={styles["ExecutiveMembersRange"]}
                      />
                    </Col>
                    <Col
                      sm={12}
                      md={12}
                      lg={12}
                      className=" text-start color-949494 font-11 p-0 Saved_money_Tagline"
                    >
                      {isPackageDetail.UsersRangeAdmin} {t("Of")} {maxAdminUser}{" "}
                      {t("Admin-users")}
                    </Col>
                    <Col sm={12} md={12} lg={12} className="m-0 p-0">
                      <ProgressBar
                        now={isPackageDetail.UsersRangeBoardMembers}
                        max={maxBoardMembers}
                        className={styles["BoardMembersRange"]}
                      />
                    </Col>
                    <Col
                      sm={12}
                      md={12}
                      lg={12}
                      className=" text-start color-949494 font-11 p-0 Saved_money_Tagline"
                    >
                      {isPackageDetail.UsersRangeBoardMembers} {t("of")}{" "}
                      {maxBoardMembers} {t("Board-members")}
                    </Col>
                    <Col sm={12} md={12} lg={12} className="m-0 p-0">
                      <ProgressBar
                        now={isPackageDetail.OtherUsersRange}
                        max={maxOtherUsers}
                        className={styles["BoardMembersRange"]}
                      />
                    </Col>
                    <Col
                      sm={12}
                      md={12}
                      lg={12}
                      className=" text-start color-949494 font-11 p-0 Saved_money_Tagline"
                    >
                      {isPackageDetail.OtherUsersRange} {t("of")}{" "}
                      {maxOtherUsers} {t("Other-users")}
                    </Col>
                  </Row>
                  <Col sm={12} md={12} lg={12}></Col>
                  <span className={styles["lineBar"]}></span>
                </Col>

                <Col
                  sm={12}
                  md={7}
                  lg={7}
                  className={styles["UpgradePackageCard_box2"]}
                >
                  <Row>
                    <Col
                      sm={12}
                      md={12}
                      lg={12}
                      className=" my-4 d-flex justify-content-center FontArabicRegular"
                    >
                      <WarningMessageBox
                        text={
                          forrevokeCancel ? (
                            <span>
                              {t(
                                "You-have-selected-for-cancellation-of-subscription-at-the-end-of-your-term-which-is-at"
                              )}{" "}
                              <span>18-Dec-23</span>.
                              {t(
                                "You-can-always-opt-out-by-selecting-the-revoke-Cancellation-Option-from-the-same-screen"
                              )}
                            </span>
                          ) : (
                            t("You-have-selected-for-immediate-cancellation")
                          )
                        }
                        textClass="fw-bold font-12 margin-top-5 "
                      />
                    </Col>
                    <Col
                      sm={12}
                      lg={12}
                      md={12}
                      className={styles["upgradePackageAmoutnandList"]}
                    >
                      <p className={styles["reason-heading"]}>
                        {t("What-is-the-reason-for-your-leaving")}
                      </p>
                      <Form.Group className={styles["reason-lines"]}>
                        <Form.Check
                          type="radio"
                          className="radio-cancelsub-modal color-5a5a5a user-select-none my-2 Arabicstyles_Subtotal_Not_include_taxes"
                          label={t("Its-too-costly")}
                          name="reason"
                          onClick={() => setEnableTextArea(false)}
                          onChange={handleReason}
                          value={t("Its-too-costly")}
                        />
                        <Form.Check
                          type="radio"
                          className="radio-cancelsub-modal user-select-none my-2 Arabicstyles_Subtotal_Not_include_taxes"
                          label={t(
                            "I-found-another-product-that-fulfills-my-needs"
                          )}
                          name="reason"
                          onClick={() => setEnableTextArea(false)}
                          value={t(
                            "I-found-another-product-that-fulfills-my-needs"
                          )}
                          onChange={handleReason}
                        />
                        <Form.Check
                          type="radio"
                          className="radio-cancelsub-modal color-5a5a5a user-select-none my-2 Arabicstyles_Subtotal_Not_include_taxes"
                          label={t("I-dont-use-it-enough")}
                          name="reason"
                          onClick={() => setEnableTextArea(false)}
                          value={t("I-dont-use-it-enough")}
                          onChange={handleReason}
                        />
                        <Form.Check
                          type="radio"
                          className="radio-cancelsub-modal color-5a5a5a user-select-none my-2 Arabicstyles_Subtotal_Not_include_taxes"
                          label={t("Others")}
                          onClick={() => setEnableTextArea(!enableTextArea)}
                          name="reason"
                          onChange={handleReason}
                        />
                        {enableTextArea ? (
                          <Form.Control
                            onChange={handleReason}
                            disabled={enableTextArea ? false : true}
                            as="textarea"
                            className={styles["CancelSubModalTextArea"]}
                          ></Form.Control>
                        ) : (
                          <Col className={styles["height-20"]}></Col>
                        )}
                      </Form.Group>
                    </Col>
                    <Col sm={12} md={12} lg={12} className="mt-4 mb-3">
                      <Row>
                        {forrevokeCancel ? (
                          <>
                            <Col
                              sm={12}
                              md={12}
                              lg={12}
                              className="d-flex justify-content-center my-2"
                            >
                              <Button
                                text={t("Proceed-with-cancellation")}
                                onClick={handleSubmitPrcoceedwithCancellation}
                                className={styles["proceedwithCancelatioBtn"]}
                                disableBtn={isReason !== "" ? false : true}
                              />
                            </Col>
                            <Col
                              sm={12}
                              md={12}
                              lg={12}
                              className="d-flex justify-content-center"
                            >
                              <Link
                                onClick={modalClose}
                                to=""
                                className={styles["goBackBTN"]}
                              >
                                {t("Go-back")}
                              </Link>
                            </Col>
                          </>
                        ) : (
                          <>
                            <Col
                              sm={12}
                              md={6}
                              lg={6}
                              className="d-flex justify-content-start"
                            >
                              <Button
                                text={t("Cancel")}
                                onClick={modalClose}
                                className={styles["CancelNowBtn2"]}
                              />
                            </Col>
                            <Col
                              sm={12}
                              md={6}
                              lg={6}
                              className="d-flex justify-content-end"
                            >
                              <Button
                                text={t("Proceed")}
                                type="submit"
                                disableBtn={isReason !== "" ? false : true}
                                className={styles["ProceedBtn2"]}
                                onClick={handleClickCancelBtn}
                              />
                            </Col>
                          </>
                        )}
                      </Row>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Card>
          }
        />
      </Container>
      <Notification open={open} setOpen={setOpen} />
    </>
  );
};

export default CancelSubs;
