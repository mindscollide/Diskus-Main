import React from "react";
import { ResultMessage } from "../../../../../elements";
import NoRecentCalls from "../../../../../../assets/images/Empty-Recent-Calls.png";

/**
 * @component EmptyRecentCalls
 * @description Empty-state placeholder displayed inside the recent calls body
 * view when the current user has no call history to show. Renders a
 * `ResultMessage` element with a decorative illustration and a descriptive
 * message prompting the user to make their first call.
 */
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
