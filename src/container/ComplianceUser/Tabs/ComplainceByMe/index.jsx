import React, { useMemo, useState } from "react";
import CustomTable from "../../../../components/elements/table/Table";
import CustomButton from "../../../../components/elements/button/Button";
import styles from './complianceByMe.module.css'


const ComplianceByMe = () => {
  const [rows, setRows] = useState([
    {
      ComplianceTitle:
        "Implementation of End-to-End Data Encryption Across All Intern",
      Criticality: "High",
      Status: "In Progress",
      DueDate: "07 May 2025",
      Authority: "PSX",
    },
    {
      ComplianceTitle: "Data Protection Policy",
      Criticality: "High",
      Status: "In Progress",
      DueDate: "2024-12-31",
      Authority: "John Doe",
    },
  ]);
  const columns = useMemo(
    () => [
      {
        title: "Compliance Title",
        dataIndex: "ComplianceTitle",
        key: "ComplianceTitle",
        width: 350,
        ellipsis: true,
        align: "left",
        // render: (text, record) => (
        //   <span>
        //     Implementation of End-to-End Data Encryption Across All Intern...
        //   </span>
        // ),
      },
      {
        title: "Criticality",
        dataIndex: "Criticality",
        key: "Criticality",
        width: 150,
        align: "center",
      },
      {
        title: "Status",
        dataIndex: "Status",
        key: "Status",
        width: 150,
        align: "center",
      },
      {
        title: "Due Date",
        dataIndex: "DueDate",
        key: "DueDate",
        width: 200,
        align: "center",
      },
      {
        title: "Authority",
        dataIndex: "Authority",
        key: "Authority",
        width: 200,
        align: "center",
      },
      {
        title: "",
        dataIndex: "Authority",
        key: "Authority",
        render: (_, record) => {
          return (
            <div className='d-flex align-item-center justify-content-center gap-2'>
              <CustomButton className={styles["actionButtons_complianceList"]} text={"Edit"} />
              <CustomButton  className={styles["actionButtons_complianceList"]} text={"View Details"} />
            </div>
          );
        },
      },
    ],
    []
  );
  return (
    <>
      <CustomTable
        rows={rows}
        column={columns}
        className={"Compliance_Table mt-3"}
        scroll={{ x: "max-content", y: 550 }}
        pagination={false}
      />{" "}
    </>
  );
};

export default ComplianceByMe;
