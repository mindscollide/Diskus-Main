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
import Key from "../../../../../../assets/images/KEY.svg";
const AdvancePersmissionModal = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { SubMenu } = Menu;
  const { Sider } = Layout;
  const { NewMeetingreducer } = useSelector((state) => state);
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
  return (
    <>
      <section>
        <Modal
          show={NewMeetingreducer.advancePermissionModal}
          setShow={dispatch(showAdvancePermissionModal)}
          modalFooterClassName={"d-block"}
          modalHeaderClassName={"d-block"}
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
              <Row>
                <Col lg={3} md={3} sm={3}>
                  <Row>
                    <Col lg={12} md={12} sm={12}>
                      <Row className="mt-4 mb-4 m-0 p-0">
                        <Col
                          lg={11}
                          md={11}
                          sm={12}
                          className="d-flex justify-content-center"
                        >
                          <span className={styles["Agenda_heading_Advance"]}>
                            {t("Agenda")}
                          </span>
                        </Col>
                        <Col lg={1} md={1} sm={12}></Col>
                      </Row>
                      <Layout>
                        <Sider width={250}>
                          <Menu
                            theme="light"
                            // defaultOpenKeys={[defaultOpenKey]}
                            // defaultSelectedKeys={[defaultSelectedKey]}
                            mode="inline"
                            className="Menu-sidebar-class"
                          >
                            <SubMenu
                              key="sub1"
                              icon={<i className="icon-user menu-icons"></i>}
                              title="Introduction"
                              className="submenu-sidebar-icons"
                            >
                              <Menu.Item className="menu-items-sidebar" key="3">
                                Introduction SubMenus
                              </Menu.Item>
                            </SubMenu>
                            <SubMenu
                              key="sub2"
                              icon={<i className="icon-user menu-icons"></i>}
                              title="CEO Report"
                              className="submenu-sidebar-icons"
                            >
                              <Menu.Item className="menu-items-sidebar" key="6">
                                CEO Report
                              </Menu.Item>
                            </SubMenu>
                            <SubMenu
                              key="sub3"
                              icon={<i className="icon-user menu-icons"></i>}
                              title="Finance Summary"
                              className="submenu-sidebar-icons"
                            >
                              <Menu.Item className="menu-items-sidebar" key="8">
                                Finance Summmary SubMenus
                              </Menu.Item>
                            </SubMenu>
                            <SubMenu
                              key="sub4"
                              icon={<i className="icon-user menu-icons"></i>}
                              title="Functional Review"
                              className="submenu-sidebar-icons"
                            >
                              <Menu.Item className="menu-items-sidebar" key="9">
                                Functional Review Submenu
                              </Menu.Item>
                            </SubMenu>
                            <SubMenu
                              key="sub5"
                              icon={<i className="icon-user menu-icons"></i>}
                              title="Closing Report"
                              className="submenu-sidebar-icons"
                            >
                              <Menu.Item className="menu-items-sidebar" key="9">
                                Closing Report Submenu
                              </Menu.Item>
                            </SubMenu>
                          </Menu>
                        </Sider>
                      </Layout>
                    </Col>
                  </Row>
                </Col>
                <Col lg={2} md={2} sm={2}></Col>
                <Col lg={7} md={7} sm={7}>
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
                            className={styles["All_Heading_Advance_permission"]}
                          >
                            {"View"}
                          </span>
                        </Col>
                        <Col lg={3} md={3} sm={3}>
                          <span
                            className={styles["All_Heading_Advance_permission"]}
                          >
                            {"Modify"}
                          </span>
                        </Col>
                      </Row>
                      <Row>
                        {members.map((data, index) => {
                          return (
                            <>
                              <Col lg={6} md={6} sm={6}>
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
                                  <Col lg={12} md={12} sm={12} className="m-1">
                                    <Switch
                                      className={
                                        styles[
                                          "AdvancePermission_switches_View"
                                        ]
                                      }
                                    />
                                  </Col>
                                </Row>
                              </Col>
                              <Col lg={3} md={3} sm={3}>
                                <Row>
                                  <Col lg={12} md={12} sm={12} className="m-1">
                                    <Switch
                                      className={
                                        styles["AdvancePermission_switches"]
                                      }
                                    />
                                  </Col>
                                </Row>
                              </Col>
                              <Row>
                                <Col lg={12} md={12} sm={12}>
                                  <span
                                    className={styles["Bottom_line_names"]}
                                  ></span>
                                </Col>
                              </Row>
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
          ModalBody={
            <>
              <Row className="m-0 p-0 mt-5">
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
