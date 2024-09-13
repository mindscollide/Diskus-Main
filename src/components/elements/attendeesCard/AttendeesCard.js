import React from "react";
import styles from "./AttendeesCard.module.css";
const AttendeesCard = ({ CardData }) => {
  console.log(CardData, "CardDataCardDataCardData");
  const { user, attendeeAvailability } = CardData;
  let status = 3;
  return (
    <div
      className={
        attendeeAvailability.pK_AAID === 2
          ? styles["AttendeesCard_attending"]
          : attendeeAvailability.pK_AAID === 4
          ? styles["AttendeesCard_Maybe"]
          : attendeeAvailability.pK_AAID === 3
          ? styles["AttendeesCard_NotAttending"]
          : attendeeAvailability.pK_AAID === 1
          ? styles["AttendeesCard_awaiting"]
          : null
      }>
      <span className={styles["AttendeesName"]}>{user.name}</span>
      <span className={styles["AttendeeDesgination"]}>{user.designation}</span>
    </div>
  );
};

export default AttendeesCard;
