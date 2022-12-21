import "./input-search-filter.css";
import TextField from "./../input_field/Input_field";
import { useTranslation } from "react-i18next";

const InputSearchFilter = ({ filteredDataHandler, value, change, disable }) => {
  //For Localization
  const { t } = useTranslation();
  return (
    <div className="search-container-assignee">
      <div className="search-inner-textfield">
        <TextField
          type="text"
          value={value}
          change={change}
          placeholder={t("Add-Attendees-Placeholder")}
          disable={disable}
        />
      </div>
      <div className="dropdown-assignee">{filteredDataHandler}</div>
    </div>
  );
};

export default InputSearchFilter;
