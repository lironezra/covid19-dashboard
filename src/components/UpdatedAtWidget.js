import React from 'react';

const UpdatedAtWidget = ({ lastUpdated }) => {
    if(lastUpdated) {
        return (
            <div className="updated-at">
                <span>Last Updated at</span>
                <p>{lastUpdated ? lastUpdated : null}</p>
            </div>
        );
    }

    return null;
};

export default UpdatedAtWidget;