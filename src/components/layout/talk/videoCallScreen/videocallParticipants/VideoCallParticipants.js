import React, { useEffect, useState } from "react";
import styles from "./VideoCallParticipants.module.css";
import { Col, Row } from "react-bootstrap";
import CrossIcon from "../../../../../assets/images/VideoCall/Cross_icon_videoCallParticipantWaiting.png";
import { Button, TextField } from "../../../../elements";
import UserImage from "../../../../../assets/images/user.png";
import { participantWaitingListBox } from "../../../../../store/actions/VideoFeature_actions";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { admitRejectAttendeeMainApi } from "../../../../../store/actions/Guest_Video";

const names = [
  "John",
  "Ali",
  "Emily",
  "Sara",
  "Michael",
  "Sophia",
  "Daniel",
  "Liam",
  "Olivia",
  "James",
  "Ava",
  "William",
  "Isabella",
  "Benjamin",
  "Mia",
  "Lucas",
  "Charlotte",
  "Henry",
  "Amelia",
  "Alexander",
  "Evelyn",
  "Jacob",
  "Harper",
  "Mason",
  "Ella",
  "Logan",
  "Scarlett",
  "Ethan",
  "Grace",
  "Noah",
  "Lily",
  "Aiden",
  "Zoe",
  "Jackson",
  "Chloe",
  "Elijah",
  "Victoria",
  "Sebastian",
  "Hannah",
  "David",
  "Aurora",
  "Samuel",
  "Aria",
  "Levi",
  "Penelope",
  "Gabriel",
  "Layla",
  "Isaac",
  "Nora",
  "Matthew",
  "Ellie",
  "Julian",
  "Hazel",
  "Anthony",
  "Luna",
  "Joshua",
  "Violet",
  "Andrew",
  "Sofia",
];

const VideoCallParticipants = () => {
  const { videoFeatureReducer } = useSelector((state) => state);
  const [meettingID, setMeetingID] = useState(0)
  const [participantsList, setPartcipantList] = useState([]);
  const dispatch = useDispatch();
  const [searchValue, setSearchValue] = useState("");
  const handleChangeSearchParticipant = (e) => {
    const { value } = e.target;
    setSearchValue(value);
    let findisExist = names.filter((namesData, index) =>
      namesData.includes(value)
    );
    setPartcipantList(findisExist);
  };
  useEffect(() => {
    if (videoFeatureReducer.participantWaitingList.length > 0) {
      try {
        videoFeatureReducer.participantWaitingList.forEach(
          (participantData, index) => {
            setPartcipantList([...participantsList, participantData]);
          }
        );
      } catch (error) {
        console.log(error, "errorerror")
      }
    } else {
      setPartcipantList([])
    }
  }, [videoFeatureReducer.participantWaitingList]);

  // const handleClickAcceptAndReject = () => {
  //   let Data = {
  //     MeetingId: meettingID,
  //     AttendeeResponseList: [
  //       {
  //         Name: name,
  //         UID: uid,
  //         IsRequestAccepted: flag === 1 ? true : false,
  //         IsGuest: isGuest,
  //       },
  //     ],
  //   };
  //   dispatch(admitRejectAttendeeMainApi(Data, navigate, t));
  // }
  console.log(videoFeatureReducer, "videoFeatureReducer.participantWaitingListvideoFeatureReducer.participantWaitingList")
  return (
    <section
      className={
        videoFeatureReducer.NormalizeVideoFlag
          ? styles["WaitingParticipantBoxNorm"]
          : styles["WaitingParticipantBox"]
      }>
      <Row>
        <Col
          sm={12}
          md={12}
          lg={12}
          className='d-flex justify-content-between '>
          <span className={styles["waiting_participants_box_title"]}>
            Waiting for entry
          </span>
          <img
            src={CrossIcon}
            onClick={() => dispatch(participantWaitingListBox(false))}
            style={{ display: "block", objectFit: "cover" }}
          />
        </Col>
        <Col sm={12} md={12} lg={12}>
          <TextField
            placeholder={"Search"}
            applyClass={"waitingParticipantsSearchField"}
            change={handleChangeSearchParticipant}
            value={searchValue}
          />
        </Col>
        <Col sm={12} md={12} lg={12}>
          <div className={styles["AcceptAndDeniedBtns"]}>
            <Row>
              <Col sm={6} md={6} lg={6}>
                <Button className={styles["denyAllBtn"]} text={"Deny All"} />
              </Col>
              <Col sm={6} md={6} lg={6}>
                <Button
                  className={styles["AcceptAllBtn"]}
                  text={"Accept All "}
                />
              </Col>
            </Row>
          </div>
        </Col>
        <Col sm={12} md={12} lg={12}>
          <div
            className={
              videoFeatureReducer.NormalizeVideoFlag
                ? styles["AcceptAndDeniedManual_Nor"]
                : styles["AcceptAndDeniedManual"]
            }>
            {participantsList?.length > 0 &&
              participantsList.map((data, index) => {
                console.log(data, "participantsListparticipantsListparticipantsList")
                return (
                  <Row className='mb-2' key={data.uid}>
                    <Col
                      sm={6}
                      md={6}
                      lg={6}
                      className='d-flex align-items-center gap-2'>
                      <img
                        src={UserImage}
                        className={styles["participantImage"]}
                      />
                      <span className={styles["participant_name"]}>{data.name}</span>
                    </Col>
                    <Col
                      sm={6}
                      md={6}
                      lg={6}
                      className='d-flex align-items-center gap-2'>
                      <Button
                        className={styles["denyAllBtn-small"]}
                        text={"Deny "}
                      />
                      <Button
                        className={styles["AcceptAllBtn-small"]}
                        text={"Accept "}
                      />
                    </Col>
                  </Row>
                );
              })}
          </div>
        </Col>
      </Row>
    </section>
  );
};

export default VideoCallParticipants;
