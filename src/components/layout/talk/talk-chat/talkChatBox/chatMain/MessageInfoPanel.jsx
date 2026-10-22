import React from "react";
import { useTranslation } from "react-i18next";
import { newTimeFormaterMIAsPerUTCTalkDateTime } from "../../../../../../commen/functions/date_formater";
import CloseChatIcon from "../../../../../../assets/images/Cross-Chat-Icon.png";
import DoubleTickIcon from "../../../../../../assets/images/DoubleTick-Icon.png";
import DoubleTickDeliveredIcon from "../../../../../../assets/images/DoubleTickDelivered-Icon.png";
import SingleTickIcon from "../../../../../../assets/images/SingleTick-Icon.png";

const MessageInfoPanel = ({ messageInfoData, lang, onClose }) => {
  const { t } = useTranslation();
  return (
    <div className="talk-screen-innerwrapper">
      <div className="message-body talk-screen-content">
        <div className="message-heading d-flex mb-2">
          <span className="text-left heading-info">{t("Message-info")}</span>
          <span className="text-right ml-auto">
            <img
              draggable="false"
              onClick={onClose}
              src={CloseChatIcon}
              alt=""
              width={10}
              className="cursor-pointer"
            />
          </span>
        </div>
        <div className="message-info-item">
          <div className="Sent-with-icon">
            <div className="heading-info status">{t("Sent")}</div>
            <img draggable="false" src={SingleTickIcon} alt="" />
          </div>
          <div className="time-info">
            {messageInfoData.sentDate === undefined ? (
              <p className="m-0">-</p>
            ) : (
              newTimeFormaterMIAsPerUTCTalkDateTime(
                messageInfoData.sentDate,
                lang,
              )
            )}
          </div>
        </div>
        <div className="message-info-item">
          <div className="Sent-with-icon">
            <div className="heading-info status">{t("Delivered")}</div>
            <img draggable="false" src={DoubleTickDeliveredIcon} alt="" />
          </div>
          <div className="time-info">
            {messageInfoData.receivedDate === undefined ||
            messageInfoData.receivedDate === "" ? (
              <p className="m-0">-</p>
            ) : (
              newTimeFormaterMIAsPerUTCTalkDateTime(
                messageInfoData.receivedDate,
                lang,
              )
            )}
          </div>
        </div>
        <div className="message-info-item">
          <div className="Sent-with-icon">
            <div className="heading-info status">{t("Read")}</div>
            <img draggable="false" src={DoubleTickIcon} alt="" />
          </div>
          <div className="time-info">
            {messageInfoData.seenDate === undefined ||
            messageInfoData.seenDate === "" ? (
              <p className="m-0">-</p>
            ) : (
              newTimeFormaterMIAsPerUTCTalkDateTime(
                messageInfoData.seenDate,
                lang,
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageInfoPanel;
