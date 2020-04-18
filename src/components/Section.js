import React from 'react';
import PropTypes from 'prop-types';

const Section = ({ children, className }) => {
    return (
        children ? <div className={className}>{children}</div> : null
    );
};

Section.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string
}

export default Section;