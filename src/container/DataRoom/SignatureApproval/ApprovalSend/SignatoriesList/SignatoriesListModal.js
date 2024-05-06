import React from "react";
import styles from "./SignatoriesList.module.css";
import { Modal } from "../../../../../components/elements";
import { Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import ProfilePicImg from "../../../../../assets/images/picprofile.png";
import { useState } from "react";
const namesArray = [
  "John",
  "Alice",
  "Bob",
  "Emma",
  "Michael",
  "Sophia",
  "William",
  "Olivia",
  "James",
  "Ava",
  "Liam",
  "Isabella",
  "Mason",
  "Mia",
  "Ethan",
  "Emily",
  "Alexander",
  "Charlotte",
  "Daniel",
  "Harper",
];
const UserList = [];
namesArray.forEach((name, index) => {
  UserList.push({ name, profilePic: ProfilePicImg });
});

console.log(UserList);

const SignatoriesList = ({ setSignatoriesList, signatoriesList }) => {
  const { t } = useTranslation();
  const [members, setMembers] = useState([]);
  return (
    <Modal
      show={signatoriesList}
      setShow={setSignatoriesList}
      modalHeaderClassName={styles["signatories_modal_header"]}
      onHide={() => {
        setSignatoriesList(false);
      }}
      size={"sm"}
      ModalBody={
        <>
          <Row>
            <Col sm={12} md={12} lg={12}>
              <h2 className={styles["Signatories_heading"]}>
                {t("Signatories")}
              </h2>
            </Col>
            <Col sm={12} md={12} lg={12} className={styles["signatoriesUsers"]}>
              {UserList.map((nameValues, index) => {
                return (
                  <section className="my-3 d-flex gap-3 align-items-center">
                    <img className="rounded-circle" width={22} height={22} src={nameValues.profilePic} />
                    <span className={styles["signatoriesname_value"]}> {nameValues.name}</span>
                  </section>
                );
              })}
            </Col>
          </Row>
        </>
      }
      closeButton={true}
    />
  );
};

export default SignatoriesList;
