import React from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

/**
 * @component ListCountChart
 * @description Renders a circular progress bar designed for displaying list/item count
 * ratios (e.g. completed vs total tasks). Uses a two-tone color scheme: a green path
 * (#59f2b5) for completed progress and a red trail (#f16b6b) for the remaining portion.
 * The center text and a 0.5s ease animation on the progress arc make it suitable for
 * at-a-glance count summaries on dashboard widgets or summary panels.
 *
 * @param {number} props.value - The current progress value (e.g. number of completed items).
 * @param {string} props.text - Text displayed in the center of the circle
 *   (e.g. "5/10" or "50%").
 * @param {number} props.maxValue - The maximum value representing 100% completion.
 *   Used to calculate the filled arc length.
 *
 * @example
 * <ListCountChart value={7} text="7/10" maxValue={10} />
 */
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
