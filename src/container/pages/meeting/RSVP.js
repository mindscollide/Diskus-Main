import React, { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
const RSVP = () => {
  const currentUrl = window.location.href;
  const navigate = useNavigate();
  const [rsvp, setRSVP] = useState("");
  useEffect(() => {
    if (
      currentUrl.includes("DisKus/Meeting/Useravailabilityformeeting?action=")
    ) {
      const remainingString = currentUrl.split("?action=")[1];
      if(remainingString){
      setRSVP(remainingString);

      }
      // Save something in local storage if the condition is true
    } else {
      let RSVP = localStorage.getItem("RSVP");
      if (RSVP !== undefined && RSVP !== null) {
        setRSVP(RSVP);
        alert("RSVP");
      } else {
        navigate("/Diskus/Meeting");
      }
    }
  }, []);

  useEffect(() => {
    if (rsvp !== "") {
      localStorage.removeItem("RSVP");
    }
  }, [rsvp]);

  return <div>RSVP</div>;
};
export default RSVP;
