import React from 'react';

const UpdatedAtWidget = ({ lastUpdated }) => {
    return (
        <div className="updated-at">
            <span>Last Updated at (D/M/YYYY)</span>
            <p>{lastUpdated ? lastUpdated : null}</p>
        </div>
    );
};

export default UpdatedAtWidget;