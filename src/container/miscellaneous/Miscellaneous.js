import React, { useState, useEffect } from "react";
import {
  Button,
  Accordian,
  Loader,
  Notification,
} from "./../../components/elements";
import "./Miscellaneous.css";
import { GetUserFAQs } from "./../../store/actions/Get_Faqs";
import { Row, Col, Container, Card } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";

const CustomMiscellaneous = () => {
  const state = useSelector((state) => state);

  //import faqsReducer from reducers
  const { fAQsReducer } = state;
  const dispatch = useDispatch();

  const [open, setOpen] = useState({
    flag: false,
    message: "",
  });

  //list of FAQ'S data
  const [userListOfFaqs, setUserListOfFaqs] = useState({
    pK_FAQID: 1,
    question: "",
    answer: "",
    isEnable: true,
    listOfFAQs: [],
  });

  //dispatch user getfaqs api
  useEffect(() => {
    dispatch(GetUserFAQs());
  }, []);

  console.log("fAQsReducer", fAQsReducer);

  let currentLanguage = localStorage.getItem("i18nextLng");

  return (
    <>
      <Container>
        {fAQsReducer.AllFAQsData.map((data) => {
          return (
            <>
              <Row className="mb-3">
                <Col lg={6} md={6} xs={6}>
                  <Accordian
                    // defaultActiveKey={"0"}
                    eventKey="1"
                    flush
                    className={"ABC" + " " + currentLanguage}
                    AccordioonHeader={
                      <Card.Title className="fs-4">{data.question}</Card.Title>
                    }
                    AccordioonBody={
                      <>
                        <Card.Text>{data.answer}</Card.Text>
                      </>
                    }
                  />
                </Col>
              </Row>
            </>
          );
        })}
      </Container>
      {fAQsReducer.Loading ? <Loader /> : null}
    </>
  );
};

export default CustomMiscellaneous;
