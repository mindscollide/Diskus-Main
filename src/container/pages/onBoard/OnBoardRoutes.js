import React from "react";
import { useTour } from "@reactour/tour";
import Header from "./Header/Header";
import NavigationButtons from "./navigtionbuttons/NavigationButtons";
import { Meeting } from "./Meeting/Meeting";
import Sidebar from "./Sidebar/Sidebar";
import { Layout } from "antd";
import OnboardDashboard from "./OnboardDashboard/OnboardDashboard";
import "./../../../steps.css";

const OnBoardRoute = () => {
  const { currentStep } = useTour();
  const { Content, Sider } = Layout;
  return (
    <>
      <Layout>
        <Layout>
          <Sider width={"4%"}>
            <Sidebar />
          </Sider>
          <Content style={{ width: "95%" }}>
            <Header heading="Hello Welcome" user="Tresmark" />
            {currentStep === 2 ? (
              <Meeting pageSize={3} />
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
