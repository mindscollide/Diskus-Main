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
import Group_Icon from '../../../assets/images/group_Icons.svg'
const Card = ({ CardHeading, IconOnClick, profile, BtnText, Icon, StatusID, onClickFunction, ViewBtnOnCLick, updateBtnonClick, threeDotItems, editDropDownItems, flag, chandeHandleStatus, CardID }) => {
  const { t } = useTranslation();
  const [editItems, setEditItems] = useState([{ key: t("In-active"), value: 1 }, { key: "Archeived", value: 2 }, { key: "Active", value: 3 }])
  const [dropdownthreedots, setdropdownthreedots] = useState(false);
  const [editdropdown, setEditdropdown] = useState(false);
  console.log("profileprofile", profile);
  // console.log(first);
  const threedotdropdown = () => {
    if (dropdownthreedots) {
      setdropdownthreedots(false);
    } else {
      setdropdownthreedots(true);
      setEditdropdown(false);
    }
  };

  const dropdownedit = () => {
    if (editdropdown) {
      setEditdropdown(false);
    } else {
      setEditdropdown(true);
      setdropdownthreedots(false);
    }
  };
  return (
    <Col sm={12} md={3} lg={3} xl={3} className="mb-3">
      <div className={StatusID === 1 ? styles["Committee_InActive"] : styles["Committee"]}>
        <div
          className={StatusID === 1 ? styles["Two-Icons-style-Committee-Group_InActive"] : styles["Two-Icons-style-Committee-Group"]}
        >
          <Row>
            <Col
              lg={12}
              md={12}
              sm={12}
              className="d-flex justify-content-end gap-2 mt-2 pe-4"
            >
              <img src={editicon} width={17} className={StatusID === 1 ? "cursor-pointer" : ""} onClick={dropdownedit} />
              <img src={doticon} width={17} className={StatusID === 1 ? "cursor-pointer" : ""} onClick={threedotdropdown} />
            </Col>
          </Row>
        </div>
        {dropdownthreedots ? (
          <>
            <Container className={styles["Dropdown-container-Committee"]}>
              <Row className="mt-1">
                <Col
                  lg={12}
                  md={12}
                  sm={12}
                  className="d-flex justify-content-start gap-2  ms-1"
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
                      {t(" File Sharing")}
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
                      {t(" Meeting With Agenda")}
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
                      {t("  Survey Polls")}
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
                  <span className={styles["dropdown-text"]}>{t("Task")}</span>
                </Col>
              </Row>
              {flag ? <> <hr className={styles["HR-line-Committee-group"]} />
                <Row className="mt-2">
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className="d-flex justify-content-start gap-2  ms-1 "
                  >
                    <span>
                      <img src={img7} width={17} />
                    </span>
                    <span className={styles["dropdown-text"]}>
                      {t("Assign/Remove Group")}
                    </span>
                  </Col>
                </Row></> : null}

            </Container>
          </>
        ) : null}
        {editdropdown ? (
          <>
            <Container
              className={styles["Dropdown-container-editIcon-Committee-Group"]}
            >
              {editItems.length > 0 ? editItems.map((editItem, index) => {
                return (<>
                  <Row className="mt-1">
                    <Col
                      lg={12}
                      md={12}
                      sm={12}
                      className="d-flex justify-content-center  "

                    >
                      <span className={styles["dropdown-text"]} onClick={() => chandeHandleStatus(editItem, CardID)}>{editItem.key}</span>
                    </Col>
                  </Row>
                  <hr className={styles["HR-line-Committee-group"]} />
                </>)
              }) : null}

            </Container>
          </>
        ) : null}
        <Col
          lg={12}
          sm={12}
          md={12}
          className={StatusID === 1 ? styles["In-Active-status-Committee-Group"] : styles["Active-status-Committee-Group"]}
        >
          {StatusID === 1 ? <span className={styles["Status-Committee-Group"]}>
            {t("In-active")}
          </span> : StatusID === 2 ? <span className={styles["Status-Committee-Group"]}>
            {t("Arhevied")}
          </span> : StatusID === 3 ? <span className={styles["Status-Committee-Group"]}>
            {t("Active")}
          </span> : null}
        </Col>

        <Row className="">
          <Col lg={12} md={12} sm={12}>
            <Row>
              <Col
                lg={12}
                md={12}
                sm={12}
                className="d-flex justify-content-center mt-3"
              >
                <span className={StatusID === 1 ? styles["group-icon-Committee-Group_InActive"] : styles["group-icon-Committee-Group"]}>
                  <img src={Group_Icon} />
                </span>
              </Col>
            </Row>
          </Col>
        </Row>

        <Row className="mt-2">
          <Col lg={12} md={12} sm={12} className="position-relative">
            <div className={styles["Tagline-Committee-Group"]}>
              <p className={StatusID === 1 ? styles["card-heading-Committee-Group_InActive"] : styles["card-heading-Committee-Group"]}>
                {CardHeading}
              </p>
            </div>
          </Col>
        </Row>

        <Row className="mt-4">
          <Col
            lg={10}
            md={10}
            sm={10}
            className={styles["profile_cards"]}
          >
            <Row className="justify-content-center">
              {profile != undefined && profile != null
                ? profile.map((data, index) => {
                  if (index <= 3) {
                    return (
                      <Col sm={2} md={2} lg={2} className={StatusID === 1 ? styles["card_profile_box_InActive"] : styles["card_profile_box"]}>
                        <img src={picprofile} width={37} />
                        <p className={styles["namesCards-Committee-Group"]}>
                          {data.userName}
                        </p>
                      </Col>
                    );
                  }
                })
                : null}
              {profile.length - 4 > 0 ? <Col sm={2} md={2} lg={2} className={styles["card_profile_box"]}>
                {/* <img src={picprofile} width={35} /> */}
                <span className={StatusID === 1 ? styles["namecards_morethan-3_InActive"] : styles["namecards_morethan-3"]}>
                  +{profile.length - 4}
                </span>

              </Col> : null}
            </Row>
          </Col>
        </Row>

        <Row>
          <Col
            lg={10}
            md={10}
            sm={10}
            className="justify-content-center d-flex mt-4  mx-auto"
          > <Button
              className={styles["update-Committee-btn"]}
              text={BtnText}
              onClick={onClickFunction} />

            {/* {StatusID === 1 ?
            <Button
              className={styles["update-Committee-btn"]}
              text={BtnText}
              onClick={ViewBtnOnCLick} />
            : StatusID === 2 ?
              <Button
                className={styles["update-Committee-btn"]}
                text={BtnText}
                onClick={IconOnClick} />
              : StatusID === 3 ?
                <Button
                  className={styles["update-Committee-btn"]}
                  text={BtnText}
                  onClick={updateBtnonClick} /> : null} */}
          </Col>
        </Row>
      </div >
    </Col >
  );
};

export default Card;
