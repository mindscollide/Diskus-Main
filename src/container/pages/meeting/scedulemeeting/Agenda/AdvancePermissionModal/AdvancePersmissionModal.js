import React from "react";
import styles from "./AdvancePermissionModal.module.css";
import { Modal, Button } from "../../../../../../components/elements";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import { showAdvancePermissionModal } from "../../../../../../store/actions/NewMeetingActions";
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
  return (
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
            <Row>
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
                    <Select classNamePrefix={"AdvancePermission"} />
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
              <Col lg={5} md={5} sm={5}>
                <Row>
                  <Col lg={12} md={12} sm={12}>
                    <Row className="mt-3 mb-3">
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
                              Add a Bank User
                            </Menu.Item>

                            <Menu.Item className="menu-items-sidebar" key="4">
                              Pending user requests
                            </Menu.Item>
                            <Menu.Item className="menu-items-sidebar" key="5">
                              Bank User List
                            </Menu.Item>
                          </SubMenu>
                          <SubMenu
                            key="sub2"
                            icon={<i className="icon-user menu-icons"></i>}
                            title="CEO Report"
                            className="submenu-sidebar-icons"
                          >
                            <Menu.Item className="menu-items-sidebar" key="6">
                              Add a Customer
                            </Menu.Item>
                            <Menu.Item className="menu-items-sidebar" key="7">
                              Customer Users List
                            </Menu.Item>
                          </SubMenu>
                          <SubMenu
                            key="sub3"
                            icon={<i className="icon-user menu-icons"></i>}
                            title="Finance Summary"
                            className="submenu-sidebar-icons"
                          >
                            <Menu.Item className="menu-items-sidebar" key="8">
                              User Report
                            </Menu.Item>
                          </SubMenu>
                          <SubMenu
                            key="sub4"
                            icon={<i className="icon-user menu-icons"></i>}
                            title="Functional Review"
                            className="submenu-sidebar-icons"
                          >
                            <Menu.Item className="menu-items-sidebar" key="9">
                              Nature Of Business
                            </Menu.Item>
                          </SubMenu>
                          <SubMenu
                            key="sub5"
                            icon={<i className="icon-user menu-icons"></i>}
                            title="Closing Report"
                            className="submenu-sidebar-icons"
                          >
                            <Menu.Item className="menu-items-sidebar" key="9">
                              Nature Of Business
                            </Menu.Item>
                          </SubMenu>
                        </Menu>
                      </Sider>
                    </Layout>
                  </Col>
                </Row>
              </Col>
            </Row>
          </>
        }
        ModalBody={<></>}
      />
    </section>
  );
};

export default AdvancePersmissionModal;
