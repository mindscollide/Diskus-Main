import ReactCodeInput from "react-code-input";
import Form from "react-bootstrap/Form";

const props = {
  inputStyle: {
    border: "1px solid #e1e1e1",
    margin: "4px",
    paddingLeft: "8px",
    width: "40px",
    height: "40px",
    boxSizing: "border-box",
    borderRadius: "0px",
    borderColor: "#e1e1e1",
    fontSize: "13px",
    padding: "0.375rem 0.75rem",
    transition: "border-color .15s ease-in-out, box-shadow .15s ease-in-out",
    lineHeight: "1.5",
    // color: '#564', display: "flex", justifyContent: "center"
  },
  inputStyleFocused: {
    color: "#212529",
    backgroundColor: "#fff",
    borderColor: "blue",
    outline: "0",
    boxShadow: "0 0 0 0.25rem rgb(13 110 253 / 25%)",
  },
  // inputStyleInvalid: {
  //     margin: '4px',
  //     MozAppearance: 'textfield',
  //     width: '40px',
  //     borderRadius: '3px',
  //     fontSize: '14px',
  //     height: '26px',
  //     paddingLeft: '7px',
  //     backgroundColor: 'black',
  //     color: 'red',
  //     border: '1px solid red'
  // }
};

const VerificationInputField = ({
  applyClass,
  label,
  change,
  value,
  ref,
  name,
  fields,
  key
}) => {
  return (
    <>
      <Form.Label className="MontserratMedium-500 d-inline-block">
        {label}
      </Form.Label>
      <ReactCodeInput
        ref={ref}
        className="FocusedStyling"
        inputStyle={{
          color: "#564",
          display: "flex",
          justifyContent: "center",
        }}
        key={key}
        onChange={change}
        type="text"
        pattern="[A-Z0-9]"
        fields={fields}
        value={value}
        {...props}
      />
    </>
  );
};

export default VerificationInputField;
