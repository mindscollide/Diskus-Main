import React, { useEffect, useState } from "react";
import styles from "./AdvancePermissionModal.module.css";
import { Modal, Button, Switch } from "../../../../../../components/elements";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import {
  GetAllUserAgendaRightsApiFunc,
  SaveUserAttachmentsPermissionApiFunc,
  showAdvancePermissionConfirmation,
  showAdvancePermissionModal,
} from "../../../../../../store/actions/NewMeetingActions";
import { Col, Row } from "react-bootstrap";
import Key from "../../../../../../assets/images/KEY.svg";
const AdvancePersmissionModal = ({ setSelectedID, selectedID }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { NewMeetingreducer, MeetingAgendaReducer } = useSelector(
    (state) => state
  );
  const [expandmenuIntroduction, setExpandmenuIntroduction] = useState(false);
  const [sidebarindex, setSidebarindex] = useState(0);
  const [selectedRole, setSelectedRole] = useState("All");
  const [subAgendaExpand, setsubAgendaExpand] = useState(false);
  // Initialize state for members data
  const [memberData, setMemberData] = useState([
    {
      userName: "",
      canView: false,
      canModify: false,
    },
  ]);
  const [sidebarOptions, setsidebarOptions] = useState([]);
  const options = [
    { value: "All", label: "All" },
    { value: "organizer", label: "organizer" },
    { value: "participant", label: "participant" },
    { value: "Agenda Contributor", label: "Agenda Contributor" },
  ];
  const [members, setMembers] = useState([]);

  useEffect(() => {
    return () => {
      setSelectedID(0);
      setExpandmenuIntroduction(false);
      setSidebarindex(0);
      setSelectedRole("All");
      setsubAgendaExpand(false);
      setMemberData([
        {
          userName: "",
          canView: false,
          canModify: false,
        },
      ]);
      setsidebarOptions([]);
    };
  }, []);

  const OpenConfirmation = () => {
    // dispatch(showAdvancePermissionModal(false));
    dispatch(showAdvancePermissionConfirmation(true));
  };

  const handleExpandIntroduction = (index) => {
    setSidebarindex(index);
    setExpandmenuIntroduction(!expandmenuIntroduction);
  };

  const subAgendaExpandFunction = () => {
    setsubAgendaExpand(!subAgendaExpand);
  };

  const handleSwitchChangeView = (checked, data, index) => {
    setMembers((prev) => {
      return prev.map((memberdata, index) => {
        if (memberdata.userID === data.userID) {
          if (!checked) {
            return {
              ...memberdata,
              canView: checked,
              canModify: checked,
            };
          }
          return {
            ...memberdata,
            canView: checked,
          };
        }
        return memberdata;
      });
    });
  };

  const handleSwitchChangeModify = (checked, data, index) => {
    setMembers((prev) => {
      return prev.map((memberdata, index) => {
        if (memberdata.userID === data.userID) {
          if (checked) {
            return {
              ...memberdata,
              canView: checked,
              canModify: checked,
            };
          }
          if (!memberdata.canView) {
            return {
              ...memberdata,
              canModify: checked,
            };
          }
          return {
            ...memberdata,
            canModify: checked,
          };
        }
        return memberdata;
      });
    });
  };

  // Function to handle role selection
  const handleRoleSelect = (selectedOption) => {
    setSelectedRole(selectedOption.value);
  };

  //SideBar Options Click subAgenda
  const handleOptionsClickSideBar = (agendaID) => {
    setSelectedID(agendaID);
    let NewData = {
      AgendaID: agendaID,
    };
    dispatch(GetAllUserAgendaRightsApiFunc(navigate, t, NewData));
  };

  //SideBar Options Click MainAgenda
  const handleOptionsClickSideBarMainAgenda = (agendaID) => {
    setSelectedID(agendaID);
    let NewData = {
      AgendaID: agendaID,
    };
    dispatch(GetAllUserAgendaRightsApiFunc(navigate, t, NewData));
  };

  const handleSaveAdvancedPermissionModal = () => {
    let newarray = [];
    members.map((data, index) => {
      newarray.push({
        UserID: data.userID,
        CanView: data.canView,
        CanModify: data.canModify,
      });
    });
    let Data = {
      AgendaID: selectedID,
      UserAttachmentPermissions: newarray,
    };
    console.log(Data, "AgendaIDAgendaID");
    dispatch(SaveUserAttachmentsPermissionApiFunc(navigate, t, Data));
  };

  useEffect(() => {
    try {
      if (
        MeetingAgendaReducer.GetAdvanceMeetingAgendabyMeetingIDData !== null &&
        MeetingAgendaReducer.GetAdvanceMeetingAgendabyMeetingIDData !==
          undefined
      ) {
        let agendaListArry = [];
        MeetingAgendaReducer.GetAdvanceMeetingAgendabyMeetingIDData.agendaList.map(
          (agenda, index) => {
            agendaListArry.push(agenda);
          }
        );
        setsidebarOptions(agendaListArry);
      }
    } catch {}
  }, [MeetingAgendaReducer.GetAdvanceMeetingAgendabyMeetingIDData]);

  useEffect(() => {
    try {
      if (
        NewMeetingreducer.agendaRights !== null &&
        NewMeetingreducer.agendaRights !== undefined
      ) {
        if (NewMeetingreducer.agendaRights?.agendaUserRights?.length > 0) {
          let agendaUserRightsarray = [];
          let getUserrightsdetails =
            NewMeetingreducer.agendaRights.agendaUserRights;

          getUserrightsdetails.map((agendaRightsData, agendaRightsIndex) => {
            console.log(agendaRightsData, "agendaRightsDataagendaRightsData");
            agendaUserRightsarray.push({
              userName: agendaRightsData.userName,
              canView: agendaRightsData.canView,
              canModify: agendaRightsData.canModify,
              userRole: agendaRightsData.userRole,
              userID: agendaRightsData.userID,
            });
          });
          setMembers(agendaUserRightsarray);
        } else {
          setMembers([]);
        }
      }
    } catch {}
  }, [NewMeetingreducer.agendaRights]);

  return (
    <>
      <section>
        <Modal
          show={NewMeetingreducer.advancePermissionModal}
          setShow={dispatch(showAdvancePermissionModal)}
          modalFooterClassName={"d-block"}
          modalParentClass={"AgendaPermissionModal"}
          className={NewMeetingreducer.advancePermissionConfirmation ? styles["AgendaPermissionModalHide"] : styles["AgendaPermissionModal"] }
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
                  <img
                    src={Key}
                    height="23.51px"
                    width="23.49px"
                    className="cursor-pointer"
                  />
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
                        onChange={handleRoleSelect}
                        value={options.find(
                          (option) => option.value === selectedRole
                        )}
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
                              console.log(data, "sidebarOptionssidebarOptions");
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
                                        </span>{" "}
                                        <span
                                          className={
                                            Number(selectedID) ===
                                            Number(data.id)
                                              ? styles[
                                                  "Heading_introductions_active"
                                                ]
                                              : styles["Heading_introductions"]
                                          }
                                          onClick={() =>
                                            handleOptionsClickSideBarMainAgenda(
                                              data.id
                                            )
                                          }
                                        >
                                          {data.title}
                                        </span>
                                      </span>
                                    </section>
                                    <section
                                      className={
                                        sidebarindex === index &&
                                        expandmenuIntroduction
                                          ? styles["Background"]
                                          : styles["Hidden"]
                                      }
                                    >
                                      <Row className="mt-2">
                                        {data?.subAgenda?.map(
                                          (SubAgendaData, SubAgendaIndex) => {
                                            console.log(
                                              SubAgendaData,
                                              "SubAgendaDataSubAgendaData"
                                            );
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
                                                        <span
                                                          className={
                                                            Number(
                                                              selectedID
                                                            ) ===
                                                            Number(
                                                              SubAgendaData.subAgendaID
                                                            )
                                                              ? styles[
                                                                  "Heading_introductions_active"
                                                                ]
                                                              : styles[
                                                                  "Heading_introductions"
                                                                ]
                                                          }
                                                        >
                                                          {index + 1}.
                                                          {SubAgendaIndex + 1}{" "}
                                                          <span
                                                            onClick={() =>
                                                              handleOptionsClickSideBar(
                                                                SubAgendaData.subAgendaID
                                                              )
                                                            }
                                                          >
                                                            {
                                                              SubAgendaData.subTitle
                                                            }
                                                          </span>
                                                        </span>
                                                      </span>
                                                      {/* <img
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
                                                      /> */}
                                                    </section>
                                                    {/* {subAgendaExpand ? (
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
                                                    ) : null} */}
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
                        <Col
                          lg={12}
                          md={12}
                          sm={12}
                          className={
                            styles["Scroller_Advanced_Permission_Modal"]
                          }
                        >
                          <Row>
                            {members
                              .filter((member) => {
                                if (selectedRole === "All") {
                                  return true;
                                } else {
                                  return (
                                    member.userRole?.role?.toLowerCase() ===
                                    selectedRole?.toLowerCase()
                                  );
                                }
                              })
                              .map((data, index) => {
                                const isLastItem = index === members.length - 1;
                                console.log(data, "mapmapmapmapmapmap");

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
                                            {data.userName}
                                          </span>
                                        </Col>
                                      </Row>
                                    </Col>
                                    <Col lg={3} md={3} sm={3}>
                                      <Row>
                                        <Col
                                          lg={12}
                                          md={12}
                                          sm={12}
                                          className="m-3"
                                        >
                                          <Switch
                                            checkedValue={data.canView}
                                            value={memberData.canView}
                                            className={
                                              styles[
                                                "AdvancePermission_switches_View"
                                              ]
                                            }
                                            onChange={(checked) =>
                                              handleSwitchChangeView(
                                                checked,
                                                data,
                                                index
                                              )
                                            }
                                          />
                                        </Col>
                                      </Row>
                                    </Col>
                                    <Col lg={3} md={3} sm={3}>
                                      <Row>
                                        <Col
                                          lg={12}
                                          md={12}
                                          sm={12}
                                          className="m-3"
                                        >
                                          <Switch
                                            checkedValue={data.canModify}
                                            className={
                                              styles[
                                                "AdvancePermission_switches"
                                              ]
                                            }
                                            onChange={(checked) =>
                                              handleSwitchChangeModify(
                                                checked,
                                                data,
                                                index
                                              )
                                            }
                                          />
                                        </Col>
                                      </Row>
                                    </Col>
                                    {!isLastItem && (
                                      <Row>
                                        <Col lg={12} md={12} sm={12}>
                                          <span
                                            className={
                                              styles["Bottom_line_names"]
                                            }
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
                  <Button
                    text={t("Save")}
                    className={styles["Save_Button"]}
                    onClick={handleSaveAdvancedPermissionModal}
                  />
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
