import { Radio } from "antd";
import "./Radio.css";
const CustomRadio2 = ({ onChange, Optios, value, className, disabled }) => {
  return (
    <Radio.Group onChange={onChange} value={value[0]} buttonStyle="solid">
      <Radio className={className} value={Optios} disabled={disabled} />
    </Radio.Group>
  );
};
export default CustomRadio2;
