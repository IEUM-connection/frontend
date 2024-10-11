import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginModal.css';
import axios from 'axios';
import { AuthContext } from '../auth/AuthContext';

const LoginModal = ({ onClose }) => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(true);
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const { login } = useContext(AuthContext);
    const [loginType, setLoginType] = useState('guardian'); 

    const closeModal = () => {
        setIsOpen(false);
        onClose();
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleLogin();
        }
    };

    const handleLogin = async () => {
        try {
            const response = await axios.post(
                process.env.REACT_APP_apiHome + `auth/login`,
                {
                    "email": email,
                    "password": password
                },
                {
                    headers: {
                        'loginType': loginType,
                        'Content-Type': 'application/json'
                    },
                    withCredentials: true 
                }
            );

            console.log(response);
            let token = response.headers['authorization'];

            if (token) {
                console.log('사용자 토큰 정보:', token);
                const guardianId  = response.data.guardianId; // 로그인 후 응답에서 guardianId를 받아옴
                console.log(guardianId);

                // 로컬스토리지에 guardianId와 토큰 저장
                localStorage.setItem('accessToken', token);
                localStorage.setItem('guardianId', guardianId);
  

                const getUserInfo = await axios.get(
                    process.env.REACT_APP_apiHome + `guardians/{guardian-id}`,
                    {
                        headers: {
                            
                            Authorization: `Bearer ${token}`
                        },
                    }
                );
                if (getUserInfo && getUserInfo.data) {
                    const userInfo = getUserInfo.data;
                    login(token, userInfo); // 사용자 정보로 로그인 처리
                    closeModal();
                    navigate('/');
                }
            } else {
                console.log('토큰을 찾을 수 없습니다.');
                alert('로그인에 실패했습니다.');
            }
        } catch (error) {
            console.log('에러 발생:', error);
            alert('로그인에 실패했습니다.');
        }
    };

    if (!isOpen) return null; 

    return (
        <div className="login-modal" onKeyPress={handleKeyPress}>
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
                            type="text" placeholder="이메일"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input 
                            className="email-input" 
                            type="password" placeholder="비밀번호" 
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyPress={handleKeyPress}
                        />
                        <button className="login-modal-button" onClick={handleLogin}>로그인</button>
                    </div>
                    <div className="login-function">
                        <div className="signup" onClick={() => navigate('/signup')}>회원가입</div>
                        <div className="find-email">이메일 찾기</div>
                        <div className="find-password">비밀번호 찾기</div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default LoginModal;