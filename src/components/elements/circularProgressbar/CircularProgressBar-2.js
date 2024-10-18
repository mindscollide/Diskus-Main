import React from "react";
import { CircularProgressbarWithChildren } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import "./CircularProgressbar.css";
const CustomTextProgressbar = (props) => {
  const { value, text, maxValue } = props;

  return (
    <div className="circular_progressbar_div">
      <CircularProgressbarWithChildren
        value={value}
        className="circular_progress_counter"
        maxValue={maxValue}
        styles={{
          // Customize the root svg element
          root: {},
          // Customize the path, i.e. the "completed progress"
          path: {
            // Path color
            stroke: `#F16B6B`,
            // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
            strokeLinecap: "butt",
            // Customize transition animation
            transition: "stroke-dashoffset 0.5s ease 0s",
            // Rotate the path
            transformOrigin: "center center",
            // Stroke width
            strokeWidth: "4px",
          },
          // Customize the circle behind the path, i.e. the "total progress"
          trail: {
            // Trail color
            stroke: "#4ADEDE",
            // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
            strokeLinecap: "butt",
            // Rotate the trail
            transformOrigin: "center center",
            // Stroke width
            strokeWidth: "2px",
          },
          // // Customize the text
          text: {
            // Text color
            fill: "#000",
            // Text size
          },
        }}
      >
        {text}
      </CircularProgressbarWithChildren>
      <div className="dashboard_progress_bar">{props.children}</div>
    </div>
  );
};

export default CustomTextProgressbar;
