import React, { useState } from "react";
import { useTour } from "@reactour/tour";
import Header from "./Header/Header";
import { Row, Col } from "react-bootstrap";
import { ChevronLeft, ChevronRight } from "react-bootstrap-icons";
import NavigationButtons from "./navigtionbuttons/NavigationButtons";
import { Button } from "../../../components/elements";
import { useNavigate } from "react-router-dom";
import { Meeting } from "./Meeting/Meeting";
import Sidebar from "./Sidebar/Sidebar";
import { TodoList } from "./Todolist/Todolist";
import { useSelector, useDispatch } from "react-redux";
import {
  showModalOnboard,
  showIsDetailOnboard,
  showIsAgendaOnboard,
  showIsAttendeesOnboard,
} from "../../../store/actions/OnBoardStates";
import Home from "../home/Home";
import Header2 from "../../../components/layout/header2/Header2";
import "./../../../steps.css";

const OnBoardRoute = () => {
  const dispatch = useDispatch();
  const { currentStep, setCurrentStep } = useTour();
  const [show, setShow] = useState(false);
  const [isDetails, setIsDetails] = useState(true);
  const [isAttendees, setIsAttendees] = useState(false);
  const [isAgenda, setIsAgenda] = useState(false);
  const navigate = useNavigate();
  console.log("main show", show);
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
          <Home />
        )}
        {/* <Home /> */}
        {/* <Meeting style="mt-3 bg-white border" pageSize={3} /> */}
        {/* <TodoList /> */}
      </Col>
      <Col sm={12} lg={1} md={1}>
        <NavigationButtons />
      </Col>
    </Row>
  );
};

export default OnBoardRoute;
