import { forwardRef, memo } from "react";
import { Input } from "antd";
import "./Input_field_withCount.css";
const { TextArea } = Input;

const InputfieldwithCount = forwardRef(
  (
    {
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
      onKeyDown,
      disabled = false,
      ...rest
    },
    ref
  ) => {
    return (
      <div className="position-relative">
        {label && <label className={labelClass}>{label}</label>}

        <Input
          {...rest}
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
          ref={ref}
          onKeyDown={onKeyDown}
          disabled={disabled}
        />
      </div>
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
    rows,
    ref,
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
            rows={rows}
            onBlur={onBlur}
            ref={ref}
          />
        </div>
      </>
    );
  }
);

export { InputfieldwithCount, TextAreafieldwithCount };
