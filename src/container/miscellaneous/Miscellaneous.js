import React, { useEffect, useState } from "react";
import { Accordian } from "./../../components/elements";
import "./Miscellaneous.css";
import { GetUserFAQs } from "./../../store/actions/Get_Faqs";
import { Row, Col, Card } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { youTubeEmbedUrl } from "../../commen/functions/youtube";
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
        console.error("src/container/miscellaneous/Miscellaneous.js:", error);
      }
    }
  }, [fAQsAllData]);

  return (
    <>
      <section className='faqs_container'>
        {fAQsStateData.map((data, index) => {
          // videoLinkURL may hold a bare id OR a full watch/youtu.be URL. It used
          // to be dropped straight into `embed/${...}`, so a full URL became
          // `embed/https://…watch?v=…` and the player showed "An error occurred…
          // (Playback ID …)". null means no usable id, so no player is rendered.
          const embedUrl = youTubeEmbedUrl(data.videoLinkURL);
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
                            : null}
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
                              : null}
                        </Card.Text>

                        <Row>
                          <Col lg={12} md={12} sm={12} className='p-5'>
                            {embedUrl ? (
                              <div>
                                <div className='ratio ratio-16x9'>
                                  <iframe
                                    width='560'
                                    height='315'
                                    src={embedUrl}
                                    title='YouTube video player'
                                    frameBorder='0'
                                    allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
                                    // YouTube's own embed code now includes this.
                                    // It makes the iframe send the page's origin as
                                    // the Referer even if the host page or server
                                    // sets a stricter Referrer-Policy (e.g.
                                    // no-referrer), which YouTube rejects with the
                                    // same generic "An error occurred" playback error.
                                    referrerPolicy='strict-origin-when-cross-origin'
                                    allowFullScreen></iframe>
                                </div>
                              </div>
                            ) : null}
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
