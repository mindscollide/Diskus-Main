import React from "react";
import styles from "./SelectComment.module.css";

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
