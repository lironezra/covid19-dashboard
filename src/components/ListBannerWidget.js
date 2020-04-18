import React from 'react';

const ListBannerWidget = ({ children }) => {
    return (
        <div className="list-banner-widget-wrapper">
            <ul>
                { children ? children : null }
            </ul>
        </div>
    );
};

export default ListBannerWidget;