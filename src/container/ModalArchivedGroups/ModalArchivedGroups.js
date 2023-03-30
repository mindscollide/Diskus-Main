import React, { useState, useRef, useEffect } from "react";
import {
  TextField,
  Button,
  Modal,
  Notification,
  EmployeeCard,
} from "../../components/elements";
import Card from '../../components/elements/Card/Card'
import { PlusSquareFill, Star } from "react-bootstrap-icons";
import { Row, Col, Container } from "react-bootstrap";
import styles from "./ModalArchivedGroups.module.css";
import right from "../../assets/images/right.svg";
import "bootstrap/dist/css/bootstrap.min.css";
import clockarrow from "../../assets/images/arrow-clockwise.svg";
import Carousel from "react-bootstrap/Carousel";
import profile from "../../assets/images/profile.svg";
import editicon from "../../assets/images/editicon.png";
import doticon from "../../assets/images/doticon.png";
import liststone from "../../assets/images/listone.svg";
import clipone from "../../assets/images/clip.svg";
import cliptwo from "../../assets/images/cliptwo.svg";
import chart from "../../assets/images/chart.svg";
import picprofile from "../../assets/images/picprofile.png";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from 'react-i18next'
import { getGroups } from "../../store/actions/Groups_actions";

const ModalArchivedGroups = ({ ModalTitle, updateNotes, setUpdateNotes }) => {
  const [archivedgroup, setArchivedGroups] = useState(true);
  const [archievedGroupData, setArchivedGroupData] = useState([])
  const { GroupsReducer } = useSelector(state => state)
  const { t } = useTranslation()
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(getGroups(t));
  }, []);
  useEffect(() => {
    if (
      GroupsReducer.getAllGroupsResponse !== null &&
      GroupsReducer.getAllGroupsResponse !== undefined &&
      GroupsReducer.getAllGroupsResponse.length > 0
    ) {
      console.log(GroupsReducer.getAllGroupsResponse, "getAllGroupsResponse")
      let findArcheived = GroupsReducer.getAllGroupsResponse.find((data, index) => data.groupStatusID === 2);
      console.log(findArcheived, "findArcheivedfindArcheivedfindArcheived")
      if (findArcheived !== undefined) {
        setArchivedGroupData(findArcheived);
      }
    }
  }, [GroupsReducer]);
  return (
    <>
      <Container>
        <Modal
          show={updateNotes}
          onHide={() => {
            setUpdateNotes(false);
          }}
          setShow={setUpdateNotes}
          ButtonTitle={ModalTitle}
          centered
          size={archivedgroup === true ? "xl" : "xl"}
          ModalBody={
            <>
              <Container>
                <Row className="d-flex">
                  <Col
                    lg={6}
                    md={6}
                    sm={12}
                    className="d-flex justify-content-center"
                  >
                    <p className={styles["Archived-heading"]}>
                      Archived Groups
                    </p>
                  </Col>
                  <Col
                    lg={6}
                    md={6}
                    sm={12}
                    className="d-flex justify-content-end"
                  >
                    <img src={right} width={35} />
                  </Col>
                </Row>

                <Row>
                  <Carousel>
                    <Carousel.Item>
                      <Row className="d-flex text-center justify-content-center  MontserratSemiBold-600 color-5a5a5a   mt-3">
                        <Col lg={3} md={3} sm={3}>
                          <div
                            className={styles["Groups-Modal-Archived-Modal"]}
                          >
                            <Row>
                              <Col
                                lg={12}
                                md={12}
                                sm={12}
                                className="d-flex justify-content-end mt-2 gap-1 pe-4"
                              >
                                <img src={editicon} width={15} />
                                <img src={doticon} width={15} />
                              </Col>
                            </Row>
                            <Row>
                              <Col
                                lg={12}
                                md={12}
                                sm={12}
                                className=" d-flex text-center justify-content-center"
                              >
                                <span
                                  className={
                                    styles["group-icon-Archived-Modal"]
                                  }
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="32.385"
                                    height="29.226"
                                    viewBox="0 0 32.385 29.226"
                                  >
                                    <path
                                      id="Path_636"
                                      data-name="Path 636"
                                      d="M179.255,71.21a2.48,2.48,0,0,0,1.84-.724,2.453,2.453,0,0,0,.634-1.817c-.023-.447-.016-.9-.016-1.378V67c.5,0,.991,0,1.485-.008.51,0,1.021-.008,1.531-.008.8,0,1.47.008,2.081.015h.07a2.372,2.372,0,0,0,2.405-1.6l.1-.062V56.359l-.016-.046c-.039-.139-.07-.277-.108-.423a6.947,6.947,0,0,0-.294-1,5.645,5.645,0,0,0-3.681-3.334,1.015,1.015,0,0,0,.108-.146,5.7,5.7,0,0,0,1.16-3.157.873.873,0,0,0-.781-1.009H185.7a.875.875,0,0,0-.851.885,4.055,4.055,0,0,1-1.956,3.287,4.145,4.145,0,0,1-2.2.662,4.32,4.32,0,0,1-1.732-.377.363.363,0,0,1-.07-.115,5.906,5.906,0,0,0-2.258-4.1.243.243,0,0,1-.115-.293,4.177,4.177,0,0,1,4.059-3.457c.124,0,.248.008.371.015a4.117,4.117,0,0,1,3.6,2.618.027.027,0,0,0,.007.015.3.3,0,0,0,.031.069.878.878,0,0,0,1.191.585.877.877,0,0,0,.41-1.255,5.932,5.932,0,0,0-5.6-3.78c-.155,0-.317.008-.472.015a5.734,5.734,0,0,0-3.31,1.4,5.943,5.943,0,0,0-1.895,3.1v.008c-.007,0-.007,0-.015-.008A5.824,5.824,0,0,0,173,46.2a6.007,6.007,0,0,0-1.918.323,5.9,5.9,0,0,0-5.142-4.5A5.809,5.809,0,0,0,165.3,42a5.894,5.894,0,0,0-2.057.377.871.871,0,0,0-.58,1.078.837.837,0,0,0,.812.593.958.958,0,0,0,.325-.054,4.835,4.835,0,0,1,1.547-.277,3.844,3.844,0,0,1,1.067.154,4.067,4.067,0,0,1,3.047,3.411.229.229,0,0,1-.054.115,6.139,6.139,0,0,0-2.336,4.219.3.3,0,0,1-.077.092,3.985,3.985,0,0,1-1.663.362,4.2,4.2,0,0,1-4.106-3.364,4.022,4.022,0,0,1,1.137-3.749l.031-.031a1.4,1.4,0,0,0,.14-.154.853.853,0,1,0-1.276-1.132c-.07.077-.139.162-.209.239a6.77,6.77,0,0,0-.889,1.178,5.76,5.76,0,0,0,.626,6.606,7.126,7.126,0,0,0-.951.454,5.472,5.472,0,0,0-2.822,4.858c-.024,1.894-.016,3.811-.008,5.674,0,.67,0,1.347.008,2.017a2.252,2.252,0,0,0,2.366,2.34h5.29v1.848a2.335,2.335,0,0,0,.448,1.44,2.291,2.291,0,0,0,1.934.924h4.98c.711,0,1.423,0,2.134-.008s1.423-.008,2.126-.008c1.129,0,2.065.008,2.923.023C179.224,71.21,179.24,71.21,179.255,71.21Zm.6-13.82a.876.876,0,0,0-.5.169.853.853,0,0,0-.186,1.224,2.43,2.43,0,0,0,.139.208c.047.069.092.131.131.2a3.215,3.215,0,0,1,.534,1.655c.023,2.733.023,5.489.023,8.076a.515.515,0,0,1-.588.57H167a.52.52,0,0,1-.588-.57c0-.554,0-1.1-.008-1.655-.007-2.048-.015-4.157.024-6.236a3.9,3.9,0,0,1,3.024-3.672h.007a2.389,2.389,0,0,1,.534-.085.682.682,0,0,1,.333.077,5.987,5.987,0,0,0,2.66.647,6.289,6.289,0,0,0,2.691-.639,1.218,1.218,0,0,1,.517-.092h.047a3.826,3.826,0,0,1,1.732.493.983.983,0,0,0,.472.123.844.844,0,0,0,.8-1.093.941.941,0,0,0-.51-.554c-.309-.146-.618-.285-.935-.4-.077-.031-.132-.054-.163-.069a1.282,1.282,0,0,1,.085-.123,6.077,6.077,0,0,0,.951-1.894c.039-.139.07-.216.085-.262.085.015.209.046.263.062a5.945,5.945,0,0,0,1.693.254,5.406,5.406,0,0,0,2.366-.547,1.864,1.864,0,0,1,.828-.192,2.829,2.829,0,0,1,.634.085,3.959,3.959,0,0,1,3.124,4c.007,1.917.007,3.857,0,5.743v1.663c0,.562-.155.716-.72.716h-5.227V64.142c.008-.947.008-1.917-.015-2.879a6.091,6.091,0,0,0-.271-1.74,8.018,8.018,0,0,0-.742-1.509l-.085-.146A.859.859,0,0,0,179.85,57.39Zm-20.368,7.876c-.626,0-.766-.139-.766-.762V57.229a5.1,5.1,0,0,1,.062-.878,3.972,3.972,0,0,1,3.348-3.264,1.511,1.511,0,0,1,.178-.015.863.863,0,0,1,.4.1,5.6,5.6,0,0,0,2.575.616h.054a6.045,6.045,0,0,0,1.879-.316,5.885,5.885,0,0,0,1.214,2.41,5.646,5.646,0,0,0-3.781,5.443v3.95Zm13.5-17.331a4.288,4.288,0,0,1,3.031,1.27,3.981,3.981,0,0,1,1.168,2.864,4.219,4.219,0,0,1-4.246,4.2h-.062a4.17,4.17,0,0,1,.07-8.338Z"
                                      transform="translate(-157 -42)"
                                      fill="#fff"
                                    />
                                  </svg>
                                </span>
                              </Col>
                            </Row>

                            <Row className="mt-2">
                              <Col
                                lg={12}
                                md={12}
                                sm={12}
                                className="position-relative d-flex justify-content-center"
                              >
                                <div
                                  className={styles["Tagline-Archived-Modal"]}
                                >
                                  <p
                                    className={
                                      styles["card-heading-Archived-Modal"]
                                    }
                                  >
                                    Marketing Team
                                  </p>
                                </div>
                              </Col>
                            </Row>

                            <Row className="mt-4">
                              <Col lg={2} md={2} sm={2}></Col>
                              <Col
                                lg={8}
                                md={8}
                                sm={8}
                                className="d-flex justify-content-center gap-1"
                              >
                                <div>
                                  <img src={picprofile} width={30} />
                                  <span
                                    className={
                                      styles["namesCards-archived-modal"]
                                    }
                                  >
                                    Saad
                                  </span>
                                </div>
                                <div>
                                  <img src={picprofile} width={30} />
                                  <span
                                    className={
                                      styles["namesCards-archived-modal"]
                                    }
                                  >
                                    Ashir
                                  </span>
                                </div>
                                <div>
                                  <img src={picprofile} width={30} />
                                  <span
                                    className={
                                      styles["namesCards-archived-modal"]
                                    }
                                  >
                                    Ahmed
                                  </span>
                                </div>
                                <div>
                                  <img src={picprofile} width={30} />
                                  <span
                                    className={
                                      styles["namesCards-archived-modal"]
                                    }
                                  >
                                    Bilal
                                  </span>
                                </div>
                                {/* <span className={styles["roundnumber"]}>+10</span> */}
                              </Col>
                              <Col lg={2} md={2} sm={2}></Col>
                            </Row>

                            <Row className="mt-4">
                              <Col lg={1} md={1} sm={1}></Col>
                              <Col
                                lg={10}
                                md={10}
                                sm={10}
                                className="justify-content-center d-flex align-item-center"
                              >
                                <Button
                                  className={
                                    styles["update-Group-btn-Archived-Modal"]
                                  }
                                  text="Update Group"
                                />
                              </Col>
                              <Col lg={1} md={1} sm={1}></Col>
                            </Row>
                          </div>
                        </Col>
                        <Col lg={3} md={3} sm={3}>
                          <div
                            className={styles["Groups-Modal-Archived-Modal"]}
                          >
                            <Row>
                              <Col
                                lg={12}
                                md={12}
                                sm={12}
                                className="d-flex justify-content-end mt-2 gap-1 pe-4"
                              >
                                <img src={editicon} width={15} />
                                <img src={doticon} width={15} />
                              </Col>
                            </Row>
                            <Row>
                              <Col
                                lg={12}
                                md={12}
                                sm={12}
                                className=" d-flex text-center justify-content-center"
                              >
                                <span
                                  className={
                                    styles["group-icon-Archived-Modal"]
                                  }
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="32.385"
                                    height="29.226"
                                    viewBox="0 0 32.385 29.226"
                                  >
                                    <path
                                      id="Path_636"
                                      data-name="Path 636"
                                      d="M179.255,71.21a2.48,2.48,0,0,0,1.84-.724,2.453,2.453,0,0,0,.634-1.817c-.023-.447-.016-.9-.016-1.378V67c.5,0,.991,0,1.485-.008.51,0,1.021-.008,1.531-.008.8,0,1.47.008,2.081.015h.07a2.372,2.372,0,0,0,2.405-1.6l.1-.062V56.359l-.016-.046c-.039-.139-.07-.277-.108-.423a6.947,6.947,0,0,0-.294-1,5.645,5.645,0,0,0-3.681-3.334,1.015,1.015,0,0,0,.108-.146,5.7,5.7,0,0,0,1.16-3.157.873.873,0,0,0-.781-1.009H185.7a.875.875,0,0,0-.851.885,4.055,4.055,0,0,1-1.956,3.287,4.145,4.145,0,0,1-2.2.662,4.32,4.32,0,0,1-1.732-.377.363.363,0,0,1-.07-.115,5.906,5.906,0,0,0-2.258-4.1.243.243,0,0,1-.115-.293,4.177,4.177,0,0,1,4.059-3.457c.124,0,.248.008.371.015a4.117,4.117,0,0,1,3.6,2.618.027.027,0,0,0,.007.015.3.3,0,0,0,.031.069.878.878,0,0,0,1.191.585.877.877,0,0,0,.41-1.255,5.932,5.932,0,0,0-5.6-3.78c-.155,0-.317.008-.472.015a5.734,5.734,0,0,0-3.31,1.4,5.943,5.943,0,0,0-1.895,3.1v.008c-.007,0-.007,0-.015-.008A5.824,5.824,0,0,0,173,46.2a6.007,6.007,0,0,0-1.918.323,5.9,5.9,0,0,0-5.142-4.5A5.809,5.809,0,0,0,165.3,42a5.894,5.894,0,0,0-2.057.377.871.871,0,0,0-.58,1.078.837.837,0,0,0,.812.593.958.958,0,0,0,.325-.054,4.835,4.835,0,0,1,1.547-.277,3.844,3.844,0,0,1,1.067.154,4.067,4.067,0,0,1,3.047,3.411.229.229,0,0,1-.054.115,6.139,6.139,0,0,0-2.336,4.219.3.3,0,0,1-.077.092,3.985,3.985,0,0,1-1.663.362,4.2,4.2,0,0,1-4.106-3.364,4.022,4.022,0,0,1,1.137-3.749l.031-.031a1.4,1.4,0,0,0,.14-.154.853.853,0,1,0-1.276-1.132c-.07.077-.139.162-.209.239a6.77,6.77,0,0,0-.889,1.178,5.76,5.76,0,0,0,.626,6.606,7.126,7.126,0,0,0-.951.454,5.472,5.472,0,0,0-2.822,4.858c-.024,1.894-.016,3.811-.008,5.674,0,.67,0,1.347.008,2.017a2.252,2.252,0,0,0,2.366,2.34h5.29v1.848a2.335,2.335,0,0,0,.448,1.44,2.291,2.291,0,0,0,1.934.924h4.98c.711,0,1.423,0,2.134-.008s1.423-.008,2.126-.008c1.129,0,2.065.008,2.923.023C179.224,71.21,179.24,71.21,179.255,71.21Zm.6-13.82a.876.876,0,0,0-.5.169.853.853,0,0,0-.186,1.224,2.43,2.43,0,0,0,.139.208c.047.069.092.131.131.2a3.215,3.215,0,0,1,.534,1.655c.023,2.733.023,5.489.023,8.076a.515.515,0,0,1-.588.57H167a.52.52,0,0,1-.588-.57c0-.554,0-1.1-.008-1.655-.007-2.048-.015-4.157.024-6.236a3.9,3.9,0,0,1,3.024-3.672h.007a2.389,2.389,0,0,1,.534-.085.682.682,0,0,1,.333.077,5.987,5.987,0,0,0,2.66.647,6.289,6.289,0,0,0,2.691-.639,1.218,1.218,0,0,1,.517-.092h.047a3.826,3.826,0,0,1,1.732.493.983.983,0,0,0,.472.123.844.844,0,0,0,.8-1.093.941.941,0,0,0-.51-.554c-.309-.146-.618-.285-.935-.4-.077-.031-.132-.054-.163-.069a1.282,1.282,0,0,1,.085-.123,6.077,6.077,0,0,0,.951-1.894c.039-.139.07-.216.085-.262.085.015.209.046.263.062a5.945,5.945,0,0,0,1.693.254,5.406,5.406,0,0,0,2.366-.547,1.864,1.864,0,0,1,.828-.192,2.829,2.829,0,0,1,.634.085,3.959,3.959,0,0,1,3.124,4c.007,1.917.007,3.857,0,5.743v1.663c0,.562-.155.716-.72.716h-5.227V64.142c.008-.947.008-1.917-.015-2.879a6.091,6.091,0,0,0-.271-1.74,8.018,8.018,0,0,0-.742-1.509l-.085-.146A.859.859,0,0,0,179.85,57.39Zm-20.368,7.876c-.626,0-.766-.139-.766-.762V57.229a5.1,5.1,0,0,1,.062-.878,3.972,3.972,0,0,1,3.348-3.264,1.511,1.511,0,0,1,.178-.015.863.863,0,0,1,.4.1,5.6,5.6,0,0,0,2.575.616h.054a6.045,6.045,0,0,0,1.879-.316,5.885,5.885,0,0,0,1.214,2.41,5.646,5.646,0,0,0-3.781,5.443v3.95Zm13.5-17.331a4.288,4.288,0,0,1,3.031,1.27,3.981,3.981,0,0,1,1.168,2.864,4.219,4.219,0,0,1-4.246,4.2h-.062a4.17,4.17,0,0,1,.07-8.338Z"
                                      transform="translate(-157 -42)"
                                      fill="#fff"
                                    />
                                  </svg>
                                </span>
                              </Col>
                            </Row>

                            <Row className="mt-2">
                              <Col
                                lg={12}
                                md={12}
                                sm={12}
                                className="position-relative d-flex justify-content-center"
                              >
                                <div
                                  className={styles["Tagline-Archived-Modal"]}
                                >
                                  <p
                                    className={
                                      styles["card-heading-Archived-Modal"]
                                    }
                                  >
                                    Marketing Team
                                  </p>
                                </div>
                              </Col>
                            </Row>

                            <Row className="mt-4">
                              <Col lg={2} md={2} sm={2}></Col>
                              <Col
                                lg={8}
                                md={8}
                                sm={8}
                                className="d-flex justify-content-center gap-1"
                              >
                                <div>
                                  <img src={picprofile} width={30} />
                                  <span
                                    className={
                                      styles["namesCards-archived-modal"]
                                    }
                                  >
                                    Saad
                                  </span>
                                </div>
                                <div>
                                  <img src={picprofile} width={30} />
                                  <span
                                    className={
                                      styles["namesCards-archived-modal"]
                                    }
                                  >
                                    Ashir
                                  </span>
                                </div>
                                <div>
                                  <img src={picprofile} width={30} />
                                  <span
                                    className={
                                      styles["namesCards-archived-modal"]
                                    }
                                  >
                                    Ahmed
                                  </span>
                                </div>
                                <div>
                                  <img src={picprofile} width={30} />
                                  <span
                                    className={
                                      styles["namesCards-archived-modal"]
                                    }
                                  >
                                    Bilal
                                  </span>
                                </div>
                                {/* <span className={styles["roundnumber"]}>+10</span> */}
                              </Col>
                              <Col lg={2} md={2} sm={2}></Col>
                            </Row>

                            <Row className="mt-4">
                              <Col lg={1} md={1} sm={1}></Col>
                              <Col
                                lg={10}
                                md={10}
                                sm={10}
                                className="justify-content-center d-flex align-item-center"
                              >
                                <Button
                                  className={
                                    styles["update-Group-btn-Archived-Modal"]
                                  }
                                  text="Update Group"
                                />
                              </Col>
                              <Col lg={1} md={1} sm={1}></Col>
                            </Row>
                          </div>
                        </Col>
                        <Col lg={3} md={3} sm={3}>
                          <div
                            className={styles["Groups-Modal-Archived-Modal"]}
                          >
                            <Row>
                              <Col
                                lg={12}
                                md={12}
                                sm={12}
                                className="d-flex justify-content-end mt-2 gap-1 pe-4"
                              >
                                <img src={editicon} width={15} />
                                <img src={doticon} width={15} />
                              </Col>
                            </Row>
                            <Row>
                              <Col
                                lg={12}
                                md={12}
                                sm={12}
                                className=" d-flex text-center justify-content-center"
                              >
                                <span
                                  className={
                                    styles["group-icon-Archived-Modal"]
                                  }
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="32.385"
                                    height="29.226"
                                    viewBox="0 0 32.385 29.226"
                                  >
                                    <path
                                      id="Path_636"
                                      data-name="Path 636"
                                      d="M179.255,71.21a2.48,2.48,0,0,0,1.84-.724,2.453,2.453,0,0,0,.634-1.817c-.023-.447-.016-.9-.016-1.378V67c.5,0,.991,0,1.485-.008.51,0,1.021-.008,1.531-.008.8,0,1.47.008,2.081.015h.07a2.372,2.372,0,0,0,2.405-1.6l.1-.062V56.359l-.016-.046c-.039-.139-.07-.277-.108-.423a6.947,6.947,0,0,0-.294-1,5.645,5.645,0,0,0-3.681-3.334,1.015,1.015,0,0,0,.108-.146,5.7,5.7,0,0,0,1.16-3.157.873.873,0,0,0-.781-1.009H185.7a.875.875,0,0,0-.851.885,4.055,4.055,0,0,1-1.956,3.287,4.145,4.145,0,0,1-2.2.662,4.32,4.32,0,0,1-1.732-.377.363.363,0,0,1-.07-.115,5.906,5.906,0,0,0-2.258-4.1.243.243,0,0,1-.115-.293,4.177,4.177,0,0,1,4.059-3.457c.124,0,.248.008.371.015a4.117,4.117,0,0,1,3.6,2.618.027.027,0,0,0,.007.015.3.3,0,0,0,.031.069.878.878,0,0,0,1.191.585.877.877,0,0,0,.41-1.255,5.932,5.932,0,0,0-5.6-3.78c-.155,0-.317.008-.472.015a5.734,5.734,0,0,0-3.31,1.4,5.943,5.943,0,0,0-1.895,3.1v.008c-.007,0-.007,0-.015-.008A5.824,5.824,0,0,0,173,46.2a6.007,6.007,0,0,0-1.918.323,5.9,5.9,0,0,0-5.142-4.5A5.809,5.809,0,0,0,165.3,42a5.894,5.894,0,0,0-2.057.377.871.871,0,0,0-.58,1.078.837.837,0,0,0,.812.593.958.958,0,0,0,.325-.054,4.835,4.835,0,0,1,1.547-.277,3.844,3.844,0,0,1,1.067.154,4.067,4.067,0,0,1,3.047,3.411.229.229,0,0,1-.054.115,6.139,6.139,0,0,0-2.336,4.219.3.3,0,0,1-.077.092,3.985,3.985,0,0,1-1.663.362,4.2,4.2,0,0,1-4.106-3.364,4.022,4.022,0,0,1,1.137-3.749l.031-.031a1.4,1.4,0,0,0,.14-.154.853.853,0,1,0-1.276-1.132c-.07.077-.139.162-.209.239a6.77,6.77,0,0,0-.889,1.178,5.76,5.76,0,0,0,.626,6.606,7.126,7.126,0,0,0-.951.454,5.472,5.472,0,0,0-2.822,4.858c-.024,1.894-.016,3.811-.008,5.674,0,.67,0,1.347.008,2.017a2.252,2.252,0,0,0,2.366,2.34h5.29v1.848a2.335,2.335,0,0,0,.448,1.44,2.291,2.291,0,0,0,1.934.924h4.98c.711,0,1.423,0,2.134-.008s1.423-.008,2.126-.008c1.129,0,2.065.008,2.923.023C179.224,71.21,179.24,71.21,179.255,71.21Zm.6-13.82a.876.876,0,0,0-.5.169.853.853,0,0,0-.186,1.224,2.43,2.43,0,0,0,.139.208c.047.069.092.131.131.2a3.215,3.215,0,0,1,.534,1.655c.023,2.733.023,5.489.023,8.076a.515.515,0,0,1-.588.57H167a.52.52,0,0,1-.588-.57c0-.554,0-1.1-.008-1.655-.007-2.048-.015-4.157.024-6.236a3.9,3.9,0,0,1,3.024-3.672h.007a2.389,2.389,0,0,1,.534-.085.682.682,0,0,1,.333.077,5.987,5.987,0,0,0,2.66.647,6.289,6.289,0,0,0,2.691-.639,1.218,1.218,0,0,1,.517-.092h.047a3.826,3.826,0,0,1,1.732.493.983.983,0,0,0,.472.123.844.844,0,0,0,.8-1.093.941.941,0,0,0-.51-.554c-.309-.146-.618-.285-.935-.4-.077-.031-.132-.054-.163-.069a1.282,1.282,0,0,1,.085-.123,6.077,6.077,0,0,0,.951-1.894c.039-.139.07-.216.085-.262.085.015.209.046.263.062a5.945,5.945,0,0,0,1.693.254,5.406,5.406,0,0,0,2.366-.547,1.864,1.864,0,0,1,.828-.192,2.829,2.829,0,0,1,.634.085,3.959,3.959,0,0,1,3.124,4c.007,1.917.007,3.857,0,5.743v1.663c0,.562-.155.716-.72.716h-5.227V64.142c.008-.947.008-1.917-.015-2.879a6.091,6.091,0,0,0-.271-1.74,8.018,8.018,0,0,0-.742-1.509l-.085-.146A.859.859,0,0,0,179.85,57.39Zm-20.368,7.876c-.626,0-.766-.139-.766-.762V57.229a5.1,5.1,0,0,1,.062-.878,3.972,3.972,0,0,1,3.348-3.264,1.511,1.511,0,0,1,.178-.015.863.863,0,0,1,.4.1,5.6,5.6,0,0,0,2.575.616h.054a6.045,6.045,0,0,0,1.879-.316,5.885,5.885,0,0,0,1.214,2.41,5.646,5.646,0,0,0-3.781,5.443v3.95Zm13.5-17.331a4.288,4.288,0,0,1,3.031,1.27,3.981,3.981,0,0,1,1.168,2.864,4.219,4.219,0,0,1-4.246,4.2h-.062a4.17,4.17,0,0,1,.07-8.338Z"
                                      transform="translate(-157 -42)"
                                      fill="#fff"
                                    />
                                  </svg>
                                </span>
                              </Col>
                            </Row>

                            <Row className="mt-2">
                              <Col
                                lg={12}
                                md={12}
                                sm={12}
                                className="position-relative d-flex justify-content-center"
                              >
                                <div
                                  className={styles["Tagline-Archived-Modal"]}
                                >
                                  <p
                                    className={
                                      styles["card-heading-Archived-Modal"]
                                    }
                                  >
                                    Marketing Team
                                  </p>
                                </div>
                              </Col>
                            </Row>

                            <Row className="mt-4">
                              <Col lg={2} md={2} sm={2}></Col>
                              <Col
                                lg={8}
                                md={8}
                                sm={8}
                                className="d-flex justify-content-center gap-1"
                              >
                                <div>
                                  <img src={picprofile} width={30} />
                                  <span
                                    className={
                                      styles["namesCards-archived-modal"]
                                    }
                                  >
                                    Saad
                                  </span>
                                </div>
                                <div>
                                  <img src={picprofile} width={30} />
                                  <span
                                    className={
                                      styles["namesCards-archived-modal"]
                                    }
                                  >
                                    Ashir
                                  </span>
                                </div>
                                <div>
                                  <img src={picprofile} width={30} />
                                  <span
                                    className={
                                      styles["namesCards-archived-modal"]
                                    }
                                  >
                                    Ahmed
                                  </span>
                                </div>
                                <div>
                                  <img src={picprofile} width={30} />
                                  <span
                                    className={
                                      styles["namesCards-archived-modal"]
                                    }
                                  >
                                    Bilal
                                  </span>
                                </div>
                                {/* <span className={styles["roundnumber"]}>+10</span> */}
                              </Col>
                              <Col lg={2} md={2} sm={2}></Col>
                            </Row>

                            <Row className="mt-4">
                              <Col lg={1} md={1} sm={1}></Col>
                              <Col
                                lg={10}
                                md={10}
                                sm={10}
                                className="justify-content-center d-flex align-item-center"
                              >
                                <Button
                                  className={
                                    styles["update-Group-btn-Archived-Modal"]
                                  }
                                  text="Update Group"
                                />
                              </Col>
                              <Col lg={1} md={1} sm={1}></Col>
                            </Row>
                          </div>
                        </Col>
                      </Row>
                    </Carousel.Item>
                    <Carousel.Item>{/* second slide */}</Carousel.Item>
                    <Carousel.Item>{/* third slide */}</Carousel.Item>
                  </Carousel>
                </Row>
              </Container>
            </>
          }
          ModalFooter={<></>}
        />
      </Container>
    </>
  );
};

export default ModalArchivedGroups;
