import React, { useState } from "react";
import styles from "./CreateFromScratch.module.css";
import RedCroseeIcon from "../../../../../../assets/images/CrossIcon.svg";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import profile from "../../../../../../assets/images/newprofile.png";
import { Col, Row } from "react-bootstrap";
import EditIcon from "../../../../../../assets/images/Edit-Icon.png";

const CreateFromScratch = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showScratchFiles, setshowScratchFiles] = useState([
    {
      name: "Contrary to popular belief,There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc. Lorem  Ipsum is not simply random text. It has  Ipsum is not simply random text. It has  Ipsum is not simply random text. It has  Ipsum is not simply random text. It has  Ipsum is not simply random text. It has  Ipsum is not simply random text. It has  Ipsum is not simply random text. It has  Ipsum is not simply random text. It has  Ipsum is not simply random text. It has  Ipsum is not simply random text. It has  Ipsum is not simply random text. It has  Ipsum is not simply random text. It has  Ipsum is not simply random text. It has  Ipsum is not simply random text. It has  Ipsum is not simply random text. It has  Ipsum is not simply random text. It has  Ipsum is not simply random text. It has Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of de Finibus Bonorum et Malorum (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum,Lorem ipsum dolor sit amet.., comes from a line in section 1.10.32.",
    },
  ]);

  const handleRemoveFiles = (index) => {
    let optionscross = [...showScratchFiles];
    optionscross.splice(index, 1);
    setshowScratchFiles(optionscross);
  };

  const maxVisibleChars = 240;
  const [expanded, setExpanded] = useState(false);

  const toggleExpansion = () => {
    setExpanded(!expanded);
  };

  return (
    <section>
      <Row className={styles["Scroller"]}>
        {showScratchFiles.length > 0
          ? showScratchFiles.map((data, index) => {
              console.log(data, "datadatadatadatadata");
              return (
                <>
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className={styles["Box_Minutes"]}
                  >
                    <Row>
                      <Col lg={9} md={9} sm={9}>
                        <Row className="mt-3">
                          <Col lg={12} md={12} sm={12}>
                            <span className={styles["Title_File"]}>
                              {expanded ? (
                                <>{data.name.substring(0, 190)}...</>
                              ) : (
                                <>{data.name}</>
                              )}

                              <span
                                className={styles["Show_more_Styles"]}
                                onClick={toggleExpansion}
                              >
                                {expanded ? t("See-more") : t("See-less")}
                              </span>
                            </span>
                          </Col>
                        </Row>
                        <Row className="mt-1">
                          <Col lg={12} md={12} sm={12}>
                            <span className={styles["Date_Minutes_And_time"]}>
                              4:00pm, 18th May, 2020
                            </span>
                          </Col>
                        </Row>
                      </Col>
                      <Col lg={3} md={3} sm={3} className="mt-4">
                        <Row className="d-flex justify-content-end">
                          <Col lg={2} md={2} sm={2}>
                            <img
                              src={profile}
                              height="39px"
                              width="39px"
                              className={styles["Profile_minutes"]}
                            />
                          </Col>
                          <Col
                            lg={6}
                            md={6}
                            sm={6}
                            className={styles["Line_heigh"]}
                          >
                            <Row>
                              <Col lg={12} md={12} sm={12}>
                                <span className={styles["Uploaded_heading"]}>
                                  {t("Uploaded-by")}
                                </span>
                              </Col>
                            </Row>
                            <Row>
                              <Col lg={12} md={12} sm={12}>
                                <span className={styles["Name"]}>
                                  Mehtab Ahmed
                                </span>
                              </Col>
                            </Row>
                          </Col>
                          <Col
                            lg={3}
                            md={3}
                            sm={3}
                            className="d-flex justify-content-start align-items-center"
                          >
                            <img
                              src={EditIcon}
                              height="21.55px"
                              width="21.55px"
                              className="cursor-pointer"
                            />
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                    <img
                      src={RedCroseeIcon}
                      height="20.76px"
                      width="20.76px"
                      className={styles["RedCrossClass"]}
                      onClick={() => {
                        handleRemoveFiles(index);
                      }}
                    />
                  </Col>
                </>
              );
            })
          : null}
      </Row>
    </section>
  );
};

export default CreateFromScratch;
