import React, { useEffect, useState } from "react";
import { Modal } from "../../../../../components/elements";
import { useSelector } from "react-redux";
import styles from "./InvoiceHtml.module.css";

const InvoiceHtml = ({ response, InvoiceModal, setInvoiceModal }) => {
  const { getInvoiceHTML } = useSelector((state) => state.Authreducer);
  console.log(getInvoiceHTML, "getInvoiceHTMLgetInvoiceHTMLgetInvoiceHTML");
  const [invoiceHtml, setInvoiceHtml] = useState(null);
  useEffect(() => {
    if (getInvoiceHTML !== null) {
      let { htmlString } = getInvoiceHTML;
      setInvoiceHtml(htmlString);
    }
  }, [getInvoiceHTML]);
  return (
    <Modal
      htmlCode={invoiceHtml}
      size={"xl"}
      modalBodyClassName={styles["InvocieHTMLPreview"]}

      setShow={setInvoiceModal}
      onHide={() => setInvoiceModal(false)}
      show={InvoiceModal}
    />
  );
};

export default InvoiceHtml;
