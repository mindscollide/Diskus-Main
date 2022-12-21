import React from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const ListCountChart = ({ value, text, maxValue }) => {
  return (
    <>
      <CircularProgressbar
        value={value}
        text={text}
        maxValue={maxValue}
        styles={{
          // Customize the root svg element
          root: {},
          // Customize the path, i.e. the "completed progress"
          path: {
            // Path color
            stroke: `#59f2b5`,
            // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
            strokeLinecap: "round",
            // Customize transition animation
            transition: "stroke-dashoffset 0.5s ease 0s",
            // Rotate the path
            transformOrigin: "center center",
            // Stroke width
            strokeWidth: "5px",
          },
          // Customize the circle behind the path, i.e. the "total progress"
          trail: {
            // Trail color
            stroke: "#f16b6b",
            // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
            strokeLinecap: "round",
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
            fontSize: "7px",
          },
        }}
      />
    </>
  );
};
export default ListCountChart;
