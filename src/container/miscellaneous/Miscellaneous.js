import React, { useEffect } from "react";
import { Accordian } from "./../../components/elements";
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

  const extractYouTubeID = (url) => {
    const regex =
      /(?:https?:\/\/)?(?:www\.)?youtu(?:\.be\/|be\.com\/(?:watch\?v=|embed\/))([\w-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  console.log(currentLanguage, "currentLanguagecurrentLanguage");

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
                    className={`${"ABC"} ${currentLanguage}  `}
                    AccordioonHeader={
                      <Card.Title className="fs-4 FaqsQuestionsStyles">
                        {currentLanguage === "en"
                          ? data.question
                          : data.questionArabic !== ""
                          ? data.questionArabic
                          : data.question}
                      </Card.Title>
                    }
                    AccordioonBody={
                      <>
                        <Card.Text>
                          {currentLanguage === "en"
                            ? data.answer
                            : data.answerArabic !== ""
                            ? data.answerArabic
                            : data.answer}
                        </Card.Text>

                        <Row>
                          <Col lg={12} md={12} sm={12} className="p-5">
                            {data.videoLinkURL && (
                              <div>
                                <div className="ratio ratio-16x9">
                                  <iframe
                                    src={`https://www.youtube.com/embed/${extractYouTubeID(
                                      data.videoLinkURL
                                    )}`}
                                    title="YouTube video player"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    style={{ borderRadius: "20px" }}
                                  ></iframe>
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
