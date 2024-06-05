import React, { useMemo } from "react";
import styles from "./SignatoriesList.module.css";
import { Modal } from "../../../../../components/elements";
import { Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import ProfilePicImg from "../../../../../assets/images/picprofile.png";
import { useState } from "react";

// console.log(UserList);

const SignatoriesList = ({
  setSignatoriesList,
  signatories_List,
  signatureListVal,
}) => {
  const { t } = useTranslation();
  const [members, setMembers] = useState([]);
  const signatoriesList = useMemo(() => {
    // signatureListVal value is the number of names you want in the list
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

    // Ensure signatureListVal does not exceed the length of namesArray
    const listLength = Math.min(signatureListVal, namesArray.length);

    // Generate the user list based on the specified length
    const UserList = namesArray.slice(0, listLength).map((name) => ({
      name,
      profilePic: ProfilePicImg,
    }));

    return UserList;
  }, [signatureListVal]);
  return (
    <Modal
      show={signatories_List}
      setShow={setSignatoriesList}
      modalHeaderClassName={styles["signatories_modal_header"]}
      onHide={() => {
        setSignatoriesList(false);
      }}
      size={"sm"}
      modalBodyClassName={"px-4 py-1"}
      ModalBody={
        <>
          <Row>
            <Col sm={12} md={12} lg={12}>
              <h2 className={styles["Signatories_heading"]}>
                {t("Signatories")}
              </h2>
            </Col>
            <Col sm={12} md={12} lg={12} className={styles["signatoriesUsers"]}>
              {signatoriesList.map((nameValues, index) => {
                return (
                  <section className="my-4 d-flex gap-3 align-items-center">
                    <img
                      className="rounded-circle"
                      width={22}
                      height={22}
                      src={nameValues.profilePic}
                    />
                    <span className={styles["signatoriesname_value"]}>
                      {" "}
                      {nameValues.name}
                    </span>
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
