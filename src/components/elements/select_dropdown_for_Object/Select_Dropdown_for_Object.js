// import React, { useEffect, useState } from 'react'
// import TextField from "@mui/material/TextField";
// import MenuItem from "@mui/material/MenuItem";
// import './SelectDropdownforObject.css'

// const SelectDropdownforObject = ({ options, change, value, key, defaultValue, label, setTimeZoneValue }) => {

//     return (
//         <div>
//             <TextField
//                 // id="outlined-select"
//                 select
//                 required
//                 label={label}
//                 variant="outlined"
//                 onChange={change}
//                 InputLabelProps={{
//                     shrink: true
//                 }}
//                 // helperText={helperText}

//                 key={key}
//                 value={value || ""}
//                 defaultValue={defaultValue}
//             >
//                 {/* {options} */}
//                 {options?.map((d, index) => {
//                     return <MenuItem
//                         key={d.id}
//                         value={JSON.stringify({
//                             id: d.id,
//                             percentage: d.percentage,
//                             name: d.name
//                         })}
//                     >
//                         {d.name}
//                     </MenuItem>
//                 }

//                 )}

//             </TextField>
//         </div>
//     )
// }
// export default SelectDropdownforObject

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
        // label="Select"
        variant="outlined"
        onChange={handleChange}
        InputLabelProps={{
          shrink: true,
        }}
        value={selectState || ""}
        // defaultValue={""}
      >
        {options?.map((d, index) => (
          <MenuItem
            className="menuItems"
            key={d.id}
            value={JSON.stringify({
              id: d.pK_TZID,
              // percentage: d.percentage,
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
