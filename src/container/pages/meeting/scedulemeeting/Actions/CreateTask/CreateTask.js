import React, { useState } from "react";
import styles from "./CreateTask.module.css";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Col, Row } from "react-bootstrap";
import { Button, TextField } from "../../../../../../components/elements";
import Select from "react-select";
import { message, Upload } from "antd";
import DrapDropIcon from "../../../../../../assets/images/DrapDropIcon.svg";
import profile from "../../../../../../assets/images/newprofile.png";
import tick from "../../../../../../assets/images/PNG tick.png";
import PDFIcon from "../../../../../../assets/images/pdf_icon.svg";
import RedCrossIcon from "../../../../../../assets/images/CrossIcon.svg";
import { style } from "@mui/system";
import { validateInput } from "../../../../../../commen/functions/regex";
import UnsavedActions from "../UnsavedActionModal/UnsavedActions";
import { showUnsavedActionsModal } from "../../../../../../store/actions/NewMeetingActions";

const CreateTask = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { Dragger } = Upload;
  const { NewMeetingreducer } = useSelector((state) => state);
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectThird, setselectThird] = useState(null);
  const [taskAttachments, setTaskAttachments] = useState([]);
  const [error, seterror] = useState(false);
  const [createTaskDetails, setcreateTaskDetails] = useState({
    ActionsToTake: "",
    SelectMember: 0,
    SelectAgenda: 0,
  });

  const props = {
    name: "file",
    // action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
    multiple: true,
    showUploadList: false,
    onChange(data) {
      const { status } = data.file;
      setTaskAttachments([...taskAttachments, data.file.originFileObj]);
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
    customRequest() {},
  };

  const optionsParticipants = [
    {
      value: "Particiapnts",
      label: (
        <>
          <Row>
            <Col lg={12} md={12} sm={12} className="d-flex gap-2">
              <img
                src={profile}
                height="17px"
                width="17px"
                className={styles["ProfileImages"]}
              />
              <span className={styles["Namepartipants"]}>Ethan Anderson</span>
            </Col>
          </Row>
        </>
      ),
    },
  ];

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const handleSelectThird = (option) => {
    setselectThird(option);
  };

  // React select tick option handled
  const CustomOption = ({ innerProps, label, isSelected }) => (
    <div {...innerProps} className={styles["option"]}>
      {console.log(label, "labellabellabel")}
      <Row>
        <Col lg={12} md={12} sm={12} className={styles["OverAll_padding"]}>
          <Row className="mt-2">
            <Col lg={12} md={12} sm={12} className="d-flex gap-2">
              <span className={styles["label_Styles"]}>{label}</span>
              {isSelected && <img src={tick} width={25} />}
            </Col>

            <span className={styles["BottomLine"]}></span>
          </Row>
        </Col>
      </Row>
    </div>
  );

  // For Third Select Options
  const CustomOptionThird = ({ innerProps, label, isSelected }) => (
    <div {...innerProps} className={styles["option"]}>
      {console.log(label, "labellabellabel")}
      <Row>
        <Col lg={12} md={12} sm={12} className={styles["OverAll_padding"]}>
          <Row className="mt-2">
            <Col lg={12} md={12} sm={12} className="d-flex gap-2">
              <span className={styles["label_Styles"]}>{label}</span>
              {isSelected && <img src={tick} width={25} />}
            </Col>

            <span className={styles["BottomLine"]}></span>
          </Row>
        </Col>
      </Row>
    </div>
  );

  const options = [
    {
      value: "Intrdocution",
      label: (
        <>
          <Row>
            <Col lg={12} md={12} sm={12}>
              <span className={styles["Options_classs_contributors"]}>
                {t("Intrdocution")}
              </span>
            </Col>
          </Row>
        </>
      ),
    },
    {
      value: "CeoReport",
      label: (
        <>
          <Row>
            <Col lg={12} md={12} sm={12}>
              <span className={styles["Options_classs_contributors"]}>
                {t("Ceo-report")}
              </span>
            </Col>
          </Row>
        </>
      ),
    },
    {
      value: "Financesummary",
      label: (
        <>
          <Row>
            <Col lg={12} md={12} sm={12}>
              <span className={styles["Options_classs_contributors"]}>
                {t("Finance-summary")}
              </span>
            </Col>
          </Row>
        </>
      ),
    },
    {
      value: "Functionalreview",
      label: (
        <>
          <Row>
            <Col lg={12} md={12} sm={12}>
              <span className={styles["Options_classs_contributors"]}>
                {t("Functional-review")}
              </span>
            </Col>
          </Row>
        </>
      ),
    },
    {
      value: "Closingreport",
      label: (
        <>
          <Row>
            <Col lg={12} md={12} sm={12}>
              <span className={styles["Options_classs_contributors"]}>
                {t("Closing-report")}
              </span>
            </Col>
          </Row>
        </>
      ),
    },
  ];

  const TwoOptions = [
    { value: "Outstanding", label: "Outstanding" },
    { value: "Completed", label: "Completed" },
  ];

  const removeFileFunction = (index) => {
    const updateFile = [...taskAttachments];
    updateFile.splice(index, 1);
    setTaskAttachments(updateFile);
  };

  const HandleChange = (e, index) => {
    let name = e.target.name;
    let value = e.target.value;
    if (name === "ActionsToTake") {
      let valueCheck = validateInput(value);
      if (valueCheck !== "") {
        setcreateTaskDetails({
          ...createTaskDetails,
          ActionsToTake: valueCheck,
        });
      } else {
        setcreateTaskDetails({
          ...createTaskDetails,
          ActionsToTake: "",
        });
      }
    }
  };

  const saveButtonFunc = () => {
    seterror(true);
  };

  const handleSelectMember = (e) => {
    setcreateTaskDetails({
      ...createTaskDetails,
      SelectMember: e.value,
    });
  };

  const handleUnsavedModal = () => {
    dispatch(showUnsavedActionsModal(true));
  };

  return (
    <section>
      <Row className="mt-4">
        <Col lg={12} md={12} sm={12}>
          <span className={styles["MainHeading_Create_Action"]}>
            ext ever since the 1500s, when an unknown printer took a galley of
            type and scrambled it to make a type specimen book. It has survived
            not only five centuries, but also the leap into electronic
            typesetting, remaining essentially unchanged. It was popularised in
            the 1960s with the release of Letraset sheets containing Lorem Ipsum
            passages, and more recently with desktop publishing software like
            Aldus PageMaker including versions of Lorem Ipsum.
          </span>
        </Col>
      </Row>
      <Row className="mt-1">
        <Col lg={12} md={12} sm={12}>
          <span className={styles["SubHeading"]}>
            {t("Actions-to-take")} <span className={styles["Steric"]}>*</span>
          </span>
        </Col>
      </Row>
      <Row>
        <Col lg={12} md={12} sm={12}>
          <TextField
            labelClass={"d-none"}
            change={HandleChange}
            name={"ActionsToTake"}
            value={createTaskDetails.ActionsToTake}
          />
          <Row>
            <Col>
              <p
                className={
                  error && createTaskDetails.ActionsToTake === ""
                    ? ` ${styles["errorMessage-inLogin"]} `
                    : `${styles["errorMessage-inLogin_hidden"]}`
                }
              >
                {t("Please-enter-action-to-take")}
              </p>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row className="mt-1">
        <Col lg={5} md={5} sm={5}>
          <Row>
            <Col lg={12} md={12} sm={12}>
              <span className={styles["SubHeading"]}>
                {t("Assigned-to")}
                <span className={styles["Steric"]}>*</span>
              </span>
            </Col>
          </Row>
          <Row>
            <Col lg={12} md={12} sm={12}>
              <Select
                options={optionsParticipants}
                onChange={handleSelectMember}
              />
            </Col>
          </Row>
        </Col>
        <Col lg={5} md={5} sm={5}>
          <Row>
            <Col lg={12} md={12} sm={12}>
              <span className={styles["SubHeading"]}>
                {t("Select-agenda")}
                <span className={styles["Steric"]}>*</span>
              </span>
            </Col>
          </Row>
          <Row>
            <Col lg={12} md={12} sm={12}>
              <Select
                options={options}
                value={selectedOption}
                onChange={handleOptionSelect}
                isSearchable={false}
                components={{
                  Option: CustomOption,
                }}
              />
            </Col>
          </Row>
        </Col>
        <Col lg={2} md={2} sm={2}>
          <Row>
            <Col lg={12} md={12} sm={12}>
              <span className={styles["SubHeading"]}>
                {t("Due-date")}
                <span className={styles["Steric"]}>*</span>
              </span>
            </Col>
          </Row>
          <Row>
            <Col lg={12} md={12} sm={12}>
              <Select
                options={TwoOptions}
                value={selectThird}
                onChange={handleSelectThird}
                isSearchable={false}
                components={{
                  Option: CustomOptionThird,
                }}
              />
            </Col>
          </Row>
        </Col>
        <Row>
          <Col>
            <p
              className={
                error &&
                createTaskDetails.SelectMember === 0 &&
                selectedOption === null
                  ? ` ${styles["errorMessage-inLogin"]} `
                  : `${styles["errorMessage-inLogin_hidden"]}`
              }
            >
              {t("Please-select-assignees")}
            </p>
          </Col>
        </Row>
      </Row>
      <Row className="mt-1">
        <Col lg={12} md={12} sm={12}>
          <span className={styles["SubHeading"]}>
            {t("Description")} <span className={styles["Steric"]}>*</span>
          </span>
        </Col>
      </Row>
      <Row className="mt-1">
        <Col lg={12} md={12} sm={12}>
          <TextField
            applyClass="Polls_meeting"
            type="text"
            as={"textarea"}
            maxLength={500}
            rows="4"
            placeholder={t("Description")}
            labelClass={"d-none"}
            required={true}
            name="committeedescription"
          />
        </Col>
      </Row>
      <Row className="mt-2">
        <Col lg={12} md={12} sm={12}>
          <Dragger
            {...props}
            className={styles["dragdrop_attachment_create_resolution"]}
          >
            {taskAttachments.length > 0 ? (
              <>
                <Row className="ps-3">
                  {taskAttachments.map((data, index) => {
                    console.log(data, "datadatadata");
                    return (
                      <>
                        <Col lg={3} md={3} sm={3}>
                          <section className={styles["box_For_File"]}>
                            <Row>
                              <Col lg={10} md={10} sm={10}>
                                <Row className="mt-2">
                                  <Col
                                    lg={12}
                                    md={12}
                                    sm={12}
                                    className="d-flex gap-2 align-items-center"
                                  >
                                    <img
                                      src={PDFIcon}
                                      height="31.57px"
                                      width="31.57px"
                                    />
                                    <span className={styles["FileName"]}>
                                      {data.name}
                                    </span>
                                  </Col>
                                </Row>
                              </Col>
                              <Col
                                lg={2}
                                md={2}
                                sm={2}
                                className="d-flex align-items-center justify-content-start mt-1"
                              >
                                <img
                                  src={RedCrossIcon}
                                  height="20.76px"
                                  width="20.76px"
                                  className={styles["CrossIconClass"]}
                                  onClick={() => {
                                    removeFileFunction(index);
                                  }}
                                />
                              </Col>
                            </Row>
                          </section>
                        </Col>
                      </>
                    );
                  })}
                </Row>
              </>
            ) : (
              <>
                <Row>
                  <Col
                    lg={5}
                    md={5}
                    sm={12}
                    className="d-flex justify-content-end align-items-center"
                  >
                    <img
                      src={DrapDropIcon}
                      width={100}
                      className={styles["ClassImage"]}
                    />
                  </Col>
                  <Col lg={7} md={7} sm={12}>
                    <Row className="mt-3">
                      <Col
                        lg={12}
                        md={12}
                        sm={12}
                        className="d-flex justify-content-start"
                      >
                        <span className={styles["ant-upload-text-Meetings"]}>
                          {t("Drag-file-here")}
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
                        <span className={styles["Choose_file_style-Meeting"]}>
                          {t("The-following-file-formats-are")}
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
                        <span className={styles["Choose_file_style-Meeting"]}>
                          {t("Docx-ppt-pptx-xls-xlsx-jpeg-jpg-and-png")}
                        </span>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </>
            )}
          </Dragger>
        </Col>
      </Row>

      <Row className="mt-3">
        <Col
          lg={12}
          md={12}
          sm={12}
          className="d-flex justify-content-end gap-2"
        >
          <Button
            text={"Cancel"}
            className={styles["Cancel_Button_Polls_meeting"]}
            onClick={handleUnsavedModal}
          />
          <Button
            text={"Save"}
            className={styles["Save_Button_Polls_meeting"]}
            onClick={saveButtonFunc}
          />
        </Col>
      </Row>
      {NewMeetingreducer.unsavedActions && <UnsavedActions />}
    </section>
  );
};

export default CreateTask;
