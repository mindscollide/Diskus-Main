import React from "react";
import styles from "./AttendeesCard.module.css";

/**
 * @component AttendeesCard
 * @description Displays an attendee's name and designation with a color-coded
 * background that reflects their availability status for a meeting. The card
 * style changes based on the attendeeAvailability primary key (pK_AAID):
 *   - 1: Awaiting response
 *   - 2: Attending
 *   - 3: Not attending
 *   - 4: Maybe attending
 *
 * @param {Object} props.CardData - The full attendee data object.
 * @param {Object} props.CardData.user - The user details for the attendee.
 * @param {string} props.CardData.user.name - Full name of the attendee.
 * @param {string} props.CardData.user.designation - Job designation of the attendee.
 * @param {Object} props.CardData.attendeeAvailability - Availability status object.
 * @param {number} props.CardData.attendeeAvailability.pK_AAID - Numeric ID representing
 *   the attendee's availability status (1=Awaiting, 2=Attending, 3=Not Attending, 4=Maybe).
 *
 * @example
 * <AttendeesCard
 *   CardData={{
 *     user: { name: "John Doe", designation: "Manager" },
 *     attendeeAvailability: { pK_AAID: 2 }
 *   }}
 * />
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
