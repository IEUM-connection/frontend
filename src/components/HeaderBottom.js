import './HeaderBottom.css';
import React from 'react';

const HeaderBottom = ({ text, onNavigate }) => {
    return (
        <div className="header-bottom">
            {text.map((item, index) => (
                <div key={index} className="header-bottom-content" onClick={() => onNavigate(item)}>
                    {item}
                </div>
            ))}
        </div>
    );
};

export default HeaderBottom;