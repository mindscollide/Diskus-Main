import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import "./videoPanelHeader.css";
import {
  recentVideoFlag,
  contactVideoFlag,
  videoChatSearchFlag,
} from "../../../../../../store/actions/VideoFeature_actions";
import { Select } from "antd";
import SearchIcon from "../../../../../../assets/images/Search-Icon.png";

const VideoPanelHeader = () => {
  const { videoFeatureReducer } = useSelector((state) => state);

  const dispatch = useDispatch();

  // Chat Filter Options
  const chatFilterOptions = [
    { className: "talk-video-filter", label: "Recent", value: 2 },
    { className: "talk-video-filter", label: "Contact", value: 1 },
  ];

  //Chat Filter State
  const [chatFilter, setChatFilter] = useState({
    value: 2,
    label: "Recent",
  });

  // for   select Chat Filter Name
  const [chatFilterName, setChatFilterName] = useState("Contact");

  useEffect(() => {
    if (videoFeatureReducer.ContactVideoFlag) {
      setChatFilterName("Contact");
    } else if (videoFeatureReducer.RecentVideoFlag) {
      setChatFilterName("Recent");
    }
  }, []);

  // Onchange Select Filter
  const chatFilterHandler = (e, value) => {
    if (value.label != undefined) {
      // try {

      if (value.label != chatFilter.label) {
        if (Object.keys(chatFilterOptions).length > 0) {
          chatFilterOptions.filter((data, index) => {
            if (data.label === value.label) {
              setChatFilter({
                label: data.label,
                value: data.value,
              });
            }
          });
        }
        setChatFilterName(value.label);
      } else {
      }
      try {
        if (value.label !== chatFilter.label) {
          if (value.label === "Contact") {
            dispatch(recentVideoFlag(false));
            dispatch(videoChatSearchFlag(false));
            dispatch(contactVideoFlag(true));
          } else if (value.label === "Recent") {
            dispatch(recentVideoFlag(true));
            dispatch(videoChatSearchFlag(false));
            dispatch(contactVideoFlag(false));
          } else {
          }
        } else {
        }
      } catch {}
    }
  };

  const videoSearchFilterChat = () => {
    if (videoFeatureReducer.VideoChatSearchFlag) {
      dispatch(videoChatSearchFlag(false));
    } else {
      dispatch(videoChatSearchFlag(true));
    }
  };

  const preventPropagation = (event) => {
    event.stopPropagation();
  };

  return (
    <>
      <section className="d-flex justify-content-between">
        <div className="d-flex align-items-center gap-2">
          <p className="talk-video-heading m-0">Video</p>
          <Select
            options={chatFilterOptions}
            defaultValue={chatFilterOptions[0]}
            onChange={chatFilterHandler}
            className="videoFilter"
            popupClassName="talk-video-filter"
            onClick={preventPropagation}
          />
        </div>
        <div
          className="d-flex align-items-center justify-content-center cursor-pointer"
          onClick={videoSearchFilterChat}
        >
          <img src={SearchIcon} className="img-cover" width={20} />
        </div>
      </section>
    </>
  );
};

export default VideoPanelHeader;
