import React, { useEffect, useState } from "react";
import styles from "./viewCompliance.module.css";
import { Col, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useComplianceContext } from "../../../../context/ComplianceContext";
import CustomButton from "../../../../components/elements/button/Button";
import { useTranslation } from "react-i18next";
import { ProgressLoader } from "../../../../components/elements/ProgressLoader/ProgressLoader";
import ViewComplianceDetails from "./VIewComplianceDetails";
import ViewComplianceTasks from "./ViewComplianceTasks";
import { Button } from "../../../../components/elements";
import ReopenOrOnHoldDetailsModal from "../ReopenOrOnHoldDetailsModal";
import ArrowBack from "../../../../assets/images/arrow-left-compliance.png";

const ViewCompliance = () => {
  const { t } = useTranslation();

  // const [isViewDetailsBtnActive, setIsViewDetailsBtnActive] = useState(true);

  // Compliance Context
  const {
    setComplianceInfo,
    setComplianceDetailsState,
    viewComplianceDetailsTab,
    setViewComplianceDetailsTab,
    complianceDetailsState,
    setAllowedComplianceStatusOptions,
    setAllCheckListByComplianceId,
    mainComplianceTabs,
    isViewDetailsOpen,
    setIsViewDetailsOpen,
    setShowViewCompliance,
    emptyComplianceState,
  } = useComplianceContext();

  console.log();

  //   Get Comliance Details
  const viewComplianceByMeDetails = useSelector(
    (state) => state.ComplainceSettingReducerReducer.ViewComplianceByMeDetails
  );

  useEffect(() => {
    if (viewComplianceByMeDetails !== null) {
      try {
        const {
          allowedComplianceStatuses,
          authority,
          checklistTasks,
          checklists,
          completedTasks,
          complianceId,
          complianceStatus,
          complianceStatusChangeHistory,
          complianceTitle,
          createdBy,
          criticalityLevel,
          description,
          dueDate,
          isExecuted,
          progressPercent,
          showProgressBar,
          tags,
          totalTasks,
        } = viewComplianceByMeDetails;
        setComplianceInfo({
          complianceId: complianceId,
          complianceName: complianceTitle,
        });
        // setComplianceDetails({
        //   complianceTitle,
        //   complianceDescription: description,
        // });
        console.log(
          viewComplianceByMeDetails,
          "complianceDetailscomplianceDetails"
        );
        setComplianceDetailsState({
          complianceTitle: complianceTitle,
          complianceId: complianceId,
          description: description,
          //   authorityId: authority.authorityID,
          //   criticality: criticalityLevel,
          authority: {
            value: authority.authorityId,
            label: authority.authorityName,
          },
          criticality: {
            value: 0,
            label: criticalityLevel,
          },
          dueDate: dueDate,
          tags: Array.isArray(tags)
            ? tags.map((tag, index) => ({
                tagID: index + 1,
                tagTitle: tag,
              }))
            : [],
          progressPercent: progressPercent,
          status: {
            value: complianceStatus.statusId,
            label: complianceStatus.statusName,
          },
          createdBy: createdBy,
          totalComplianceTasks: totalTasks,
          showProgressBar: showProgressBar,
          complianceStatusChangeHistory: complianceStatusChangeHistory,
        });
        setAllCheckListByComplianceId(checklists);
        if (allowedComplianceStatuses && allowedComplianceStatuses.length > 0) {
          const allowedStatuses = allowedComplianceStatuses.map(
            (data, index) => {
              return {
                ...data,
                value: data.statusId,
                label: data.statusName,
              };
            }
          );
          setAllowedComplianceStatusOptions(allowedStatuses);
        }

        // setSelectAuthority(authority);
        // setSelectCriticality(criticalityLevel);
        // setComplianceDueDate(dueDate);
      } catch (error) {}
    }
  }, [viewComplianceByMeDetails]);
  const handleOpenReopenModal = () => {
    setIsViewDetailsOpen(true);
  };
  const handleClickBackIcon = () => {
    setShowViewCompliance(false);
    setViewComplianceDetailsTab(1);
    emptyComplianceState();
  };
  return (
    <>
      <section className={styles["MainViewCompliance_Container"]}>
        <Row>
          <Col
            sm={12}
            md={12}
            lg={12}
            className={styles["ComplianceNameHeading"]}
          >
            <img
              src={ArrowBack}
              alt=""
              width={17.75}
              height={17.75}
              className="cursor-pointer"
              onClick={handleClickBackIcon}
            />
            {complianceDetailsState.complianceTitle}
          </Col>
        </Row>
        <section className={` ${styles["ViewComplianceInnerSection"]}`}>
          <Row>
            <Col
              sm={12}
              md={3}
              lg={3}
              className="d-flex align-items-left justify-content-start gap-3"
            >
              <CustomButton
                className={
                  viewComplianceDetailsTab === 1
                    ? styles["viewComplianceTabBtn_active"]
                    : styles["viewComplianceTabBtn"]
                }
                text={t("Details")}
                onClick={() => {
                  setViewComplianceDetailsTab(1);
                }}
              />
              <CustomButton
                className={
                  viewComplianceDetailsTab === 2
                    ? styles["viewComplianceTabBtn_active"]
                    : styles["viewComplianceTabBtn"]
                }
                // disableBtn={
                //   complianceInfo.complianceId !== 0
                //     ? false
                //     : complianceAddEditViewState === 2
                //     ? false
                //     : true
                // }
                text={`${t("Tasks")}`}
                onClick={() => {
                  setViewComplianceDetailsTab(2);
                }}
              />
            </Col>
            {/* isViewDetailsBtnActive */}
            {viewComplianceDetailsTab === 1 && (
              <Col
                sm={12}
                md={9}
                lg={9}
                className="d-flex justify-content-end align-items-center gap-3"
              >
                {/* {isViewDetailsBtnActive && ( */}
                <>
                  {complianceDetailsState.complianceStatusChangeHistory.length >
                    0 && (
                    <div className={styles["viewComplianceDetailsArea"]}>
                      <span>
                        {t(
                          "The-status-of-this-compliance-was-changed-multiple-times."
                        )}
                      </span>
                      <Button
                        text={t("View-details")}
                        className={styles["viewComplianceDetailsBtn"]}
                        onClick={handleOpenReopenModal}
                        // () => setIsViewDetailsBtnActive(true)}
                      />
                    </div>
                  )}
                  {complianceDetailsState.showProgressBar ? (
                    <>
                      {/* <Col sm={12} md={3} lg={3} className="mt-2"> */}
                      <div className={styles.ProgressBarDiv}>
                        <div className="d-flex justify-content-between">
                          <span className={styles["progressBarHeading"]}>
                            {t("My-progress")}
                          </span>
                          <span className={styles["progressBarHeading"]}>
                            {`${complianceDetailsState.progressPercent}%`}
                          </span>
                        </div>
                        <ProgressLoader
                          progress={complianceDetailsState.progressPercent}
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <span className={styles["noTaskMsg"]}>
                        {t("No-tasks-created")}
                      </span>
                    </>
                  )}
                </>
                {/* )} */}
              </Col>
            )}
          </Row>
          {viewComplianceDetailsTab === 1 && <ViewComplianceDetails />}
          {viewComplianceDetailsTab === 2 && <ViewComplianceTasks />}
        </section>
      </section>
      <ReopenOrOnHoldDetailsModal />
    </>
  );
};

export default ViewCompliance;
