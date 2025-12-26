import { memo } from "react";
import { Input } from "antd";
import "./Input_field_withCount.css";
const { TextArea } = Input;

const InputfieldwithCount = memo(
  ({
    showCount = true,
    value,
    onChange,
    enterKeyHint,
    name,
    preFixClas,
    placeholder,
    maxLength,
    minLength,
    pattern,
    label,
    labelClass,
    prefix,
    onBlur,
    loading,
  }) => {
    return (
      <>
        <div className="position-relative">
          <label className={labelClass}>{label}</label>
          <Input
            showCount={showCount}
            value={value}
            onChange={onChange}
            name={name}
            enterKeyHint={enterKeyHint}
            placeholder={placeholder}
            prefixCls={preFixClas}
            maxLength={maxLength}
            minLength={minLength}
            pattern={pattern}
            prefix={prefix}
            onBlur={onBlur}
          />
        </div>
      </>
    );
  }
);

const TextAreafieldwithCount = memo(
  ({
    showCount = true,
    value,
    onChange,
    enterKeyHint,
    name,
    preFixClas,
    placeholder,
    maxLength,
    minLength,
    pattern,
    label,
    labelClass,
    prefix,
    onBlur,
    loading,
  }) => {
    return (
      <>
        <div className="position-relative">
          <label className={labelClass}>{label}</label>
          <TextArea
            showCount={showCount}
            value={value}
            onChange={onChange}
            name={name}
            enterKeyHint={enterKeyHint}
            placeholder={placeholder}
            prefixCls={preFixClas}
            maxLength={maxLength}
            minLength={minLength}
            pattern={pattern}
            prefix={prefix}
            onBlur={onBlur}
          />
        </div>
      </>
    );
  }
);

export { InputfieldwithCount, TextAreafieldwithCount };
