import React from "react";
import { CircularProgressbarWithChildren } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import "./CircularProgressbar.css";

/**
 * @component CustomTextProgressbar
 * @description An extended circular progress bar that supports arbitrary child content
 * rendered inside and below the circle. Built on `CircularProgressbarWithChildren`,
 * it uses a red path (#F16B6B) for the progress arc and a teal trail (#4ADEDE) for the
 * background ring — the inverse color scheme from ListCountChart, making it visually
 * distinct for pending/overdue metrics. An additional `props.children` slot is rendered
 * in a div below the circle, useful for supplementary labels or sub-metrics on dashboard
 * widgets.
 *
 * @param {number} props.value - The current progress value.
 * @param {React.ReactNode} props.text - Content rendered inside the circle (passed as
 *   children to CircularProgressbarWithChildren, so rich markup is supported).
 * @param {number} props.maxValue - The maximum value representing 100% of the arc.
 * @param {React.ReactNode} [props.children] - Additional content rendered in a div
 *   below the circle (e.g. a legend or count breakdown).
 *
 * @example
 * <CustomTextProgressbar value={3} text={<span>3</span>} maxValue={10}>
 *   <p>Pending Items</p>
 * </CustomTextProgressbar>
 */
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
