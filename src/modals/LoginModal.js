import React, { useState } from 'react';
import './LoginModal.css';

const LoginModal = ({ onClose }) => {
    const [isOpen, setIsOpen] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태 관리용

    const closeModal = () => {
        setIsOpen(false);
        onClose();
    };

    const handleLogin = () => {  
        setIsLoggedIn(true); // 로그인 상태 변경
    };

    if (!isOpen) return null; 

    return (
        <div className="login-modal">
            <div className="login-inner">
                <div className="close-button" onClick={closeModal}>
                    <img src="/image/close-button.png" alt="닫기" />
                </div>
                <div className="login-logo">
                    <img src="/image/logo-text.png" alt="메인로고" />
                </div>
                <div className="login-wrap">
                    <div className="login-input-container">
                        <input className="email-input" type="text" placeholder="이메일"/>
                        <input className="email-input" type="text" placeholder="비밀번호"/>
                        <button className="login-modal-button" onClick={handleLogin}>로그인</button>
                    </div>
                    <div className="login-function">
                        <div className="member-subscribe">회원가입</div>
                        <div className="find-email">이메일 찾기</div>
                        <div className="find-password">비밀번호 찾기</div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default LoginModal;