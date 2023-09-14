import React, { useState } from "react";
import styles from "./Agenda.module.css";
import { Col, Row } from "react-bootstrap";
import { Button, TextField } from "../../../../../components/elements";
import { DownOutlined } from "@ant-design/icons";
import { Tree } from "antd";
import { useTranslation } from "react-i18next";
import { Radio } from "antd";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import DatePicker from "react-multi-date-picker";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import desh from "../../../../../assets/images/desh.svg";
import dropmdownblack from "../../../../../assets/images/whitedown.png";
import blackArrowUpper from "../../../../../assets/images/whiteupper.png";
import { useNavigate } from "react-router-dom";
import { message, Upload } from "antd";
import Lock from "../../../../../assets/images/LOCK.svg";
import featherupload from "../../../../../assets/images/featherupload.svg";
import DarkLock from "../../../../../assets/images/BlackLock.svg";
import DrapDropIcon from "../../../../../assets/images/DrapDropIcon.svg";
import Key from "../../../../../assets/images/KEY.svg";
import plusFaddes from "../../../../../assets/images/PlusFadded.svg";
import Cast from "../../../../../assets/images/CAST.svg";
import profile from "../../../../../assets/images/newprofile.png";
import redcrossIcon from "../../../../../assets/images/Artboard 9.png";
import line from "../../../../../assets/images/LineAgenda.svg";
import PdfIcon from "../../../../../assets/images/pdf_icon.svg";
import closedLocked from "../../../../../assets/images/CloseLocked.svg";
import lineBLue from "../../../../../assets/images/BlueLine.png";
import AgenItemremovedModal from "./AgendaItemRemovedModal/AgenItemremovedModal";
import {
  showAdvancePermissionModal,
  showAgenItemsRemovedModal,
  showImportPreviousAgendaModal,
  showMainAgendaItemRemovedModal,
  showVoteAgendaModal,
} from "../../../../../store/actions/NewMeetingActions";
import MainAjendaItemRemoved from "./MainAgendaItemsRemove/MainAjendaItemRemoved";
import AdvancePersmissionModal from "./AdvancePermissionModal/AdvancePersmissionModal";
import PermissionConfirmation from "./AdvancePermissionModal/PermissionConfirmModal/PermissionConfirmation";
import VoteModal from "./VoteModal/VoteModal";
import VoteModalConfirm from "./VoteModal/VoteModalConfirmation/VoteModalConfirm";
import {
  regexOnlyForNumberNCharacters,
  validateInput,
} from "../../../../../commen/functions/regex";
import ImportPrevious from "./ImportPreviousAgenda/ImportPrevious";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { startCase } from "lodash";

const Agenda = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { NewMeetingreducer } = useSelector((state) => state);
  const { Dragger } = Upload;
  const [value, setValue] = useState(1);
  const [subValue, setSubValue] = useState(0);
  const [expand, setExpand] = useState(true);
  const [subExpand, setSubExpand] = useState(true);
  const [expandSubIndex, setExpandSubIndex] = useState(0);
  const [expandIndex, setExpandIndex] = useState(0);
  const [subAjendaRowIndex, setsubAjendaRowIndex] = useState(0);
  const [subexpandIndex, setsubexpandIndex] = useState(0);
  const [agendaItemRemovedIndex, setAgendaItemRemovedIndex] = useState(0);
  const [mainAgendaRemovalIndex, setMainAgendaRemovalIndex] = useState(0);
  const [disbaleFields, setDisbaleFields] = useState(false);
  const [subMenudisbaleFields, setSubMenuDisbaleFields] = useState(false);
  const [subajendaRemoval, setSubajendaRemoval] = useState(0);
  const [subLock, setSubLock] = useState([]);
  const [open, setOpen] = useState({
    flag: false,
    message: "",
  });
  const [rows, setRows] = useState([
    {
      ID: "0",
      title: "",
      selectedOption: null,
      startDate: null,
      endDate: null,
      selectedRadio: "0",
      urlFieldMain: "",
      requestContributorURl: "",
      MainNote: "",
      files: [
        {
          name: "MeetingAgendas",
        },
        {
          name: "DiskusMeetings",
        },
        {
          name: "AxisMeetings",
        },
        {
          name: "Bahria Auditoriom Meetings to be published",
        },
        {
          name: "MeetingAgendas",
        },
        {
          name: "MeetingAgendas",
        },
        {
          name: "MeetingAgendas",
        },
        {
          name: "MeetingAgendas",
        },
        {
          name: "MeetingAgendas",
        },
        {
          name: "MeetingAgendas",
        },
      ],
      subAgenda: [
        {
          ID: "0",
          SubTitle: "",
          selectedOption: null,
          startDate: null,
          endDate: null,
          subSelectRadio: "0",
          SubAgendaUrlFieldRadio: "",
          subAgendarequestContributorUrl: "",
          subAgendarequestContributorEnterNotes: "",
          Subfiles: [
            {
              name: "MeetingAgendas",
            },
            {
              name: "DiskusMeetings",
            },
            {
              name: "AxisMeetings",
            },
            {
              name: "Bahria Auditoriom Meetings to be published",
            },
            {
              name: "MeetingAgendas",
            },
            {
              name: "MeetingAgendas",
            },
            {
              name: "MeetingAgendas",
            },
            {
              name: "MeetingAgendas",
            },
            {
              name: "MeetingAgendas",
            },
            {
              name: "MeetingAgendas",
            },
          ],
        },
      ],
    },
  ]);

  const [files, setfiles] = useState([]);

  const props = {
    name: "file",
    // action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
    multiple: true,
    showUploadList: false,
    onChange(data) {
      const { status } = data.file;
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
    customRequest() {},
  };

  const Subprops = {
    name: "file",
    // action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
    multiple: true,
    showUploadList: false,
    onChange(data) {
      const { status } = data.file;
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
    customRequest() {},
  };

  const options = [
    {
      value: "chocolate",
      label: (
        <>
          <Row>
            <Col
              lg={12}
              md={12}
              sm={12}
              className="d-flex gap-2 align-items-center"
            >
              <img
                src={profile}
                width="17px"
                height="17px"
                className={styles["Image_class_Agenda"]}
              />
              <span className={styles["Name_Class"]}>Oliver Davis</span>
            </Col>
          </Row>
        </>
      ),
    },
  ];

  const handleExpandedBtn = (index) => {
    console.log(index, "recordrecordrecordrecord");
    setExpandIndex(index);
    setExpand(!expand);
  };

  const addRow = () => {
    const updatedRows = [...rows];
    const newMainAgenda = {
      ID: updatedRows.length.toString(),
      title: "",
      selectedOption: null,
      startDate: null,
      endDate: null,
      files: [
        {
          name: "MeetingAgendas",
        },
      ],
      urlFieldMain: "",
      requestContributorURl: "",
      MainNote: "",
      subAgenda: [
        {
          ID: "0",
          title: "",
          selectedOption: null,
          startDate: null,
          endDate: null,
          files: [
            {
              name: "MeetingAgendas",
            },
            // ... (other file objects)
          ],
          subSelectRadio: "0", // Initialize selectedRadio to "0" for sub-agenda
          SubAgendaUrlFieldRadio: "",
          subAgendarequestContributorUrl: "",
          subAgendarequestContributorEnterNotes: "",
        },
      ],
    };
    updatedRows.push(newMainAgenda);
    setRows(updatedRows);
  };

  const addSubAjendaRows = (rowAgendaIndex) => {
    const updatedRows = [...rows];
    const newSubAgenda = {
      ID: updatedRows[rowAgendaIndex].subAgenda.length.toString(),
      SubTitle: "",
      selectedOption: null,
      startDate: null,
      endDate: null,
      subSelectRadio: "0",
      SubAgendaUrlFieldRadio: "",
      subAgendarequestContributorUrl: "",
      subAgendarequestContributorEnterNotes: "",
      Subfiles: [
        {
          name: "MeetingAgendas",
        },
        {
          name: "DiskusMeetings",
        },
        {
          name: "AxisMeetings",
        },
        {
          name: "Bahria Auditoriom Meetings to be published",
        },
        {
          name: "MeetingAgendas",
        },
        {
          name: "MeetingAgendas",
        },
        {
          name: "MeetingAgendas",
        },
        {
          name: "MeetingAgendas",
        },
        {
          name: "MeetingAgendas",
        },
        {
          name: "MeetingAgendas",
        },
      ],
    };
    updatedRows[rowAgendaIndex].subAgenda.push(newSubAgenda);
    setRows(updatedRows);
  };

  const handleCrossIcon = (index) => {
    dispatch(showMainAgendaItemRemovedModal(true));
    setMainAgendaRemovalIndex(index);
  };

  const handleCrossSubAjenda = (index, subIndex) => {
    dispatch(showAgenItemsRemovedModal(true));
    setAgendaItemRemovedIndex(index);
    setSubajendaRemoval(subIndex);
  };

  const handleSubMenuExpand = (index, subIndex) => {
    setsubexpandIndex(index);
    setExpandSubIndex(subIndex);
    setSubExpand(!subExpand);
  };

  const CrossDocument = (index) => {
    let optionscross = [...files];
    optionscross.splice(index, 1);
    setfiles(optionscross);
  };

  const openAdvancePermissionModal = () => {
    dispatch(showAdvancePermissionModal(true));
  };

  const openVoteMOdal = () => {
    dispatch(showVoteAgendaModal(true));
  };
  const [mainLock, setmainLock] = useState([]);

  const lockFunctionActive = (data) => {
    if (mainLock.length === 0) {
      // If state is empty, add the data
      setmainLock([data]);
    } else {
      const existingIndex = mainLock.findIndex((item) => item === data);
      if (existingIndex >= 0) {
        // If parentIndex exists, remove it
        const updatedData = mainLock.filter((item) => item !== data);
        setmainLock(updatedData);
      } else {
        // If parentIndex doesn't exist, add it
        setmainLock([...mainLock, data]);
      }
    }
  };

  const apllyLockOnParentAgenda = (parentIndex) => {
    const exists = mainLock.some((item) => {
      if (item === parentIndex) {
        return true;
      }
      return false;
    });

    return exists;
  };

  // StateManagement of Components

  const handleAgendaItemChange = (index, e) => {
    let name = e.target.name;
    let value = e.target.value;
    const updatedAgendaItems = [...rows];
    if (name === "title") {
      updatedAgendaItems[index][name] = value;
    }
    setRows(updatedAgendaItems);
  };

  const handleSelectChange = (index, value) => {
    console.log(value, "valuevaluevalue");
    const updatedAgendaItems = [...rows];
    let SelectValue = {
      value: value.value,
      label: value.label,
    };
    updatedAgendaItems[index].selectedOption = SelectValue;
    setRows(updatedAgendaItems);
  };

  // Function to update the startDate for a specific row
  const handleStartDateChange = (index, date) => {
    console.log(date, "datedatedatedatedate");
    const updatedRows = [...rows];
    updatedRows[index].startDate = date;
    setRows(updatedRows);
  };

  // Function to update the endDate for a specific row
  const handleEndDateChange = (index, date) => {
    const updatedRows = [...rows];
    updatedRows[index].endDate = date;
    setRows(updatedRows);
  };

  // Function to update the selected radio option for a specific row
  const handleRadioChange = (index, value) => {
    const updatedRows = [...rows];
    updatedRows[index].selectedRadio = value;
    setRows(updatedRows);
  };

  //SubAgenda Statemanagement

  // Function to handle changes in sub-agenda title
  const handleSubAgendaTitleChange = (index, subIndex, e) => {
    let name = e.target.name;
    let value = e.target.value;
    console.log(value, "valuevaluevalue");
    const updatedRows = [...rows];
    if (name === "SubTitle") {
      updatedRows[index].subAgenda[subIndex].SubTitle = value;
    }
    console.log(updatedRows, "SubAgendaTitleSubAgendaTitle");
    setRows(updatedRows);
  };

  // SubAgenda Select Options
  const SubAgendaoptions = [
    { value: "chocolate", label: "Chocolate" },
    { value: "strawberry", label: "Strawberry" },
    { value: "vanilla", label: "Vanilla" },
  ];

  // Function to handle changes in sub-agenda select
  const handleSubAgendaSelectChange = (index, subIndex, value) => {
    const updatedRows = [...rows];
    let SelectValue = {
      value: value.value,
      label: value.label,
    };
    updatedRows[index].subAgenda[subIndex].selectedOption = SelectValue;
    console.log(updatedRows, "SubagendaSelectSubagendaSelect");
    setRows(updatedRows);
  };

  // Function to handle changes in sub-agenda start date
  const handleSubAgendaStartDateChange = (index, subIndex, date) => {
    const updatedRows = [...rows];
    updatedRows[index].subAgenda[subIndex].startDate = date;
    console.log(updatedRows, "startCasestartCasestartCase");
    setRows(updatedRows);
  };

  // Function to handle changes in sub-agenda end date
  const handleSubAgendaEndDateChange = (index, subIndex, date) => {
    const updatedRows = [...rows];
    updatedRows[index].subAgenda[subIndex].endDate = date;
    setRows(updatedRows);
  };

  // Function to handle changes in sub-agenda radio group
  const handleSubAgendaRadioChange = (index, subIndex, e) => {
    let value = e.target.value;
    const updatedRows = [...rows];
    updatedRows[index].subAgenda[subIndex].subSelectRadio = value;
    console.log(
      updatedRows,
      "handleSubAgendaRadioChangehandleSubAgendaRadioChange"
    );
    setRows(updatedRows);
  };

  // Function to handle changes in main agenda additional text field
  const handleMainAgendaAdditionalFieldChange = (index, e) => {
    let name = e.target.name;
    let value = e.target.value;
    const updatedRows = [...rows];
    if (name === "UrlMainAgenda") {
      updatedRows[index].urlFieldMain = value;
    }
    setRows(updatedRows);
    console.log(updatedRows, "UrlMainAgendaUrlMainAgenda");
  };

  // Function to handle changes in main agenda Main Request Contributor Url text field
  const handleMainAgendaAdditionalFieldChangeRequestContributorURL = (
    index,
    e
  ) => {
    let name = e.target.name;
    let value = e.target.value;
    const updatedRows = [...rows];
    if (name === "MainRequestContributorName") {
      updatedRows[index].requestContributorURl = value;
    }
    setRows(updatedRows);
    console.log(updatedRows, "MainRequestContributorName");
  };

  // Function to handle changes in main agenda additional text field Main Request Contributor Note
  const handleMainAgendaAdditionalMainReqNotes = (index, e) => {
    let name = e.target.name;
    let value = e.target.value;
    const updatedRows = [...rows];
    if (name === "MainNoteReqContributor") {
      updatedRows[index].MainNote = value;
    }
    setRows(updatedRows);
    console.log(updatedRows, "MainNoteReqContributor");
  };

  // Function to handle changes in sub-agenda additional Enter URl Radio text field
  const handleSubAgendaUrlEnterUrlField = (index, subIndex, e) => {
    let name = e.target.name;
    let value = e.target.value;
    console.log(value, name, "valuevaluevalue");

    const updatedRows = [...rows];
    console.log(
      updatedRows[index].subAgenda[subIndex].SubAgendaUrlFieldRadio,
      "updatedRowsupdatedRows"
    );
    if (name === "SubAgendaUrlRadioField") {
      updatedRows[index].subAgenda[subIndex].SubAgendaUrlFieldRadio = value;
      console.log(
        updatedRows[index].subAgenda[subIndex].SubAgendaUrlFieldRadio,
        "updatedRowsupdatedRows"
      );
    }
    console.log(updatedRows, "SubAgendaUrlRadioField");
    setRows(updatedRows);
  };

  // Function to handle changes in sub-agenda additional Request Contributor Enter URl Radio text field
  const handleSubAgendaRequestContributorEnterUrl = (index, subIndex, e) => {
    let name = e.target.name;
    let value = e.target.value;
    console.log(value, name, "valuevaluevalue");

    const updatedRows = [...rows];

    if (name === "SubAgendaRequestContributorUrlField") {
      updatedRows[index].subAgenda[subIndex].subAgendarequestContributorUrl =
        value;
    }
    console.log(updatedRows, "SubAgendaRequestContributorUrlField");
    setRows(updatedRows);
  };

  // Function to handle changes in sub-agenda additional Request Contributor Enter Note Radio text field
  const handleSubAgendaRequestContributorEnterNote = (index, subIndex, e) => {
    let name = e.target.name;
    let value = e.target.value;
    console.log(value, name, "valuevaluevalue");

    const updatedRows = [...rows];

    if (name === "SubAgendaRequestContributorEnterNotesFiled") {
      updatedRows[index].subAgenda[
        subIndex
      ].subAgendarequestContributorEnterNotes = value;
    }
    console.log(updatedRows, "SubAgendaRequestContributorEnterNotesFiled");
    setRows(updatedRows);
  };

  const [subLockArry, setSubLockArray] = useState([]);

  const lockFunctionActiveSubMenus = (index, subindex) => {
    let cloneSubLockArry = [...subLockArry];
    console.log(index, subindex, "findsubIndexfindsubIndexfindsubIndex");

    const parentIndexExists = cloneSubLockArry.findIndex(
      (item) => item.parentIndex === index
    );

    if (parentIndexExists >= 0) {
      const existingParentIndexObj = cloneSubLockArry[parentIndexExists];

      const subIndexExists = existingParentIndexObj.SubIndexArray.findIndex(
        (item) => item.subIndex === subindex
      );

      if (subIndexExists >= 0) {
        existingParentIndexObj.SubIndexArray.splice(subIndexExists, 1);

        // If SubIndexArray is empty, remove the entire parent index object
        if (existingParentIndexObj.SubIndexArray.length === 0) {
          cloneSubLockArry.splice(parentIndexExists, 1);
        }
      } else {
        existingParentIndexObj.SubIndexArray.push({ subIndex: subindex });
      }
    } else {
      let newData = {
        parentIndex: index,
        SubIndexArray: [{ subIndex: subindex }],
      };
      cloneSubLockArry.push(newData);
    }

    setSubLockArray(cloneSubLockArry);
  };

  const handlePreviousAgenda = () => {
    dispatch(showImportPreviousAgendaModal(true));
  };

  const apllyLockOnSubAgenda = (parentIndex, subIndex) => {
    const exists = subLockArry.some((item) => {
      if (item.parentIndex === parentIndex) {
        return item.SubIndexArray.some(
          (subItem) => subItem.subIndex === subIndex
        );
      }
      return false;
    });

    return exists;
  };

  // const HandleDragDrop = (results) => {
  //   console.log(results, "Hello There");
  //   const { source, destination, type } = results;

  //   if (!destination) return;

  //   if (
  //     source.droppableId === destination.droppableId &&
  //     source.index === destination.index
  //   )
  //     return;

  //   if (type === "group") {
  //     const updatedRows = [...rows];

  //     if (source.droppableId === "ROOT") {
  //       // Main Agenda Item Drag and Drop
  //       const mainAgendaItem = updatedRows[source.index];
  //       updatedRows.splice(source.index, 1);
  //       updatedRows.splice(destination.index, 0, mainAgendaItem);
  //     } else if (source.droppableId === "subAgendaList") {
  //       // Sub Agenda Item Drag and Drop
  //       const mainAgendaIndex = parseInt(source.droppableId.split("-")[1]);
  //       const subAgendaItem =
  //         updatedRows[mainAgendaIndex].subAgenda[source.index];
  //       updatedRows[mainAgendaIndex].subAgenda.splice(source.index, 1);
  //       updatedRows[mainAgendaIndex].subAgenda.splice(
  //         destination.index,
  //         0,
  //         subAgendaItem
  //       );
  //     }

  //     setRows(updatedRows);
  //   }
  // };

  const HandleDragDrop = (results) => {
    console.log(results, "Hello There");
    const { source, destination, type } = results;

    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    if (type === "group") {
      const updatedRows = [...rows];

      // Check if the drag-and-drop is in the main agenda list
      if (source.droppableId === "ROOT") {
        // Update "ROOT" to your actual droppableId
        // Main Agenda Item Drag and Drop
        const mainAgendaItem = updatedRows[source.index];
        updatedRows.splice(source.index, 1);
        updatedRows.splice(destination.index, 0, mainAgendaItem);
      }

      // Add this block to handle sub-agenda drag-and-drop
      // Check if the drag-and-drop is in the sub-agenda list
      if (source.droppableId.startsWith("subAgendaList")) {
        // Update "subAgendaList" to your actual droppableId
        const mainAgendaIndex = parseInt(source.droppableId.split("-")[1]);
        const subAgendaItem =
          updatedRows[mainAgendaIndex].subAgenda[source.index];
        updatedRows[mainAgendaIndex].subAgenda.splice(source.index, 1);
        updatedRows[mainAgendaIndex].subAgenda.splice(
          destination.index,
          0,
          subAgendaItem
        );
      }

      setRows(updatedRows);
    }
  };

  return (
    <>
      <section>
        <DragDropContext onDragEnd={HandleDragDrop}>
          <Row>
            <Col lg={12} md={12} sm={12} className={styles["Scroller_Agenda"]}>
              <Droppable droppableId="ROOT" type="group">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef}>
                    {rows.length > 0
                      ? rows.map((data, index) => {
                          console.log("valuevaluevalue", data.title);
                          return (
                            <>
                              <Draggable
                                draggableId={data.ID}
                                Key={data.ID}
                                index={index}
                              >
                                {(provided) => (
                                  <div
                                    {...provided.dragHandleProps}
                                    {...provided.draggableProps}
                                    ref={provided.innerRef}
                                  >
                                    <Row key={data.ID} className="mt-4 m-0 p-0">
                                      <Col
                                        lg={12}
                                        md={12}
                                        sm={12}
                                        key={index + 1}
                                        className={
                                          apllyLockOnParentAgenda(index)
                                            ? styles[
                                                "BackGround_Agenda_InActive"
                                              ]
                                            : styles["BackGround_Agenda"]
                                        }
                                      >
                                        <Row>
                                          <Col
                                            lg={1}
                                            md={1}
                                            sm={1}
                                            className={
                                              styles["BackGroundNewImplemented"]
                                            }
                                          >
                                            <Row className="mt-4">
                                              <Col
                                                lg={12}
                                                md={12}
                                                sm={12}
                                                className="d-flex justify-content-center align-items-center"
                                              >
                                                <img
                                                  src={
                                                    expandIndex === index &&
                                                    expand === true
                                                      ? blackArrowUpper
                                                      : dropmdownblack
                                                  }
                                                  width="18.71px"
                                                  height="9.36px"
                                                  className={
                                                    expand === true
                                                      ? styles["Arrow_Expanded"]
                                                      : styles["Arrow"]
                                                  }
                                                  onClick={() => {
                                                    handleExpandedBtn(index);
                                                  }}
                                                />
                                              </Col>
                                            </Row>
                                          </Col>

                                          <Col lg={11} md={11} sm={11}>
                                            <section
                                              className={
                                                styles["SectionInnerClass"]
                                              }
                                            >
                                              <Row
                                                key={index + 2}
                                                className="mt-4"
                                              >
                                                <Col lg={5} md={5} sm={12}>
                                                  <Row>
                                                    <Col
                                                      lg={12}
                                                      md={12}
                                                      sm={12}
                                                    >
                                                      <span
                                                        className={
                                                          styles[
                                                            "Meeting_title_heading"
                                                          ]
                                                        }
                                                      >
                                                        <span>
                                                          {index + 1}.
                                                        </span>{" "}
                                                        {t("Agenda-title")}{" "}
                                                        <span>{index + 1}</span>
                                                      </span>
                                                    </Col>
                                                  </Row>
                                                  <TextField
                                                    applyClass={
                                                      "AgendaTextField"
                                                    }
                                                    name={"title"}
                                                    labelClass={"d-none"}
                                                    placeholder={t(
                                                      "Agenda-title"
                                                    )}
                                                    value={data.title}
                                                    change={(e) =>
                                                      handleAgendaItemChange(
                                                        index,
                                                        e
                                                      )
                                                    }
                                                    disable={
                                                      apllyLockOnParentAgenda(
                                                        index
                                                      )
                                                        ? true
                                                        : false
                                                    }
                                                  />
                                                </Col>
                                                <Col lg={3} md={3} sm={12}>
                                                  <Row>
                                                    <Col
                                                      lg={12}
                                                      md={12}
                                                      sm={12}
                                                    >
                                                      <span
                                                        className={
                                                          styles[
                                                            "Meeting_title_heading"
                                                          ]
                                                        }
                                                      >
                                                        {t("Presenter")}
                                                      </span>
                                                    </Col>
                                                  </Row>
                                                  <Select
                                                    options={options}
                                                    value={data.selectedOption}
                                                    onChange={(value) =>
                                                      handleSelectChange(
                                                        index,
                                                        value
                                                      )
                                                    }
                                                    isDisabled={
                                                      apllyLockOnParentAgenda(
                                                        index
                                                      )
                                                        ? true
                                                        : false
                                                    }
                                                  />
                                                </Col>
                                                <Col
                                                  sm={12}
                                                  md={4}
                                                  lg={4}
                                                  className="d-flex gap-4 justify-content-start align-items-center"
                                                >
                                                  <Row>
                                                    <Col lg={5} md={5} sm={5}>
                                                      <Row>
                                                        <Col
                                                          lg={12}
                                                          md={12}
                                                          sm={12}
                                                        >
                                                          <span
                                                            className={
                                                              styles[
                                                                "Meeting_title_heading"
                                                              ]
                                                            }
                                                          >
                                                            {t("Start-date")}
                                                          </span>
                                                        </Col>
                                                      </Row>
                                                      <DatePicker
                                                        arrowClassName="arrowClass"
                                                        containerClassName="containerClassTimePicker"
                                                        className="timePicker"
                                                        disableDayPicker
                                                        inputClass="inputTImeMeeting"
                                                        format="HH:mm A"
                                                        selected={
                                                          data.startDate
                                                        }
                                                        plugins={[
                                                          <TimePicker
                                                            hideSeconds
                                                          />,
                                                        ]}
                                                        onChange={(date) =>
                                                          handleStartDateChange(
                                                            index,
                                                            date
                                                          )
                                                        }
                                                        disabled={
                                                          apllyLockOnParentAgenda(
                                                            index
                                                          )
                                                            ? true
                                                            : false
                                                        }
                                                      />
                                                    </Col>
                                                    <Col
                                                      lg={2}
                                                      md={2}
                                                      sm={2}
                                                      className="d-flex justify-content-center align-items-center"
                                                    >
                                                      <img
                                                        src={desh}
                                                        width="19.02px"
                                                      />
                                                    </Col>
                                                    <Col lg={5} md={5} sm={5}>
                                                      <Row>
                                                        <Col
                                                          lg={12}
                                                          md={12}
                                                          sm={12}
                                                        >
                                                          <span
                                                            className={
                                                              styles[
                                                                "Meeting_title_heading"
                                                              ]
                                                            }
                                                          >
                                                            {t("End-date")}
                                                          </span>
                                                        </Col>
                                                      </Row>
                                                      <DatePicker
                                                        arrowClassName="arrowClass"
                                                        containerClassName="containerClassTimePicker"
                                                        className="timePicker"
                                                        disableDayPicker
                                                        inputClass="inputTImeMeeting"
                                                        format="HH:mm A"
                                                        selected={data.endDate}
                                                        plugins={[
                                                          <TimePicker
                                                            hideSeconds
                                                          />,
                                                        ]}
                                                        onChange={(date) =>
                                                          handleEndDateChange(
                                                            index,
                                                            date
                                                          )
                                                        } // Update end date
                                                        disabled={
                                                          apllyLockOnParentAgenda(
                                                            index
                                                          )
                                                            ? true
                                                            : false
                                                        }
                                                      />
                                                    </Col>
                                                  </Row>
                                                  {index !== 0 && (
                                                    <img
                                                      src={redcrossIcon}
                                                      height="25px"
                                                      width="25px"
                                                      className={
                                                        styles[
                                                          "RedCross_Icon_class_Main_agenda"
                                                        ]
                                                      }
                                                      onClick={() => {
                                                        handleCrossIcon(index);
                                                      }}
                                                    />
                                                  )}
                                                </Col>
                                              </Row>
                                              <Row className="mt-2">
                                                <Col lg={12} md={12} sm={12}>
                                                  <span
                                                    className={
                                                      styles["Show_Details_Tag"]
                                                    }
                                                    onClick={() => {
                                                      handleExpandedBtn(index);
                                                    }}
                                                  >
                                                    {expand === true
                                                      ? t("Hide-details")
                                                      : t("Show-details")}
                                                  </span>
                                                </Col>
                                              </Row>
                                              {expandIndex === index &&
                                              expand === true ? (
                                                <>
                                                  <Row
                                                    key={index + 3}
                                                    className="mt-3"
                                                  >
                                                    <Col
                                                      lg={12}
                                                      md={12}
                                                      sm={12}
                                                    >
                                                      <span
                                                        className={
                                                          styles[
                                                            "Agenda_Heading"
                                                          ]
                                                        }
                                                      >
                                                        {t("Attachments")}
                                                      </span>
                                                    </Col>
                                                  </Row>
                                                  <Row
                                                    key={index + 4}
                                                    className="mt-3"
                                                  >
                                                    <Col lg={6} md={6} sm={6}>
                                                      <Radio.Group
                                                        onChange={(e) =>
                                                          handleRadioChange(
                                                            index,
                                                            e.target.value
                                                          )
                                                        }
                                                        value={data.value}
                                                        disabled={
                                                          apllyLockOnParentAgenda(
                                                            index
                                                          )
                                                            ? true
                                                            : false
                                                        }
                                                      >
                                                        <Radio value="1">
                                                          <span
                                                            className={
                                                              styles[
                                                                "Radio_Button_options"
                                                              ]
                                                            }
                                                          >
                                                            {t("Document")}
                                                          </span>
                                                        </Radio>
                                                        <Radio value="2">
                                                          <span
                                                            className={
                                                              styles[
                                                                "Radio_Button_options"
                                                              ]
                                                            }
                                                          >
                                                            {t("URL")}
                                                          </span>
                                                        </Radio>
                                                        <Radio value="3">
                                                          <span
                                                            className={
                                                              styles[
                                                                "Radio_Button_options"
                                                              ]
                                                            }
                                                          >
                                                            {t(
                                                              "Request from contributor"
                                                            )}
                                                          </span>
                                                        </Radio>
                                                      </Radio.Group>
                                                    </Col>
                                                    <Col
                                                      lg={6}
                                                      md={6}
                                                      sm={6}
                                                      className="d-flex justify-content-end gap-4 align-items-center"
                                                    >
                                                      <img
                                                        src={Key}
                                                        width="24.07px"
                                                        height="24.09px"
                                                        className="cursor-pointer"
                                                        onClick={
                                                          apllyLockOnParentAgenda(
                                                            index
                                                          )
                                                            ? ""
                                                            : openAdvancePermissionModal
                                                        }
                                                      />
                                                      <img
                                                        src={Cast}
                                                        width="25.85px"
                                                        height="25.89px"
                                                        className="cursor-pointer"
                                                        onClick={
                                                          apllyLockOnParentAgenda(
                                                            index
                                                          )
                                                            ? ""
                                                            : openVoteMOdal
                                                        }
                                                      />
                                                      <img
                                                        src={
                                                          apllyLockOnParentAgenda(
                                                            index
                                                          )
                                                            ? DarkLock
                                                            : Lock
                                                        }
                                                        width="18.87px"
                                                        className={
                                                          apllyLockOnParentAgenda(
                                                            index
                                                          )
                                                            ? styles[
                                                                "lockBtn_inActive"
                                                              ]
                                                            : styles["lockBtn"]
                                                        }
                                                        height="26.72px"
                                                        onClick={() =>
                                                          lockFunctionActive(
                                                            index
                                                          )
                                                        }
                                                      />
                                                    </Col>
                                                  </Row>
                                                  {data.selectedRadio ===
                                                  "1" ? (
                                                    <>
                                                      <Row key={index + 5}>
                                                        <Col
                                                          lg={12}
                                                          md={12}
                                                          sm={12}
                                                          className={
                                                            styles[
                                                              "Scroller_document"
                                                            ]
                                                          }
                                                        >
                                                          <div className="d-flex gap-1 flex-wrap mt-2">
                                                            {data?.files
                                                              ?.length > 0
                                                              ? data?.files?.map(
                                                                  (
                                                                    filesData,
                                                                    index
                                                                  ) => {
                                                                    return (
                                                                      <>
                                                                        <span
                                                                          className={
                                                                            styles[
                                                                              "card"
                                                                            ]
                                                                          }
                                                                        >
                                                                          <Row>
                                                                            <Col
                                                                              lg={
                                                                                10
                                                                              }
                                                                              md={
                                                                                10
                                                                              }
                                                                              sm={
                                                                                12
                                                                              }
                                                                              className="d-flex gap-1"
                                                                            >
                                                                              <img
                                                                                src={
                                                                                  PdfIcon
                                                                                }
                                                                              />
                                                                              <span
                                                                                className={
                                                                                  styles[
                                                                                    "TitleFile"
                                                                                  ]
                                                                                }
                                                                              >
                                                                                {
                                                                                  filesData.name
                                                                                }
                                                                              </span>
                                                                            </Col>
                                                                            <Col
                                                                              lg={
                                                                                2
                                                                              }
                                                                              md={
                                                                                2
                                                                              }
                                                                              sm={
                                                                                12
                                                                              }
                                                                              className="d-flex justify-content-end align-items-center"
                                                                            >
                                                                              <img
                                                                                src={
                                                                                  redcrossIcon
                                                                                }
                                                                                width="15px"
                                                                                height="15px"
                                                                                onClick={() => {
                                                                                  CrossDocument(
                                                                                    index
                                                                                  );
                                                                                }}
                                                                              />
                                                                            </Col>
                                                                          </Row>
                                                                        </span>
                                                                      </>
                                                                    );
                                                                  }
                                                                )
                                                              : null}
                                                          </div>
                                                        </Col>
                                                      </Row>
                                                    </>
                                                  ) : data.selectedRadio ===
                                                    "2" ? (
                                                    <>
                                                      <Row
                                                        key={index + 5}
                                                        className="mt-3"
                                                      >
                                                        <Col
                                                          lg={12}
                                                          md={12}
                                                          sm={12}
                                                        >
                                                          <TextField
                                                            applyClass={
                                                              "AgendaTextField"
                                                            }
                                                            labelClass={
                                                              "d-none"
                                                            }
                                                            placeholder={t(
                                                              "Enter-url"
                                                            )}
                                                            name={
                                                              "UrlMainAgenda"
                                                            }
                                                            value={
                                                              data.urlFieldMain
                                                            }
                                                            change={(e) =>
                                                              handleMainAgendaAdditionalFieldChange(
                                                                index,
                                                                e
                                                              )
                                                            }
                                                          />
                                                        </Col>
                                                      </Row>
                                                    </>
                                                  ) : data.selectedRadio ===
                                                    "3" ? (
                                                    <>
                                                      <Row
                                                        key={index + 5}
                                                        className="mt-2"
                                                      >
                                                        <Col
                                                          lg={12}
                                                          md={12}
                                                          sm={12}
                                                        >
                                                          <TextField
                                                            applyClass={
                                                              "AgendaTextField"
                                                            }
                                                            labelClass={
                                                              "d-none"
                                                            }
                                                            placeholder={t(
                                                              "Enter-email-address-here"
                                                            )}
                                                            name={
                                                              "MainRequestContributorName"
                                                            }
                                                            value={
                                                              data.requestContributorURl
                                                            }
                                                            change={(e) => {
                                                              handleMainAgendaAdditionalFieldChangeRequestContributorURL(
                                                                index,
                                                                e
                                                              );
                                                            }}
                                                          />
                                                        </Col>
                                                      </Row>
                                                      <Row>
                                                        <Col
                                                          lg={12}
                                                          md={12}
                                                          sm={12}
                                                        >
                                                          <TextField
                                                            applyClass="text-area-create-resolution"
                                                            type="text"
                                                            as={"textarea"}
                                                            name={
                                                              "MainNoteReqContributor"
                                                            }
                                                            value={
                                                              data.MainNote
                                                            }
                                                            change={(e) =>
                                                              handleMainAgendaAdditionalMainReqNotes(
                                                                index,
                                                                e
                                                              )
                                                            }
                                                            rows="4"
                                                            placeholder={t(
                                                              "Enter-notes"
                                                            )}
                                                            required={true}
                                                            maxLength={500}
                                                          />
                                                        </Col>
                                                      </Row>
                                                    </>
                                                  ) : (
                                                    <>
                                                      <Row
                                                        key={index + 5}
                                                        className="mt-4 mb-2"
                                                      >
                                                        <Col
                                                          lg={12}
                                                          md={12}
                                                          sm={12}
                                                        >
                                                          <Dragger
                                                            {...props}
                                                            className={
                                                              styles[
                                                                "dragdrop_attachment_create_resolution"
                                                              ]
                                                            }
                                                          >
                                                            <Row>
                                                              <Col
                                                                lg={5}
                                                                md={5}
                                                                sm={12}
                                                                className="d-flex justify-content-end align-items-center"
                                                              >
                                                                <img
                                                                  src={
                                                                    DrapDropIcon
                                                                  }
                                                                  width={100}
                                                                  className={
                                                                    styles[
                                                                      "ClassImage"
                                                                    ]
                                                                  }
                                                                />
                                                              </Col>
                                                              <Col
                                                                lg={7}
                                                                md={7}
                                                                sm={12}
                                                              >
                                                                <Row className="mt-3">
                                                                  <Col
                                                                    lg={12}
                                                                    md={12}
                                                                    sm={12}
                                                                    className="d-flex justify-content-start"
                                                                  >
                                                                    <span
                                                                      className={
                                                                        styles[
                                                                          "ant-upload-text-Meetings"
                                                                        ]
                                                                      }
                                                                    >
                                                                      {t(
                                                                        "Drag-file-here"
                                                                      )}
                                                                    </span>
                                                                  </Col>
                                                                </Row>
                                                                <Row>
                                                                  <Col
                                                                    lg={12}
                                                                    md={12}
                                                                    sm={12}
                                                                    className="d-flex justify-content-start"
                                                                  >
                                                                    <span
                                                                      className={
                                                                        styles[
                                                                          "Choose_file_style-Meeting"
                                                                        ]
                                                                      }
                                                                    >
                                                                      {t(
                                                                        "The-following-file-formats-are"
                                                                      )}
                                                                    </span>
                                                                  </Col>
                                                                </Row>
                                                                <Row>
                                                                  <Col
                                                                    lg={12}
                                                                    md={12}
                                                                    sm={12}
                                                                    className="d-flex justify-content-start"
                                                                  >
                                                                    <span
                                                                      className={
                                                                        styles[
                                                                          "Choose_file_style-Meeting"
                                                                        ]
                                                                      }
                                                                    >
                                                                      {t(
                                                                        "Docx-ppt-pptx-xls-xlsx-jpeg-jpg-and-png"
                                                                      )}
                                                                    </span>
                                                                  </Col>
                                                                </Row>
                                                              </Col>
                                                            </Row>
                                                          </Dragger>
                                                        </Col>
                                                      </Row>
                                                    </>
                                                  )}
                                                </>
                                              ) : null}
                                            </section>
                                          </Col>
                                        </Row>
                                      </Col>
                                    </Row>

                                    {data.subAgenda.length > 0 &&
                                      data.subAgenda.map(
                                        (subAgendaData, subIndex) => {
                                          return (
                                            <>
                                              <Row
                                                key={subAgendaData.ID}
                                                className="mt-3"
                                              >
                                                <Col lg={1} md={1} sm={1}></Col>
                                                <Col
                                                  lg={11}
                                                  md={11}
                                                  sm={11}
                                                  className={
                                                    apllyLockOnParentAgenda(
                                                      index
                                                    ) ||
                                                    apllyLockOnSubAgenda(
                                                      index,
                                                      subIndex
                                                    )
                                                      ? styles[
                                                          "SubajendaBox_Inactive"
                                                        ]
                                                      : styles["SubajendaBox"]
                                                  }
                                                >
                                                  <Row>
                                                    <Col lg={1} md={1} sm={1}>
                                                      <section
                                                        className={
                                                          styles["backGorund"]
                                                        }
                                                      ></section>
                                                    </Col>
                                                    <Col
                                                      lg={11}
                                                      md={11}
                                                      sm={11}
                                                      className={
                                                        styles[
                                                          "SubAgendaSection"
                                                        ]
                                                      }
                                                    >
                                                      <Row className="mt-2 mb-2">
                                                        <Col
                                                          lg={5}
                                                          md={5}
                                                          sm={12}
                                                        >
                                                          <Row>
                                                            <Col
                                                              lg={12}
                                                              md={12}
                                                              sm={12}
                                                            >
                                                              <span
                                                                className={
                                                                  styles[
                                                                    "Meeting_subAgenda"
                                                                  ]
                                                                }
                                                              >
                                                                <span>
                                                                  {index + 1}.
                                                                </span>
                                                                <span>
                                                                  {subIndex + 1}
                                                                </span>{" "}
                                                                {t(
                                                                  "Sub-agenda-title"
                                                                )}{" "}
                                                                <span>
                                                                  {subIndex + 1}
                                                                </span>
                                                              </span>
                                                            </Col>
                                                          </Row>
                                                          <TextField
                                                            applyClass={
                                                              "AgendaTextField"
                                                            }
                                                            labelClass={
                                                              "d-none"
                                                            }
                                                            name={"SubTitle"}
                                                            disable={
                                                              apllyLockOnParentAgenda(
                                                                index
                                                              ) ||
                                                              apllyLockOnSubAgenda(
                                                                index,
                                                                subIndex
                                                              )
                                                                ? true
                                                                : false
                                                            }
                                                            placeholder={t(
                                                              "Sub-Agenda-title"
                                                            )}
                                                            value={
                                                              subAgendaData.SubTitle
                                                            }
                                                            change={(e) =>
                                                              handleSubAgendaTitleChange(
                                                                index,
                                                                subIndex,
                                                                e
                                                              )
                                                            }
                                                          />
                                                        </Col>
                                                        <Col
                                                          lg={3}
                                                          md={3}
                                                          sm={12}
                                                        >
                                                          <Row>
                                                            <Col
                                                              lg={12}
                                                              md={12}
                                                              sm={12}
                                                            >
                                                              <span
                                                                className={
                                                                  styles[
                                                                    "Meeting_subAgenda"
                                                                  ]
                                                                }
                                                              >
                                                                {t("Presenter")}
                                                              </span>
                                                            </Col>
                                                          </Row>
                                                          <Select
                                                            options={
                                                              SubAgendaoptions
                                                            }
                                                            value={
                                                              subAgendaData.selectedOption
                                                            }
                                                            onChange={(value) =>
                                                              handleSubAgendaSelectChange(
                                                                index,
                                                                subIndex,
                                                                value
                                                              )
                                                            }
                                                            isDisabled={
                                                              apllyLockOnParentAgenda(
                                                                index
                                                              ) ||
                                                              apllyLockOnSubAgenda(
                                                                index,
                                                                subIndex
                                                              )
                                                                ? true
                                                                : false
                                                            }
                                                          />
                                                        </Col>
                                                        <Col
                                                          sm={12}
                                                          md={4}
                                                          lg={4}
                                                          className="d-flex gap-4 justify-content-start align-items-center"
                                                        >
                                                          <Row>
                                                            <Col
                                                              lg={5}
                                                              md={5}
                                                              sm={5}
                                                            >
                                                              <Row>
                                                                <Col
                                                                  lg={12}
                                                                  md={12}
                                                                  sm={12}
                                                                >
                                                                  <span
                                                                    className={
                                                                      styles[
                                                                        "Meeting_subAgenda"
                                                                      ]
                                                                    }
                                                                  >
                                                                    {t(
                                                                      "Start-date"
                                                                    )}
                                                                  </span>
                                                                </Col>
                                                              </Row>
                                                              <DatePicker
                                                                arrowClassName="arrowClass"
                                                                containerClassName="containerClassTimePicker"
                                                                className="timePicker"
                                                                disableDayPicker
                                                                inputClass="inputTImeMeeting"
                                                                disabled={
                                                                  apllyLockOnParentAgenda(
                                                                    index
                                                                  ) ||
                                                                  apllyLockOnSubAgenda(
                                                                    index,
                                                                    subIndex
                                                                  )
                                                                    ? true
                                                                    : false
                                                                }
                                                                format="HH:mm A"
                                                                selected={
                                                                  subAgendaData.startDate
                                                                }
                                                                onChange={(
                                                                  date
                                                                ) =>
                                                                  handleSubAgendaStartDateChange(
                                                                    index,
                                                                    subIndex,
                                                                    date
                                                                  )
                                                                }
                                                                plugins={[
                                                                  <TimePicker
                                                                    hideSeconds
                                                                  />,
                                                                ]}
                                                              />
                                                            </Col>
                                                            <Col
                                                              lg={2}
                                                              md={2}
                                                              sm={2}
                                                              className="d-flex justify-content-center align-items-center"
                                                            >
                                                              <img
                                                                src={desh}
                                                                width="19.02px"
                                                              />
                                                            </Col>
                                                            <Col
                                                              lg={5}
                                                              md={5}
                                                              sm={5}
                                                            >
                                                              <Row>
                                                                <Col
                                                                  lg={12}
                                                                  md={12}
                                                                  sm={12}
                                                                >
                                                                  <span
                                                                    className={
                                                                      styles[
                                                                        "Meeting_subAgenda"
                                                                      ]
                                                                    }
                                                                  >
                                                                    {t(
                                                                      "End-date"
                                                                    )}
                                                                  </span>
                                                                </Col>
                                                              </Row>
                                                              <DatePicker
                                                                arrowClassName="arrowClass"
                                                                containerClassName="containerClassTimePicker"
                                                                className="timePicker"
                                                                disableDayPicker
                                                                inputClass="inputTImeMeeting"
                                                                disabled={
                                                                  apllyLockOnParentAgenda(
                                                                    index
                                                                  ) ||
                                                                  apllyLockOnSubAgenda(
                                                                    index,
                                                                    subIndex
                                                                  )
                                                                    ? true
                                                                    : false
                                                                }
                                                                format="HH:mm A"
                                                                selected={
                                                                  subAgendaData.endDate
                                                                }
                                                                onChange={(
                                                                  date
                                                                ) =>
                                                                  handleSubAgendaEndDateChange(
                                                                    index,
                                                                    subIndex,
                                                                    date
                                                                  )
                                                                }
                                                                plugins={[
                                                                  <TimePicker
                                                                    hideSeconds
                                                                  />,
                                                                ]}
                                                              />
                                                            </Col>
                                                          </Row>
                                                          <img
                                                            src={redcrossIcon}
                                                            height="25px"
                                                            width="25px"
                                                            className={
                                                              styles[
                                                                "RedCross_Icon_class_SubAgenda"
                                                              ]
                                                            }
                                                            onClick={() => {
                                                              apllyLockOnParentAgenda(
                                                                index
                                                              ) ||
                                                                handleCrossSubAjenda(
                                                                  index,
                                                                  subIndex
                                                                );
                                                            }}
                                                          />
                                                        </Col>
                                                      </Row>
                                                      <Row>
                                                        <Col
                                                          lg={12}
                                                          md={12}
                                                          sm={12}
                                                        >
                                                          <span
                                                            className={
                                                              styles[
                                                                "Show_More_Styles"
                                                              ]
                                                            }
                                                            onClick={() => {
                                                              apllyLockOnParentAgenda(
                                                                index
                                                              ) ||
                                                                handleSubMenuExpand(
                                                                  index,
                                                                  subIndex
                                                                );
                                                            }}
                                                          >
                                                            {subExpand
                                                              ? t(
                                                                  "Hide-details"
                                                                )
                                                              : t("Show-more")}
                                                          </span>
                                                        </Col>
                                                      </Row>
                                                      {/* Condition for Subajencda */}
                                                      {subexpandIndex ===
                                                        index &&
                                                      expandSubIndex ===
                                                        subIndex &&
                                                      subExpand ? (
                                                        <>
                                                          <Row className="mt-3">
                                                            <Col
                                                              lg={12}
                                                              md={12}
                                                              sm={12}
                                                            >
                                                              <span
                                                                className={
                                                                  styles[
                                                                    "Agenda_Heading"
                                                                  ]
                                                                }
                                                              >
                                                                {t(
                                                                  "Attachments"
                                                                )}
                                                              </span>
                                                            </Col>
                                                          </Row>
                                                          <Row className="mt-3">
                                                            <Col
                                                              lg={6}
                                                              md={6}
                                                              sm={6}
                                                            >
                                                              <Radio.Group
                                                                value={
                                                                  subAgendaData.subSelectRadio
                                                                }
                                                                onChange={(e) =>
                                                                  handleSubAgendaRadioChange(
                                                                    index,
                                                                    subIndex,
                                                                    e
                                                                  )
                                                                }
                                                                disabled={
                                                                  apllyLockOnParentAgenda(
                                                                    index
                                                                  ) ||
                                                                  apllyLockOnSubAgenda(
                                                                    index,
                                                                    subIndex
                                                                  )
                                                                    ? true
                                                                    : false
                                                                }
                                                              >
                                                                <Radio value="1">
                                                                  <span
                                                                    className={
                                                                      styles[
                                                                        "Radio_Button_options"
                                                                      ]
                                                                    }
                                                                  >
                                                                    {t(
                                                                      "Document"
                                                                    )}
                                                                  </span>
                                                                </Radio>
                                                                <Radio value="2">
                                                                  <span
                                                                    className={
                                                                      styles[
                                                                        "Radio_Button_options"
                                                                      ]
                                                                    }
                                                                  >
                                                                    {t("URL")}
                                                                  </span>
                                                                </Radio>
                                                                <Radio value="3">
                                                                  <span
                                                                    className={
                                                                      styles[
                                                                        "Radio_Button_options"
                                                                      ]
                                                                    }
                                                                  >
                                                                    {t(
                                                                      "Request from contributor"
                                                                    )}
                                                                  </span>
                                                                </Radio>
                                                              </Radio.Group>
                                                            </Col>
                                                            <Col
                                                              lg={6}
                                                              md={6}
                                                              sm={6}
                                                              className="d-flex justify-content-end gap-4 align-items-center"
                                                            >
                                                              <img
                                                                src={Key}
                                                                width="24.07px"
                                                                className="cursor-pointer"
                                                                height="24.09px"
                                                                onClick={
                                                                  apllyLockOnParentAgenda(
                                                                    index
                                                                  ) ||
                                                                  apllyLockOnSubAgenda(
                                                                    index,
                                                                    subIndex
                                                                  )
                                                                    ? ""
                                                                    : openAdvancePermissionModal
                                                                }
                                                              />
                                                              <img
                                                                src={Cast}
                                                                width="25.85px"
                                                                height="25.89px"
                                                                className="cursor-pointer"
                                                                onClick={
                                                                  apllyLockOnParentAgenda(
                                                                    index
                                                                  ) ||
                                                                  apllyLockOnSubAgenda(
                                                                    index,
                                                                    subIndex
                                                                  )
                                                                    ? ""
                                                                    : openVoteMOdal
                                                                }
                                                              />
                                                              <img
                                                                src={
                                                                  apllyLockOnParentAgenda(
                                                                    index
                                                                  )
                                                                    ? closedLocked
                                                                    : apllyLockOnSubAgenda(
                                                                        index,
                                                                        subIndex
                                                                      )
                                                                    ? DarkLock
                                                                    : Lock
                                                                }
                                                                width="18.87px"
                                                                height="26.72px"
                                                                className={
                                                                  apllyLockOnParentAgenda(
                                                                    index
                                                                  )
                                                                    ? styles[
                                                                        "lockBtn_inActive"
                                                                      ]
                                                                    : apllyLockOnSubAgenda(
                                                                        index,
                                                                        subIndex
                                                                      )
                                                                    ? styles[
                                                                        "lockBtn_inActive_coursor"
                                                                      ]
                                                                    : styles[
                                                                        "lockBtn"
                                                                      ]
                                                                }
                                                                onClick={() => {
                                                                  if (
                                                                    apllyLockOnParentAgenda(
                                                                      index
                                                                    )
                                                                  ) {
                                                                  } else {
                                                                    lockFunctionActiveSubMenus(
                                                                      index,
                                                                      subIndex
                                                                    );
                                                                  }
                                                                }}
                                                              />
                                                            </Col>
                                                          </Row>
                                                          {subAgendaData.subSelectRadio ===
                                                          "1" ? (
                                                            <>
                                                              <Row>
                                                                <Col
                                                                  lg={12}
                                                                  md={12}
                                                                  sm={12}
                                                                  className={
                                                                    styles[
                                                                      "SubAgendaDocScroller"
                                                                    ]
                                                                  }
                                                                >
                                                                  <Row>
                                                                    {subAgendaData
                                                                      ?.Subfiles
                                                                      ?.length >
                                                                    0
                                                                      ? subAgendaData?.Subfiles?.map(
                                                                          (
                                                                            subAgendaFiles,
                                                                            subAgendaFilesIndex
                                                                          ) => {
                                                                            return (
                                                                              <>
                                                                                <Col
                                                                                  lg={
                                                                                    3
                                                                                  }
                                                                                  md={
                                                                                    3
                                                                                  }
                                                                                  sm={
                                                                                    3
                                                                                  }
                                                                                  className="mt-2"
                                                                                >
                                                                                  <section
                                                                                    className={
                                                                                      styles[
                                                                                        "cardSubAgenda"
                                                                                      ]
                                                                                    }
                                                                                  >
                                                                                    <Row className="mt-2">
                                                                                      <Col
                                                                                        lg={
                                                                                          12
                                                                                        }
                                                                                        md={
                                                                                          12
                                                                                        }
                                                                                        sm={
                                                                                          12
                                                                                        }
                                                                                        className="d-flex gap-2 align-items-center"
                                                                                      >
                                                                                        <img
                                                                                          src={
                                                                                            PdfIcon
                                                                                          }
                                                                                          height="25.57px"
                                                                                          width="25.57px"
                                                                                        />
                                                                                        <span
                                                                                          className={
                                                                                            styles[
                                                                                              "SubagendaFilesName"
                                                                                            ]
                                                                                          }
                                                                                        >
                                                                                          {
                                                                                            subAgendaFiles.name
                                                                                          }
                                                                                        </span>
                                                                                      </Col>
                                                                                    </Row>
                                                                                  </section>
                                                                                </Col>
                                                                              </>
                                                                            );
                                                                          }
                                                                        )
                                                                      : null}
                                                                    <Col
                                                                      lg={12}
                                                                      md={12}
                                                                      sm={12}
                                                                    ></Col>
                                                                  </Row>
                                                                </Col>
                                                              </Row>
                                                            </>
                                                          ) : subAgendaData.subSelectRadio ===
                                                            "2" ? (
                                                            <>
                                                              <Row className="mt-2">
                                                                <Col
                                                                  lg={12}
                                                                  md={12}
                                                                  sm={12}
                                                                >
                                                                  <TextField
                                                                    labelClass={
                                                                      "d-none"
                                                                    }
                                                                    placeholder={t(
                                                                      "Enter-url"
                                                                    )}
                                                                    name={
                                                                      "SubAgendaUrlRadioField"
                                                                    }
                                                                    value={
                                                                      subAgendaData.SubAgendaUrlFieldRadio
                                                                    }
                                                                    change={(
                                                                      e
                                                                    ) =>
                                                                      handleSubAgendaUrlEnterUrlField(
                                                                        index,
                                                                        subIndex,
                                                                        e
                                                                      )
                                                                    }
                                                                  />
                                                                </Col>
                                                              </Row>
                                                            </>
                                                          ) : subAgendaData.subSelectRadio ===
                                                            "3" ? (
                                                            <>
                                                              <Row className="mt-2">
                                                                <Col
                                                                  lg={12}
                                                                  md={12}
                                                                  sm={12}
                                                                >
                                                                  <TextField
                                                                    labelClass={
                                                                      "d-none"
                                                                    }
                                                                    placeholder={
                                                                      "Enter-url"
                                                                    }
                                                                    name={
                                                                      "SubAgendaRequestContributorUrlField"
                                                                    }
                                                                    value={
                                                                      subAgendaData.subAgendarequestContributorUrl
                                                                    }
                                                                    change={(
                                                                      e
                                                                    ) => {
                                                                      handleSubAgendaRequestContributorEnterUrl(
                                                                        index,
                                                                        subIndex,
                                                                        e
                                                                      );
                                                                    }}
                                                                  />
                                                                </Col>
                                                              </Row>
                                                              <Row>
                                                                <Col
                                                                  lg={12}
                                                                  md={12}
                                                                  sm={12}
                                                                >
                                                                  <TextField
                                                                    applyClass="text-area-create-resolution"
                                                                    type="text"
                                                                    as={
                                                                      "textarea"
                                                                    }
                                                                    rows="4"
                                                                    placeholder={t(
                                                                      "Enter-notes"
                                                                    )}
                                                                    name={
                                                                      "SubAgendaRequestContributorEnterNotesFiled"
                                                                    }
                                                                    required={
                                                                      true
                                                                    }
                                                                    maxLength={
                                                                      500
                                                                    }
                                                                    value={
                                                                      subAgendaData.subAgendarequestContributorEnterNotes
                                                                    }
                                                                    change={(
                                                                      e
                                                                    ) =>
                                                                      handleSubAgendaRequestContributorEnterNote(
                                                                        index,
                                                                        subIndex,
                                                                        e
                                                                      )
                                                                    }
                                                                  />
                                                                </Col>
                                                              </Row>
                                                            </>
                                                          ) : (
                                                            <>
                                                              <Row className="mt-2">
                                                                <Col
                                                                  lg={12}
                                                                  md={12}
                                                                  sm={12}
                                                                >
                                                                  <Dragger
                                                                    {...Subprops}
                                                                    className={
                                                                      styles[
                                                                        "dragdrop_attachment_create_resolution"
                                                                      ]
                                                                    }
                                                                  >
                                                                    <Row>
                                                                      <Col
                                                                        lg={5}
                                                                        md={5}
                                                                        sm={12}
                                                                        className="d-flex justify-content-end align-items-center"
                                                                      >
                                                                        <img
                                                                          src={
                                                                            DrapDropIcon
                                                                          }
                                                                          width={
                                                                            100
                                                                          }
                                                                          className={
                                                                            styles[
                                                                              "ClassImage"
                                                                            ]
                                                                          }
                                                                        />
                                                                      </Col>
                                                                      <Col
                                                                        lg={7}
                                                                        md={7}
                                                                        sm={12}
                                                                      >
                                                                        <Row className="mt-3">
                                                                          <Col
                                                                            lg={
                                                                              12
                                                                            }
                                                                            md={
                                                                              12
                                                                            }
                                                                            sm={
                                                                              12
                                                                            }
                                                                            className="d-flex justify-content-start"
                                                                          >
                                                                            <span
                                                                              className={
                                                                                styles[
                                                                                  "ant-upload-text-Meetings"
                                                                                ]
                                                                              }
                                                                            >
                                                                              {t(
                                                                                "Drag-file-here"
                                                                              )}
                                                                            </span>
                                                                          </Col>
                                                                        </Row>
                                                                        <Row>
                                                                          <Col
                                                                            lg={
                                                                              12
                                                                            }
                                                                            md={
                                                                              12
                                                                            }
                                                                            sm={
                                                                              12
                                                                            }
                                                                            className="d-flex justify-content-start"
                                                                          >
                                                                            <span
                                                                              className={
                                                                                styles[
                                                                                  "Choose_file_style-Meeting"
                                                                                ]
                                                                              }
                                                                            >
                                                                              {t(
                                                                                "The-following-file-formats-are"
                                                                              )}
                                                                            </span>
                                                                          </Col>
                                                                        </Row>
                                                                        <Row>
                                                                          <Col
                                                                            lg={
                                                                              12
                                                                            }
                                                                            md={
                                                                              12
                                                                            }
                                                                            sm={
                                                                              12
                                                                            }
                                                                            className="d-flex justify-content-start"
                                                                          >
                                                                            <span
                                                                              className={
                                                                                styles[
                                                                                  "Choose_file_style-Meeting"
                                                                                ]
                                                                              }
                                                                            >
                                                                              {t(
                                                                                "Docx-ppt-pptx-xls-xlsx-jpeg-jpg-and-png"
                                                                              )}
                                                                            </span>
                                                                          </Col>
                                                                        </Row>
                                                                      </Col>
                                                                    </Row>
                                                                  </Dragger>
                                                                </Col>
                                                              </Row>
                                                            </>
                                                          )}
                                                        </>
                                                      ) : null}
                                                    </Col>
                                                  </Row>
                                                </Col>
                                              </Row>
                                            </>
                                          );
                                        }
                                      )}

                                    {/* sub Ajenda Button */}
                                    <Row className="mt-3">
                                      <Col lg={12} md={12} sm={12}>
                                        <Button
                                          text={
                                            <>
                                              <Row>
                                                <Col
                                                  lg={12}
                                                  md={12}
                                                  sm={12}
                                                  className="d-flex justify-content-center gap-2 align-items-center"
                                                >
                                                  <img
                                                    src={plusFaddes}
                                                    height="10.77px"
                                                    width="10.77px"
                                                  />
                                                  <span
                                                    className={
                                                      styles["Add_Agen_Heading"]
                                                    }
                                                  >
                                                    {t("Add-sub-agenda")}
                                                  </span>
                                                </Col>
                                              </Row>
                                            </>
                                          }
                                          className={styles["AddMoreBtnAgenda"]}
                                          onClick={() => {
                                            addSubAjendaRows(index);
                                          }}
                                        />
                                      </Col>
                                    </Row>
                                  </div>
                                )}
                              </Draggable>
                              {/* Line Seperator */}
                              <Row className="mt-3">
                                <Col lg={12} md={12} sm={12}>
                                  <img
                                    src={line}
                                    className={styles["LineStyles"]}
                                  />
                                </Col>
                              </Row>
                            </>
                          );
                        })
                      : null}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </Col>
          </Row>
        </DragDropContext>
        {/* Seperator For Footer */}
        <Row className="mt-3">
          <Col lg={12} md={12} sm={12}>
            <Button
              text={
                <>
                  <Row>
                    <Col
                      lg={12}
                      md={12}
                      sm={12}
                      className="d-flex justify-content-center gap-2 align-items-center"
                    >
                      <img src={plusFaddes} height="10.77px" width="10.77px" />
                      <span className={styles["Add_Agen_Heading"]}>
                        {t("Add-agenda")}
                      </span>
                    </Col>
                  </Row>
                </>
              }
              className={styles["AddMoreBtnAgenda"]}
              onClick={addRow}
            />
          </Col>
        </Row>
        <Row className="mt-5">
          <Col
            lg={12}
            md={12}
            sm={12}
            className="d-flex justify-content-end gap-2"
          >
            <Button
              text={t("Import-previous-agenda")}
              className={styles["Agenda_Buttons"]}
              onClick={handlePreviousAgenda}
            />
            <Button text={t("Cancel")} className={styles["Agenda_Buttons"]} />
            <Button
              text={t("Save-and-Next")}
              className={styles["Save_Agenda_btn"]}
            />
          </Col>
        </Row>
      </section>
      {NewMeetingreducer.agendaItemRemoved && (
        <AgenItemremovedModal
          setRows={setRows}
          setSubajendaRemoval={setSubajendaRemoval}
          agendaItemRemovedIndex={agendaItemRemovedIndex}
        />
      )}
      {NewMeetingreducer.mainAgendaItemRemoved && (
        <MainAjendaItemRemoved
          mainAgendaRemovalIndex={mainAgendaRemovalIndex}
          rows={rows}
          setRows={setRows}
        />
      )}
      {NewMeetingreducer.advancePermissionModal && <AdvancePersmissionModal />}
      {NewMeetingreducer.advancePermissionConfirmation && (
        <PermissionConfirmation />
      )}
      {NewMeetingreducer.voteAgendaModal && <VoteModal />}
      {NewMeetingreducer.voteConfirmationModal && <VoteModalConfirm />}
      {NewMeetingreducer.importPreviousAgendaModal && <ImportPrevious />}
    </>
  );
};

export default Agenda;
