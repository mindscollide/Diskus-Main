import "./input-search-filter.css";
import TextField from "./../input_field/Input_field";

const InputSearchFilter = ({
  onclickFlag,
  filteredDataHandler,
  value,
  change,
  disable,
  applyClass,
  placeholder,
  labelclass,
  flag,
}) => {
  return (
    <div className="search-container-assignee">
      <div className="search-inner-textfield">
        <TextField
          type="text"
          width={"100%"}
          labelclass={labelclass}
          value={value}
          change={change}
          placeholder={placeholder}
          disable={disable}
          applyClass={applyClass}
        />
      </div>
      {onclickFlag !== true ? (
        <div
          className={
            flag === 1 ? "dropdown-assignee_sharefolder" : "dropdown-assignee"
          }
        >
          {filteredDataHandler}
        </div>
      ) : null}
    </div>
  );
};

export default InputSearchFilter;
