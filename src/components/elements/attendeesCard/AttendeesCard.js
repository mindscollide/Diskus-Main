/**
 * @file AttendeesCard.js
 * @description Card component showing an attendee's name, designation, and attendance availability status with colour coding.
 */

import React from "react";
import styles from "./AttendeesCard.module.css";

/**
 * Renders an attendee card with status-based styling (attending, maybe, not attending, awaiting).
 * @param {{ CardData: { user: { name: string, designation: string }, attendeeAvailability: { pK_AAID: number } } }} props
 * @returns {JSX.Element}
 */
const AttendeesCard = ({ CardData }) => {
  const { user, attendeeAvailability } = CardData;
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
      }
    >
      <span className={styles["AttendeesName"]}>{user.name}</span>
      <span className={styles["AttendeeDesgination"]}>{user.designation}</span>
    </div>
  );
};

export default AttendeesCard;
