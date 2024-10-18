import Accordion from "react-bootstrap/Accordion";
import { Col, Row, Container } from "react-bootstrap";
import { PlusLg } from "react-bootstrap-icons";
import Card from "react-bootstrap/Card";
import "./CustomAccordion.css";

const CustomAccordion = ({ data, columns, ToggleButton }) => {
  let index;
  for (index = 0; index < data.length; index++) {}

  return (
    <>
      <Container>
        <Row>
          {columns.map((col, i) => {
            return (
              <Col sm={col.col} key={i}>
                {col.title}
              </Col>
            );
          })}
        </Row>
      </Container>
      {data.map((tabledata, i) => {
        return (
          <>
            <Accordion defaultActiveKey="0" key={i}>
              <Card className="my-1">
                <Card.Header>
                  <Container>
                    <Row className="my-2">
                      <Col sm={5}>
                        <ToggleButton eventKey={index}>
                          <PlusLg />
                        </ToggleButton>
                        {tabledata.task}
                      </Col>
                      <Col sm={2}>
                        <img
                          className="data-img"
                          alt="pin"
                          src={tabledata.assignedto}
                          draggable="false"
                        />
                        <img
                          className="data-img"
                          alt="pin"
                          src={tabledata.assignedto}
                          draggable="false"
                        />
                        <img
                          className="data-img"
                          alt="pin"
                          src={tabledata.assignedto}
                          draggable="false"
                        />
                      </Col>
                      <Col sm={1}>{tabledata.attached}</Col>
                      <Col sm={2}>{tabledata.deadline}</Col>
                      <Col sm={1}>{tabledata.status}</Col>
                      <Col sm={1}>{tabledata.checkbox}</Col>
                    </Row>
                  </Container>
                </Card.Header>
                {tabledata.children.map((child, i) => {
                  return (
                    <Accordion.Collapse eventKey={index}>
                      <Card.Body>
                        <Row>
                          <Col sm={5} className="ml-2">
                            {child.task}
                          </Col>
                          <Col sm={2}>
                            <img
                              className="data-img"
                              src={child.assignedto}
                              alt="pin"
                              draggable="false"
                            />
                            <img
                              className="data-img"
                              src={child.assignedto}
                              alt="pin"
                              draggable="false"
                            />
                            <img
                              className="data-img"
                              src={child.assignedto}
                              alt="pin"
                              draggable="false"
                            />
                          </Col>
                          <Col sm={1}>{child.attachedPin}</Col>
                          <Col sm={2}>{child.deadline}</Col>
                          <Col sm={1}>{child.status}</Col>
                          <Col sm={1}>{child.checkbox}</Col>
                        </Row>
                      </Card.Body>
                    </Accordion.Collapse>
                  );
                })}
              </Card>
            </Accordion>
          </>
        );
      })}
    </>
  );
};
export default CustomAccordion;
