import React from "react";
import MultiProgress from "react-multi-progress";
import "./ProgressStats.css";

const ProgressStats = ({
  firstValue,
  FirstColor,
  secondValue,
  secondColor,
  thirdValue,
  thirdColor,
}) => {
  const elements = [
    {
      value: firstValue,
      color: FirstColor,
      showPercentage: firstValue !== 0 ? `${firstValue}%` : null,
      className: "FirstElement",
    },
    {
      value: secondValue,
      color: secondColor,
      showPercentage: secondValue !== 0 ? `${secondValue}%` : null,
      className: "SecondElement",
    },
    {
      value: thirdValue,
      color: thirdColor,
      showPercentage: thirdValue !== 0 ? `${thirdValue}%` : null,
      className: "ThirdElement",
    },
  ].filter((element) => element.value > 0); // Filter out elements with value 0

  return (
    <div className="multi-progress-container">
      <MultiProgress
        height={35}
        elements={elements}
        backgroundColor="#ffffff"
        fontColor="#fff"
        fontSize={12}
        fontWeight="bold"
        round={true}
        roundLastElement={true}
        transitionDuration={1}
      />
    </div>
  );
};

export default ProgressStats;
