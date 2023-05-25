import { Container, Row, Col } from "react-bootstrap";
import styles from "./Card.module.css";
import React, { useEffect, useState } from "react";
import picprofile from "../../../assets/images/picprofile.png";
import img1 from "../../../assets/images/DropdownONE.svg";
import { useTranslation } from "react-i18next";
import img2 from "../../../assets/images/DropDownTWO.svg";
import { Button } from "../../../components/elements";
import img3 from "../../../assets/images/DropdownTHREE.svg";
import img4 from "../../../assets/images/DropdownFOUR.svg";
import img5 from "../../../assets/images/DropdownFIVE.svg";
import editicon from "../../../assets/images/Esvg.svg";
import doticon from "../../../assets/images/Dsvg.svg";
import img6 from "../../../assets/images/DropdownSIX.svg";
import img7 from "../../../assets/images/DropdownSEVEN.svg";
import Group_Icon from "../../../assets/images/group_Icons.svg";
const Card = ({
  CardHeading,
  profile,
  BtnText,
  StatusID,
  onClickFunction,
  flag,
  changeHandleStatus,
  CardID,
  assignGroupBtn,
  setUniqCardID,
  uniqCardID,
  Icon,
}) => {
  const { t } = useTranslation();
  const [editItems, setEditItems] = useState([
    { key: t("In-active"), value: 1 },
    { key: t("Archived"), value: 2 },
    { key: t("Active"), value: 3 },
  ]);
  const [dropdownthreedots, setdropdownthreedots] = useState(false);
  const [editdropdown, setEditdropdown] = useState(false);

  useEffect(() => {
    console.log("click");
    window.addEventListener("click", function (e) {
      console.log("eeeeeeeee", e.target.className);
      var clsname = e.target.className;
      let arr = clsname && clsname.split("_");
      console.log("click", arr[1]);
      if (arr != undefined) {
        if (arr[1] === "dot" && dropdownthreedots === true) {
          console.log("click", clsname);

          setdropdownthreedots(false);
        } else if (arr[1] === "dot" && dropdownthreedots === false) {
          console.log("click", clsname);
          setEditdropdown(false);
          setdropdownthreedots(true);
        } else if (arr[1] === "Edit" && editdropdown === true) {
          console.log("click", clsname);

          setEditdropdown(false);
        } else if (arr[1] === "Edit" && editdropdown === false) {
          console.log("click", clsname);
          setdropdownthreedots(false);
          setEditdropdown(true);
        } else {
          console.log("click", clsname);
          setEditdropdown(false);
          setdropdownthreedots(false);
        }
      } else {
        setEditdropdown(false);
        setdropdownthreedots(false);
      }
    });
  }, []);
  useEffect(() => {
    console.log("click", editdropdown, dropdownthreedots);
  }, [editdropdown, dropdownthreedots]);
  return (
    <Row
      className={
        StatusID === 1
          ? styles["Committee_InActive"]
          : StatusID === 2
          ? styles["Committee_Archived"]
          : styles["Committee"]
      }
    >
      <Col
        lg={12}
        sm={12}
        md={12}
        className={
          StatusID === 1
            ? styles["In-Active-status-Committee-Group-background"]
            : StatusID === 2
            ? styles["Archived-status-Committee-Group-background"]
            : styles["Active-status-Committee-Group-background"]
        }
      >
        {StatusID === 1 ? (
          <span className={styles["Status-Committee-Group"]}>
            {t("In-active")}
          </span>
        ) : StatusID === 2 ? (
          <span className={styles["Archived-Status-Committee-Group"]}>
            {t("Archived")}
          </span>
        ) : StatusID === 3 ? (
          <span className={styles["Status-Committee-Group"]}>
            {t("Active")}
          </span>
        ) : null}
      </Col>

      <Row className="p-0 m-0">
        <Col lg={2} md={2} sm={2}></Col>
        <Col lg={8} md={8} sm={8}>
          <Row>
            <Col
              lg={12}
              md={12}
              sm={12}
              className="d-flex justify-content-center mt-3"
            >
              <span
                className={
                  StatusID === 1 || StatusID === 2
                    ? styles["group-icon-Committee-Group_InActive"]
                    : styles["group-icon-Committee-Group"]
                }
              >
                {Icon}
              </span>
            </Col>
          </Row>
        </Col>
        <Col
          lg={2}
          md={2}
          sm={2}
          className={
            StatusID === 1 || StatusID === 2
              ? styles["Two-Icons-style-Committee-Group_InActive"]
              : styles["Two-Icons-style-Committee-Group"]
          }
        >
          <Row>
            <Col
              lg={12}
              md={12}
              sm={12}
              className="d-flex justify-content-end gap-2 mt-4 pe-3"
            >
              <img
                src={editicon}
                width="21px"
                height="21px"
                // className={StatusID === 1 ? "cursor-pointer" : ""}
                className={styles["Edit_icon_styles"]}
                onClick={() => setUniqCardID(CardID)}
              />
              <img
                src={doticon}
                width="21px"
                height="21px"
                // className={StatusID === 1 ? "cursor-pointer" : ""}
                className={styles["dot_icon_styles"]}
                onClick={() => setUniqCardID(CardID)}
              />
            </Col>
            <Col lg={12} md={12} sm={12}>
              {editdropdown && parseInt(CardID) === parseInt(uniqCardID) ? (
                <>
                  <Container
                    className={
                      styles["Dropdown-container-editIcon-Committee-Group"]
                    }
                  >
                    {editItems.length > 0
                      ? editItems.map((editItem, index) => {
                          return (
                            <>
                              <Row className="mt-1">
                                <Col
                                  lg={12}
                                  md={12}
                                  sm={12}
                                  className="d-flex justify-content-center cursor-pointer Saved_money_Tagline "
                                >
                                  <span
                                    className={styles["dropdown-text"]}
                                    onClick={() =>
                                      changeHandleStatus(
                                        editItem,
                                        CardID,
                                        setEditdropdown
                                      )
                                    }
                                  >
                                    {editItem.key}
                                  </span>
                                </Col>
                              </Row>
                              <hr
                                className={styles["HR-line-Committee-group"]}
                              />
                            </>
                          );
                        })
                      : null}
                  </Container>
                </>
              ) : null}
              {dropdownthreedots &&
              parseInt(CardID) === parseInt(uniqCardID) ? (
                <>
                  <Container className={styles["Dropdown-container-Committee"]}>
                    <Row className="mt-1">
                      <Col
                        lg={12}
                        md={12}
                        sm={12}
                        className="d-flex justify-content-start gap-2  ms-1 "
                      >
                        <span>
                          <img src={img1} width={15} />
                        </span>
                        <span className={styles["dropdown-text"]}>
                          {t("Documents")}
                        </span>
                      </Col>
                    </Row>
                    <hr className={styles["HR-line-Committee-group"]} />
                    <Row className="mt-2">
                      <Col lg={12} md={12} sm={12}>
                        <Col
                          lg={12}
                          md={12}
                          sm={12}
                          className="d-flex justify-content-start gap-2  ms-1 "
                        >
                          <span>
                            <img src={img2} width={17} />
                          </span>
                          <span className={styles["dropdown-text"]}>
                            {t("File-sharing")}
                          </span>
                        </Col>
                      </Col>
                    </Row>
                    <hr className={styles["HR-line-Committee-group"]} />
                    <Row className="mt-2">
                      <Col lg={12} md={12} sm={12}>
                        <Col
                          lg={12}
                          md={12}
                          sm={12}
                          className="d-flex justify-content-start gap-2  ms-1 "
                        >
                          <span>
                            <img src={img3} width={15} />
                          </span>
                          <span className={styles["dropdown-text"]}>
                            {t("Discussion")}
                          </span>
                        </Col>
                      </Col>
                    </Row>
                    <hr className={styles["HR-line-Committee-group"]} />
                    <Row className="mt-2">
                      <Col lg={12} md={12} sm={12}>
                        <Col
                          lg={12}
                          md={12}
                          sm={12}
                          className="d-flex justify-content-start gap-2  ms-1 "
                        >
                          <span>
                            <img src={img4} width={17} />
                          </span>
                          <span className={styles["dropdown-text"]}>
                            {t("Meeting-with-agenda")}
                          </span>
                        </Col>
                      </Col>
                    </Row>
                    <hr className={styles["HR-line-Committee-group"]} />
                    <Row className="mt-2">
                      <Col lg={12} md={12} sm={12}>
                        <Col
                          lg={12}
                          md={12}
                          sm={12}
                          className="d-flex justify-content-start gap-2  ms-1 "
                        >
                          <span>
                            <img src={img5} width={17} />
                          </span>
                          <span className={styles["dropdown-text"]}>
                            {t("Survey-polls")}
                          </span>
                        </Col>
                      </Col>
                    </Row>
                    <hr className={styles["HR-line-Committee-group"]} />
                    <Row className="mt-2">
                      <Col
                        lg={12}
                        md={12}
                        sm={12}
                        className="d-flex justify-content-start gap-2  ms-1 "
                      >
                        <span>
                          <img src={img6} width={17} />
                        </span>
                        <span className={styles["dropdown-text"]}>
                          {t("Task")}
                        </span>
                      </Col>
                    </Row>
                    {flag ? (
                      <>
                        {" "}
                        <hr className={styles["HR-line-Committee-group"]} />
                        <Row className="mt-2">
                          <Col
                            lg={12}
                            md={12}
                            sm={12}
                            className="d-flex justify-content-start gap-2  ms-1 "
                            onClick={assignGroupBtn}
                          >
                            <span>
                              <img src={img7} width={17} />
                            </span>
                            <span
                              className={styles["dropdown-text"]}
                              // onClick={() =>
                              //   setdropdownthreedots(!dropdownthreedots)
                              // }
                            >
                              {t("Assign-remove-group")}
                            </span>
                          </Col>
                        </Row>
                      </>
                    ) : null}
                  </Container>
                </>
              ) : null}
            </Col>
          </Row>
        </Col>
      </Row>

      <Row className="m-0 p-0 ">
        <Col lg={12} md={12} sm={12} className="position-relative">
          <div className={styles["Tagline-Committee-Group"]}>
            <p
              className={
                StatusID === 1 || StatusID === 2
                  ? styles["card-heading-Committee-Group_InActive"]
                  : styles["card-heading-Committee-Group"]
              }
            >
              {CardHeading}
            </p>
          </div>
        </Col>
      </Row>

      <Row className="m-0 p-0 ">
        <Col lg={10} md={10} sm={10} className={styles["profile_cards"]}>
          <Row className="justify-content-center">
            {profile != undefined && profile != null
              ? profile.map((data, index) => {
                  if (index <= 3) {
                    return (
                      <Col
                        sm={2}
                        md={2}
                        lg={2}
                        className={
                          StatusID === 1
                            ? styles["card_profile_box_InActive"]
                            : StatusID === 2
                            ? styles["card_profile_box_Archived"]
                            : styles["card_profile_box"]
                        }
                      >
                        <img src={picprofile} width="37px" height="37px" />
                        <p className={styles["namesCards-Committee-Group"]}>
                          {data.userName}
                        </p>
                      </Col>
                    );
                  }
                })
              : null}
            {profile && profile.length - 4 > 0 ? (
              <Col sm={2} md={2} lg={2} className={styles["card_profile_box"]}>
                {/* <img src={picprofile} width={35} /> */}
                <span
                  className={
                    StatusID === 1 || StatusID === 2
                      ? styles["namecards_morethan-3_InActive"]
                      : styles["namecards_morethan-3"]
                  }
                >
                  + {profile.length - 4}
                </span>
              </Col>
            ) : null}
          </Row>
        </Col>
      </Row>

      <Row className="m-0 p-0 ">
        <Col
          lg={12}
          md={12}
          sm={12}
          className="justify-content-center d-flex   mx-auto"
        >
          <Button
            className={styles["update-Committee-btn"]}
            text={BtnText}
            onClick={onClickFunction}
          />
        </Col>
      </Row>
    </Row>
  );
};

export default Card;
