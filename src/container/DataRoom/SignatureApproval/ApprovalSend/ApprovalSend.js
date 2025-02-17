import React, { useEffect, useState } from "react";
import styles from "./ApprovalSend.module.css";
import { ChevronDown } from "react-bootstrap-icons";
import { useTranslation } from "react-i18next";
import { TableToDo } from "../../../../components/elements";
import { Col, Row } from "react-bootstrap";
import DeleteIcon from "../../../../assets/images/delete_dataroom.png";
import InfiniteScroll from "react-infinite-scroll-component";
import { LoadingOutlined } from "@ant-design/icons";
import EmtpyImage from "../../../../assets/images/SendApproval_emptyIcon.png";
import SorterIconAscend from "../../../../assets/images/approval_sorter_icon_ascend.svg";
import SorterIconDescend from "../../../../assets/images/approval_sorter_icon_descend.svg";
import SignatoriesListModal from "./SignatoriesList/SignatoriesListModal";
import {
  getFileExtension,
  getIconSource,
} from "../../SearchFunctionality/option";
import { useSelector } from "react-redux";
import { Spin } from "antd";
import { SignatureandPendingApprovalDateTIme } from "../../../../commen/functions/date_formater";
import {
  deleteSignatureFlowDocumentApi,
  getAllPendingApprovalStatusApi,
  getAllSignatoriesStatusWise_Api,
  getAllSignaturesDocumentsforCreatorApi,
  validateEncryptedStringSignatureDataApi,
} from "../../../../store/actions/workflow_actions";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import DescendIcon from "../../../../assets/images/sortingIcons/SorterIconDescend.png";
import AscendIcon from "../../../../assets/images/sortingIcons/SorterIconAscend.png";
import ArrowDownIcon from "../../../../assets/images/sortingIcons/Arrow-down.png";
import ArrowUpIcon from "../../../../assets/images/sortingIcons/Arrow-up.png";
import { Checkbox, Dropdown, Menu } from "antd";
import { Button } from "../../../../components/elements";

const ApprovalSend = () => {
  const { t } = useTranslation();
  let CurrentLanguage = localStorage.getItem("i18nextLng");
  const SignatureWorkFlowReducer = useSelector(
    (state) => state.SignatureWorkFlowReducer
  );
  const workflowsignaturedocumentbyme = useSelector(
    (state) => state.SignatureWorkFlowReducer.workflowsignaturedocumentbyme
  );
  const workflowSignaturedocumentStatusChange = useSelector(
    (state) =>
      state.SignatureWorkFlowReducer.workflowSignaturedocumentStatusChange
  );

  console.log({ workflowsignaturedocumentbyme }, "globalStateglobalState");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [approvalsData, setApprovalsData] = useState([]);
  const [rowsDataLength, setDataLength] = useState(0);
  const [pageNo, setPageNo] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [signatoriesList, setSignatoriesList] = useState(false);
  const [originalData, setOriginalData] = useState([]);
  const [visible, setVisible] = useState(false);
  const docSignedCrAction = localStorage.getItem("docSignedCrAction");
  const [sortingData, setSortingData] = useState({
    sentOn: 0,
    title: 0,
    statusID: [],
  });
  console.log(sortingData, "sortingDatasortingData");
  const [reviewAndSignatureStatus, setReviewAndSignatureStatus] = useState([]);
  const [defaultreviewAndSignatureStatus, setDefaultReviewAndSignatureStatus] =
    useState([]);
  const [fileNameSort, setFileNameSort] = useState(null);
  const [signatoriesSort, setSignatoriesSort] = useState(null);

  useEffect(() => {
    const apiFunc = async () => {
      let newData = { IsCreator: true };
      await dispatch(getAllPendingApprovalStatusApi(navigate, t, newData, 1));
    };
    apiFunc();
  }, []);

  useEffect(() => {
    if (docSignedCrAction !== null) {
      let Data = {
        EncryptedString: docSignedCrAction,
      };
      dispatch(validateEncryptedStringSignatureDataApi(Data, navigate, t, 3));
    }
  }, [docSignedCrAction]);
  const handleClickChevron = () => {
    setVisible((prevVisible) => !prevVisible);
  };
  const resetFilter = async () => {
    setSortingData({
      ...sortingData,
      statusID: [],
      sentOn: 0,
      title: 0,
    });
    setVisible(false);
    let Data = {
      sRow: 0,
      Length: 10,
      SentOnSort: 0,
      StatusIDs: [],
      TitleSort: 0,
    };
    await dispatch(getAllSignaturesDocumentsforCreatorApi(navigate, t, Data));
  };

  const handleMenuClick = (filterValue) => {
    setSortingData((prevState) => ({
      ...prevState,
      statusID: prevState.statusID.includes(filterValue)
        ? prevState.statusID.filter((value) => value !== filterValue)
        : [...prevState.statusID, filterValue],
    }));
  };
  const handleApplyFilter = async () => {
    let Data = {
      sRow: 0,
      Length: 10,
      SentOnSort: sortingData.sentOn,
      StatusIDs: sortingData.statusID,
      TitleSort: sortingData.title,
    };
    await dispatch(getAllSignaturesDocumentsforCreatorApi(navigate, t, Data));
    setVisible(false);
  };

  const menu = (
    <Menu>
      {reviewAndSignatureStatus.map((filter) => (
        <Menu.Item
          key={filter.value}
          onClick={() => handleMenuClick(filter.value)}>
          <Checkbox checked={sortingData.statusID.includes(filter.value)}>
            {filter.text}
          </Checkbox>
        </Menu.Item>
      ))}
      <Menu.Divider />
      <div className='d-flex gap-3 align-items-center justify-content-center'>
        <Button
          text={"Reset"}
          className={styles["FilterResetBtn"]}
          onClick={resetFilter}
        />
        <Button
          text={"Ok"}
          disableBtn={sortingData.statusID.length === 0 ? true : false}
          className={styles["ResetOkBtn"]}
          onClick={handleApplyFilter}
        />
      </div>
    </Menu>
  );

  const handleSortingFunc = async (sortTab) => {
    if (sortTab === "title") {
      setSortingData({
        ...sortingData,
        title: sortingData.title === 1 ? 2 : 1,
      });
      let Data = {
        sRow: 0,
        Length: 10,
        SentOnSort: sortingData.sentOn,
        StatusIDs: sortingData.statusID,
        TitleSort: sortingData.title === 1 ? 2 : 1,
      };
      await dispatch(getAllSignaturesDocumentsforCreatorApi(navigate, t, Data));
    } else if (sortTab === "sentOn") {
      setSortingData({
        ...sortingData,
        sentOn: sortingData.sentOn === 1 ? 2 : 1,
      });
      let Data = {
        sRow: 0,
        Length: 10,
        SentOnSort: sortingData.sentOn === 1 ? 2 : 1,
        StatusIDs: sortingData.statusID,
        TitleSort: sortingData.title,
      };
      await dispatch(getAllSignaturesDocumentsforCreatorApi(navigate, t, Data));
    }
  };
  // Columns configuration for the table displaying pending approval data
  const pendingApprovalColumns = [
    {
      // Column for file name
      title: (
        <>
          <span className='d-flex gap-2'>
            {t("File-name")}
            {sortingData.title === 2 ? (
              <img src={DescendIcon} alt='' />
            ) : (
              <img src={AscendIcon} alt='' />
            )}
          </span>
        </>
      ),
      dataIndex: "fileName",
      key: "fileName",
      className: "nameParticipant",
      align: "start",
      ellipsis: true,
      tooltip: false,
      width: "30%",
      sortDirections: ["ascend", "descend"],
      sorter: (a, b) => a.fileName - b.fileName, // Custom sorter function for sorting by name
      onHeaderCell: () => ({
        onClick: () => {
          handleSortingFunc("title");
        },
      }),
      render: (text, record) => {
        console.log(record, "texttexttext");
        return (
          <span
            className='d-flex gap-2 align-items-center cursor-pointer'
            onClick={() => handleClickOpenDoc(record)}>
            <img
              width={"25px"}
              height={"25px"}
              src={getIconSource(getFileExtension(text))}
            />
            <p className={styles["fileName_Approvals"]}>{text}</p>
          </span>
        );
      },
    },
    {
      // Column for signatories
      title: t("Signatories"),
      dataIndex: "numberOfSignatories",
      key: "numberOfSignatories",
      ellipsis: true,
      width: "20%",
      align: "center",

      render: (text, record) => {
        if (record?.workFlowStatusID === 4) {
          return (
            <span className={styles["status_draft_signatoriesList"]}></span>
          );
        } else {
          return (
            <span
              onClick={() => handleClickSignatoriesList(record)}
              className={
                styles["signatories_vale"]
              }>{` ${text} Signatories`}</span>
          );
        }
      },
    },
    {
      // Column for sent-on date
      title: (
        <>
          {" "}
          <Row>
            <Col className='d-flex align-items-center justify-content-center gap-2'>
              {t("Sent-on")}
              {sortingData.sentOn === 2 ? (
                <img src={ArrowUpIcon} />
              ) : (
                <img src={ArrowDownIcon} />
              )}
            </Col>
          </Row>
        </>
      ),
      dataIndex: "sentOn",
      key: "sentOn",
      className: "leaveTimeParticipant",
      width: "15%",
      onHeaderCell: () => ({
        onClick: () => {
          handleSortingFunc("sentOn");
          // setSignatoriesSort((order) => {
          //   if (order === "descend") return "ascend";
          //   if (order === "ascend") return null;
          //   return "descend";
          // });
        },
      }),
      ellipsis: true,
      render: (text, record) => {
        if (text === "-") {
          return <span className={styles["date_vale"]}>{text}</span>;
        } else {
          return (
            <span className={styles["date_vale"]}>
              {SignatureandPendingApprovalDateTIme(text, CurrentLanguage)}
            </span>
          );
        }
      },
    },
    {
      // Column for status
      title: (
        <>
          <span className='d-flex justify-content-center gap-2'>
            {t("Status")}
          </span>
        </>
      ),
      dataIndex: "status",
      key: "status",
      align: "center",
      width: "10%",
      ellipsis: true,
      className: "statusParticipant",

      filterIcon: (filtered) => (
        <ChevronDown
          className='filter-chevron-icon-todolist'
          onClick={handleClickChevron}
        />
      ),
      filterDropdown: () => (
        <Dropdown overlay={menu} open={visible} trigger={["click"]}>
          <div />
        </Dropdown>
      ),
      render: (text, record) => {
        const { workFlowStatusID, status } = record;
        return (
          <p
            className={
              status === "Pending Signature"
                ? styles["pendingStatus"]
                : status === "Signed"
                ? styles["signedStatus"]
                : status === "Declined"
                ? styles["declineStatus"]
                : styles["draftStatus"]
            }>
            {t(status)}
          </p>
        );
      },
    },
    {
      // Column for status
      title: "",
      dataIndex: "delete",
      key: "delete",
      align: "center",
      width: "10%",
      render: (text, record) => {
        // Render status text with appropriate styles
        if (Number(record?.workFlowStatusID) === 4) {
          return (
            <img
              src={DeleteIcon}
              className='cursor-pointer'
              onClick={() => deleteSignatureDocument(record)}
            />
          );
        }
      },
    },
  ];

  const handleClickSignatoriesList = (record) => {
    console.log(record, "handleClickSignatoriesListhandleClickSignatoriesList");
    // setSignatureListVal(value);
    // setSignatoriesList(true);
    let Data = { WorkFlowID: record.workFlowID, FileID: record.fileID };
    dispatch(
      getAllSignatoriesStatusWise_Api(navigate, t, Data, setSignatoriesList)
    );
  };

  const handleClickOpenDoc = (record) => {
    let reponseData = JSON.stringify(record.fileID);
    if (Number(record.workFlowStatusID) === 4) {
      window.open(
        `/#/Diskus/signatureviewer?documentID=${encodeURIComponent(
          reponseData
        )}`,
        "_blank",
        "noopener noreferrer"
      );
    } else {
      let reponseData = JSON.stringify(record.fileID);
      window.open(
        `/#/Diskus/viewSignDocument?documentID=${encodeURIComponent(
          reponseData
        )}`,
        "_blank",
        "noopener noreferrer"
      );
    }
  };

  const deleteSignatureDocument = (record) => {
    let Data = { WorkFlowID: Number(record?.workFlowID) };
    dispatch(deleteSignatureFlowDocumentApi(navigate, t, Data));
  };

  useEffect(() => {
    if (SignatureWorkFlowReducer.getAllSignatureDocumentsforCreator !== null) {
      try {
        let { signatureFlowDocumentsForCreator, totalCount } =
          SignatureWorkFlowReducer.getAllSignatureDocumentsforCreator;
        if (
          Array.isArray(signatureFlowDocumentsForCreator) &&
          signatureFlowDocumentsForCreator.length > 0
        ) {
          if (isScrolling) {
            setIsScrolling(false);
            setApprovalsData([
              ...signatureFlowDocumentsForCreator,
              ...approvalsData,
            ]);
            setOriginalData([
              ...originalData,
              ...signatureFlowDocumentsForCreator,
            ]);

            if (
              totalCount !== undefined &&
              totalCount !== null &&
              totalCount !== 0
            ) {
              setTotalRecords(totalCount);
            }
            setPageNo((prev) => prev + 1);
            setDataLength(
              (prev) => prev + signatureFlowDocumentsForCreator.length
            );
          } else {
            if (
              totalCount !== undefined &&
              totalCount !== null &&
              totalCount !== 0
            ) {
              setTotalRecords(totalCount);
            }
            setOriginalData(signatureFlowDocumentsForCreator);
            setApprovalsData(signatureFlowDocumentsForCreator);
            setPageNo(1);
            setDataLength(signatureFlowDocumentsForCreator.length);
          }
        }
      } catch (error) {
        console.log("Something Went Wrong", error);
        setApprovalsData([]);
        setTotalRecords(0);
        setPageNo(1);

        setDataLength(0);
        setIsScrolling(false);
      }
    } else {
      setIsScrolling(false);
      setApprovalsData([]);
      setTotalRecords(0);
      setPageNo(1);

      setDataLength(0);
      setIsScrolling(false);
    }
  }, [SignatureWorkFlowReducer.getAllSignatureDocumentsforCreator]);

  useEffect(() => {
    if (
      SignatureWorkFlowReducer.getAllPendingApprovalStatuses !== null &&
      SignatureWorkFlowReducer.getAllPendingApprovalStatuses !== undefined
    ) {
      try {
        const { statusList } =
          SignatureWorkFlowReducer.getAllPendingApprovalStatuses;
        let statusValues = [];
        let defaultStatus = [];
        if (statusList.length > 0) {
          statusList.forEach((statusData, index) => {
            statusValues.push({
              text: `${t(statusData.statusName)}`,
              value: Number(statusData.statusID),
            });
            defaultStatus.push(Number(statusData.statusID));
          });
          setReviewAndSignatureStatus(statusValues);
          setDefaultReviewAndSignatureStatus(defaultStatus);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }, [SignatureWorkFlowReducer.getAllPendingApprovalStatuses]);

  useEffect(() => {
    try {
      if (workflowsignaturedocumentbyme !== null) {
        const { data } = workflowsignaturedocumentbyme;
        let findIfExist = approvalsData.find(
          (reviewSignatureData, index) =>
            reviewSignatureData.workFlowID === data.workFlowID
        );
        if (findIfExist !== undefined) {
          setApprovalsData((approvalsDataCopy) =>
            approvalsDataCopy.map((data2) =>
              data2.workFlowID === data.workFlowID
                ? {
                    ...data2,
                    status: data.status,
                    workFlowStatusID: data.workFlowStatusID,
                  }
                : data2
            )
          );
          setOriginalData((approvalsDataCopy) =>
            approvalsDataCopy.map((data2) =>
              data2.workFlowID === data.workFlowID
                ? {
                    ...data2,
                    status: data.status,
                    workFlowStatusID: data.workFlowStatusID,
                  }
                : data2
            )
          );
        } else {
          setApprovalsData([data, ...approvalsData]);
          setOriginalData([data, ...originalData]);
          setTotalRecords(totalRecords + 1);
        }
      }
    } catch (error) {}
  }, [workflowsignaturedocumentbyme]);

  useEffect(() => {
    try {
      if (workflowSignaturedocumentStatusChange !== null) {
        const { data } = workflowSignaturedocumentStatusChange;
        setApprovalsData((approvalsDataCopy) =>
          approvalsDataCopy.map((data2) =>
            data2.workFlowID === data.workFlowID
              ? {
                  ...data2,
                  status: data.status,
                  workFlowStatusID: data.workFlowStatusID,
                }
              : data2
          )
        );
      }
    } catch (error) {
      console.error("Error updating approvals data:", error);
    }
  }, [workflowSignaturedocumentStatusChange]);

  const antIcon = (
    <LoadingOutlined
      style={{
        fontSize: 36,
      }}
      spin
    />
  );
  console.log(
    rowsDataLength <= totalRecords,
    totalRecords,
    rowsDataLength,
    "handleScrollhandleScroll"
  );
  const handleScroll = async () => {
    console.log(
      rowsDataLength <= totalRecords,
      totalRecords,
      rowsDataLength,
      "handleScrollhandleScroll"
    );
    if (approvalsData.length > 0 && rowsDataLength <= totalRecords) {
      setIsScrolling(true);
      let Data = {
        sRow: Number(rowsDataLength),
        Length: 10,
        SentOnSort: sortingData.sentOn,
        StatusIDs: sortingData.statusID,
        TitleSort: sortingData.title,
      };

      await dispatch(getAllSignaturesDocumentsforCreatorApi(navigate, t, Data));
    }
  };
  return (
    <>
      {" "}
      <Row className='mb-2'>
        <Col sm={12} md={12} lg={12} className='mt-3'>
          <InfiniteScroll
            dataLength={approvalsData.length}
            next={handleScroll}
            style={{
              overflowX: "hidden",
            }}
            hasMore={approvalsData.length === totalRecords ? false : true}
            height={"58vh"}
            endMessage=''
            loader={
              approvalsData.length <= totalRecords &&
              isScrolling && (
                <>
                  <Row>
                    <Col
                      sm={12}
                      md={12}
                      lg={12}
                      className='d-flex justify-content-center mt-2'>
                      <Spin indicator={antIcon} />
                    </Col>
                  </Row>
                </>
              )
            }>
            <TableToDo
              sortDirections={["descend", "ascend"]}
              column={pendingApprovalColumns}
              className={"ApprovalsTable"}
              // prefClassName="ApprovalSending"
              rows={approvalsData}
              locale={{
                emptyText: (
                  <Col
                    sm={12}
                    md={12}
                    lg={12}
                    className='d-flex justify-content-center align-items-center mt-2'>
                    <section className={styles["ApprovalSend_emptyContainer"]}>
                      <img
                        className='d-flex justify-content-center'
                        src={EmtpyImage}
                      />
                      <span className={styles["emptyState_title"]}>
                        {t("Submit-document-for-approval")}
                      </span>
                      <span className={styles["emptyState_tagline"]}>
                        {t(
                          "Ready-to-send-a-document-for-approval-this-tab-awaits-your-next-submission"
                        )}
                        !
                      </span>
                    </section>
                  </Col>
                ),
              }}
              pagination={false}
              showHeader={true}
              id={(record, index) =>
                index === approvalsData.length - 1 ? "last-row-class" : ""
              }
            />
          </InfiniteScroll>
        </Col>
      </Row>
      {signatoriesList && (
        <SignatoriesListModal
          signatories_List={signatoriesList}
          setSignatoriesList={setSignatoriesList}
        />
      )}
    </>
  );
};

export default ApprovalSend;
