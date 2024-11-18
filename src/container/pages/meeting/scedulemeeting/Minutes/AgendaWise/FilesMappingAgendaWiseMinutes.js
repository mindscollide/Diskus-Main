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
import { AttachmentViewer } from "../../../../../../components/elements";
const FilesMappingAgendaWiseMinutes = ({
  showMoreIndex,
  Itemsdata,
  showMore,
  detailIndex,
}) => {
  console.log(Itemsdata, "ItemsdataItemsdataItemsdataItemsdata");
  return (
    <>
      {showMoreIndex === detailIndex && showMore === true ? (
        <section className={styles["viewAgendaWiseFiles"]}>
          <Row>
            {Itemsdata.minutesAttachmets.map((filesname, parentIndex) => {
              return filesname.files.map((data, index) => (
                <Col lg={4} md={4} sm={4} key={`${parentIndex}-${index}`}>
                  <AttachmentViewer
                    data={data}
                    id={0}
                    name={data.displayFileName}
                  />
                </Col>
              ));
            })}
          </Row>
        </section>
      ) : null}
    </>
  );
};

export default FilesMappingAgendaWiseMinutes;
