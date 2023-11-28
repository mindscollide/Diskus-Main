import React, { useState } from "react";
import styles from "./AdvancePermissionModal.module.css";
import { Modal, Button, Switch } from "../../../../../../components/elements";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import {
  showAdvancePermissionConfirmation,
  showAdvancePermissionModal,
} from "../../../../../../store/actions/NewMeetingActions";
import { Col, Row } from "react-bootstrap";
import { Breadcrumb, Layout, Menu, theme } from "antd";
import PlusIcon from "../../../../../../assets/images/SVGPLUS.svg";
import PDF from "../../../../../../assets/images/pdf_icon.svg";
import Minus from "../../../../../../assets/images/SVGMINUS.svg";
import profile from "../../../../../../assets/images/newprofile.png";
import Key from "../../../../../../assets/images/KEY.svg";
import { style } from "@mui/system";
const AdvancePersmissionModal = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { SubMenu } = Menu;
  const { Sider } = Layout;
  const { NewMeetingreducer } = useSelector((state) => state);
  const [expandmenuIntroduction, setExpandmenuIntroduction] = useState(false);
  const [sidebarindex, setSidebarindex] = useState(0);
  const [subAgendaExpand, setsubAgendaExpand] = useState(false);
  // Initialize state for members data
  const [memberData, setMemberData] = useState([]);
  const [sidebarOptions, setsidebarOptions] = useState([
    {
      title: t("Introduction"),
      IntroductionFiles: [
        {
          name: "Axis.Diskus.Com",
        },
        {
          name: "Axis.Diskus.Com",
        },
        {
          name: "Axis.Diskus.Com",
        },
        {
          name: "Axis.Diskus.Com",
        },
        {
          name: "Axis.Diskus.Com",
        },
      ],
      SubAgendaOptions: [
        { SubTitle: "Get New Agenda For You Knowledge and we are" },
      ],
    },
    {
      title: t("Ceo-report"),
      IntroductionFiles: [],
    },
    {
      title: t("Finance-summary"),
      IntroductionFiles: [],
    },
    {
      title: t("Functional-review"),
      IntroductionFiles: [],
    },
    {
      title: t("Closing-report"),
      IntroductionFiles: [],
    },
  ]);
  const options = [
    { value: "All", label: "All" },
    { value: "organizer", label: "organizer" },
    { value: "participant", label: "participant" },
    { value: "Agenda Contributor", label: "Agenda Contributor" },
  ];
  const [members, setMembers] = useState([
    {
      Name: "Saif Ul Islam",
    },
    {
      Name: "Owais Wajid Khan",
    },
    {
      Name: "Aun Naqvi",
    },
    {
      Name: "Ali Raza Mamdani",
    },
    {
      Name: "Syed Ali Raza",
    },
    {
      Name: "Huzeifa Jahangir",
    },
  ]);
  const OpenConfirmation = () => {
    dispatch(showAdvancePermissionModal(false));
    dispatch(showAdvancePermissionConfirmation(true));
  };

  const handleExpandIntroduction = (index) => {
    setSidebarindex(index);
    setExpandmenuIntroduction(!expandmenuIntroduction);
  };

  const subAgendaExpandFunction = () => {
    setsubAgendaExpand(!subAgendaExpand);
  };

  const handleSwitchChange = (index, field) => {
    // Create a copy of the memberData array
    const updatedMemberData = [...memberData];
    // Update the specific field for the member at the given index
    updatedMemberData[index][field] = !updatedMemberData[index][field];
    // Update the state with the new data
    setMemberData(updatedMemberData);
  };

  return (
    <>
      <section>
        <Modal
          show={NewMeetingreducer.advancePermissionModal}
          setShow={dispatch(showAdvancePermissionModal)}
          modalFooterClassName={"d-block"}
          modalParentClass={"AgendaPermissionModal"}
          className={styles["AgendaPermissionModal"]}
          modalBodyClassName={styles["modal_body"]}
          modalHeaderClassName={styles["modal_header"]}
          onHide={() => {
            dispatch(showAdvancePermissionModal(false));
          }}
          size={"lg"}
          ModalTitle={
            <>
              <Row className={styles["OverAll_padding"]}>
                <Col
                  lg={7}
                  md={7}
                  sm={12}
                  className="d-flex gap-2 align-items-center"
                >
                  <img src={Key} height="23.51px" width="23.49px" />
                  <span className={styles["Advance_setting_heading"]}>
                    {t("Advanced-permission-settings")}
                  </span>
                </Col>
                <Col lg={5} md={5} sm={5}>
                  <Row>
                    <Col
                      lg={2}
                      md={2}
                      sm={12}
                      className="d-flex align-items-center"
                    >
                      <span
                        className={styles["Show_Heading_Advance_persmission"]}
                      >
                        {t("Show") + ":"}
                      </span>
                    </Col>
                    <Col lg={10} md={10} sm={10}>
                      <Select
                        options={options}
                        classNamePrefix={"AdvancePermission"}
                        isSearchable={false}
                      />
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row>
                <Col lg={12} md={12} sm={12} className="m-0 p-0">
                  <span className={styles["Bottom_line"]}></span>
                </Col>
              </Row>
            </>
          }
          ModalBody={
            <>
              <Row>
                <Col lg={5} md={5} sm={12}>
                  <Row>
                    <Col lg={12} md={12} sm={12} className="ms-2 ">
                      <Row className="mt-4">
                        <Col lg={12} md={12} sm={12} className="d-flex ">
                          <span className={styles["Agenda_heading_Advance"]}>
                            {t("Agenda")}
                          </span>
                        </Col>
                      </Row>
                      <Row className="mt-2">
                        {sidebarOptions.length > 0
                          ? sidebarOptions.map((data, index) => {
                              const isLastItem =
                                index === sidebarOptions.length - 1;

                              return (
                                <>
                                  <Col lg={12} md={12} sm={12} className="mt-4">
                                    <section
                                      className={
                                        sidebarindex === index &&
                                        expandmenuIntroduction
                                          ? styles["SidebarSection_expanded"]
                                          : styles["SidebarSection"]
                                      }
                                    >
                                      <span
                                        className={
                                          styles["Heading_introductions"]
                                        }
                                      >
                                        <span>
                                          {index + 1}
                                          <span>.</span>
                                        </span>
                                        <span
                                          className={
                                            styles["Heading_introductions"]
                                          }
                                        >
                                          {data.title}
                                        </span>
                                      </span>

                                      <img
                                        src={
                                          sidebarindex === index &&
                                          expandmenuIntroduction === true
                                            ? Minus
                                            : PlusIcon
                                        }
                                        height="14px"
                                        width="14px"
                                        className={styles["Plus_icon-Class"]}
                                        onClick={() => {
                                          handleExpandIntroduction(index);
                                        }}
                                      />
                                    </section>
                                    <section
                                      className={
                                        sidebarindex === index &&
                                        expandmenuIntroduction
                                          ? styles["Background"]
                                          : styles["Hidden"]
                                      }
                                    >
                                      {sidebarindex === index &&
                                      expandmenuIntroduction === true ? (
                                        <>
                                          <Row className="mt-2">
                                            <Col lg={7} md={7} sm={7}>
                                              <Row>
                                                <Col
                                                  lg={12}
                                                  md={12}
                                                  sm={12}
                                                  className="d-flex gap-1"
                                                >
                                                  <img
                                                    src={profile}
                                                    height="19px"
                                                    width="19px"
                                                    className={
                                                      styles["Profile"]
                                                    }
                                                  />
                                                  <span
                                                    className={
                                                      styles["ParticipantName"]
                                                    }
                                                  >
                                                    Salman Memon
                                                  </span>
                                                </Col>
                                              </Row>
                                            </Col>
                                            <Col
                                              lg={5}
                                              md={5}
                                              sm={5}
                                              className="d-flex align-items-center gap-1"
                                            >
                                              <span
                                                className={
                                                  styles["Times_styles"]
                                                }
                                              >
                                                12:15 PM
                                              </span>
                                              <span
                                                className={styles["minus_sign"]}
                                              ></span>
                                              <span
                                                className={
                                                  styles["Times_styles"]
                                                }
                                              >
                                                12:15 PM
                                              </span>
                                            </Col>
                                          </Row>
                                          <Row
                                            className={
                                              styles["tranisitionStyle"]
                                            }
                                          >
                                            {data.IntroductionFiles.map(
                                              (Filesdata, Filesindex) => {
                                                return (
                                                  <>
                                                    <Col
                                                      lg={4}
                                                      md={4}
                                                      sm={12}
                                                      className="flex-wrap my-1 text-center   d-flex justify-content-center"
                                                    >
                                                      <img
                                                        src={PDF}
                                                        height="38.57px"
                                                        width="38.57px"
                                                      />
                                                      <span
                                                        className={
                                                          styles[
                                                            "attachment_line"
                                                          ]
                                                        }
                                                      >
                                                        {Filesdata.name}
                                                      </span>
                                                    </Col>
                                                  </>
                                                );
                                              }
                                            )}
                                          </Row>
                                        </>
                                      ) : null}
                                      <Row className="mt-2">
                                        {data?.SubAgendaOptions?.map(
                                          (SubAgendaData, SubAgendaIndex) => {
                                            return (
                                              <>
                                                <Col
                                                  lg={1}
                                                  md={1}
                                                  sm={12}
                                                ></Col>
                                                <Col lg={11} md={11} sm={12}>
                                                  <section
                                                    className={
                                                      styles["SubAgendaBox"]
                                                    }
                                                  >
                                                    <span
                                                      className={
                                                        styles[
                                                          "UpperLineSubAgenda"
                                                        ]
                                                      }
                                                    ></span>
                                                    <section
                                                      className={
                                                        subAgendaExpand
                                                          ? styles[
                                                              "SidebarSectionSubAgendaActive"
                                                            ]
                                                          : styles[
                                                              "SidebarSectionSubAgenda"
                                                            ]
                                                      }
                                                    >
                                                      <span
                                                        className={
                                                          styles[
                                                            "Heading_introductions_Of_SubAgenda"
                                                          ]
                                                        }
                                                      >
                                                        <span>
                                                          {index}
                                                          <span>
                                                            .{SubAgendaData + 1}
                                                          </span>
                                                        </span>
                                                        <span
                                                          className={
                                                            styles[
                                                              "Heading_introductions_"
                                                            ]
                                                          }
                                                        >
                                                          {
                                                            SubAgendaData.SubTitle
                                                          }
                                                        </span>
                                                      </span>
                                                      <img
                                                        src={
                                                          subAgendaExpand
                                                            ? Minus
                                                            : PlusIcon
                                                        }
                                                        height="14px"
                                                        width="14px"
                                                        className={
                                                          styles[
                                                            "Plus_icon-Class"
                                                          ]
                                                        }
                                                        onClick={
                                                          subAgendaExpandFunction
                                                        }
                                                      />
                                                    </section>
                                                    {subAgendaExpand ? (
                                                      <>
                                                        <Row className="mt-2">
                                                          <section
                                                            className={
                                                              subAgendaExpand
                                                                ? styles[
                                                                    "SubAgendaBackground"
                                                                  ]
                                                                : styles[
                                                                    "Hidden"
                                                                  ]
                                                            }
                                                          >
                                                            <Col
                                                              lg={7}
                                                              md={7}
                                                              sm={7}
                                                            >
                                                              <Row>
                                                                <Col
                                                                  lg={12}
                                                                  md={12}
                                                                  sm={12}
                                                                  className="d-flex gap-1"
                                                                >
                                                                  <img
                                                                    src={
                                                                      profile
                                                                    }
                                                                    height="19px"
                                                                    width="19px"
                                                                    className={
                                                                      styles[
                                                                        "Profile"
                                                                      ]
                                                                    }
                                                                  />
                                                                  <span
                                                                    className={
                                                                      styles[
                                                                        "ParticipantName"
                                                                      ]
                                                                    }
                                                                  >
                                                                    Salman Memon
                                                                  </span>
                                                                </Col>
                                                              </Row>
                                                            </Col>
                                                            <Col
                                                              lg={5}
                                                              md={5}
                                                              sm={5}
                                                              className="d-flex align-items-center gap-1"
                                                            >
                                                              <span
                                                                className={
                                                                  styles[
                                                                    "Times_styles"
                                                                  ]
                                                                }
                                                              >
                                                                12:15 PM
                                                              </span>
                                                              <span
                                                                className={
                                                                  styles[
                                                                    "minus_sign"
                                                                  ]
                                                                }
                                                              ></span>
                                                              <span
                                                                className={
                                                                  styles[
                                                                    "Times_styles"
                                                                  ]
                                                                }
                                                              >
                                                                12:15 PM
                                                              </span>
                                                            </Col>
                                                          </section>
                                                        </Row>
                                                      </>
                                                    ) : null}
                                                  </section>
                                                </Col>
                                              </>
                                            );
                                          }
                                        )}
                                      </Row>
                                      {!isLastItem && (
                                        <span
                                          className={styles["Bottom_Line"]}
                                        ></span>
                                      )}
                                    </section>
                                  </Col>
                                </>
                              );
                            })
                          : null}
                      </Row>
                    </Col>
                  </Row>
                </Col>
                <Col lg={1} md={1} sm={12}>
                  <span className={styles["LineUpper"]}></span>
                </Col>
                <Col lg={6} md={6} sm={12}>
                  <Row>
                    <Col lg={12} md={12} sm={12}>
                      <Row className="mt-4 mb-4">
                        <Col lg={6} md={6} sm={6}>
                          <span
                            className={styles["All_Heading_Advance_permission"]}
                          >
                            {"All"}
                          </span>
                        </Col>
                        <Col lg={3} md={3} sm={3}>
                          <span
                            className={
                              styles["All_Heading_Advance_permission_View"]
                            }
                          >
                            {"View"}
                          </span>
                        </Col>
                        <Col lg={3} md={3} sm={3}>
                          <span
                            className={
                              styles["All_Heading_Advance_permission_View"]
                            }
                          >
                            {"Modify"}
                          </span>
                        </Col>
                      </Row>
                      <Row>
                        {members.map((data, index) => {
                          const isLastItem = index === members.length - 1;

                          return (
                            <>
                              <Col lg={6} md={6} sm={6} className="mt-3">
                                <Row>
                                  <Col lg={12} md={12} sm={12}>
                                    <span
                                      className={
                                        styles["Names_advance_permission"]
                                      }
                                    >
                                      {data.Name}
                                    </span>
                                  </Col>
                                </Row>
                              </Col>
                              <Col lg={3} md={3} sm={3}>
                                <Row>
                                  <Col lg={12} md={12} sm={12} className="m-3">
                                    <Switch
                                      className={
                                        styles[
                                          "AdvancePermission_switches_View"
                                        ]
                                      }
                                      onChange={() =>
                                        handleSwitchChange(index, "switchView")
                                      }
                                    />
                                  </Col>
                                </Row>
                              </Col>
                              <Col lg={3} md={3} sm={3}>
                                <Row>
                                  <Col lg={12} md={12} sm={12} className="m-3">
                                    <Switch
                                      className={
                                        styles["AdvancePermission_switches"]
                                      }
                                      onChange={() =>
                                        handleSwitchChange(index, "switch")
                                      }
                                    />
                                  </Col>
                                </Row>
                              </Col>
                              {!isLastItem && (
                                <Row>
                                  <Col lg={12} md={12} sm={12}>
                                    <span
                                      className={styles["Bottom_line_names"]}
                                    ></span>
                                  </Col>
                                </Row>
                              )}
                            </>
                          );
                        })}
                      </Row>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </>
          }
          ModalFooter={
            <>
              <Row>
                <Col
                  lg={12}
                  md={12}
                  sm={12}
                  className="d-flex justify-content-end gap-3 "
                >
                  <Button
                    text={t("Cancel")}
                    className={styles["Cancel_Button"]}
                    onClick={OpenConfirmation}
                  />
                  <Button text={t("Save")} className={styles["Save_Button"]} />
                </Col>
              </Row>
            </>
          }
        />
      </section>
    </>
  );
};

export default AdvancePersmissionModal;
