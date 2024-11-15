import React, { useEffect, useState } from "react";
import "./ProgressBarPending.css";

const ProgressLine = ({ segments }) => {
  // Calculate total sum of all segment values
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
