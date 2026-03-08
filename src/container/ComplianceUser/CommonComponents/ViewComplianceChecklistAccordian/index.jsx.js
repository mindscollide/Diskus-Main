import React, { useEffect, useRef, useState } from "react";
import styles from "./checklistAccordian.module.css";
import CustomAccordion from "../../../../components/elements/accordian/CustomAccordion";
import { useTranslation } from "react-i18next";
import { Col, Row } from "react-bootstrap";
import Accordion_Arrow from "../../../../assets/images/Accordion_Arrow.png";
import { useComplianceContext } from "../../../../context/ComplianceContext";
import { Button } from "../../../../components/elements";
import NoChecklistImg from "../../../../assets/images/NoChecklistImg.png";
import Select from "react-select";
import { ProgressLoader } from "../../../../components/elements/ProgressLoader/ProgressLoader";
import { formatDateToYMD } from "../commonFunctions";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { updateCheckListStatusApi } from "../../../../store/actions/ComplainSettingActions";
import { useNavigate } from "react-router-dom";

const ViewComplianceChecklistAccordian = () => {
  const accordionContainerRef = useRef();
  const { complianceInfo } = useComplianceContext();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [addChecklistCloseState, setAddChecklistCloseState] = useState(false);
  const [getCheckListData, setGetCheckListData] = useState([]);
  const [expandedCheckListIds, setExpandedCheckListIds] = useState([]);
  // const [isExpandBtnClicked, setIsExpandBtnClicked] = useState(false);
  const viewComplianceByMeDetails = useSelector(
    (state) => state.ComplainceSettingReducerReducer.ViewComplianceByMeDetails,
  );

  console.log(viewComplianceByMeDetails, "viewComplianceByMeDetails");

  const allExpanded =
    getCheckListData.length > 0 &&
    expandedCheckListIds.length === getCheckListData.length;

  // context
  const {
    allCheckListByComplianceId,
    setExpandChecklistOnTasksPage,
    setViewComplianceDetailsTab,
    complianceViewMode,
  } = useComplianceContext();

  console.log(
    {
      allCheckListByComplianceId,
    },
    "CheckListByComplianceCheckListByCompliance",
  );

  useEffect(() => {
    if (allCheckListByComplianceId && allCheckListByComplianceId.length !== 0) {
      setGetCheckListData(allCheckListByComplianceId);
      // 🔑 COLLAPSE ALL ACCORDIONS AFTER ADD
      setExpandedCheckListIds([]);
    }
  }, [allCheckListByComplianceId]);

  // functions
  const handleClickExpandCheckList = (data) => {
    setExpandedCheckListIds((prev) => {
      if (prev.includes(data.checklistId)) {
        // collapse

        return prev.filter((id) => id !== data.checklistId);
      } else {
        setAddChecklistCloseState(true);
        // expand
        return [...prev, data.checklistId];
      }
    });
  };

  // const handleExpandBtn = () => {
  //   if (isExpandBtnClicked) {
  //     if (getCheckListData?.length > 0) {
  //       const allIds = getCheckListData.map((item) => item.checklistId);

  //       setAddChecklistCloseState(true);
  //       setExpandedCheckListIds(allIds);
  //       setIsExpandBtnClicked(!isExpandBtnClicked);
  //     }
  //   }
  // };
  // const handleExpandBtn = () => {
  //   if (getCheckListData?.length === 0) return;

  //   if (!isExpandBtnClicked) {
  //     // 👉 EXPAND ALL
  //     const allIds = getCheckListData.map((item) => item.checklistId);

  //     setExpandedCheckListIds(allIds);
  //     setAddChecklistCloseState(true);
  //   } else {
  //     // 👉 COLLAPSE ALL
  //     setExpandedCheckListIds([]);
  //     setAddChecklistCloseState(false);
  //   }

  //   // 🔄 toggle button state
  //   setIsExpandBtnClicked((prev) => !prev);
  // };
  const handleExpandBtn = () => {
    if (getCheckListData.length === 0) return;

    if (allExpanded) {
      // 👉 COLLAPSE ALL
      setExpandedCheckListIds([]);
      setAddChecklistCloseState(false);
    } else {
      // 👉 EXPAND ALL
      const allIds = getCheckListData.map((item) => item.checklistId);

      setExpandedCheckListIds(allIds);
      setAddChecklistCloseState(true);
    }
  };

  const handleChecklistStatusChange = (
    checklistId,
    selectedStatus,
    dueDate,
  ) => {
    console.log("Checklist ID:", checklistId);
    console.log("Selected Status:", selectedStatus);
    let Data = {
      ChecklistID: checklistId,
      ComplianceID: complianceInfo?.complianceId,
      NewStatusID: selectedStatus?.value,
      StatusChangeReason: "",
      UpdatedDueDate: `${dueDate}185958`,
      ApplyToAssociatedItems: 0, // if not have associated things  // 1 if have associated things
    };

    dispatch(updateCheckListStatusApi(navigate, Data, t));

    // 🔁 Update local UI immediately (optional but recommended)
    setGetCheckListData((prev) =>
      prev.map((item) =>
        item.checklistId === checklistId
          ? {
              ...item,
              status: {
                statusId: selectedStatus.value,
                statusName: selectedStatus.label,
              },
            }
          : item,
      ),
    );

    // 🚀 CALL API HERE
    // updateChecklistStatus({
    //   checklistId,
    //   statusId: selectedStatus.value,
    // });
  };
  // styling for select:
  const getStatusColor = (status) => {
    switch (status) {
      case "Not Started":
        return "#9E9E9E";
      case "In Progress":
        return "#F5A623";
      case "Completed":
        return "#2ECC71";
      case "Overdue":
        return "#E74C3C";
      case "Submitted for Approval":
        return "#5B6EF5";
      case "Responded":
        return "#4FC3F7";
      case "On Hold":
        return "#26C6DA";
      case "Closed":
        return "#616161";
      default:
        return "#000";
    }
  };
  const statusSelectStyles = {
    option: (provided, state) => ({
      ...provided,
      color: getStatusColor(state.data.label),
      backgroundColor: state.isFocused ? "#F5F7FF" : "#fff",
      fontWeight: 500,
      cursor: "pointer",
    }),
    menu: (provided, state) => ({
      ...provided,
      width: "150px",
    }),
    singleValue: (provided, state) => ({
      ...provided,
      color: getStatusColor(state.data.label),
      fontWeight: 600,
    }),

    control: (provided, state) => ({
      ...provided,
      width: "150px",
      minHeight: "36px",
      border: "none",
      borderColor: state.isFocused ? "#6172d6" : "#d9d9d9",
      boxShadow: "none",
      "&:hover": {
        borderColor: "#6172d6",
      },
    }),

    indicatorSeparator: () => ({
      display: "none",
    }),
  };

  return (
    <>
      <Row className="my-2">
        <Col
          sm={12}
          md={6}
          lg={6}
          className={`d-flex align-items-end ${styles["complianceViewLabel"]}`}
        >
          {t("Checklists")}
        </Col>
        <Col
          sm={12}
          md={6}
          lg={6}
          className="d-flex justify-content-end align-items-center"
        >
          {getCheckListData?.length > 0 && (
            // <Button
            //   text={!isExpandBtnClicked ? t("Expand-all") : t("Collapse-all")}
            //   className={styles["viewCompliance_ExapnAllBtn"]}
            //   onClick={handleExpandBtn}
            // />
            <Button
              text={allExpanded ? t("Collapse-all") : t("Expand-all")}
              className={styles["viewCompliance_ExapnAllBtn"]}
              onClick={handleExpandBtn}
            />
          )}
        </Col>
      </Row>

      <div
        ref={accordionContainerRef}
        className={
          addChecklistCloseState
            ? styles["checklistAccordian_closed"]
            : styles["checklistAccordian"]
        }
      >
        {getCheckListData?.length > 0 ? (
          getCheckListData.map((data, index) => {
            const isExpanded = expandedCheckListIds.find(
              (data2, index) => data2 === data.checklistId,
            );

            console.log(isExpanded, data, "isExpandedisExpanded");
            const checklistStatusOptions =
              data.complianceCheckListAllowed?.map((status) => ({
                value: status.statusId,
                label: status.statusName,
              })) || [];

            const selectedChecklistStatus = data.status
              ? {
                  value: data.status.statusId,
                  label: data.status.statusName,
                }
              : null;

            return (
              <div key={index}>
                <CustomAccordion
                  isExpand={isExpanded}
                  notesID={data.checklistId}
                  isCompliance={true}
                  isComplianceTask={false}
                  StartField={
                    <p
                      className={`m-0 ${styles["ViewChecklistDetailStyles_notexpanded"]} ${styles["truncateTitle"]}`}
                    >
                      {data.checklistTitle}
                    </p>
                  }
                  attachmentsRow={
                    <>
                      <Row>
                        <Col sm={12} md={12} lg={12}>
                          <div className={styles["complianceViewLabel"]}>{`${t(
                            "Description",
                          )}`}</div>
                          <div className={styles["complianceViewValue"]}>
                            {data.description}
                          </div>
                        </Col>
                      </Row>
                      <Row className="mt-2">
                        <Col sm={12} md={3} lg={3}>
                          <div className={styles["complianceViewLabel"]}>{`${t(
                            "Due-date",
                          )}`}</div>
                          <div className={styles["complianceViewValue"]}>
                            {formatDateToYMD(data.dueDate)}
                          </div>
                        </Col>
                        <Col sm={12} md={2} lg={2}>
                          <div className={styles["complianceViewLabel"]}>{`${t(
                            "Status",
                          )}:`}</div>
                          {complianceViewMode === "byMe" ? (
                            <Select
                              isSearchable={true}
                              options={checklistStatusOptions}
                              labelInValue={t("Status")}
                              onChange={(selectedOption) =>
                                handleChecklistStatusChange(
                                  data.checklistId,
                                  selectedOption,
                                  data.dueDate,
                                )
                              }
                              styles={statusSelectStyles}
                              value={selectedChecklistStatus}
                              menuPortalTarget={document.body}
                              className={styles.Select_status_compliance}
                            />
                          ) : (
                            <div className={styles["complianceViewValue"]}>
                              {selectedChecklistStatus.label}
                            </div>
                          )}
                        </Col>
                        {data.tasksCount === 0 ? (
                          <Col
                            sm={12}
                            md={7}
                            lg={7}
                            className={`d-flex justify-content-end align-items-center ${styles["noTaskMsg"]}`}
                          >
                            {t("No-tasks-created")}
                          </Col>
                        ) : (
                          <>
                            <Col sm={12} md={4} lg={4}></Col>
                            <Col sm={12} md={3} lg={3}>
                              <div className="d-flex justify-content-between align-items-center">
                                <span className={styles["progressBarHeading"]}>
                                  {t("Checklist-progress")}
                                </span>
                                <span className={styles["progressBarHeading"]}>
                                  {`${data.checklistProgress}%`}
                                </span>
                              </div>

                              <ProgressLoader
                                progress={data.checklistProgress}
                              />
                            </Col>
                          </>
                        )}
                      </Row>
                    </>
                  }
                  endField={
                    <>
                      <Row>
                        <Col
                          sm={10}
                          md={10}
                          lg={10}
                          className="d-flex justify-content-end align-items-center"
                        >
                          {data.tasksCount === 0 ? (
                            !isExpanded && (
                              <span className={styles["noTaskMsg"]}>
                                {t("No-tasks-created")}
                              </span>
                            )
                          ) : (
                            <span
                              className={styles["viewTaskBtn"]}
                              onClick={() => {
                                setExpandChecklistOnTasksPage(data.checklistId); // 👈 key line
                                setViewComplianceDetailsTab(2); // switch to Tasks tab
                              }}
                            >
                              {t("view-tasks")}
                            </span>
                          )}
                        </Col>

                        <Col
                          sm={2}
                          md={2}
                          lg={2}
                          className="d-flex justify-content-end align-items-center"
                        >
                          <img
                            src={Accordion_Arrow}
                            onClick={() => handleClickExpandCheckList(data)}
                            alt=""
                            className={`cursor-pointer ${
                              isExpanded ? "" : styles["AccordionArrowDown"]
                            }`}
                          />
                        </Col>
                      </Row>
                    </>
                  }
                />
              </div>
            );
          })
        ) : (
          <>
            <Row className="mt-3 ">
              <Col
                lg={12}
                ms={12}
                sm={12}
                className="d-flex justify-content-center align-items-center"
              >
                <img draggable={false} src={NoChecklistImg} alt="" />
              </Col>
            </Row>
            <Row>
              <Col
                lg={12}
                ms={12}
                sm={12}
                className={`${styles["noChecklistMsg"]} d-flex justify-content-center`}
              >
                {t("No-checklist-found")}
              </Col>
            </Row>
            <Row>
              <Col
                lg={12}
                md={12}
                sm={12}
                className={`${styles["noChecklistMsg_subMsg"]} d-flex justify-content-center`}
              >
                {t("No-checklist-has-been-assigned-yet.")}
              </Col>
            </Row>
          </>
        )}
      </div>
    </>
  );
};

export default ViewComplianceChecklistAccordian;
