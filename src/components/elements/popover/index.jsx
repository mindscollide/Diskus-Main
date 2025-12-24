import React, { useState } from "react";
import { Popover } from "antd";
import "./popOver.css";
import { getFileExtension } from "../../../container/DataRoom/SearchFunctionality/option";
import { fileFormatforSignatureFlow } from "../../../commen/functions/utils";

const MenuPopover = ({
  imageImage,
  listData,
  listOnClickFunction,
  t,
  record,
}) => {
  const [visible, setVisible] = useState(false); // State to manage visibility of the Popover

  const handleVisibleChange = (newVisible) => {
    setVisible(newVisible); // Toggle Popover visibility
  };

  const handleItemClick = (optionVal) => {
    let fileData;
    if (!record.isFolder) {
      let fileExtension = getFileExtension(record.name);

      let checkifSignatureFlow =
        fileFormatforSignatureFlow.includes(fileExtension);
      if (checkifSignatureFlow) {
        fileData = {
          taskId: record.id,
          commingFrom: 4,
          fileName: record.name,
          attachmentID: record.id,
          isPermission: record.permissionID,
          isNew: true,
        };
      } else {
        fileData = {
          taskId: record.id,
          commingFrom: 4,
          fileName: record.name,
          attachmentID: record.id,
          isPermission: record.permissionID,
        };
      }
    }
    let convertIntoJSONStringfy = JSON.stringify(fileData);

    listOnClickFunction(optionVal, record, convertIntoJSONStringfy); // Perform the passed function
    setVisible(false); // Hide the Popover
  };

  const content = (
    <div className='popOver_content'>
      <ul className='popOver_ulList'>
        {listData(t).map((listdata, index) => (
          <li
            key={index}
            className='popOver_li_options'
            onClick={() => handleItemClick(listdata)} // Call the handler
            style={{ cursor: "pointer", }}>
            {listdata.label}
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <Popover
      content={content}
      trigger='click'
      placement='bottom'
      overlayClassName='menu-popover'
      showArrow={false}
      visible={visible} // Controlled visibility
      onVisibleChange={handleVisibleChange} // Track visibility changes
    >
      <span
        style={{
          width: "25px",
          cursor: "pointer",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}>
        <img src={imageImage} style={{ cursor: "pointer" }} alt='menu' />
      </span>
    </Popover>
  );
};

export default MenuPopover;
