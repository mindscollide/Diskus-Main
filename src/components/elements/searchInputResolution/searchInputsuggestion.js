import React, { useState } from 'react';
import Select from 'react-select';
import './searchInputsuggestion.css'
const SearchSelect = () => {
    const options = [
        // { value: 'apple', label: 'Apple' },
        // { value: 'banana', label: 'Banana' },
        // { value: 'orange', label: 'Orange' },
        // { value: 'grape', label: 'Grape' },
        // { value: 'kiwi', label: 'Kiwi' },
        // { value: 'mango', label: 'Mango' }
        // Add more options as needed
    ];

    const [inputValue, setInputValue] = useState('');
    const [filteredOptions, setFilteredOptions] = useState(options);

    const handleInputChange = value => {
        setInputValue(value);

        // Perform intelligent filtering based on user input
        // const filtered = options.filter(option =>
        //     option.label.toLowerCase().includes(value.toLowerCase())
        // );

        // setFilteredOptions(filtered);
    };

    return (
        <Select
            classNamePrefix={"input_suggestion_resolution"}
            options={filteredOptions}
            onInputChange={handleInputChange}
            inputValue={inputValue}
            isSearchable
            placeholder="Search..."

        />
    );
};

export default SearchSelect;
