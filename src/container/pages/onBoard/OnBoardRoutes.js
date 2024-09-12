import React, { useState } from "react";
import { useTour } from "@reactour/tour";
import Header from "./Header/Header";
import { Row, Col } from "react-bootstrap";
import NavigationButtons from "./navigtionbuttons/NavigationButtons";
import { useNavigate } from "react-router-dom";
import { Meeting } from "./Meeting/Meeting";
import Sidebar from "./Sidebar/Sidebar";
// import Home from "../home/Home";
import OnboardDashboard from "./OnboardDashboard/OnboardDashboard";
import Header2 from "../../../components/layout/header2/Header2";
import "./../../../steps.css";

const OnBoardRoute = () => {
  const { currentStep } = useTour();
  const navigate = useNavigate();
  return (
    <Row className="m-0 ">
      <Col className="m-0 p-0">
        <Sidebar />
      </Col>
      <Col sm={12}>
        <Header heading="Hello Welcome" user="Tresmark" />
        {currentStep === 2 ? (
          <Meeting style="mt-3 bg-white border" pageSize={3} />
        ) : (
          <OnboardDashboard />
        )}
      </Col>
      <Col sm={12} lg={1} md={1}>
        <NavigationButtons />
      </Col>
    </Row>
  );
};

export default OnBoardRoute;
