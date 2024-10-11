import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginModal.css';
import axios from 'axios';
import { AuthContext } from '../auth/AuthContext';

// LoginModal 컴포넌트는 로그인 화면을 보여주는 모달창 역할을 합니다.
const LoginModal = ({ onClose }) => {
    // navigate는 페이지 이동을 도와주는 함수입니다.
    const navigate = useNavigate();

    const [isOpen, setIsOpen] = useState(true); // 모달이 열려있으면 true, 닫히면 false
    const [password, setPassword] = useState(''); // 사용자가 입력한 비밀번호를 저장하는 상태
    const [email, setEmail] = useState(''); // 사용자가 입력한 이메일 또는 관리자 코드를 저장하는 상태
    const { login } = useContext(AuthContext); // 로그인 상태를 업데이트하는 함수
    const [isLoading, setIsLoading] = useState(false); // 로그인 중인지 확인하는 상태

    // closeModal 함수는 모달을 닫는 역할을 합니다.
    const closeModal = () => {
        setIsOpen(false); // 모달이 닫혔음을 상태로 설정
        onClose(); // 모달이 닫혔음을 부모 컴포넌트에 알림
    };

    // 사용자가 'Enter' 키를 누르면 handleLogin 함수가 실행됩니다.
    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleLogin(); // 'Enter' 키를 눌렀을 때 로그인 시도
        }
    };

    // 입력된 이메일이 유효한지 확인하는 함수입니다.
    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // 이메일 형식을 확인하는 정규식
        return emailRegex.test(email); // 이메일 형식이 맞으면 true 반환
    };

    const handleLogin = async () => {
        if (isLoading) return; // 이미 로그인 중이면 중복으로 실행하지 않음
    
        setIsLoading(true); // 로그인 시도 중이므로 로딩 상태로 설정
        try {
            // 입력된 값이 이메일 형식이면 guardian(사용자), 그렇지 않으면 admin(관리자)으로 로그인 타입을 설정합니다.
            const loginType = isValidEmail(email) ? 'guardian' : 'admin';
    
            // 로그인에 필요한 데이터를 준비합니다.
            const loginData = {
                password: password, // 입력된 비밀번호
                [loginType === 'guardian' ? 'email' : 'adminCode']: email // 로그인 타입에 맞는 이메일 또는 관리자 코드
            };
    
            // 서버에 로그인 요청을 보냅니다.
            const response = await axios.post(
                process.env.REACT_APP_apiHome + `auth/login`, // 로그인 API 경로
                loginData, // 로그인 데이터
                {
                    headers: {
                        'loginType': loginType, // 로그인 타입을 서버에 전달
                    },
                    withCredentials: true // 쿠키와 함께 요청을 보냄 (인증 정보 저장을 위해)
                }
            );
    
            // 서버에서 받은 인증 토큰을 저장합니다.
            let token = response.headers['authorization'];

            if (token) {
                // 서버에서 받은 사용자 정보를 가져옵니다.
                const userId = response.data.userId; // 사용자 ID를 응답에서 받아옵니다.
                const loginType = response.data.loginType[0].authority; // 권한 정보 (예: GUARDIAN 또는 ADMIN)
    
                // 로컬 저장소에 토큰과 사용자 정보를 저장합니다.
                localStorage.setItem('accessToken', token); // 토큰 저장
                localStorage.setItem('loginType', loginType); // 로그인 타입 저장
                localStorage.setItem('userId', userId); // 사용자 ID 저장
    
                // 로그인 상태를 업데이트합니다.
                login(token, { loginType, userId });
    
                // 로그인 성공 시 모달을 닫고, 관리자면 관리자 대시보드로, 그렇지 않으면 메인 페이지로 이동합니다.
                closeModal();
                navigate(loginType === 'ADMIN' ? '/admin-dashboard' : '/');
            } else {
                throw new Error('No token received'); // 토큰을 받지 못한 경우 오류 발생
            }
        } catch (error) {
            // 로그인 실패 시 오류 메시지를 보여줍니다.
            if (error.response && error.response.status === 401) {
                alert('이메일/관리자 코드 또는 비밀번호가 올바르지 않습니다.');
            } else {
                alert('로그인 중 오류가 발생했습니다. 다시 시도해 주세요.');
            }
            console.error('Login error:', error);
        } finally {
            setIsLoading(false); // 로그인 시도 완료 후 로딩 상태 해제
        }
    };

    // 모달이 닫혔다면 아무 것도 렌더링하지 않음
    if (!isOpen) return null;

    // 로그인 모달 화면을 렌더링합니다.
    return (
        <div className="login-modal" onKeyPress={handleKeyPress}>
            <div className="login-inner">
                {/* 닫기 버튼 */}
                <div className="close-button" onClick={closeModal}>
                    <img src="/image/close-button.png" alt="닫기" />
                </div>
                {/* 로고 이미지 */}
                <div className="login-logo">
                    <img src="/image/logo-text.png" alt="메인로고" />
                </div>
                <div className="login-wrap">
                    <div className="login-input-container">
                        {/* 이메일 또는 관리자 코드 입력란 */}
                        <input
                            className="email-input"
                            type="text"
                            placeholder="이메일 또는 관리자 코드"
                            onChange={(e) => setEmail(e.target.value)} // 입력값을 email 상태에 저장
                            disabled={isLoading} // 로그인 중일 때 입력 불가
                        />
                        {/* 비밀번호 입력란 */}
                        <input
                            className="email-input"
                            type="password"
                            placeholder="비밀번호"
                            onChange={(e) => setPassword(e.target.value)} // 입력값을 password 상태에 저장
                            onKeyPress={handleKeyPress} // 'Enter' 키를 누르면 로그인 시도
                            disabled={isLoading} // 로그인 중일 때 입력 불가
                        />
                        {/* 로그인 버튼 */}
                        <button
                            className="login-modal-button"
                            onClick={handleLogin} // 버튼을 누르면 로그인 시도
                            disabled={isLoading} // 로그인 중일 때 버튼 비활성화
                        >
                            {isLoading ? '로그인 중...' : '로그인'} {/* 로딩 중일 때는 '로그인 중...' 표시 */}
                        </button>
                    </div>
                    <div className="login-function">
                        {/* 회원가입, 이메일 찾기, 비밀번호 찾기 기능 */}
                        <div className="signup" onClick={() => navigate('/signup')}>회원가입</div>
                        <div className="find-email">이메일 찾기</div>
                        <div className="find-password">비밀번호 찾기</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginModal;
