import React from 'react'
import Dropdown from 'react-bootstrap/Dropdown';
const CustomDropdown = ({ Icon, options, onChange, onClick }) => {
    console.log(options, "optionsoptionsoptionsoptions")
    return (
        <Dropdown className="d-inline mx-2" onChange={onChange}>
            <Dropdown.Toggle id="dropdown-autoclose-true">
                {Icon}
            </Dropdown.Toggle>

            <Dropdown.Menu >
                {/* {options} */}
                {options !== null && options !== undefined && options.map((data, index) => {
                    console.log(data, "datadatadatadata")
                    return <Dropdown.Item onClick={onClick} >{data.label}</Dropdown.Item>
                })}

                {/* <Dropdown.Item href="#">Menu Item</Dropdown.Item>
                <Dropdown.Item href="#">Menu Item</Dropdown.Item> */}
            </Dropdown.Menu>
        </Dropdown>

    )
}

export default CustomDropdown