import React from 'react';
import PropTypes from 'prop-types';

const Slider = ({ children }) => {
    return (
        <div className="slider-wrapper">
            <p className="content">
               {children ? children : null}
            </p>
        </div>
    )
}

Slider.propTypes = {
    children: PropTypes.node
}

export default Slider;