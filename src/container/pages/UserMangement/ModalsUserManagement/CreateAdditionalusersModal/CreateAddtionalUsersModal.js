import React, { useState } from "react";
import styles from "./CreateAdditionalUsersModal.module.css";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import plusFaddes from "../../../../../assets/images/NewBluePLus.svg";
import CrossIcon from "../../../../../assets/images/CrossIcon.svg";
import profile from "../../../../../assets/images/newprofile.png";
import { useSelector } from "react-redux";
import { showCreateAddtionalUsersModal } from "../../../../../store/actions/UserMangementModalActions";
import {
  Button,
  Checkbox,
  Modal,
  TextField,
} from "../../../../../components/elements";
import crossicon from "../../../../../assets/images/BlackCrossIconModals.svg";
import { Col, Row } from "react-bootstrap";
import { style } from "@material-ui/system";
import EmployeeinfoCard from "../../../../../components/elements/Employeeinfocard/EmployeeinfoCard";
const CreateAddtionalUsersModal = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { UserManagementModals } = useSelector((state) => state);

  const [members, setMembers] = useState([
    {
      name: "Saif ul islam",
      emailAddress: "saifiiyousuf4002@gmail.com",
    },
    {
      name: "huzaifa jahangir",
      emailAddress: "saifiiyousuf4002@gmail.com",
    },
    {
      name: "Owais",
      emailAddress: "saifiiyousuf4002@gmail.com",
    },
    {
      name: "mamdani",
      emailAddress: "saifiiyousuf4002@gmail.com",
    },
  ]);

  const handleCrossIcon = () => {
    dispatch(showCreateAddtionalUsersModal(false));
  };
  return (
    <section>
      <Modal
        show={UserManagementModals.createAdditionalModals}
        setShow={dispatch(showCreateAddtionalUsersModal)}
        modalFooterClassName={"d-block"}
        modalHeaderClassName={"d-block"}
        size={"md"}
        onHide={() => {
          dispatch(showCreateAddtionalUsersModal(false));
        }}
        ModalTitle={
          <>
            {" "}
            <Row>
              <Col
                lg={12}
                md={12}
                sm={12}
                className="d-flex justify-content-end align-items-center"
              >
                <img
                  src={crossicon}
                  alt=""
                  onClick={handleCrossIcon}
                  className="cursor-pointer"
                />
              </Col>
            </Row>
          </>
        }
        ModalBody={
          <>
            <section className={styles["Padding_Alignment"]}>
              <Row>
                <Col lg={12} md={12} sm={12}>
                  <span className={styles["AddtionalUserheading"]}>
                    {t("Create-addtional-users")}
                  </span>
                </Col>
              </Row>
              <Row className="mt-1">
                <Col lg={2} md={2} sm={12} xs={12}></Col>
                <Col
                  lg={8}
                  md={8}
                  sm={12}
                  xs={12}
                  className={styles["RedSrtip"]}
                >
                  <span className={styles["RedStripContent"]}>
                    {t("Maximum-20-users-can-be-created-in-trial-version")}
                  </span>
                </Col>
                <Col lg={2} md={2} sm={12} xs={12}></Col>
              </Row>
              <Row className="mt-3">
                <Col lg={10} md={10} sm={12} xs={12}>
                  <TextField
                    placeholder={t("Full-name")}
                    label={
                      <>
                        <Row>
                          <Col lg={12} md={12} sm={12}>
                            <span className={styles["NameCreateAddtional"]}>
                              {t("Name")}{" "}
                              <span className={styles["Steric"]}>*</span>
                            </span>
                          </Col>
                        </Row>
                      </>
                    }
                    applyClass={"updateNotes_titleInput"}
                  />
                </Col>
                <Col
                  lg={2}
                  md={2}
                  sm={12}
                  xs={12}
                  className={styles["buttonStyles"]}
                >
                  <Button
                    text={
                      <>
                        <Row>
                          <Col
                            lg={12}
                            md={12}
                            sm={12}
                            xs={12}
                            className="d-flex justify-content-center align-items-center"
                          >
                            <img
                              src={plusFaddes}
                              alt=""
                              className={styles["PlusIcons"]}
                            />
                          </Col>
                        </Row>
                      </>
                    }
                    className={styles["Buttonclass"]}
                  />
                </Col>
              </Row>
              <Row className="mt-3">
                <Col
                  lg={6}
                  md={6}
                  sm={12}
                  className="d-flex flex-column flex-wrap"
                >
                  <span className={styles["NameCreateAddtional"]}>
                    {t("Organization")}
                  </span>
                  <span className={styles["NameClass"]}>Waqas Associates</span>
                </Col>
                <Col lg={6} md={6} sm={12} className="flex-column flex-wrap">
                  <span className={styles["NameCreateAddtional"]}>
                    {t("Select-role")}
                  </span>
                  <Row>
                    <Col lg={12} md={12} sm={12} className="d-flex gap-2">
                      <Checkbox classNameCheckBoxP="m-0 p-0" classNameDiv="" />
                      <span className={styles["AdminAlsoClass"]}>
                        {t("Is-admin-also")}
                      </span>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row>
                <Col lg={6} md={6} sm={12}>
                  <TextField
                    placeholder={t("Email")}
                    label={
                      <>
                        <span className={styles["NameCreateAddtional"]}>
                          {t("Email")}{" "}
                          <span className={styles["Steric"]}>*</span>
                        </span>
                      </>
                    }
                    applyClass={"updateNotes_titleInput"}
                  />
                </Col>{" "}
                <Col lg={6} md={6} sm={12}>
                  <TextField
                    placeholder={t("Designation")}
                    label={
                      <>
                        <span className={styles["NameCreateAddtional"]}>
                          {t("Designation")}{" "}
                          <span className={styles["Steric"]}>*</span>
                        </span>
                      </>
                    }
                    applyClass={"updateNotes_titleInput"}
                  />
                </Col>
              </Row>
              <Row className="mt-3">
                <Col
                  lg={12}
                  md={12}
                  sm={12}
                  xs={12}
                  className={styles["Scroller_Users"]}
                >
                  <Row>
                    {members.map((data, index) => {
                      return (
                        <Col lg={6} md={6} sm={12} className="mt-2">
                          <Row>
                            <Col lg={12} md={12} sm={12}>
                              <EmployeeinfoCard
                                Employeename={data?.name}
                                Employeeemail={data?.emailAddress}
                                EmployeePic={data?.displayProfilePictureName}
                                Icon={
                                  <img
                                    src={CrossIcon}
                                    width="18px"
                                    height="18px"
                                    alt=""
                                    draggable="false"
                                  />
                                }
                              />
                            </Col>
                          </Row>
                        </Col>
                      );
                    })}
                  </Row>
                </Col>
              </Row>
            </section>
          </>
        }
        ModalFooter={
          <>
            <section className={styles["Padding_Alignment"]}>
              <Row>
                <Col
                  lg={12}
                  md={12}
                  sm={12}
                  className="d-flex justify-content-end gap-2"
                >
                  <Button
                    text={t("Skip")}
                    className={styles["SkipandResetButtonClass"]}
                  />

                  <Button
                    text={t("Create")}
                    className={styles["CreateButtonClass"]}
                  />
                </Col>
              </Row>
            </section>
          </>
        }
      />
    </section>
  );
};

export default CreateAddtionalUsersModal;
