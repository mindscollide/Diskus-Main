import React, { useEffect } from "react";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import './SelectDropdownforObjectCC.css'
function SelectOptionForCC({ options, setstatevalues, statevalues, name }) {
    console.log("optionsoptionsoptionsCC", options)

    const [selectState, setSelectState] = React.useState();

    useEffect(() => {
        console.log(selectState);
    }, [selectState]);

    const handleChange = (event) => {
        setSelectState(event.target.value);
        let newdata = event.target.value

        var obj = JSON.parse(newdata)
        console.log("getUserGeneralSettingData in", obj.id)
        setstatevalues({ ...statevalues, [name]: obj.id })
    };

    return (
        <div>
            <TextField
                id="outlined-select"
                select
                required
                // label="Select"
                variant="outlined"
                onChange={handleChange}

                InputLabelProps={{
                    shrink: true
                }}
                value={selectState || ""}
                defaultValue={""}
            >
                {options?.map((d, index) => (
                    <MenuItem
                        key={d.id}
                        value={JSON.stringify({
                            id: d.pK_CCID,
                            // percentage: d.percentage,
                            name: d.code
                        })}
                    >
                        {d.code}
                    </MenuItem>
                ))}
            </TextField>
        </div>
    );
}
export default SelectOptionForCC