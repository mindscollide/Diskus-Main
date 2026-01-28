import { Radio } from "antd";
import "./Radio.css";
import { Col, Row } from "react-bootstrap";

const CustomRadioGroup = ({
  value,
  onChange,
  options = [],
  disabled = false,
  className = "",
  is2FA = false,
  radioButtonClass = "",
  defaultValue,
}) => {
  return (
    <Radio.Group
      className={`${className} ${is2FA && "w-100"}`}
      buttonStyle="solid"
      value={value}
      onChange={onChange}
      defaultValue={defaultValue}
      disabled={disabled}
    >
      {options.map((option) =>
        is2FA ? (
          <Row>
            <Col sm={10} md={10} lg={10}>
              <span className="gradient-radio w-100">{option.label}</span>
            </Col>
            <Col sm={2} md={2} lg={2}>
              <Radio
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              />
            </Col>
          </Row>
        ) : (
          <Radio
            key={option.value}
            value={option.value}
            disabled={option.disabled}
            className={radioButtonClass}
          >
            <span className="gradient-radio">{option.label}</span>
          </Radio>
        )
      )}
    </Radio.Group>
  );
};

export default CustomRadioGroup;
