import './Footer.css';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
    const navigate = useNavigate();

    return (
        <div className="footer-container">
            <div className="footer-logo">
                <img src="/image/Ieum_logo.png" alt="하단로고" />
            </div>
            <div className="footer-text">
                <div className="footer-message">사람과 사람 사이를 잇습니다.</div>
                <div className="footer-contact">Contact : i2um.connection@gmail.com</div>
                <div className="footer-copyright">Copyright 2024 All ⓒ rights reserved</div>
            </div>
            <div className="footer-contents">
                <div className="footer-content">고객센터</div>
                <div className="footer-content">이용약관</div>
                <div className="footer-content">개인정보처리방침</div>
            </div>
        </div>
    );

};

export default Footer;