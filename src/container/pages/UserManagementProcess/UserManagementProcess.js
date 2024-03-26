import React, { useState } from "react";
import SignInComponent from "../UserMangement/SignInUserManagement/SignInUserManagement";

const UserManagementProcess = () => {
  const [currentStep, setCurrentStep] = useState(0); // Start from step 1

  // Render the appropriate step based on the currentStep state
  switch (currentStep) {
    case 1:
      return <SignInComponent />;
    case 2:
      return "This is Step 2!";
    // Add cases for other steps as needed
    default:
      return null; // or any fallback UI if currentStep is invalid
  }
};

export default UserManagementProcess;
