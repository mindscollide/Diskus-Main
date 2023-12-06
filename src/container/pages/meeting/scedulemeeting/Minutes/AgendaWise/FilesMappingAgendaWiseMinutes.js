import React from "react";
import styles from "./AgendaWise.module.css";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Col, Row } from "react-bootstrap";
import file_image from "../../../../../../assets/images/file_image.svg";
import {
  getFileExtension,
  getIconSource,
} from "../../../../../DataRoom/SearchFunctionality/option";
const FilesMappingAgendaWiseMinutes = ({
  showMoreIndex,
  Itemsdata,
  showMore,
  detailIndex,
}) => {
  return (
    <section>
      {showMoreIndex === detailIndex && showMore === true ? (
        <>
          <Row>
            <Col lg={12} md={12} sm={12} className={styles["DocsScroller"]}>
              <Row className="mt-3">
                {Itemsdata.minutesAttachmets.map((filesname, index) => {
                  return filesname.files.map((fileData, index) => {
                    console.log(fileData, "fileDatafileDatafileData");
                    return (
                      <>
                        <Col
                          lg={3}
                          md={3}
                          sm={12}
                          className="position-relative gap-2"
                        >
                          <section className={styles["Outer_Box"]}>
                            <Row>
                              <Col lg={12} md={12} sm={12}>
                                <img
                                  src={file_image}
                                  width={"100%"}
                                  alt=""
                                  draggable="false"
                                />
                              </Col>
                            </Row>

                            <section className={styles["backGround_name_Icon"]}>
                              <Row className="mb-2">
                                <Col
                                  lg={12}
                                  md={12}
                                  sm={12}
                                  className={styles["IconTextClass"]}
                                >
                                  <img
                                    src={getIconSource(
                                      getFileExtension(fileData.displayFileName)
                                    )}
                                    height="10px"
                                    alt=""
                                    width="10px"
                                    className={styles["IconPDF"]}
                                  />
                                  <span className={styles["FileName"]}>
                                    {fileData.displayFileName}
                                  </span>
                                </Col>
                              </Row>
                            </section>
                          </section>
                        </Col>
                      </>
                    );
                  });
                })}
                <Col lg={12} md={12} sm={12}></Col>
              </Row>
            </Col>
          </Row>
        </>
      ) : null}
    </section>
  );
};

export default FilesMappingAgendaWiseMinutes;
