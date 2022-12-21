import React, { Fragment } from "react";
import { Container, Row, Col } from 'react-bootstrap'
import { PaymentActivity, Table } from "../../../../components/elements";


const Summary = () => {
  const columns = [
    {
      title: "Invoice#",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Due Date",
      dataIndex: "title",
      key: "title",
    }
    ,
    {
      title: "Invoice Amount",
      dataIndex: "title",
      key: "title",
    }
    ,
    {
      title: "Balance Due",
      dataIndex: "title",
      key: "title",
    }
    ,
    {
      title: "Late Charges",
      dataIndex: "title",
      key: "title",
    }

  ]
  return (<Fragment>
    <Container>
      <PaymentActivity
        PaymentActivityBoxTitle="Summary"
        PaymentActivityTitle="Section of Account Summary"
        ColOneKey="Balance Due:"
        ColTwoKey="Next Invoice Estimate:"
        ColThreeKey="Next Payment Due Date:"
        ColOneValue="05$"
        ColTwoValue="50$"
        ColThreeValue="12-04-23" />
      <PaymentActivity
        PaymentActivityBoxTitle="Account Activity"
        PaymentActivityTitle="Last Payment"
        ColOneKey="Invoice#"
        ColTwoKey="Payment Received Date"
        ColThreeKey="Paid Amount"
        ColOneValue="123456"
        ColTwoValue="11-Dec-2022"
        ColThreeValue="50$" />
      <Row>
        <Col sm={12} md={12} lg={12} className="border my-2">
          <Col sm={12} md={12} lg={12} className="fs-4 fw-bold mt-3">
            Open Invoice
          </Col>
          <Col sm={12} md={12} lg={12}>
            <Table column={columns} />
          </Col>
        </Col>
      </Row>

    </Container>
  </Fragment>);
};

export default Summary;

