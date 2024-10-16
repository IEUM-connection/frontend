import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginModal.css';
import axios from 'axios';
import { AuthContext } from '../auth/AuthContext';


const FindPassword = ({ onClose }) => {
    const navigate = useNavigate();

    const [isOpen, setIsOpen] = useState(true); // 모달이 열려있으면 true, 닫히면 false
    const [email, setEmail] = useState(''); // 사용자가 입력한 이메일 또는 관리자 코드를 저장하는 상태
    const { login } = useContext(AuthContext); // 로그인 상태를 업데이트하는 함수
    const [isLoading, setIsLoading] = useState(false); // 로그인 중인지 확인하는 상태

    // closeModal 함수는 모달을 닫는 역할을 합니다.
    const closeModal = () => {
        setIsOpen(false); // 모달이 닫혔음을 상태로 설정
        onClose(); // 모달이 닫혔음을 부모 컴포넌트에 알림
    };

    // 모달이 닫혔다면 아무 것도 렌더링하지 않음
    if (!isOpen) return null;

    // 로그인 모달 화면을 렌더링합니다.
    return (
        <div className="login-modal" >
            <div className="login-inner">
                <div className="close-button" onClick={closeModal}>
                    <img src="/image/close-button.png" alt="닫기" />
                </div>
                <div className="login-logo">
                    <img src="/image/logo-text.png" alt="메인로고" />
                </div>
                <div className="login-wrap">
                    <div className="login-input-container">
                        <input
                            className="email-input"
                            type="text"
                            placeholder="이름"
                            onChange={(e) => setEmail(e.target.value)} // 입력값을 email 상태에 저장
                            disabled={isLoading} // 로그인 중일 때 입력 불가
                        />
                        <input
                            className="email-input"
                            type="password"
                            placeholder="비밀번호"
                        />
                        <button className="login-modal-button">찾기</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FindPassword;
