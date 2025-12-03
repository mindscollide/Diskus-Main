import Form from "react-bootstrap/Form";
import "./Radio.css";
export const Radio3 = ({ values, value, onChange }) => {
  
  return (
    <>
      <Form.Check
        name={values}
        value={value}
        prefix="RadioButton"
        className="customRadioButton"
        type="radio"
        aria-label="radio 1"
        onChange={onChange}
      />
    </>
  );
};
