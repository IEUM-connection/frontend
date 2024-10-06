import './Header.css';
import LoginModal from '../modals/LoginModal';
import AlertModal from '../modals/AlertModal';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
    const [alertCount, setAlertCount] = useState(0);
    const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태 관리용
    const navigate = useNavigate();

    const handleLogin = () => {  
        setIsLoggedIn(true); // 로그인 상태 변경. !나중에 지워야함!
        setIsModalOpen(true);
    };

    const handleLogout = () => {  // 로그아웃 로직 상태 변경 하기 위해
        setIsLoggedIn(false);
    };
    
    //알림 숫자 더미데이터 (나중에 지우고 데이터 받아오기)
    useEffect(() => {
        setAlertCount(20);
    }, []);

    const handleAlertClick = () => {
        if (isAlertModalOpen) {
            // 모달이 열려있을 때 닫으면서 알림 숫자를 0으로 변경
            setIsAlertModalOpen(false);
            setAlertCount(0);
        } else if (alertCount > 0) {
            // 알림 숫자가 0보다 클 때 모달을 연다
            setIsAlertModalOpen(true);
        }
    };

    const closeAlertModal = () => {
        setIsAlertModalOpen(false);
        setAlertCount(0);
    };


    return (
        <div className="header-container">
            <div className="bar-wrap">
                <div className="logo-img" onClick={() => navigate('/')}>
                    <img src="/image/Ieum_logo.png" alt="메인로고" />
                </div>
                <div className="header-navigation" onClick={() => navigate('/request')}> 서비스 신청 </div>
                <div className="header-navigation" onClick={() => navigate('/mypage')}> 마이페이지 </div>
                <div className="header-navigation" onClick={() => navigate('/service')}> 고객센터 </div>
                <div className="header-navigation" onClick={() => navigate('/admin')}> 관리자페이지 </div>
            </div>
            {isLoggedIn ? (
                    <div className="user-info-container">
                        <div className="alert-icon" onClick={handleAlertClick}>
                            <img src="/image/alert.png" alt="알림" />
                            {alertCount > 0 && (
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
            {isAlertModalOpen && <AlertModal onClose={() => setIsAlertModalOpen(false)} />}
        </div>
    );

};

export default Header;