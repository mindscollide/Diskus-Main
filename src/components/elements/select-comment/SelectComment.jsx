import React from "react";
import styles from "./SelectComment.module.css";

/**
 * @component SelectComment
 * @description A clickable comment chip/pill used in comment selection lists or
 * quick-reply menus. Renders the provided text inside a styled wrapper div. The
 * entire card is interactive — clicking anywhere on it fires the onClick callback,
 * making it suitable for predefined comment pickers or template response selectors
 * in Diskus meeting or task comment flows.
 *
 * @param {string} props.text - The comment text to display inside the chip.
 * @param {Function} props.onClick - Callback fired when the comment chip is clicked,
 *   typically used to populate an input field or submit the selected comment.
 *
 * @example
 * <SelectComment
 *   text="Noted, will follow up."
 *   onClick={() => handleSelectComment("Noted, will follow up.")}
 * />
 */
const SelectComment = ({ text, onClick }) => {
  return (
    <>
      <div className={styles["comment-wrapper"]} onClick={onClick}>
        <p className={styles["comment-text"]}>{text}</p>
      </div>
    </>
  );
};

export default SelectComment;
