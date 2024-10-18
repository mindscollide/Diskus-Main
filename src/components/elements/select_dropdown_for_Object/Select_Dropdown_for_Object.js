import React, { useEffect } from "react";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import "./SelectDropdownforObject.css";
export default function SelectDropdownforObject({
  options,
  setstatevalues,
  statevalues,
  name,
}) {
  const [selectState, setSelectState] = React.useState();

  useEffect(() => {}, [selectState]);

  const handleChange = (event) => {
    setSelectState(event.target.value);
    let newdata = event.target.value;

    var obj = JSON.parse(newdata);

    setstatevalues({ ...statevalues, [name]: obj.id });
  };

  return (
    <div>
      <TextField
        id="outlined-select"
        select
        required
        className="dropdpown_field_input"
        variant="outlined"
        onChange={handleChange}
        InputLabelProps={{
          shrink: true,
        }}
        value={selectState || ""}
      >
        {options?.map((d, index) => (
          <MenuItem
            className="menuItems"
            key={d.id}
            value={JSON.stringify({
              id: d.pK_TZID,
              name: d.gmtOffset,
            })}
          >
            {d.gmtOffset}
          </MenuItem>
        ))}
      </TextField>
    </div>
  );
}
