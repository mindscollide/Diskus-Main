import React, { useEffect, useState } from "react";
import { Accordian } from "./../../components/elements";
import "./Miscellaneous.css";
import { GetUserFAQs } from "./../../store/actions/Get_Faqs";
import { Row, Col, Card } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
const CustomMiscellaneous = () => {
  const fAQsAllData = useSelector((state) => state.fAQsReducer.AllFAQsData);
  const { t } = useTranslation();
  const [fAQsStateData, setFAQsStateData] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  //dispatch user getfaqs api
  useEffect(() => {
    dispatch(GetUserFAQs(navigate, t));
  }, []);

  let currentLanguage = localStorage.getItem("i18nextLng");

  useEffect(() => {
    if (Array.isArray(fAQsAllData) && fAQsAllData.length > 0) {
      try {
        setFAQsStateData(fAQsAllData);
      } catch (error) {
        
      }
    }
  }, [fAQsAllData]);

  

  return (
    <>
      <section className='faqs_container'>
        {fAQsStateData.map((data, index) => {
          return (
            <>
              <Row className='mb-3' key={data.key}>
                <Col lg={12} md={12} xs={12}>
                  <Accordian
                    // defaultActiveKey={"0"}
                    eventKey='1'
                    flush
                    className={`${"ABC"} ${currentLanguage}  `}
                    AccordioonHeader={
                      <Card.Title className='fs-4 FaqsQuestionsStyles'>
                        {currentLanguage === "en" && data.question !== ""
                          ? data.question
                          : currentLanguage === "ar" &&
                            data.questionArabic !== ""
                          ? data.questionArabic
                          : data.question}
                      </Card.Title>
                    }
                    AccordioonBody={
                      <>
                        <Card.Text>
                          {currentLanguage === "en" && data.answer !== ""
                            ? data.answer
                            : currentLanguage === "ar" &&
                              data.answerArabic !== ""
                            ? data.answerArabic
                            : data.answer}
                        </Card.Text>

                        <Row>
                          <Col lg={12} md={12} sm={12} className='p-5'>
                            {data.videoLinkURL !== "" && (
                              <div>
                                <div className='ratio ratio-16x9'>
                                  <iframe
                                    width='560'
                                    height='315'
                                    src='https://www.youtube.com/embed/dQw4w9WgXcQ'
                                    title='YouTube video player'
                                    frameborder='0'
                                    allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                                    allowfullscreen></iframe>
                                </div>
                              </div>
                            )}
                          </Col>
                        </Row>
                      </>
                    }
                  />
                </Col>
              </Row>
            </>
          );
        })}
      </section>
    </>
  );
};

export default CustomMiscellaneous;
