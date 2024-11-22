import React from "react";
import { Progress } from "antd";
import "./ProgressLoader.css";
const ProgressLoader = () => {
  const twoColors = {
    "0%": "#6172d6",
    "100%": "#49dbdb",
  };
  return (
    <section>
      <Progress
        percent={69.9}
        strokeColor={twoColors}
        className="Progress_bar_Loader"
      />
    </section>
  );
};

export default ProgressLoader;
