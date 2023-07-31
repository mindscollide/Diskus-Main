import { Radio } from "antd";
const CustomRadio2 = ({ onChange, Optios, value, className, disabled }) => {
  console.log("CustomRadio2", value);
  console.log("CustomRadio2", Optios);
  return (
    <Radio.Group onChange={onChange} value={value[0]}>
      <Radio className={className} value={Optios} disabled={disabled} />
    </Radio.Group>
  );
};
export default CustomRadio2;
