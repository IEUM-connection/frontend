import './Header.css';
import LoginModal from '../modals/LoginModal';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태 관리용
    const navigate = useNavigate();

    const handleLogin = () => {  
        setIsLoggedIn(true); // 로그인 상태 변경. !나중에 지워야함!
        setIsModalOpen(true);
    };

    const handleLogout = () => {  // 로그아웃 로직 상태 변경 하기 위해
        setIsLoggedIn(false);
    };

    const [alertCount, setAlertCount] = useState(0); // 알림 숫자 상태 추가
    
    //알림 숫자 더미데이터 (나중에 지우고 데이터 받아오기)
    useEffect(() => {
        setAlertCount(20);
    }, []);

    return (
        <div className="header-container">
            <div className="bar-wrap">
                <div className="logo-img" onClick={() => navigate('/')}>
                    <img src="/image/Ieum_logo.png" alt="메인로고" />
                </div>
                <div className="header-navigation" onClick={() => navigate('/')}> 서비스 신청 </div>
                <div className="header-navigation" onClick={() => navigate('/')}> 마이페이지 </div>
                <div className="header-navigation" onClick={() => navigate('/')}> 고객센터 </div>
                <div className="header-navigation" onClick={() => navigate('/')}> 관리자페이지 </div>
            </div>
            {isLoggedIn ? (
                    <div className="user-info-container">
                        <div className="alert-icon">
                            <img src="/image/alert.png" alt="알림" />
                            {alertCount > 0 && ( // 알림 숫자가 0보다 클 때만 표시
                                <div className="alert-count">{alertCount}</div>
                            )}
                        </div>
                        <div className="user-welcome">
                            <div className="user-name"> 역삼2동 최고민수 님</div>
                            <div className="welcome-message">환영합니다!</div>
                        </div>
                        <button className="logout-button" onClick={handleLogout}>로그아웃</button>
                    </div>
                ) : (
                    <div className="login-container">
                        <div className="profile-icon">
                            <img src="/image/profile.png" alt="프로필아이콘" />
                        </div>
                        <button className="login-button" onClick={handleLogin}>로그인</button>
                    </div>
                )}
            {isModalOpen && <LoginModal onClose={() => setIsModalOpen(false)} />}
        </div>
    );

};

export default Header;