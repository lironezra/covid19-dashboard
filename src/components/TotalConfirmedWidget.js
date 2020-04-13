import React from 'react';

const TotalConfirmedWidget = ( { totalConfirmedCases }) => {
    return (
        <div className="total-confirmed-number">
            <span className="confiemed-header">Total Confirmed</span>
            <span className="confiemed-number">{totalConfirmedCases ? totalConfirmedCases.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') : null}</span>
        </div>
    );
};

export default TotalConfirmedWidget;