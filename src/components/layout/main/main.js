import React from "react";
import { Layout } from "antd";
import styles from "./main.module.css";
import { Container } from "react-bootstrap";

const Main = ({ routingData, role }) => {
  const { Content } = Layout;
  return (
    <>
      <Layout>
        <Content className={styles.mainContainer}>
          <Container maxWidth="lg"></Container>
        </Content>
      </Layout>
    </>
  );
};

export default Main;
