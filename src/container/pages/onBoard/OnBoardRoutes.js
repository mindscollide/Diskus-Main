import React, { useState } from "react";
import { useTour } from "@reactour/tour";
import Header from "./Header/Header";
import { Row, Col } from "react-bootstrap";
import NavigationButtons from "./navigtionbuttons/NavigationButtons";
import { useNavigate } from "react-router-dom";
import { Meeting } from "./Meeting/Meeting";
import Sidebar from "./Sidebar/Sidebar";
import { Layout } from "antd";
// import Home from "../home/Home";
import OnboardDashboard from "./OnboardDashboard/OnboardDashboard";
import Header2 from "../../../components/layout/header2/Header2";
import "./../../../steps.css";

const OnBoardRoute = () => {
  const { currentStep } = useTour();
  const { Content, Sider } = Layout;
  return (
    <>
      <Layout >
        <Layout>
          <Sider width={"4%"}>
            <Sidebar />
          </Sider>
          <Content style={{ width: "95%" }}>
            <Header heading='Hello Welcome' user='Tresmark' />
            {currentStep === 2 ? (
              <Meeting style='' pageSize={3} />
            ) : (
              <OnboardDashboard />
            )}
            <NavigationButtons />
          </Content>
        </Layout>
      </Layout>
    </>
  );
};

export default OnBoardRoute;
