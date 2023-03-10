import React, { useState, useEffect } from "react";
import "./Talk.css";
import { Triangle } from "react-bootstrap-icons";
import { allAssignessList } from "../../../store/actions/Get_List_Of_Assignees";
import { useDispatch, useSelector } from "react-redux";
import TalkChat from "./talk-chat/Talk-Chat";
import TalkVideo from "./talk-Video/TalkVideo";
import { useTranslation } from "react-i18next";
const Talk = () => {
  const { t } = useTranslation();
  let createrID = localStorage.getItem("userID");
  const dispatch = useDispatch();

  // for sub menus Icons
  const [subIcons, setSubIcons] = useState(false);
  const [activeChatBox, setActiveChatBox] = useState(false);

  //for video menu
  const [videoIcon, setVideoIcon] = useState(false);
  const [activeVideoIcon, setActiveVideoIcon] = useState(false);

  // for video Icon Click
  const videoIconClick = () => {
    setActiveVideoIcon(true);
    if (activeVideoIcon === false) {
      setActiveChatBox(false);
    } else {
      setActiveVideoIcon(false);
      setActiveChatBox(false);
    }
  };

  const showsubTalkIcons = () => {
    setSubIcons(!subIcons);
    setActiveChatBox(false);
  };

  let currentLang = localStorage.getItem("i18nextLng");

  const iconClick = () => {
    if (activeChatBox === false) {
      setActiveChatBox(true);
    } else {
      setActiveChatBox(false);
    }
  };

  useEffect(() => {
    dispatch(allAssignessList(parseInt(createrID), t));
  }, []);

  return (
    <div className={"talk_nav" + " " + currentLang}>
      {activeChatBox === true ? (
        <TalkChat />
      ) : activeVideoIcon === true ? (
        <TalkVideo />
      ) : null}
      <div className={subIcons ? "talk-nav-icons" : "border-0"}>
        <div className={subIcons ? "talk_subIcon" : "talk_subIcon_hidden"}>
          <span className="talk-count">1</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="40.144"
            viewBox="0 0 38.586 40.144"
          >
            <defs>
              <linearGradient
                id="linear-gradient"
                x1="0.5"
                x2="0.5"
                y2="1"
                gradientUnits="objectBoundingBox"
              >
                <stop offset="0" stop-color="#4adede" />
                <stop offset="1" stop-color="#6172d6" />
              </linearGradient>
            </defs>
            <g
              id="Group_1347"
              data-name="Group 1347"
              transform="translate(-307.429 -3290.113)"
            >
              <path
                id="Union_7"
                data-name="Union 7"
                d="M-7696.01,3002.017l-.035,0c-.217-.031-.434-.058-.65-.087-.484-.062-.983-.128-1.475-.209a19.745,19.745,0,0,1-9.859-4.669c-.34-.3-.662-.594-.952-.889a1.836,1.836,0,0,1-.041-2.615,1.838,1.838,0,0,1,1.322-.567,1.88,1.88,0,0,1,1.309.542,17.3,17.3,0,0,0,4.269,3.066,16.208,16.208,0,0,0,7.286,1.723,16.279,16.279,0,0,0,11.15-4.344,16.256,16.256,0,0,0,5.112-9.636,16.212,16.212,0,0,0-13.375-18.45,19.917,19.917,0,0,0-3.142-.26c-5.264,0-9.685,2.354-13.15,7,.889,0,1.781,0,2.671,0q.787,0,1.57,0a1.815,1.815,0,0,1,1.744,1.073,1.774,1.774,0,0,1-.219,1.918,1.794,1.794,0,0,1-1.456.716l-1.038,0q-1.524,0-3.053,0c-1.307,0-2.393,0-3.418-.01a1.813,1.813,0,0,1-1.832-1.837c-.013-2.488-.013-5.008,0-7.493a1.81,1.81,0,0,1,1.845-1.843h.021a1.839,1.839,0,0,1,1.835,1.87c0,.439,0,.877,0,1.328a19.988,19.988,0,0,1,11.042-6.115,19.7,19.7,0,0,1,3.74-.36,19.916,19.916,0,0,1,5.951.914,20.342,20.342,0,0,1,5.368,2.594,19.72,19.72,0,0,1,7.426,9.354,20.052,20.052,0,0,1-.5,15.632,20.12,20.12,0,0,1-11.64,10.536,19.091,19.091,0,0,1-5.06,1.047.982.982,0,0,0-.14.029l-.12.029-.051.01Zm-4.226-13.459a1.8,1.8,0,0,1-1.252-1.471,1.848,1.848,0,0,1,.6-1.671c.579-.575,1.166-1.159,1.732-1.727.78-.78,1.587-1.585,2.387-2.375a.356.356,0,0,0,.131-.308c-.008-3.687-.008-7.724,0-12.335a1.84,1.84,0,0,1,1.76-1.969c.027,0,.058,0,.085,0a1.845,1.845,0,0,1,1.853,1.911c0,1.583,0,3.192,0,4.747v1.9c0,.577,0,1.154,0,1.731,0,1.558,0,3.171.008,4.756a2.2,2.2,0,0,1-.675,1.655c-1.082,1.071-2.178,2.164-3.239,3.223q-.72.723-1.444,1.444a1.848,1.848,0,0,1-1.334.589A1.976,1.976,0,0,1-7700.236,2988.558Z"
                transform="translate(8020.708 328.24)"
                fill="url(#linear-gradient)"
              />
            </g>
          </svg>
        </div>
        <div
          className={subIcons ? "talk_subIcon" : "talk_subIcon_hidden"}
          onClick={videoIconClick}
        >
          <span className="talk-count">1</span>
          <svg
            id="Icon_feather-video"
            data-name="Icon feather-video"
            xmlns="http://www.w3.org/2000/svg"
            width="34"
            height="29.4"
            viewBox="0 0 44.65 29.4"
          >
            <defs>
              <linearGradient
                id="linear-gradient"
                x1="0.5"
                x2="0.5"
                y2="1"
                gradientUnits="objectBoundingBox"
              >
                <stop offset="0" stop-color="#4adede" />
                <stop offset="1" stop-color="#6172d6" />
              </linearGradient>
            </defs>
            <path
              id="Union_4"
              data-name="Union 4"
              d="M5.171,29.4A5.176,5.176,0,0,1,0,24.23V5.169A5.175,5.175,0,0,1,5.171,0H26.136a5.175,5.175,0,0,1,5.171,5.169v6.891l11.2-8a1.357,1.357,0,0,1,2.147,1.1V24.23a1.359,1.359,0,0,1-2.147,1.1l-11.2-8V24.23A5.176,5.176,0,0,1,26.136,29.4ZM2.716,5.169V24.23a2.458,2.458,0,0,0,2.456,2.454H26.136a2.457,2.457,0,0,0,2.456-2.454V5.169a2.456,2.456,0,0,0-2.456-2.454H5.171A2.457,2.457,0,0,0,2.716,5.169ZM32.285,14.7l9.649,6.892V7.808Z"
              fill="url(#linear-gradient)"
            />
          </svg>
        </div>
        <div
          className={subIcons ? "talk_subIcon" : "talk_subIcon_hidden"}
          onClick={iconClick}
        >
          <span className="talk-count">2</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="34"
            height="36.444"
            viewBox="0 0 45.792 36.444"
          >
            <defs>
              <linearGradient
                id="linear-gradient"
                x1="0.5"
                x2="0.5"
                y2="1"
                gradientUnits="objectBoundingBox"
              >
                <stop offset="0" stop-color="#4adede" />
                <stop offset="1" stop-color="#6172d6" />
              </linearGradient>
            </defs>
            <path
              id="Union_5"
              data-name="Union 5"
              d="M43.57,36.263c-2.42-.734-4.843-1.464-7.258-2.213a1.106,1.106,0,0,0-.883.082,17.929,17.929,0,0,1-14.44.752,1.055,1.055,0,0,0-.7.018,14.376,14.376,0,0,1-11.919-.271,1.234,1.234,0,0,0-.791-.06c-1.916.555-3.82,1.148-5.731,1.717a1.349,1.349,0,0,1-1.825-1,2.072,2.072,0,0,1,.09-.916c.552-1.871,1.133-3.731,1.678-5.6a1.138,1.138,0,0,0-.045-.749A14.334,14.334,0,0,1,10.738,7.948c.555-.16,1.135-.234,1.7-.381a.963.963,0,0,0,.5-.306A18.017,18.017,0,0,1,43.415,26.228a.878.878,0,0,0-.054.583c.768,2.581,1.553,5.159,2.335,7.737a1.24,1.24,0,0,0,.1.192v.717c-.435.7-.753.986-1.288.986A3.347,3.347,0,0,1,43.57,36.263ZM8.946,31.8a11.517,11.517,0,0,0,4.878,1.468A10.875,10.875,0,0,0,17.186,33c-7.375-5.876-9.53-13.216-6.448-22.135,0,0,0,0-.008,0a.065.065,0,0,0-.04,0c-.057.015-.112.038-.167.059A11.346,11.346,0,0,0,6.032,14,11.491,11.491,0,0,0,4.482,27.27a1.914,1.914,0,0,1,.163,1.663c-.236.657-.417,1.334-.617,2-.19.634-.378,1.267-.583,1.959.186-.045.3-.065.408-.1,1.24-.373,2.482-.737,3.718-1.123a1.9,1.9,0,0,1,.568-.093A1.606,1.606,0,0,1,8.946,31.8ZM23.463,3.291A15.146,15.146,0,0,0,12.23,16.355a14.568,14.568,0,0,0,4.514,12.58A15.083,15.083,0,0,0,34.9,31.29a1.617,1.617,0,0,1,1.331-.135c.936.294,1.878.572,2.82.858L42.34,33c-.632-2.086-1.226-4.067-1.836-6.043a1.764,1.764,0,0,1,.154-1.458A15.106,15.106,0,0,0,42.4,15.487,15.329,15.329,0,0,0,27.358,2.765,14.673,14.673,0,0,0,23.463,3.291ZM21.186,24.5a1.382,1.382,0,1,1,.033-2.753c1.358-.005,2.713,0,4.069,0,1.327,0,2.655,0,3.98,0a1.384,1.384,0,1,1,.057,2.753q-2.1.009-4.205.009Q23.154,24.514,21.186,24.5Zm.05-5.084a1.4,1.4,0,0,1-1.508-1.174,1.352,1.352,0,0,1,.953-1.523,2.162,2.162,0,0,1,.617-.064q3.04-.005,6.077,0c2.086,0,4.171-.005,6.257,0a1.367,1.367,0,0,1,.545,2.633,1.97,1.97,0,0,1-.7.124q-3.708.006-7.415.006Q23.651,19.424,21.236,19.421Zm0-5.09a1.4,1.4,0,0,1-1.511-1.222,1.358,1.358,0,0,1,1.008-1.488,2.275,2.275,0,0,1,.575-.053q3.039-.005,6.078,0t6.078,0a1.393,1.393,0,1,1,.017,2.765l-6.122,0Z"
              transform="translate(0 0)"
              fill="url(#linear-gradient)"
            />
          </svg>
        </div>
      </div>
      <div className="talk_Icon" onClick={showsubTalkIcons}>
        <span className="talk-count total">4</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="34"
          height="36.444"
          viewBox="0 0 44.793 33.62"
        >
          <g
            id="Group_1673"
            data-name="Group 1673"
            transform="translate(-431 -643.948)"
          >
            <path
              id="Path_587"
              data-name="Path 587"
              d="M431,646.226c.058-.145.119-.289.172-.436a2.781,2.781,0,0,1,2.578-1.835c1.093-.015,2.187,0,3.281,0h35.344c2.03,0,2.7.462,3.418,2.362v.875a6.724,6.724,0,0,1-.3.812,2.744,2.744,0,0,1-2.416,1.547c-.174.01-.35,0-.525,0-12.67,0-25.34-.017-38.01.019-1.76.005-2.991-.552-3.539-2.294Z"
              fill="#fff"
            />
            <path
              id="Path_588"
              data-name="Path 588"
              d="M475.793,767.219a6.739,6.739,0,0,1-.3.812,2.744,2.744,0,0,1-2.416,1.547c-.174.01-.35,0-.525,0-12.67,0-25.34-.017-38.01.019-1.76.005-2.991-.552-3.539-2.294v-1.05c.062-.159.125-.318.186-.477a2.812,2.812,0,0,1,2.521-1.794c.175-.006.35,0,.525,0h38.143c2.028,0,2.7.464,3.418,2.362Z"
              transform="translate(0 -106.031)"
              fill="#fff"
            />
            <path
              id="Path_589"
              data-name="Path 589"
              d="M475.793,887.226a6.729,6.729,0,0,1-.3.812,2.744,2.744,0,0,1-2.416,1.547c-.174.01-.35,0-.525,0-12.67,0-25.34-.017-38.01.019-1.76.005-2.991-.552-3.539-2.294v-1.05c.058-.145.119-.289.173-.436a2.8,2.8,0,0,1,2.534-1.836c.175-.006.35,0,.525,0h38.143c2.028,0,2.7.464,3.418,2.362Z"
              transform="translate(0 -212.04)"
              fill="#fff"
            />
          </g>
        </svg>
      </div>
    </div>
  );
};

export default Talk;
