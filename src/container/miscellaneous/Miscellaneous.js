import React, { useEffect } from "react";
import { Accordian, Loader } from "./../../components/elements";
import "./Miscellaneous.css";
import { GetUserFAQs } from "./../../store/actions/Get_Faqs";
import { Row, Col, Card } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
const CustomMiscellaneous = () => {
  const state = useSelector((state) => state);
  const { t } = useTranslation();
  const { fAQsReducer } = state;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //dispatch user getfaqs api
  useEffect(() => {
    dispatch(GetUserFAQs(navigate, t));
  }, []);

  let currentLanguage = localStorage.getItem("i18nextLng");

  return (
    <>
      <section className="faqs_container">
        {fAQsReducer.AllFAQsData.map((data, index) => {
          return (
            <>
              <Row className="mb-3" key={index}>
                <Col lg={7} md={7} xs={7}>
                  <Accordian
                    // defaultActiveKey={"0"}
                    eventKey="1"
                    flush
                    className={"ABC" + " " + currentLanguage}
                    AccordioonHeader={
                      <Card.Title className="fs-4 FaqsQuestionsStyles">
                        {data.question}
                      </Card.Title>
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
      </section>
      {fAQsReducer.Loading ? <Loader /> : null}
    </>
  );
};

export default CustomMiscellaneous;
