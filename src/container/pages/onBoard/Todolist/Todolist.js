import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { CustomAccordion } from "../../../../components/elements";
import { useAccordionButton } from "react-bootstrap/AccordionButton";
import UserImage from "../../../../assets/images/user.png";
import { Paperclip } from "react-bootstrap-icons";
import Checkbox from "../../../../components/elements/check_box/Checkbox";
import "antd/dist/antd.css";

export const TodoList = () => {
  function CustomToggle({ children, eventKey }) {
    const decoratedOnClick = useAccordionButton(eventKey, () =>
      console.log("totally custom!")
    );

    return (
      <button
        type="button"
        className="accordion-btn"
        onClick={decoratedOnClick}
      >
        {children}
      </button>
    );
  }

  const data = [
    {
      task: "Finance & Accounts Report",
      assignedto: UserImage,
      attached: <Paperclip />,
      deadline: "18th May 2020",
      status: "Upcoming",
      checkbox: <Checkbox />,
      col: 3,

      children: [
        {
          task: "Active Directory Testing",
          assignedto: UserImage,
          attachedPin: <Paperclip />,
          deadline: "18th May 2020",
          status: "Upcoming",
          checkbox: <Checkbox />,
        },
        {
          task: "Board Meeting",
          assignedto: UserImage,
          attachedPin: <Paperclip />,
          deadline: "18th May 2020",
          status: "Upcoming",
          checkbox: <Checkbox />,
        },
      ],
    },
    {
      task: "Finance & Accounts Report",
      assignedto: UserImage,
      attached: <Paperclip />,
      deadline: "18th May 2020",
      status: "Upcoming",
      checkbox: <Checkbox />,
      col: 3,

      children: [
        {
          task: "Active Directory Testing",
          assignedto: UserImage,
          attachedPin: <Paperclip />,
          deadline: "18th May 2020",
          status: "Upcoming",
          checkbox: <Checkbox />,
        },
        {
          task: "Board Meeting",
          assignedto: UserImage,
          attachedPin: <Paperclip />,
          deadline: "18th May 2020",
          status: "Upcoming",
          checkbox: <Checkbox />,
        },
        {
          task: "Board Meeting",
          assignedto: UserImage,
          attachedPin: <Paperclip />,
          deadline: "18th May 2020",
          status: "Upcoming",
          checkbox: <Checkbox />,
        },
      ],
    },
    {
      task: "Finance & Accounts Report",
      assignedto: UserImage,
      attached: <Paperclip />,
      deadline: "18th May 2020",
      status: "Upcoming",
      checkbox: <Checkbox />,
      col: 3,

      children: [
        {
          task: "Active Directory Testing",
          assignedto: UserImage,
          attachedPin: <Paperclip />,
          deadline: "18th May 2020",
          status: "Upcoming",
          checkbox: <Checkbox />,
        },
        {
          task: "Board Meeting",
          assignedto: UserImage,
          attachedPin: <Paperclip />,
          deadline: "18th May 2020",
          status: "Upcoming",
          checkbox: <Checkbox />,
        },
        {
          task: "Board Meeting",
          assignedto: UserImage,
          attachedPin: <Paperclip />,
          deadline: "18th May 2020",
          status: "Upcoming",
          checkbox: <Checkbox />,
        },
      ],
    },
    {
      task: "Finance & Accounts Report",
      assignedto: UserImage,
      attached: <Paperclip />,
      deadline: "18th May 2020",
      status: "Upcoming",
      checkbox: <Checkbox />,
      col: 3,

      children: [
        {
          task: "Active Directory Testing",
          assignedto: UserImage,
          attachedPin: <Paperclip />,
          deadline: "18th May 2020",
          status: "Upcoming",
          checkbox: <Checkbox />,
        },
        {
          task: "Board Meeting",
          assignedto: UserImage,
          attachedPin: <Paperclip />,
          deadline: "18th May 2020",
          status: "Upcoming",
          checkbox: <Checkbox />,
        },
        {
          task: "Board Meeting",
          assignedto: UserImage,
          attachedPin: <Paperclip />,
          deadline: "18th May 2020",
          status: "Upcoming",
          checkbox: <Checkbox />,
        },
      ],
    },
    {
      task: "Finance & Accounts Report",
      assignedto: UserImage,
      attached: <Paperclip />,
      deadline: "18th May 2020",
      status: "Upcoming",
      checkbox: <Checkbox />,
      col: 3,

      children: [
        {
          task: "Active Directory Testing",
          assignedto: UserImage,
          attachedPin: <Paperclip />,
          deadline: "18th May 2020",
          status: "Upcoming",
          checkbox: <Checkbox />,
        },
        {
          task: "Board Meeting",
          assignedto: UserImage,
          attachedPin: <Paperclip />,
          deadline: "18th May 2020",
          status: "Upcoming",
          checkbox: <Checkbox />,
        },
        {
          task: "Board Meeting",
          assignedto: UserImage,
          attachedPin: <Paperclip />,
          deadline: "18th May 2020",
          status: "Upcoming",
          checkbox: <Checkbox />,
        },
      ],
    },
    {
      task: "Finance & Accounts Report",
      assignedto: UserImage,
      attached: <Paperclip />,
      deadline: "18th May 2020",
      status: "Upcoming",
      checkbox: <Checkbox />,
      col: 3,

      children: [
        {
          task: "Active Directory Testing",
          assignedto: UserImage,
          attachedPin: <Paperclip />,
          deadline: "18th May 2020",
          status: "Upcoming",
          checkbox: <Checkbox />,
        },
        {
          task: "Board Meeting",
          assignedto: UserImage,
          attachedPin: <Paperclip />,
          deadline: "18th May 2020",
          status: "Upcoming",
          checkbox: <Checkbox />,
        },
        {
          task: "Board Meeting",
          assignedto: UserImage,
          attachedPin: <Paperclip />,
          deadline: "18th May 2020",
          status: "Upcoming",
          checkbox: <Checkbox />,
        },
      ],
    },
  ];
  const columns = [
    {
      title: "Task",
      dataIndex: "task",
      key: "task",
      col: 5,
      className: "text-center",
    },
  ];

  return (
    <>
      <Container className="mb-5">
        <Row>
          <Col className="heading color-primary fw-600  mt-2">To-Do List</Col>
        </Row>
        <Row>
          <Col className="mt-2">
            <CustomAccordion
              columns={columns}
              data={data}
              ToggleButton={CustomToggle}
            />{" "}
          </Col>
        </Row>
      </Container>
    </>
  );
};
