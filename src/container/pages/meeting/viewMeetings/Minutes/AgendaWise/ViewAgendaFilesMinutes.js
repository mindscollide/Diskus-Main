import React from "react";
import styles from "./AgendaWise.module.css";
import { Col, Row } from "react-bootstrap";
import file_image from "../../../../../../assets/images/file_image.svg";
import {
  getFileExtension,
  getIconSource,
} from "../../../../../DataRoom/SearchFunctionality/option";

const ViewAgendaFilesMinutes = ({
  showMoreIndex,
  Itemsdata,
  showMore,
  detailIndex,
}) => {
  return (
    <>
      <section>
        {showMoreIndex === detailIndex && showMore === true ? (
          <>
            <Row>
              <Col lg={12} md={12} sm={12} className={styles["DocsScroller"]}>
                <Row className="mt-3">
                  {Itemsdata.minutesAttachmets.map((filesname, index) => {
                    console.log(filesname, "filesnamefilesname");
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
                                      getFileExtension(
                                        filesname.displayFileName
                                      )
                                    )}
                                    height="10px"
                                    width="10px"
                                    alt=""
                                    className={styles["IconPDF"]}
                                  />
                                  <span className={styles["FileName"]}>
                                    {filesname.displayFileName}
                                  </span>
                                </Col>
                              </Row>
                            </section>
                          </section>
                        </Col>
                      </>
                    );
                  })}
                  <Col lg={12} md={12} sm={12}></Col>
                </Row>
              </Col>
            </Row>
          </>
        ) : null}
      </section>
    </>
  );
};

export default ViewAgendaFilesMinutes;
