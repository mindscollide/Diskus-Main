import React from 'react';
import './Tooltip.css'; // Import the CSS file for tooltip styles

const Tooltip = ({ text, children }) => (
    <div className="tooltip-container">
        {children}
        <div className="tooltip-text">{text}</div>
    </div>
);

export default Tooltip;
