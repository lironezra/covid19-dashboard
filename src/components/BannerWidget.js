import React from 'react';
import PropTypes from 'prop-types';

const BannerWidget = ({ header, value, className, type }) => {
    if (value && header) {
        return (
            <div className={className}>
                <span className="banner-header">{header}</span>
                <span className={`banner-value ${type}`}>{value.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}</span>
            </div>
        );
    }

    return null;
};

BannerWidget.propTypes = {
    header: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ])
};

export default BannerWidget;