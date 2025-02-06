import React, { useLayoutEffect, useState } from "react";
import { Progress } from "antd";
import "./ProgressLoader.css";

const ProgressLoader = ({ progress }) => {
  const currentUrl = window.location.href;
  const [twoColors, setTwoColors] = useState({
    "0%": "#6172d6",
    "100%": "#49dbdb",
  });

  useLayoutEffect(() => {
    const currentLanguage = localStorage.getItem("i18nextLng");
    const updatedColors = {
      "0%": currentLanguage === "en" ? "#6172d6" : "#49dbdb",
      "100%": currentLanguage === "en" ? "#49dbdb" : "#6172d6",
    };
    setTwoColors(updatedColors);
  }, []); // Dependency array ensures this runs once after component mounts

  return (
    <section>
      {/* Commenting the Progress bar due to 0011401: Diskus Loader (CR Priority 128) */}
      {/* <Progress
        percent={progress}
        strokeColor={twoColors}
        className={currentUrl.toLowerCase().includes("/Diskus".toLowerCase()) || currentUrl.toLowerCase().includes("/Admin".toLowerCase()) ?  "Progress_bar_Loader" : "Progress_bar_Loader_auth"}
      /> */}
    </section>
  );
};

export default ProgressLoader;
