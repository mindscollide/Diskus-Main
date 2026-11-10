import React from "react";
import { Col, Row } from "react-bootstrap";
import { Tooltip } from "antd";
import { useTranslation } from "react-i18next";
import EditIcon from "../../../assets/images/Edit-Icon.png";
import BinIcon from "../../../assets/images/bin.svg";

// Edit / Delete icons of a poll row, shared by the polls tables.
// Shown only to the creator of the poll (and only when `enabled`, for the contexts
// that also restrict by group / committee / meeting status).
//  - Unpublished / Published poll: Edit and Delete
//  - Expired poll that was never published: Edit only
//  - Expired poll that was published: Delete only
const iconProps = {
  className: "cursor-pointer",
  width: "21.59px",
  height: "21.59px",
  alt: "",
  draggable: "false",
};

const PollActionsCell = ({
  record,
  userID,
  enabled = true,
  onEdit,
  onDelete,
}) => {
  const { t } = useTranslation();
  if (!enabled || Number(record.pollCreatorID) !== Number(userID)) return null;

  const expired = record.pollStatus.pollStatusId === 3;
  const showEdit = !expired || !record.wasPollPublished;
  const showDelete = !expired || record.wasPollPublished;

  return (
    <Row>
      <Col sm={12} md={5} lg={5}>
        {showEdit && (
          <Tooltip placement='topRight' title={t("Edit")}>
            <img src={EditIcon} {...iconProps} onClick={() => onEdit(record)} />
          </Tooltip>
        )}
      </Col>
      <Col sm={12} md={5} lg={5}>
        {showDelete && (
          <Tooltip placement='topLeft' title={t("Delete")}>
            <img
              src={BinIcon}
              {...iconProps}
              onClick={() => onDelete(record)}
            />
          </Tooltip>
        )}
      </Col>
    </Row>
  );
};

export default PollActionsCell;
