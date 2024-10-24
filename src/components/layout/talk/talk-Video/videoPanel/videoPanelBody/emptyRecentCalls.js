import React from "react";
import { ResultMessage } from "../../../../../elements";
import NoRecentCalls from "../../../../../../assets/images/Empty-Recent-Calls.png";

const EmptyRecentCalls = () => {
  return (
    <ResultMessage
      icon={<img src={NoRecentCalls} width={250} alt="" />}
      title={"It looks like you haven't made any recent calls"}
      className="emptyRecentCalls"
    />
  );
};

export default EmptyRecentCalls;
