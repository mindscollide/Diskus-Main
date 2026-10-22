import React from "react";
import "./ProgressBarPending.css";

/**
 * @component ProgressLine
 * @description Renders a horizontal segmented progress bar where each segment's width
 * is proportional to its value relative to the total of all segment values. Each segment
 * is independently colored, making this suitable for visualising multi-category
 * breakdowns such as task status (Pending / In-Progress / Completed) in a single bar.
 *
 * @param {Array<Object>} props.segments - Array of segment descriptors that together
 *   define the bar's visual breakdown.
 * @param {number} props.segments[].value - Numeric value of this segment. The rendered
 *   width is `(value / totalOfAllValues) * 100%`.
 * @param {string} props.segments[].color - CSS color string applied as the segment's
 *   background color (e.g. "#4ADEDE", "red", "rgba(0,0,0,0.5)").
 *
 * @example
 * <ProgressLine
 *   segments={[
 *     { value: 5, color: "#59f2b5" },
 *     { value: 3, color: "#F16B6B" },
 *     { value: 2, color: "#4ADEDE" },
 *   ]}
 * />
 */
const ProgressLine = ({ segments }) => {
  // Calculate total sum of all segment values to derive each segment's percentage width
  const total = segments.reduce((acc, segment) => acc + segment.value, 0);

  return (
    <div className="progress-bar">
      {segments.map((segment, index) => (
        <div
          key={index}
          className="progress-segment"
          style={{
            width: `${(segment.value / total) * 100}%`,
            backgroundColor: segment.color,
          }}
        />
      ))}
    </div>
  );
};

export default ProgressLine;
