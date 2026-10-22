import Accordion from "react-bootstrap/Accordion";
import { Col, Row, Container } from "react-bootstrap";
import { PlusLg } from "react-bootstrap-icons";
import Card from "react-bootstrap/Card";
import "./CustomAccordion.css";

/**
 * @component CustomAccordion
 * @description A data-driven accordion component for displaying hierarchical task lists.
 * Renders a column-header row followed by one Accordion card per item in `data`. Each
 * card shows parent-level task information (task name, assignee avatars, attachments,
 * deadline, status, checkbox) and can be expanded to reveal child sub-tasks with the
 * same column structure.
 *
 * The `ToggleButton` prop accepts a render-prop style component that receives an
 * `eventKey` and a PlusLg icon child — this lets the caller plug in Ant Design's or
 * React-Bootstrap's own Accordion toggle utilities without this component being tightly
 * coupled to one library.
 *
 * Note: the `index` variable is computed by looping through `data` before rendering,
 * resulting in a fixed value of `data.length - 1`. All Accordion cards and their
 * children therefore share the same eventKey, meaning only a single expand/collapse
 * group is active at a time.
 *
 * @param {Array<{
 *   task: React.ReactNode,
 *   assignedto: string,
 *   attached: React.ReactNode,
 *   deadline: React.ReactNode,
 *   status: React.ReactNode,
 *   checkbox: React.ReactNode,
 *   children: Array<{
 *     task: React.ReactNode,
 *     assignedto: string,
 *     attachedPin: React.ReactNode,
 *     deadline: React.ReactNode,
 *     status: React.ReactNode,
 *     checkbox: React.ReactNode
 *   }>
 * }>} data - Array of parent task objects, each optionally containing child tasks.
 *
 * @param {Array<{ col: number, title: React.ReactNode }>} columns - Column header
 *   definitions. `col` is the Bootstrap sm grid span (1-12); `title` is the header label.
 *
 * @param {React.ComponentType<{ eventKey: number, children: React.ReactNode }>} ToggleButton
 *   - Component used as the expand/collapse trigger inside each card header.
 *
 * @example
 * <CustomAccordion
 *   data={taskList}
 *   columns={[
 *     { col: 5, title: "Task" },
 *     { col: 2, title: "Assigned To" },
 *     { col: 1, title: "Attachments" },
 *     { col: 2, title: "Deadline" },
 *     { col: 1, title: "Status" },
 *     { col: 1, title: "" },
 *   ]}
 *   ToggleButton={Accordion.Toggle}
 * />
 */
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
