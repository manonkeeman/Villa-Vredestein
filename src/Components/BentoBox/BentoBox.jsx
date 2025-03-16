import React from 'react';
import PropTypes from 'prop-types';
import './BentoBox.css';

const BentoBox = ({ content }) => {
    return (
        <div className="wrapper">
            <div className="bento-grid">
                {content}
            </div>
        </div>
    );
};

BentoBox.propTypes = {
    content: PropTypes.node.isRequired,
};

export default BentoBox;