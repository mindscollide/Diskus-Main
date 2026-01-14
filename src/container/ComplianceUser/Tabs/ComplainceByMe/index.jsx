import React, { useMemo, useState, useEffect } from "react";
import CustomTable from "../../../../components/elements/table/Table";
import CustomButton from "../../../../components/elements/button/Button";
import styles from "./complianceByMe.module.css";
import { useComplianceContext } from "../../../../context/ComplianceContext";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  listOfComplianceByCreatorApi,
  ViewComplianceByIdAPI,
  ViewComplianceByMeDetailsAPI,
} from "../../../../store/actions/ComplainSettingActions";
import { useSelector } from "react-redux";

const ComplianceByMe = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const getCompliancesForCreator = useSelector(
    (state) => state.ComplainceSettingReducerReducer.listOfComplianceByCreator
  );
  const [complianceList, setComplianceList] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  console.log(
    "getCompliancesForCreator",
    getCompliancesForCreator,
    complianceList
  );
  const { setComplianceAddEditViewState, setCreateEditComplaince, setC } =
    useComplianceContext();

  useEffect(() => {
    let Data = {
      complianceTitle: "",
      dueDateFrom: "",
      dueDateTo: "",
      authorityShortCode: "",
      tagsCSV: "",
      criticalityIds: [],
      statusIds: [],
      pageNumber: 0,
      length: 10,
    };

    dispatch(listOfComplianceByCreatorApi(navigate, Data, t));
  }, []);

  useEffect(() => {
    if (!getCompliancesForCreator) return;
    try {
      if (getCompliancesForCreator.complianceList.length > 0) {
        setComplianceList(getCompliancesForCreator.complianceList);
        setTotalRecords(getCompliancesForCreator.totalCount);
      }
    } catch (error) {
      console.log(error);
    }
  }, [getCompliancesForCreator]);

  const handleEditCompliance = (record) => {
    const Data = {
      complianceId: record.complianceId,
    };
    dispatch(
      ViewComplianceByMeDetailsAPI(
        navigate,
        Data,
        t,
        1,
        setComplianceAddEditViewState,
        setCreateEditComplaince
      )
    );
  };

  const columns = useMemo(
    () => [
      {
        title: "Compliance Title",
        dataIndex: "complianceTitle",
        key: "complianceTitle",
        width: 350,
        ellipsis: true,
        align: "left",
      },
      {
        title: "Criticality",
        dataIndex: "criticality",
        key: "criticality",
        width: 150,
        align: "center",
        render: (text, record) => {
          return (
            <span>
              {text === 1 ? t("High") : text === 2 ? t("Medium") : t("Low")}
            </span>
          );
        },
      },
      {
        title: "Status",
        dataIndex: "complianceStatusTitle",
        key: "complianceStatusTitle",
        width: 150,
        align: "center",
      },
      {
        title: "Due Date",
        dataIndex: "DueDate",
        key: "DueDate",
        width: 200,
        align: "center",
        render: (_, record) => {
          return <span>{`${record.dueDate} ${record.dueTime}`}</span>;
        },
      },
      {
        title: "Authority",
        dataIndex: "authorityShortCode",
        key: "authorityShortCode",
        width: 200,
        align: "center",
      },
      {
        title: "",
        dataIndex: "",
        key: "",
        render: (_, record) => {
          return (
            <div className="d-flex align-item-center justify-content-center gap-2">
              <CustomButton
                className={styles["actionButtons_complianceList"]}
                text={"Edit"}
                onClick={() => handleEditCompliance(record)}
              />
              <CustomButton
                className={styles["actionButtons_complianceList"]}
                text={"View Details"}
              />
            </div>
          );
        },
      },
    ],
    [complianceList]
  );
  return (
    <>
      <CustomTable
        rows={complianceList}
        column={columns}
        className={"Compliance_Table mt-3"}
        scroll={{ x: "max-content", y: 550 }}
        pagination={false}
      />{" "}
    </>
  );
};

export default ComplianceByMe;
