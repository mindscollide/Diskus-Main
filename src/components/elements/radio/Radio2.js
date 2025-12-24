import { Radio } from "antd";
import "./Radio.css";
const CustomRadio2 = ({ onChange, Optios, value, className, disabled }) => {
  return (
    <Radio.Group buttonStyle="solid" onChange={onChange} value={value[0]} >
      <Radio className="gradient-radio" value={Optios} disabled={disabled} />
    </Radio.Group>
  );
};
export default CustomRadio2;
