import './HeaderBottom.css';
import React from 'react';

const HeaderBottom = ({ text }) => {
    return (
        <div className="header-bottom">
            <div className="header-bottom-content">{text}</div>
        </div>
    );

};

export default HeaderBottom;