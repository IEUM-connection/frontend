import React, { useState, useContext } from 'react';
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
    const [isLoading, setIsLoading] = useState(false);

    const closeModal = () => {
        setIsOpen(false);
        onClose();
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleLogin();
        }
    };

    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleLogin = async () => {
        if (isLoading) return; // Prevent multiple login attempts

        setIsLoading(true);
        try {
            const loginType = isValidEmail(email) ? 'guardian' : 'admin';
            const loginData = {
                password: password,
                [loginType === 'guardian' ? 'email' : 'adminCode']: email
            };

            const response = await axios.post(
                process.env.REACT_APP_apiHome + `auth/login`,
                loginData,
                {
                    headers: {
                        'loginType': loginType,
                    },
                    withCredentials: true
                }
            );

            let token = response.headers['authorization'];

            if (token) {
                const userType = response.data.userType;
                const userId = response.data.userId;

                localStorage.setItem('accessToken', token);
                localStorage.setItem('userType', userType);
                localStorage.setItem('userId', userId);

                login(token, { userType, userId });

                closeModal();
                navigate(userType === 'admin' ? '/admin-dashboard' : '/');
            } else {
                throw new Error('No token received');
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                alert('이메일/관리자 코드 또는 비밀번호가 올바르지 않습니다.');
            } else {
                alert('로그인 중 오류가 발생했습니다. 다시 시도해 주세요.');
            }
            console.error('Login error:', error);
        } finally {
            setIsLoading(false);
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
                            type="text"
                            placeholder="이메일 또는 관리자 코드"
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isLoading}
                        />
                        <input
                            className="email-input"
                            type="password"
                            placeholder="비밀번호"
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyPress={handleKeyPress}
                            disabled={isLoading}
                        />
                        <button
                            className="login-modal-button"
                            onClick={handleLogin}
                            disabled={isLoading}
                        >
                            {isLoading ? '로그인 중...' : '로그인'}
                        </button>
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
