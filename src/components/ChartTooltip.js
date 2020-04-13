import React from 'react';

import  { abbreviateNumber } from '../lib/util';

const ChartTooltip = ({ active, payload, label }) => {
    if (active) {
        return (
            <div className="tooltip-container">
                <p>{label ? label : "Not-Suplly"}:</p>
                <p>{abbreviateNumber(payload[0].value)}</p>
            </div>
        );
    }

    return null;
};

export default ChartTooltip;