import { Container, Row, Col } from "react-bootstrap";
import styles from "./Card.module.css";
import React, { useEffect, useState } from "react";
import img1 from "../../../assets/images/DropdownONE.svg";
import img3 from "../../../assets/images/DropdownTHREE.svg";
import { useTranslation } from "react-i18next";
import { Button } from "../../../components/elements";
import img4 from "../../../assets/images/DropdownFOUR.svg";
import img5 from "../../../assets/images/DropdownFIVE.svg";
import editicon from "../../../assets/images/Esvg.svg";
import doticon from "../../../assets/images/Dsvg.svg";
import img6 from "../../../assets/images/DropdownSIX.svg";
import { Tooltip } from "antd";
import { convertToArabicNumerals } from "../../../commen/functions/regex";

/**
 * @component Card
 * @description Displays a committee or group card in the Diskus governance platform.
 * The card shows the entity's status badge, icon, heading, associated tags, up to four
 * member profile pictures (with a "+N" overflow indicator), and an action button.
 * An edit-status dropdown (In-active / Archive / Active) and a "three-dots" context menu
 * (Documents, Discussion, Meetings, Polls, Tasks) are toggled via icon clicks.
 * Only the creator of the entity sees the edit icon; the "More" dots icon is visible to all.
 * Language-aware numerals are rendered via `convertToArabicNumerals` when the UI is in Arabic.
 *
 * @param {string}    CardHeading                  - Title displayed on the card.
 * @param {Array}     profile                      - Array of member objects with `userName` and `userProfilePicture.displayProfilePictureName` (base64).
 * @param {number}    StatusID                     - Entity status: 1 = In-active, 2 = Archived, 3 = Active.
 * @param {Function}  onClickFunction              - Handler for the "Update committee / group" button.
 * @param {boolean}   flag                         - When true the card represents a committee; false means a group.
 * @param {Function}  changeHandleStatus           - Handler called when a status item is selected from the edit dropdown.
 * @param {number}    CardID                       - Unique identifier for this card, used to control which dropdown is open.
 * @param {Function}  assignGroupBtn               - Callback for assigning a group (passed through, not directly invoked in JSX).
 * @param {Function}  setUniqCardID                - Setter that tracks which card's dropdown is currently active.
 * @param {number}    uniqCardID                   - The currently active card ID; controls dropdown visibility.
 * @param {ReactNode} Icon                         - Icon element rendered in the card header area.
 * @param {boolean}   groupState                   - Determines whether associated tags are shown as committees (true) or groups (false).
 * @param {Array}     associatedTags               - Array of associated committee/group objects with `committeeTitle` or `groupTitle`.
 * @param {number}    creatorId                    - ID of the user who created this entity; controls edit-icon visibility.
 * @param {Function}  titleOnCLick                 - Handler invoked when the card heading text is clicked.
 * @param {Function}  handleClickDiscussion        - Handler for the "Discussion" context-menu option.
 * @param {string}    discussionMenuClass          - CSS class applied to the Discussion menu item wrapper.
 * @param {Function}  handleMeetingClickOption     - Handler for the "Meetings" context-menu option.
 * @param {Function}  handlePollsClickOption       - Handler for the "Polls" context-menu option.
 * @param {Function}  handleTasksClickOption       - Handler for the "Tasks" context-menu option.
 * @param {Function}  handleClickDocumentOption    - Handler for the "Documents" context-menu option.
 *
 * @example
 * <Card
 *   CardHeading="Finance Committee"
 *   StatusID={3}
 *   flag={true}
 *   CardID={42}
 *   creatorId={7}
 *   profile={members}
 *   associatedTags={tags}
 *   groupState={true}
 *   onClickFunction={handleUpdate}
 *   setUniqCardID={setActiveCard}
 *   uniqCardID={activeCard}
 *   changeHandleStatus={handleStatusChange}
 *   titleOnCLick={handleTitleClick}
 * />
 */
const Card = ({
  CardHeading,
  profile,
  StatusID,
  onClickFunction,
  flag,
  changeHandleStatus,
  CardID,
  assignGroupBtn,
  setUniqCardID,
  uniqCardID,
  Icon,
  groupState,
  associatedTags,
  creatorId,
  titleOnCLick,
  handleClickDiscussion,
  discussionMenuClass,
  handleMeetingClickOption,
  handlePollsClickOption,
  handleTasksClickOption,
  handleClickDocumentOption,
}) => {
  const { t } = useTranslation();
  let Currentlanguage = localStorage.getItem("i18nextLng");
  const [editItems, setEditItems] = useState([
    { key: "In-active", value: 1 },
    { key: "Archive", value: 2 },
    { key: "Active", value: 3 },
  ]);

  const [dropdownthreedots, setdropdownthreedots] = useState(false);
  const [editdropdown, setEditdropdown] = useState(false);
  const creatorID = localStorage.getItem("userID");

  useEffect(() => {
    try {
      // Global click listener that closes whichever dropdown is open when the
      // user clicks outside of it. CSS class names follow the pattern
      // "<prefix>_dot" or "<prefix>_Edit" — the segment after the underscore
      // determines which dropdown was targeted.
      window.addEventListener("click", function (e) {
        let clsname = e.target.className;
        if (typeof clsname === "string") {
          let arr = clsname.split("_");
          if (arr !== undefined) {
            if (arr[1] === "dot" && dropdownthreedots === true) {
              // Second click on the dots icon — collapse the three-dots menu.
              setdropdownthreedots(false);
            } else if (arr[1] === "dot" && dropdownthreedots === false) {
              // First click on the dots icon — close edit dropdown and open three-dots menu.
              setEditdropdown(false);
              setdropdownthreedots(true);
            } else if (arr[1] === "Edit" && editdropdown === true) {
              // Second click on the edit icon — collapse the edit dropdown.
              setEditdropdown(false);
            } else if (arr[1] === "Edit" && editdropdown === false) {
              // First click on the edit icon — close three-dots menu and open edit dropdown.
              setdropdownthreedots(false);
              setEditdropdown(true);
            } else {
              // Click landed outside both menus — close everything and deselect the card.
              setEditdropdown(false);
              setdropdownthreedots(false);
              setUniqCardID(0);
            }
          } else {
            setEditdropdown(false);
            setdropdownthreedots(false);
          }
        }
      });
    } catch (error) {
      console.log("error", error);
    }
  }, []);
  // Sort member profiles alphabetically by userName (case-insensitive) so the
  // first four displayed avatars are always in a deterministic order.
  let sortedArraay =
    profile !== null &&
    profile !== undefined &&
    profile.length > 0 &&
    profile.sort((a, b) => {
      const userNameA = a.userName.toLowerCase();
      const userNameB = b.userName.toLowerCase();

      if (userNameA < userNameB) {
        return -1;
      }
      if (userNameA > userNameB) {
        return 1;
      }
      return 0;
    });

  useEffect(() => {}, [editdropdown, dropdownthreedots]);

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
            StatusID === 2
              ? styles["Two-Icons-style-Committee-Group_InActive"]
              : styles["Two-Icons-style-Committee-Group"]
          }
        >
          <Row>
            <Col
              lg={12}
              md={12}
              sm={12}
              className={`d-flex gap-2 mt-4 pe-3 ${
                Currentlanguage === "ar" ? "" : "justify-content-end"
              }`}
            >
              {Number(creatorId) === Number(creatorID) && (
                <Tooltip placement="bottomLeft" title={t("Edit")}>
                  <img
                    src={editicon}
                    width="21px"
                    height="21px"
                    alt=""
                    className={
                      Number(creatorId) === Number(creatorID)
                        ? styles["Edit_icon_styles"]
                        : styles["Edit_icon_styles_InActive"]
                    }
                    onClick={() => setUniqCardID(CardID)}
                    draggable="false"
                  />
                </Tooltip>
              )}
              <Tooltip placement="bottomLeft" title={t("More")}>
                <img
                  src={doticon}
                  width="21px"
                  height="21px"
                  className={
                    StatusID === 3 || StatusID === 1
                      ? styles["dot_icon_styles"]
                      : StatusID === 2
                      ? styles["dot_icon_styles_InActive"]
                      : styles["dot_icon_styles_InActive"]
                  }
                  onClick={() => setUniqCardID(CardID)}
                  alt=""
                  draggable="false"
                />
              </Tooltip>
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
                              <Row className="mt-1" key={index}>
                                <Col
                                  lg={12}
                                  md={12}
                                  sm={12}
                                  className="d-flex justify-content-center  Saved_money_Tagline "
                                >
                                  <span
                                    className={
                                      Number(editItem.value) ===
                                      Number(StatusID)
                                        ? styles["dropdown-text-disable"]
                                        : styles["dropdown-text"]
                                    }
                                    onKeyDown={(e) =>
                                      Number(editItem.value) ===
                                        Number(StatusID) && e.preventDefault()
                                    }
                                    onClick={() =>
                                      Number(editItem.value) !==
                                        Number(StatusID) &&
                                      changeHandleStatus(
                                        editItem,
                                        CardID,
                                        setEditdropdown
                                      )
                                    }
                                  >
                                    {t(editItem.key)}
                                  </span>
                                </Col>
                              </Row>
                              <hr
                                className={
                                  index === 2
                                    ? "d-none"
                                    : styles["HR-line-Committee-group"]
                                }
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
                        className="d-flex justify-content-start gap-2  ms-1  "
                        onClick={handleClickDocumentOption}
                      >
                        <div className={"d-flex justify-content-start gap-2"}>
                          <span>
                            <img
                              src={img1}
                              width={15}
                              draggable="false"
                              alt=""
                            />
                          </span>
                          <span className={styles["dropdown-text"]}>
                            {t("Documents")}
                          </span>
                        </div>
                      </Col>
                    </Row>
                    <hr className={styles["HR-line-Committee-group"]} />
                    <Row className="mt-2">
                      <Col
                        lg={12}
                        md={12}
                        sm={12}
                        onClick={handleClickDiscussion}
                      >
                        <Col
                          lg={12}
                          md={12}
                          sm={12}
                          className="d-flex justify-content-start gap-2  ms-1 "
                        >
                          <div className={discussionMenuClass}>
                          <span>
                            <img
                              src={img3}
                              width={15}
                              draggable="false"
                              alt=""
                            />
                          </span>
                            <span className={styles["dropdown-text"]}>
                              {t("Discussion")}
                            </span>
                          </div>
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
                          onClick={handleMeetingClickOption}
                        >
                          <div className="d-flex justify-content-start gap-2  ">
                            <span>
                              <img
                                src={img4}
                                alt=""
                                width={17}
                                draggable="false"
                              />
                            </span>
                            <span className={styles["dropdown-text"]}>
                              {t("Meetings")}
                            </span>
                          </div>
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
                          onClick={handlePollsClickOption}
                        >
                          <div className="d-flex justify-content-start gap-2  ">
                            <span>
                              <img
                                src={img5}
                                width={17}
                                alt=""
                                draggable="false"
                              />
                            </span>
                            <span className={styles["dropdown-text"]}>
                              {t("Polls")}
                            </span>
                          </div>
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
                        onClick={handleTasksClickOption}
                      >
                        <div className="d-flex justify-content-start gap-2  ">
                          <span>
                            <img
                              src={img6}
                              width={17}
                              draggable="false"
                              alt=""
                            />
                          </span>
                          <span className={styles["dropdown-text"]}>
                            {t("Tasks")}
                          </span>
                        </div>
                      </Col>
                    </Row>
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
                StatusID === 1
                  ? styles["card-heading-Committee-Group_InActive"]
                  : StatusID === 2
                  ? styles["card-heading-Committee-Group_InActive_Archeive"]
                  : styles["card-heading-Committee-Group"]
              }
              onClick={titleOnCLick}
            >
              {CardHeading}
            </p>
          </div>
        </Col>
      </Row>
      <Row className="m-0 p-0">
        {groupState === true ? (
          <Col sm={12} md={12} lg={12}>
            {associatedTags !== null &&
            associatedTags !== undefined &&
            associatedTags.length === 1 ? (
              <>
                <span className={styles["associated_tagLine_single"]}>
                  {t("Associated-with")}
                  <span
                    className={styles["associated_tagLine_groupTitle_single"]}
                  >
                    {`${associatedTags[0].committeeTitle} ${t("Committee")}`}
                  </span>
                </span>
              </>
            ) : null}
            {associatedTags && associatedTags.length > 1 ? (
              <>
                <span className={styles["associated_tagLine"]}>
                  {`${t("Associated-with")} ${" "}`}
                  <span className={styles["associated_tagLine_groupTitle"]}>
                    {`${associatedTags.length} ${t("Committees")} `}
                  </span>
                </span>
              </>
            ) : (
              ""
            )}
          </Col>
        ) : (
          <Col sm={12} md={12} lg={12}>
            {associatedTags !== null &&
            associatedTags !== undefined &&
            associatedTags.length === 1 ? (
              <>
                <span className={styles["associated_tagLine_single"]}>
                  {`${t("Associated-with")}`}
                  <span
                    className={styles["associated_tagLine_groupTitle_single"]}
                  >
                    {`${associatedTags[0].groupTitle} ${t("Group")}` + " "}
                  </span>
                </span>
              </>
            ) : null}
            {associatedTags && associatedTags.length > 1 ? (
              <>
                <span className={styles["associated_tagLine"]}>
                  {t("Associated-with")}{" "}
                  <span className={styles["associated_tagLine_groupTitle"]}>
                    {`${associatedTags.length} ${t("Groups")}`}
                  </span>
                </span>
              </>
            ) : (
              ""
            )}
          </Col>
        )}
      </Row>

      <Row className="m-0 p-0 ">
        <Col lg={10} md={10} sm={10} className={styles["profile_cards"]}>
          <Row className="justify-content-center">
            {profile !== undefined &&
            profile !== null &&
            sortedArraay !== null &&
            sortedArraay !== undefined &&
            sortedArraay.length > 0
              ? sortedArraay.map((data, index) => {
                  if (index <= 3) {
                    return (
                      <Col
                        sm={2}
                        md={2}
                        lg={2}
                        key={index}
                        className={
                          StatusID === 1
                            ? styles["card_profile_box_InActive"]
                            : StatusID === 2
                            ? styles["card_profile_box_Archived"]
                            : styles["card_profile_box"]
                        }
                      >
                        <img
                          src={`data:image/jpeg;base64,${data.userProfilePicture.displayProfilePictureName}`}
                          alt=""
                          className="user-img"
                          draggable="false"
                        />
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
                <span
                  className={
                    StatusID === 1 || StatusID === 2
                      ? styles["namecards_morethan-3_InActive"]
                      : styles["namecards_morethan-3"]
                  }
                >
                  + {convertToArabicNumerals(profile.length - 4)}
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
            text={flag ? t("Update-committee") : t("Update-group")}
            disableBtn={
              Number(StatusID) === 3 && Number(creatorId) === Number(creatorID)
                ? false
                : true
            }
            onClick={onClickFunction}
          />
        </Col>
      </Row>
    </Row>
  );
};

export default Card;
