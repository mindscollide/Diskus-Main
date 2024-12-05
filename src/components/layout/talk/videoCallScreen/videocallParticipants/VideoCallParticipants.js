// import React, { useContext, useEffect, useState } from "react";
// import styles from "./VideoCallParticipants.module.css";
// import { Col, Row } from "react-bootstrap";
// import CrossIcon from "../../../../../assets/images/VideoCall/Cross_icon_videoCallParticipantWaiting.png";
// import { Button, TextField } from "../../../../elements";
// import UserImage from "../../../../../assets/images/user.png";
// import { participantWaitingListBox } from "../../../../../store/actions/VideoFeature_actions";
// import { useDispatch } from "react-redux";
// import { useSelector } from "react-redux";
// import {
//   admitRejectAttendeeMainApi,
//   getVideoCallParticipantsGuestMainApi,
//   setAdmittedParticipant,
// } from "../../../../../store/actions/Guest_Video";
// import { useNavigate } from "react-router-dom";
// import { useTranslation } from "react-i18next";
// import { MeetingContext } from "../../../../../context/MeetingContext";

// const VideoCallParticipants = () => {
//   const { videoFeatureReducer } = useSelector((state) => state);
//   const [meettingID, setMeetingID] = useState(0);
//   const navigate = useNavigate();
//   const { t } = useTranslation();
//   console.log("Iam Video Call ");
//   const [participantsList, setPartcipantList] = useState([]);
//   console.log(participantsList, "participantsListData");
//   let roomID = localStorage.getItem("newRoomId");
//   const { editorRole } = useContext(MeetingContext);
//   console.log(editorRole, "editorRoleeditorRole");

//   const dispatch = useDispatch();
//   const [searchValue, setSearchValue] = useState("");
//   const handleChangeSearchParticipant = (e) => {
//     const { value } = e.target;
//     setSearchValue(value);
//     // let findisExist = names.filter((namesData, index) =>
//     //   namesData.includes(value)
//     // );
//     // setPartcipantList(findisExist);
//   };

//   useEffect(() => {
//     if (videoFeatureReducer.participantWaitingList.length > 0) {
//       try {
//         setPartcipantList(videoFeatureReducer.participantWaitingList);
//       } catch (error) {
//         console.log(error, "errorerror");
//       }
//     } else {
//       setPartcipantList([]);
//     }
//   }, [videoFeatureReducer.participantWaitingList]);

//   const handleClickAllAcceptAndReject = (flag) => {
//     let Data = {
//       MeetingId: participantsList[0].meetingID,
//       RoomId: String(roomID),
//       IsRequestAccepted: flag === 1 ? true : false,
//       AttendeeResponseList: participantsList.map((participantData, index) => {
//         console.log(participantData, "mahdahahshahs");
//         return {
//           IsGuest: participantData.isGuest,
//           UID: participantData.guid,
//           UserID: participantData.userID,
//         };
//       }),
//     };

//     dispatch(
//       admitRejectAttendeeMainApi(Data, navigate, t, true, participantsList)
//     );
//   };
//   const handleClickAcceptAndReject = (participantInfo, flag) => {
//     console.log(participantInfo, "participantInfo");
//     let Data = {
//       MeetingId: participantInfo.meetingID,
//       RoomId: String(roomID),
//       IsRequestAccepted: flag === 1 ? true : false,
//       AttendeeResponseList: [
//         {
//           IsGuest: participantInfo.isGuest,
//           UID: participantInfo.guid,
//           UserID: participantInfo.userID,
//         },
//       ],
//     };
//     dispatch(
//       admitRejectAttendeeMainApi(Data, navigate, t, false, participantsList)
//     );
//   };
//   console.log(
//     videoFeatureReducer,
//     "videoFeatureReducer.participantWaitingListvideoFeatureReducer.participantWaitingList"
//   );
//   return (
//     <section
//       className={
//         videoFeatureReducer.NormalizeVideoFlag
//           ? styles["WaitingParticipantBoxNorm"]
//           : styles["WaitingParticipantBox"]
//       }
//     >
//       <Row>
//         <Col
//           sm={12}
//           md={12}
//           lg={12}
//           className="d-flex justify-content-between "
//         >
//           <span className={styles["waiting_participants_box_title"]}>
//             Waiting for entry
//           </span>
//           <img
//             src={CrossIcon}
//             onClick={() => dispatch(participantWaitingListBox(false))}
//             style={{ display: "block", objectFit: "cover" }}
//           />
//         </Col>
//         <Col sm={12} md={12} lg={12}>
//           <TextField
//             placeholder={"Search"}
//             applyClass={"waitingParticipantsSearchField"}
//             change={handleChangeSearchParticipant}
//             value={searchValue}
//           />
//         </Col>
//         <Col sm={12} md={12} lg={12}>
//           <div className={styles["AcceptAndDeniedBtns"]}>
//             <Row>
//               <Col sm={6} md={6} lg={6}>
//                 <Button
//                   className={styles["denyAllBtn"]}
//                   text={"Deny All"}
//                   onClick={() => handleClickAllAcceptAndReject(2)}
//                 />
//               </Col>
//               <Col sm={6} md={6} lg={6}>
//                 <Button
//                   className={styles["AcceptAllBtn"]}
//                   text={"Accept All "}
//                   onClick={() => handleClickAllAcceptAndReject(1)}
//                 />
//               </Col>
//             </Row>
//           </div>
//         </Col>
//         <Col sm={12} md={12} lg={12}>
//           <div
//             className={
//               videoFeatureReducer.NormalizeVideoFlag
//                 ? styles["AcceptAndDeniedManual_Nor"]
//                 : styles["AcceptAndDeniedManual"]
//             }
//           >
//             {participantsList?.length > 0 &&
//               participantsList.map((data, index) => {
//                 console.log(
//                   data,
//                   "participantsListparticipantsListparticipantsList"
//                 );
//                 return (
//                   <Row className="mb-2" key={data.uid}>
//                     <Col
//                       sm={6}
//                       md={6}
//                       lg={6}
//                       className="d-flex align-items-center gap-2"
//                     >
//                       <img
//                         src={UserImage}
//                         className={styles["participantImage"]}
//                       />
//                       <span className={styles["participant_name"]}>
//                         {data.name}
//                       </span>
//                     </Col>
//                     <Col
//                       sm={6}
//                       md={6}
//                       lg={6}
//                       className="d-flex align-items-center gap-2"
//                     >
//                       <Button
//                         className={styles["denyAllBtn-small"]}
//                         text="Deny"
//                         onClick={() => handleClickAcceptAndReject(data, 2)}
//                       />
//                       <Button
//                         className={styles["AcceptAllBtn-small"]}
//                         text={"Accept"}
//                         onClick={() => handleClickAcceptAndReject(data, 1)}
//                       />
//                     </Col>
//                   </Row>
//                 );
//               })}
//           </div>
//         </Col>
//       </Row>
//     </section>
//   );
// };

// export default VideoCallParticipants;
