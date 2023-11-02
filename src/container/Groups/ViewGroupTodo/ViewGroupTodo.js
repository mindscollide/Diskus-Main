import React from "react";
import { useTranslation } from "react-i18next";
import {
  Button,
  TableToDo,
  ResultMessage,
  Paper,
  Loader,
  CustomDatePicker,
  TextField,
  Notification,
} from "../../../components/elements";

import { Row, Col } from "react-bootstrap";
import TodoMessageIcon1 from "../../../assets/images/Todomsg-1.png";

const ViewGroupTodo = () => {
  const { t } = useTranslation();
  const columnsToDo = [
    {
      title: t("Task"),
      dataIndex: "title",
      key: "title",
      width: "260px",
      sortDirections: ["descend", "ascend"],
      //       sorter: (a, b) =>
      //         a.title.toLowerCase().localeCompare(b.title.toLowerCase()),
      //       render: (text, record) => (
      //         <p
      //           className="todolist-title-col"
      //           onClick={(e) => viewModalHandler(record.pK_TID)}
      //         >
      //           {text}
      //         </p>
      //       ),
    },
    {
      title: t("Assigned-by"),
      dataIndex: "taskCreator",
      key: "taskCreator",
      width: "220px",
      sortDirections: ["descend", "ascend"],
      // align: "left",
      //       render: (record, index) => {
      //         return (
      //           <p className="m-0 MontserratRegular color-5a5a5a FontArabicRegular">
      //             {" "}
      //             <img
      //               draggable="false"
      //               className="data-img"
      //               src={`data:image/jpeg;base64,${record.displayProfilePictureName}`}
      //               alt="userimage"
      //             />
      //             {record?.name}
      //           </p>
      //         );
      //       },
      //       sorter: (a, b) => {
      //         return a?.taskCreator?.name
      //           .toLowerCase()
      //           .localeCompare(b?.taskCreator?.name.toLowerCase());
      //       },
    },
    {
      title: t("Assigned-to"),
      width: "220px",
      dataIndex: "taskAssignedTo",
      key: "taskAssignedTo",
      sortDirections: ["descend", "ascend"],
      //       sorter: (a, b) =>
      //         a.taskAssignedTo[0].name
      //           .toLowerCase()
      //           .localeCompare(b.taskAssignedTo[0].name.toLowerCase()),
      //       render: (text, record) => {
      //         if (text !== undefined && text !== null && text.length > 0) {
      //           return (
      //             <>
      //               <p className="m-0 MontserratRegular color-505050 FontArabicRegular">
      //                 {" "}
      //                 {currentLanguage === "ar" ? (
      //                   <>
      //                     <img
      //                       draggable="false"
      //                       className="data-img"
      //                       src={`data:image/jpeg;base64,${text[0].displayProfilePictureName}`}
      //                       alt="userimage"
      //                     />

      //                     {text[0].name}
      //                   </>
      //                 ) : (
      //                   <>
      //                     <img
      //                       draggable="false"
      //                       className="data-img"
      //                       src={`data:image/jpeg;base64,${text[0].displayProfilePictureName}`}
      //                       alt="userimage"
      //                     />
      //                     {text[0].name}
      //                   </>
      //                 )}
      //               </p>
      //             </>
      //           );
      //         }
      //       },
    },
    {
      title: t("Deadline"),
      dataIndex: "deadlineDateTime",
      key: "deadlineDateTime",
      className: "deadLineTodo",
      width: "180px",
      //       sortDirections: ["descend", "ascend"],
      //       sorter: (a, b) =>
      //         utcConvertintoGMT(a.deadlineDateTime) -
      //         utcConvertintoGMT(b.deadlineDateTime),
      //       // width: "220px",
      //       render: (text, record) => {
      //         return newTimeFormaterAsPerUTCFullDate(record.deadlineDateTime);
      //       },
    },
    {
      title: t("Status"),
      dataIndex: "status",
      key: "status",
      align: "center",
      width: "220px",
      //       filters: [
      //         {
      //           text: t("In-progress"),
      //           value: "In Progress",
      //           // className: currentLanguage,
      //         },
      //         {
      //           text: t("Pending"),
      //           value: "Pending",
      //         },
      //         {
      //           text: t("Upcoming"),
      //           value: "Upcoming",
      //         },
      //         {
      //           text: t("Cancelled"),
      //           value: "Cancelled",
      //         },
      //         {
      //           text: t("Completed"),
      //           value: "Completed",
      //         },
      //       ],
      //       defaultFilteredValue: [
      //         "In Progress",
      //         "Pending",
      //         "Upcoming",
      //         "Cancelled",
      //         "Completed",
      //       ],
      //       filterIcon: (filtered) => (
      //         <ChevronDown className="filter-chevron-icon-todolist" />
      //       ),
      //       onFilter: (value, record) => {
      //         return record.status.status.toLowerCase().includes(value.toLowerCase());
      //       },
      //       render: (text, record) => {
      //         if (Number(record.taskCreator.pK_UID) === Number(createrID)) {
      //           if (
      //             Number(
      //               record.taskAssignedTo[0].pK_UID ===
      //                 Number(record.taskCreator.pK_UID)
      //             )
      //           ) {
      //             return (
      //               <Select
      //                 defaultValue={text.status}
      //                 bordered={false}
      //                 dropdownClassName="Status-Todo"
      //                 className={
      //                   text.pK_TSID === 1
      //                     ? "InProgress MontserratSemiBold custom-class "
      //                     : text.pK_TSID === 2
      //                     ? "Pending MontserratSemiBold custom-class "
      //                     : text.pK_TSID === 3
      //                     ? "Upcoming MontserratSemiBold custom-class "
      //                     : text.pK_TSID === 4
      //                     ? "Cancelled MontserratSemiBold custom-class "
      //                     : text.pK_TSID === 5
      //                     ? "Completed MontserratSemiBold custom-class "
      //                     : null
      //                 }
      //                 onChange={(e) => statusChangeHandler(e, record.pK_TID)}
      //               >
      //                 {statusOptions.map((optValue, index) => {
      //                   return (
      //                     <option key={optValue.id} value={optValue.id}>
      //                       {optValue.status}
      //                     </option>
      //                   );
      //                 })}
      //               </Select>
      //             );
      //           } else {
      //             return (
      //               <p
      //                 className={
      //                   text.pK_TSID === 1
      //                     ? "InProgress  MontserratSemiBold color-5a5a5a text-center  my-1"
      //                     : text.pK_TSID === 2
      //                     ? "Pending  MontserratSemiBold color-5a5a5a text-center my-1"
      //                     : text.pK_TSID === 3
      //                     ? "Upcoming MontserratSemiBold color-5a5a5a text-center  my-1"
      //                     : text.pK_TSID === 4
      //                     ? "Cancelled  MontserratSemiBold color-5a5a5a text-center my-1"
      //                     : text.pK_TSID === 5
      //                     ? "Completed  MontserratSemiBold color-5a5a5a  text-center my-1"
      //                     : null
      //                 }
      //               >
      //                 {text.status}
      //               </p>
      //             );
      //           }
      //         } else {
      //           return record.taskAssignedTo.map((newdata, index) => {
      //             if (Number(newdata.pK_UID) === Number(createrID)) {
      //               return (
      //                 <Select
      //                   defaultValue={text.status}
      //                   // prefixCls="todo-status-select"
      //                   bordered={false}
      //                   dropdownClassName="Status-Todo"
      //                   className={
      //                     text.pK_TSID === 1
      //                       ? "InProgress MontserratSemiBold "
      //                       : text.pK_TSID === 2
      //                       ? "Pending MontserratSemiBold "
      //                       : text.pK_TSID === 3
      //                       ? "Upcoming MontserratSemiBold "
      //                       : text.pK_TSID === 4
      //                       ? "Cancelled MontserratSemiBold "
      //                       : text.pK_TSID === 5
      //                       ? "Completed MontserratSemiBold "
      //                       : null
      //                   }
      //                   onChange={(e) => statusChangeHandler(e, record.pK_TID)}
      //                 >
      //                   {statusOptions.map((optValue, index) => {
      //                     return (
      //                       <option key={optValue.id} value={optValue.id}>
      //                         {optValue.status}
      //                       </option>
      //                     );
      //                   })}
      //                 </Select>
      //               );
      //             }
      //           });
      //         }
      //       },
      //       filterMultiple: true,
    },
    {
      title: t("Delete"),
      dataIndex: "taskCreator",
      key: "taskCreator",
      width: "120px",
      //       render: (record, index) => {
      //         console.log(record, index, "recordrecordrecordrecordrecord");
      //         if (parseInt(record?.pK_UID) === parseInt(createrID)) {
      //           return (
      //             <i
      //               className="meeting-editbutton"
      //               onClick={(e) => deleteTodolist(index)}
      //             >
      //               <img draggable="false" src={del} alt="" />
      //             </i>
      //           );
      //         } else {
      //           <></>;
      //         }
      //       },
    },
  ];

  // Empty text data
  const emptyText = () => {
    return (
      <ResultMessage
        icon={
          <img
            src={TodoMessageIcon1}
            alt=""
            draggable="false"
            className="nodata-table-icon"
          />
        }
        title={t("No-Task")}
      />
    );
  };

  return (
    <>
      <Row>
        <Col lg={12} md={12} sm={12} className="d-flex justify-content-end">
          <Button text={"Create-Todo"} />
        </Col>
      </Row>
      <TableToDo
        column={columnsToDo}
        rows={[]}
        locale={{
          emptyText: emptyText(), // Set your custom empty text here
        }}
      />
    </>
  );
};

export default ViewGroupTodo;
