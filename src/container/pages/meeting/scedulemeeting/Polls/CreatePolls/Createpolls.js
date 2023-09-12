import React, { useState } from "react";
import styles from "./CreatePolls.module.css";
import { Button, TextField } from "../../../../../../components/elements";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Col, Row } from "react-bootstrap";
import { regexOnlyForNumberNCharacters } from "../../../../../../commen/functions/regex";
import WhiteCrossIcon from "../../../../../../assets/images/PollCrossIcon.svg";
import plusFaddes from "../../../../../../assets/images/NewBluePLus.svg";

const Createpolls = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { NewMeetingreducer } = useSelector((state) => state);
  const [options, setOptions] = useState([
    {
      name: 1,
      value: "",
    },
    {
      name: 2,
      value: "",
    },
    {
      name: 3,
      value: "",
    },
  ]);

  const [open, setOpen] = useState({
    flag: false,
    message: "",
  });

  const HandleCancelFunction = (index) => {
    let optionscross = [...options];
    optionscross.splice(index, 1);
    setOptions(optionscross);
  };

  const HandleOptionChange = (e) => {
    let name = parseInt(e.target.name);
    let newValue = e.target.value;
    let valueCheck = regexOnlyForNumberNCharacters(newValue);
    setOptions((prevState) =>
      prevState.map((item) => {
        return item.name === name ? { ...item, value: valueCheck } : item;
      })
    );
  };

  const allValuesNotEmpty = options.every((item) => item.value !== "");

  const addNewRow = () => {
    console.log("iam clicked");
    if (options.length > 1) {
      if (allValuesNotEmpty) {
        let lastIndex = options.length - 1;
        if (options[lastIndex].value != "") {
          const randomNumber = Math.floor(Math.random() * 100) + 1;
          let newOptions = { name: randomNumber, value: "" };
          setOptions([...options, newOptions]);
        }
      } else {
        setOpen({
          flag: true,
          message: t("Please-fill-options"),
        });
      }
    } else {
      setOpen({
        flag: true,
        message: t("Please-fill-options"),
      });
    }
  };

  return (
    <section>
      <Row>
        <Col lg={6} md={6} sm={6}>
          <Row className="mt-5">
            <Col lg={12} md={12} sm={12}>
              <span className={styles["Title_heading"]}>
                {t("Title")} <span className={styles["steric"]}>*</span>
              </span>
            </Col>
          </Row>
          <Row className="mt-1">
            <Col lg={12} md={12} sm={12}>
              <TextField labelClass={"d-none"} />
            </Col>
          </Row>
          <Row className="mt-2">
            <Col lg={12} md={12} sm={12}>
              <span className={styles["Title_heading"]}>
                {t("Options")} <span className={styles["steric"]}>*</span>
              </span>
            </Col>
          </Row>

          <Row>
            <Col lg={12} md={12} sm={12}>
              {options.length > 0
                ? options.map((data, index) => {
                    return (
                      <>
                        {index <= 1 ? (
                          <Row key={index} className="mt-2">
                            <Col lg={12} md={12} sm={12}>
                              <span className="position-relative">
                                <TextField
                                  placeholder={
                                    "Option" + " " + parseInt(index + 1)
                                  }
                                  applyClass={"PollingCreateModal"}
                                  labelClass="d-none"
                                  name={data.name}
                                  maxLength={500}
                                  value={data.value}
                                  change={(e) => HandleOptionChange(e)}
                                />
                              </span>
                            </Col>
                          </Row>
                        ) : (
                          <Row key={index} className="mt-2">
                            <Col lg={12} md={12} sm={12}>
                              <span className="position-relative">
                                <TextField
                                  placeholder={
                                    "Option" + " " + parseInt(index + 1)
                                  }
                                  applyClass={"PollingCreateModal"}
                                  labelClass="d-none"
                                  name={data.name}
                                  value={data.value}
                                  maxLength={500}
                                  change={(e) => HandleOptionChange(e)}
                                  inputicon={
                                    <img
                                      src={WhiteCrossIcon}
                                      width="31.76px"
                                      height="31.76px"
                                      onClick={() =>
                                        HandleCancelFunction(index)
                                      }
                                      className={
                                        styles["Cross-icon-Create_poll"]
                                      }
                                    />
                                  }
                                  iconClassName={
                                    styles["polling_Options_backGround"]
                                  }
                                />
                              </span>
                            </Col>
                          </Row>
                        )}
                      </>
                    );
                  })
                : null}
              <Row className="mt-2">
                <Col lg={12} md={12} sm={12}>
                  <Button
                    text={
                      <>
                        <Row>
                          <Col lg={12} md={12} sm={12} className="d-flex gap-2">
                            <img
                              src={plusFaddes}
                              width="15.87px"
                              height="15.87px"
                            />
                            <span className={styles["Add_Button_Heading"]}>
                              {t("Add-another-field")}
                            </span>
                          </Col>
                        </Row>
                      </>
                    }
                    onClick={addNewRow}
                    className={styles["Add_another_options"]}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
        <Col lg={6} md={6} sm={6}></Col>
      </Row>
    </section>
  );
};

export default Createpolls;
