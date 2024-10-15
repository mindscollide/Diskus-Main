import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import Newprofile from "../../../assets/images/newprofile.png";
import { Paper } from "@mui/material";
import {
  TextField,
  Button,
  Checkbox,
  SelectBox,
  InputSearchFilter,
} from "./../../../components/elements";
import styles from "./UpdateCommittee.module.css";
import CrossIcon from "../../../assets/images/CrossIcon.svg";
import { useState } from "react";
import Committee from "../../../container/Committee/Committee";
const UpdateCommittee = () => {
  const [viewUpdateCommittee, setViewUpdateCommittee] = useState(true);
  const { t } = useTranslation();

  const closebtn = async () => {
    setViewUpdateCommittee(false);
  };
  return (
    <>
      {viewUpdateCommittee ? (
        <>
          {" "}
          <Container className=" color-5a5a5a">
            <Row className="mt-3">
              <Col
                lg={12}
                md={12}
                sm={12}
                className="d-flex justify-content-start "
              >
                <span className={styles["Update-Committee-Heading"]}>
                  {t("Upadate-committee")}
                </span>
              </Col>
            </Row>
            <Row className="mt-2">
              <Col lg={12} md={12} sm={12}>
                <Paper className={styles["Update-Committee-paper"]}>
                  <Row>
                    <Col lg={12} md={12} sm={12}>
                      <Row>
                        <Col lg={8} md={8} sm={8}>
                          <Row>
                            <Col lg={12} md={12} sm={12}>
                              <span
                                className={
                                  styles["details-class-Update-Committee"]
                                }
                              >
                                {t(" Details")}
                              </span>
                            </Col>
                          </Row>

                          <Row>
                            <Col
                              lg={12}
                              md={12}
                              sm={12}
                              className="CreateMeetingInput"
                            >
                              <TextField
                                applyClass="form-control2"
                                type="text"
                                placeholder={t("Task-title")}
                                required={true}
                              />
                            </Col>
                          </Row>
                          <Row>
                            <Col
                              lg={12}
                              md={12}
                              sm={12}
                              className="CreateMeetingInput "
                            >
                              <TextField
                                applyClass="text-area-create-group"
                                type="text"
                                as={"textarea"}
                                rows="4"
                                placeholder={t("Description")}
                                required={true}
                                // className={styles["Height-of-textarea"]
                              />
                            </Col>
                          </Row>

                          <Row className="mt-1">
                            <Col
                              lg={6}
                              md={6}
                              sm={6}
                              className="UpdateCheckbox  d-flex justify-content-start"
                            >
                              <Checkbox
                                className="SearchCheckbox "
                                name="IsChat"
                                label={t("Create-Talk-Group")}
                                // checked={createMeeting.IsChat}
                                // onChange={onChange}
                                classNameDiv="checkboxParentClass"
                              ></Checkbox>
                            </Col>
                            <Col lg={2} md={2} sm={2}></Col>
                            <Col
                              lg={4}
                              md={4}
                              sm={4}
                              className="CreateMeetingReminder m-0 select-participant-box"
                            >
                              <SelectBox
                                name="Participant"
                                placeholder={t("Committee Type")}
                                // option={participantOptions}
                                // value={participantRoleName}
                                // change={assigntRoleAttendies}
                              />
                            </Col>
                          </Row>
                          {/* this is members shown area on which the scroll will applied */}
                          <Row>
                            <Col
                              lg={12}
                              md={12}
                              sm={12}
                              className={styles["scroll-bar-Update-Committee"]}
                            >
                              <Row className="mt-1">
                                <Col lg={12} md={12} sm={12}>
                                  <span
                                    className={
                                      styles["Update-Committee-Head-Heading"]
                                    }
                                  >
                                    {t("Executive Member")}
                                  </span>
                                </Col>
                              </Row>

                              {/* Group Heads */}
                              <Row className="mt-2">
                                <Col lg={4} md={4} sm={12}>
                                  <Row>
                                    <Col lg={3} md={3} sm={12}>
                                      <img
                                        draggable="false"
                                        src={Newprofile}
                                        width={50}
                                      />
                                    </Col>
                                    <Col
                                      lg={7}
                                      md={7}
                                      sm={12}
                                      className={
                                        styles["Executive-Member-info"]
                                      }
                                    >
                                      <Row>
                                        <Col
                                          lg={12}
                                          md={12}
                                          sm={12}
                                          className="mt-1"
                                        >
                                          <Row>
                                            <Col lg={12} md={12} sm={12}>
                                              <span
                                                className={
                                                  styles[
                                                    "name-Update-Committee"
                                                  ]
                                                }
                                              >
                                                Waleed Jabbar
                                              </span>
                                            </Col>
                                          </Row>
                                          <Row>
                                            <Col lg={12} md={12} sm={12}>
                                              <span
                                                className={
                                                  styles[
                                                    "Designation-Update-Committee"
                                                  ]
                                                }
                                              >
                                                Designer
                                              </span>
                                            </Col>
                                          </Row>
                                          <Row>
                                            <Col lg={12} md={12} sm={12}>
                                              <span
                                                className={
                                                  styles[
                                                    "email-Update-Committee"
                                                  ]
                                                }
                                              >
                                                <a>Waleed@gmail.com</a>
                                              </span>
                                            </Col>
                                          </Row>
                                        </Col>
                                      </Row>
                                    </Col>
                                    <Col
                                      lg={2}
                                      md={2}
                                      sm={12}
                                      className="mt-0  d-flex justify-content-center"
                                    >
                                      <img
                                        draggable="false"
                                        src={CrossIcon}
                                        width={18}
                                      />
                                    </Col>
                                  </Row>
                                </Col>
                                <Col lg={4} md={4} sm={12}>
                                  <Row>
                                    <Col lg={3} md={3} sm={12}>
                                      <img
                                        draggable="false"
                                        src={Newprofile}
                                        width={50}
                                      />
                                    </Col>
                                    <Col
                                      lg={7}
                                      md={7}
                                      sm={12}
                                      className={
                                        styles["Executive-Member-info"]
                                      }
                                    >
                                      <Row>
                                        <Col
                                          lg={12}
                                          md={12}
                                          sm={12}
                                          className="mt-1"
                                        >
                                          <Row>
                                            <Col lg={12} md={12} sm={12}>
                                              <span
                                                className={
                                                  styles[
                                                    "name-Update-Committee"
                                                  ]
                                                }
                                              >
                                                Waleed Jabbar
                                              </span>
                                            </Col>
                                          </Row>
                                          <Row>
                                            <Col lg={12} md={12} sm={12}>
                                              <span
                                                className={
                                                  styles[
                                                    "Designation-Update-Committee"
                                                  ]
                                                }
                                              >
                                                Designer
                                              </span>
                                            </Col>
                                          </Row>
                                          <Row>
                                            <Col lg={12} md={12} sm={12}>
                                              <span
                                                className={
                                                  styles[
                                                    "email-Update-Committee"
                                                  ]
                                                }
                                              >
                                                <a>Waleed@gmail.com</a>
                                              </span>
                                            </Col>
                                          </Row>
                                        </Col>
                                      </Row>
                                    </Col>
                                    <Col
                                      lg={2}
                                      md={2}
                                      sm={12}
                                      className="mt-0  d-flex justify-content-center"
                                    >
                                      <img
                                        draggable="false"
                                        src={CrossIcon}
                                        width={18}
                                      />
                                    </Col>
                                  </Row>
                                </Col>
                                <Col lg={4} md={4} sm={12}>
                                  <Row>
                                    <Col lg={3} md={3} sm={12}>
                                      <img
                                        draggable="false"
                                        src={Newprofile}
                                        width={50}
                                      />
                                    </Col>
                                    <Col
                                      lg={7}
                                      md={7}
                                      sm={12}
                                      className={
                                        styles["Executive-Member-info"]
                                      }
                                    >
                                      <Row>
                                        <Col
                                          lg={12}
                                          md={12}
                                          sm={12}
                                          className="mt-1"
                                        >
                                          <Row>
                                            <Col lg={12} md={12} sm={12}>
                                              <span
                                                className={
                                                  styles[
                                                    "name-Update-Committee"
                                                  ]
                                                }
                                              >
                                                Waleed Jabbar
                                              </span>
                                            </Col>
                                          </Row>
                                          <Row>
                                            <Col lg={12} md={12} sm={12}>
                                              <span
                                                className={
                                                  styles[
                                                    "Designation-Update-Committee"
                                                  ]
                                                }
                                              >
                                                Designer
                                              </span>
                                            </Col>
                                          </Row>
                                          <Row>
                                            <Col lg={12} md={12} sm={12}>
                                              <span
                                                className={
                                                  styles[
                                                    "email-Update-Committee"
                                                  ]
                                                }
                                              >
                                                <a>Waleed@gmail.com</a>
                                              </span>
                                            </Col>
                                          </Row>
                                        </Col>
                                      </Row>
                                    </Col>
                                    <Col
                                      lg={2}
                                      md={2}
                                      sm={12}
                                      className="mt-0  d-flex justify-content-center"
                                    >
                                      <img
                                        draggable="false"
                                        src={CrossIcon}
                                        width={18}
                                      />
                                    </Col>
                                  </Row>
                                </Col>
                              </Row>

                              <Row className="mt-3">
                                <Col lg={12} md={12} sm={12}>
                                  <span
                                    className={
                                      styles["members-Upadate-Committee-page"]
                                    }
                                  >
                                    {t("Regular Memebers")}
                                  </span>
                                </Col>
                              </Row>
                              <Row className="mt-2">
                                <Col lg={4} md={4} sm={4}>
                                  <Row>
                                    <Col lg={3} md={3} sm={12}>
                                      <img
                                        draggable="false"
                                        src={Newprofile}
                                        width={50}
                                      />
                                    </Col>
                                    <Col
                                      lg={7}
                                      md={7}
                                      sm={12}
                                      className={
                                        styles["Executive-Member-info"]
                                      }
                                    >
                                      <Row>
                                        <Col
                                          lg={12}
                                          md={12}
                                          sm={12}
                                          className="mt-1"
                                        >
                                          <Row>
                                            <Col lg={12} md={12} sm={12}>
                                              <span
                                                className={
                                                  styles[
                                                    "name-Update-Committee"
                                                  ]
                                                }
                                              >
                                                Waleed Jabbar
                                              </span>
                                            </Col>
                                          </Row>
                                          <Row>
                                            <Col lg={12} md={12} sm={12}>
                                              <span
                                                className={
                                                  styles[
                                                    "Designation-Update-Committee"
                                                  ]
                                                }
                                              >
                                                Designer
                                              </span>
                                            </Col>
                                          </Row>
                                          <Row>
                                            <Col lg={12} md={12} sm={12}>
                                              <span
                                                className={
                                                  styles[
                                                    "email-Update-Committee"
                                                  ]
                                                }
                                              >
                                                <a>Waleed@gmail.com</a>
                                              </span>
                                            </Col>
                                          </Row>
                                        </Col>
                                      </Row>
                                    </Col>
                                    <Col
                                      lg={2}
                                      md={2}
                                      sm={12}
                                      className="mt-0  d-flex justify-content-center"
                                    >
                                      <img
                                        draggable="false"
                                        src={CrossIcon}
                                        width={18}
                                      />
                                    </Col>
                                  </Row>
                                </Col>
                                <Col lg={4} md={4} sm={4}>
                                  <Row>
                                    <Col lg={3} md={3} sm={12}>
                                      <img
                                        draggable="false"
                                        src={Newprofile}
                                        width={50}
                                      />
                                    </Col>
                                    <Col
                                      lg={7}
                                      md={7}
                                      sm={12}
                                      className={
                                        styles["Executive-Member-info"]
                                      }
                                    >
                                      <Row>
                                        <Col
                                          lg={12}
                                          md={12}
                                          sm={12}
                                          className="mt-1"
                                        >
                                          <Row>
                                            <Col lg={12} md={12} sm={12}>
                                              <span
                                                className={
                                                  styles[
                                                    "name-Update-Committee"
                                                  ]
                                                }
                                              >
                                                Waleed Jabbar
                                              </span>
                                            </Col>
                                          </Row>
                                          <Row>
                                            <Col lg={12} md={12} sm={12}>
                                              <span
                                                className={
                                                  styles[
                                                    "Designation-Update-Committee"
                                                  ]
                                                }
                                              >
                                                Designer
                                              </span>
                                            </Col>
                                          </Row>
                                          <Row>
                                            <Col lg={12} md={12} sm={12}>
                                              <span
                                                className={
                                                  styles[
                                                    "email-Update-Committee"
                                                  ]
                                                }
                                              >
                                                <a>Waleed@gmail.com</a>
                                              </span>
                                            </Col>
                                          </Row>
                                        </Col>
                                      </Row>
                                    </Col>
                                    <Col
                                      lg={2}
                                      md={2}
                                      sm={12}
                                      className="mt-0  d-flex justify-content-center"
                                    >
                                      <img
                                        draggable="false"
                                        src={CrossIcon}
                                        width={18}
                                      />
                                    </Col>
                                  </Row>
                                </Col>
                                <Col lg={4} md={4} sm={4}>
                                  <Row>
                                    <Col lg={3} md={3} sm={12}>
                                      <img
                                        draggable="false"
                                        src={Newprofile}
                                        width={50}
                                      />
                                    </Col>
                                    <Col
                                      lg={7}
                                      md={7}
                                      sm={12}
                                      className={
                                        styles["Executive-Member-info"]
                                      }
                                    >
                                      <Row>
                                        <Col
                                          lg={12}
                                          md={12}
                                          sm={12}
                                          className="mt-1"
                                        >
                                          <Row>
                                            <Col lg={12} md={12} sm={12}>
                                              <span
                                                className={
                                                  styles[
                                                    "name-Update-Committee"
                                                  ]
                                                }
                                              >
                                                Waleed Jabbar
                                              </span>
                                            </Col>
                                          </Row>
                                          <Row>
                                            <Col lg={12} md={12} sm={12}>
                                              <span
                                                className={
                                                  styles[
                                                    "Designation-Update-Committee"
                                                  ]
                                                }
                                              >
                                                Designer
                                              </span>
                                            </Col>
                                          </Row>
                                          <Row>
                                            <Col lg={12} md={12} sm={12}>
                                              <span
                                                className={
                                                  styles[
                                                    "email-Update-Committee"
                                                  ]
                                                }
                                              >
                                                <a>Waleed@gmail.com</a>
                                              </span>
                                            </Col>
                                          </Row>
                                        </Col>
                                      </Row>
                                    </Col>
                                    <Col
                                      lg={2}
                                      md={2}
                                      sm={12}
                                      className="mt-0  d-flex justify-content-center"
                                    >
                                      <img
                                        draggable="false"
                                        src={CrossIcon}
                                        width={18}
                                      />
                                    </Col>
                                  </Row>
                                </Col>
                              </Row>
                              <Row className="mt-3">
                                <Col lg={4} md={4} sm={4}>
                                  <Row>
                                    <Col lg={3} md={3} sm={12}>
                                      <img
                                        draggable="false"
                                        src={Newprofile}
                                        width={50}
                                      />
                                    </Col>
                                    <Col
                                      lg={7}
                                      md={7}
                                      sm={12}
                                      className={
                                        styles["Executive-Member-info"]
                                      }
                                    >
                                      <Row>
                                        <Col
                                          lg={12}
                                          md={12}
                                          sm={12}
                                          className="mt-1"
                                        >
                                          <Row>
                                            <Col lg={12} md={12} sm={12}>
                                              <span
                                                className={
                                                  styles[
                                                    "name-Update-Committee"
                                                  ]
                                                }
                                              >
                                                Waleed Jabbar
                                              </span>
                                            </Col>
                                          </Row>
                                          <Row>
                                            <Col lg={12} md={12} sm={12}>
                                              <span
                                                className={
                                                  styles[
                                                    "Designation-Update-Committee"
                                                  ]
                                                }
                                              >
                                                Designer
                                              </span>
                                            </Col>
                                          </Row>
                                          <Row>
                                            <Col lg={12} md={12} sm={12}>
                                              <span
                                                className={
                                                  styles[
                                                    "email-Update-Committee"
                                                  ]
                                                }
                                              >
                                                <a>Waleed@gmail.com</a>
                                              </span>
                                            </Col>
                                          </Row>
                                        </Col>
                                      </Row>
                                    </Col>
                                    <Col
                                      lg={2}
                                      md={2}
                                      sm={12}
                                      className="mt-0  d-flex justify-content-center"
                                    >
                                      <img
                                        draggable="false"
                                        src={CrossIcon}
                                        width={18}
                                      />
                                    </Col>
                                  </Row>
                                </Col>
                                <Col lg={4} md={4} sm={4}>
                                  <Row>
                                    <Col lg={3} md={3} sm={12}>
                                      <img
                                        draggable="false"
                                        src={Newprofile}
                                        width={50}
                                      />
                                    </Col>
                                    <Col
                                      lg={7}
                                      md={7}
                                      sm={12}
                                      className={
                                        styles["Executive-Member-info"]
                                      }
                                    >
                                      <Row>
                                        <Col
                                          lg={12}
                                          md={12}
                                          sm={12}
                                          className="mt-1"
                                        >
                                          <Row>
                                            <Col lg={12} md={12} sm={12}>
                                              <span
                                                className={
                                                  styles[
                                                    "name-Update-Committee"
                                                  ]
                                                }
                                              >
                                                Waleed Jabbar
                                              </span>
                                            </Col>
                                          </Row>
                                          <Row>
                                            <Col lg={12} md={12} sm={12}>
                                              <span
                                                className={
                                                  styles[
                                                    "Designation-Update-Committee"
                                                  ]
                                                }
                                              >
                                                Designer
                                              </span>
                                            </Col>
                                          </Row>
                                          <Row>
                                            <Col lg={12} md={12} sm={12}>
                                              <span
                                                className={
                                                  styles[
                                                    "email-Update-Committee"
                                                  ]
                                                }
                                              >
                                                <a>Waleed@gmail.com</a>
                                              </span>
                                            </Col>
                                          </Row>
                                        </Col>
                                      </Row>
                                    </Col>
                                    <Col
                                      lg={2}
                                      md={2}
                                      sm={12}
                                      className="mt-0  d-flex justify-content-center"
                                    >
                                      <img
                                        draggable="false"
                                        src={CrossIcon}
                                        width={18}
                                      />
                                    </Col>
                                  </Row>
                                </Col>
                                <Col lg={4} md={4} sm={4}>
                                  <Row>
                                    <Col lg={3} md={3} sm={12}>
                                      <img
                                        draggable="false"
                                        src={Newprofile}
                                        width={50}
                                      />
                                    </Col>
                                    <Col
                                      lg={7}
                                      md={7}
                                      sm={12}
                                      className={
                                        styles["Executive-Member-info"]
                                      }
                                    >
                                      <Row>
                                        <Col
                                          lg={12}
                                          md={12}
                                          sm={12}
                                          className="mt-1"
                                        >
                                          <Row>
                                            <Col lg={12} md={12} sm={12}>
                                              <span
                                                className={
                                                  styles[
                                                    "name-Update-Committee"
                                                  ]
                                                }
                                              >
                                                Waleed Jabbar
                                              </span>
                                            </Col>
                                          </Row>
                                          <Row>
                                            <Col lg={12} md={12} sm={12}>
                                              <span
                                                className={
                                                  styles[
                                                    "Designation-Update-Committee"
                                                  ]
                                                }
                                              >
                                                Designer
                                              </span>
                                            </Col>
                                          </Row>
                                          <Row>
                                            <Col lg={12} md={12} sm={12}>
                                              <span
                                                className={
                                                  styles[
                                                    "email-Update-Committee"
                                                  ]
                                                }
                                              >
                                                <a>Waleed@gmail.com</a>
                                              </span>
                                            </Col>
                                          </Row>
                                        </Col>
                                      </Row>
                                    </Col>
                                    <Col
                                      lg={2}
                                      md={2}
                                      sm={12}
                                      className="mt-0  d-flex justify-content-center"
                                    >
                                      <img
                                        draggable="false"
                                        src={CrossIcon}
                                        width={18}
                                      />
                                    </Col>
                                  </Row>
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                          {/* till this point the scroll will be applied  */}
                        </Col>
                        <Col lg={1} md={1} sm={1}></Col>
                        <Col lg={3} md={3} sm={3}>
                          <Row>
                            <Col lg={12} md={12} sm={12}>
                              <Row>
                                <Col lg={12} md={12} sm={12}>
                                  <span
                                    className={
                                      styles[
                                        "Addmembers-class-Update-Committee"
                                      ]
                                    }
                                  >
                                    {t("Add Members")}
                                  </span>
                                </Col>
                              </Row>
                              <Row>
                                <Col
                                  md={12}
                                  lg={12}
                                  sm={12}
                                  className={
                                    styles["Column-Update-Committee-Style"]
                                  }
                                >
                                  <InputSearchFilter />
                                </Col>
                              </Row>
                              <Row>
                                <Col
                                  lg={9}
                                  md={9}
                                  sm={9}
                                  className="CreateMeetingReminder  select-participant-box   "
                                >
                                  <SelectBox
                                    name="Participant"
                                    placeholder={t("Regular Members ")}
                                  />
                                </Col>
                                <Col
                                  lg={3}
                                  md={3}
                                  sm={3}
                                  className="mt-2 d-flex justify-content-start p-0 "
                                >
                                  <Button
                                    className={
                                      styles["ADD-Update-Committee-btn"]
                                    }
                                    text={t(" ADD")}
                                  />
                                </Col>
                              </Row>
                              {/* from this point add members are starting */}
                              <Row>
                                <Col
                                  lg={12}
                                  md={12}
                                  sm={12}
                                  className={
                                    styles[
                                      "scrollbar-addmember-Update-Committee"
                                    ]
                                  }
                                >
                                  <Row className="mt-4">
                                    <Col lg={12} md={12} sm={12}>
                                      <Row className="d-flex gap-2">
                                        <Col lg={2} md={2} sm={12}>
                                          <img
                                            draggable="false"
                                            src={Newprofile}
                                            width={50}
                                          />
                                        </Col>

                                        <Col
                                          lg={7}
                                          md={7}
                                          sm={12}
                                          className={
                                            styles[
                                              "Update-Committee-head-info-Add-Members"
                                            ]
                                          }
                                        >
                                          <Row className="mt-1">
                                            <Col lg={12} md={12} sm={12}>
                                              <span
                                                className={
                                                  styles[
                                                    "name-Update-Committee"
                                                  ]
                                                }
                                              >
                                                Waleed Jabbar
                                              </span>
                                            </Col>
                                          </Row>
                                          <Row>
                                            <Col lg={12} md={12} sm={12}>
                                              <span
                                                className={
                                                  styles[
                                                    "Designation-Update-Committee"
                                                  ]
                                                }
                                              >
                                                Designer
                                              </span>
                                            </Col>
                                          </Row>
                                          <Row>
                                            <Col lg={12} md={12} sm={12}>
                                              <span
                                                className={
                                                  styles[
                                                    "email-Update-Committee"
                                                  ]
                                                }
                                              >
                                                <a>Waleed@gmail.com</a>
                                              </span>
                                            </Col>
                                          </Row>
                                        </Col>
                                        <Col
                                          lg={2}
                                          md={2}
                                          sm={12}
                                          className="mt-2 "
                                        >
                                          <Checkbox
                                            // checked={rememberEmail}
                                            classNameDiv=""
                                            // onChange={rememberChangeEmail}
                                            className={styles["RememberEmail"]}
                                          />
                                        </Col>
                                      </Row>
                                    </Col>
                                  </Row>
                                  <Row className="mt-4">
                                    <Col lg={12} md={12} sm={12}>
                                      <Row className="d-flex gap-2">
                                        <Col lg={2} md={2} sm={12}>
                                          <img
                                            draggable="false"
                                            src={Newprofile}
                                            width={50}
                                          />
                                        </Col>

                                        <Col
                                          lg={7}
                                          md={7}
                                          sm={12}
                                          className={
                                            styles[
                                              "Update-Committee-head-info-Add-Members"
                                            ]
                                          }
                                        >
                                          <Row className="mt-1">
                                            <Col lg={12} md={12} sm={12}>
                                              <span
                                                className={
                                                  styles[
                                                    "name-Update-Committee"
                                                  ]
                                                }
                                              >
                                                Waleed Jabbar
                                              </span>
                                            </Col>
                                          </Row>
                                          <Row>
                                            <Col lg={12} md={12} sm={12}>
                                              <span
                                                className={
                                                  styles[
                                                    "Designation-Update-Committee"
                                                  ]
                                                }
                                              >
                                                Designer
                                              </span>
                                            </Col>
                                          </Row>
                                          <Row>
                                            <Col lg={12} md={12} sm={12}>
                                              <span
                                                className={
                                                  styles[
                                                    "email-Update-Committee"
                                                  ]
                                                }
                                              >
                                                <a>Waleed@gmail.com</a>
                                              </span>
                                            </Col>
                                          </Row>
                                        </Col>
                                        <Col
                                          lg={2}
                                          md={2}
                                          sm={12}
                                          className="mt-2 "
                                        >
                                          <Checkbox
                                            // checked={rememberEmail}
                                            classNameDiv=""
                                            // onChange={rememberChangeEmail}
                                            className={styles["RememberEmail"]}
                                          />
                                        </Col>
                                      </Row>
                                    </Col>
                                  </Row>
                                  <Row className="mt-4">
                                    <Col lg={12} md={12} sm={12}>
                                      <Row className="d-flex gap-2">
                                        <Col lg={2} md={2} sm={12}>
                                          <img
                                            draggable="false"
                                            src={Newprofile}
                                            width={50}
                                          />
                                        </Col>

                                        <Col
                                          lg={7}
                                          md={7}
                                          sm={12}
                                          className={
                                            styles[
                                              "Update-Committee-head-info-Add-Members"
                                            ]
                                          }
                                        >
                                          <Row className="mt-1">
                                            <Col lg={12} md={12} sm={12}>
                                              <span
                                                className={
                                                  styles[
                                                    "name-Update-Committee"
                                                  ]
                                                }
                                              >
                                                Waleed Jabbar
                                              </span>
                                            </Col>
                                          </Row>
                                          <Row>
                                            <Col lg={12} md={12} sm={12}>
                                              <span
                                                className={
                                                  styles[
                                                    "Designation-Update-Committee"
                                                  ]
                                                }
                                              >
                                                Designer
                                              </span>
                                            </Col>
                                          </Row>
                                          <Row>
                                            <Col lg={12} md={12} sm={12}>
                                              <span
                                                className={
                                                  styles[
                                                    "email-Update-Committee"
                                                  ]
                                                }
                                              >
                                                <a>Waleed@gmail.com</a>
                                              </span>
                                            </Col>
                                          </Row>
                                        </Col>
                                        <Col
                                          lg={2}
                                          md={2}
                                          sm={12}
                                          className="mt-2 "
                                        >
                                          <Checkbox
                                            // checked={rememberEmail}
                                            classNameDiv=""
                                            // onChange={rememberChangeEmail}
                                            className={styles["RememberEmail"]}
                                          />
                                        </Col>
                                      </Row>
                                    </Col>
                                  </Row>
                                  <Row className="mt-4">
                                    <Col lg={12} md={12} sm={12}>
                                      <Row className="d-flex gap-2">
                                        <Col lg={2} md={2} sm={12}>
                                          <img
                                            draggable="false"
                                            src={Newprofile}
                                            width={50}
                                          />
                                        </Col>

                                        <Col
                                          lg={7}
                                          md={7}
                                          sm={12}
                                          className={
                                            styles[
                                              "Update-Committee-head-info-Add-Members"
                                            ]
                                          }
                                        >
                                          <Row className="mt-1">
                                            <Col lg={12} md={12} sm={12}>
                                              <span
                                                className={
                                                  styles[
                                                    "name-Update-Committee"
                                                  ]
                                                }
                                              >
                                                Waleed Jabbar
                                              </span>
                                            </Col>
                                          </Row>
                                          <Row>
                                            <Col lg={12} md={12} sm={12}>
                                              <span
                                                className={
                                                  styles[
                                                    "Designation-Update-Committee"
                                                  ]
                                                }
                                              >
                                                Designer
                                              </span>
                                            </Col>
                                          </Row>
                                          <Row>
                                            <Col lg={12} md={12} sm={12}>
                                              <span
                                                className={
                                                  styles[
                                                    "email-Update-Committee"
                                                  ]
                                                }
                                              >
                                                <a>Waleed@gmail.com</a>
                                              </span>
                                            </Col>
                                          </Row>
                                        </Col>
                                        <Col
                                          lg={2}
                                          md={2}
                                          sm={12}
                                          className="mt-2 "
                                        >
                                          <Checkbox
                                            // checked={rememberEmail}
                                            classNameDiv=""
                                            // onChange={rememberChangeEmail}
                                            className={styles["RememberEmail"]}
                                          />
                                        </Col>
                                      </Row>
                                    </Col>
                                  </Row>
                                  <Row className="mt-4">
                                    <Col lg={12} md={12} sm={12}>
                                      <Row className="d-flex gap-2">
                                        <Col lg={2} md={2} sm={12}>
                                          <img
                                            draggable="false"
                                            src={Newprofile}
                                            width={50}
                                          />
                                        </Col>

                                        <Col
                                          lg={7}
                                          md={7}
                                          sm={12}
                                          className={
                                            styles[
                                              "Update-Committee-head-info-Add-Members"
                                            ]
                                          }
                                        >
                                          <Row className="mt-1">
                                            <Col lg={12} md={12} sm={12}>
                                              <span
                                                className={
                                                  styles[
                                                    "name-Update-Committee"
                                                  ]
                                                }
                                              >
                                                Waleed Jabbar
                                              </span>
                                            </Col>
                                          </Row>
                                          <Row>
                                            <Col lg={12} md={12} sm={12}>
                                              <span
                                                className={
                                                  styles[
                                                    "Designation-Update-Committee"
                                                  ]
                                                }
                                              >
                                                Designer
                                              </span>
                                            </Col>
                                          </Row>
                                          <Row>
                                            <Col lg={12} md={12} sm={12}>
                                              <span
                                                className={
                                                  styles[
                                                    "email-Update-Committee"
                                                  ]
                                                }
                                              >
                                                <a>Waleed@gmail.com</a>
                                              </span>
                                            </Col>
                                          </Row>
                                        </Col>
                                        <Col
                                          lg={2}
                                          md={2}
                                          sm={12}
                                          className="mt-2 "
                                        >
                                          <Checkbox
                                            // checked={rememberEmail}
                                            classNameDiv=""
                                            // onChange={rememberChangeEmail}
                                            className={styles["RememberEmail"]}
                                          />
                                        </Col>
                                      </Row>
                                    </Col>
                                  </Row>
                                </Col>
                              </Row>
                              {/* at this point it is ending  */}
                            </Col>
                          </Row>
                          <Row>
                            <Col
                              lg={12}
                              md={12}
                              sm={12}
                              className="d-flex justify-content-end gap-3 mt-4"
                            >
                              <Button
                                className={
                                  styles["Cancell-updatecommittee-btn"]
                                }
                                text={t("Cancel")}
                                onClick={closebtn}
                              />
                              <Button
                                className={styles["Create-updatecommittee-btn"]}
                                text={t("Update")}
                              />
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Paper>
              </Col>
            </Row>
          </Container>
        </>
      ) : (
        <Committee />
      )}
    </>
  );
};

export default UpdateCommittee;
