import './Header.css';
import LoginModal from '../modals/LoginModal';
import AlertModal from '../modals/AlertModal';
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import axios from 'axios';

const Header = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
    const [alertCount, setAlertCount] = useState(0);
    const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태 관리용
    const { accessToken, userInfo, isAuthenticated, logout } = useAuth();  // useAuth()로 수정
    const [guardianInfo, setGuardianInfo] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (userInfo) {
            setIsLoggedIn(true); // userInfo가 있으면 로그인 상태로 변경
        } else {
            setIsLoggedIn(false); // userInfo가 없으면 로그아웃 상태로 변경
        }
    }, [userInfo]);


    const handleLogout = () => {  // 로그아웃 로직 상태 변경 하기 위해
        logout();  // 로그아웃 시 AuthContext의 logout 함수 호출
        navigate('/');
    };
    
    //알림 숫자 더미데이터 (나중에 지우고 데이터 받아오기)
    useEffect(() => {
        setAlertCount(20);
    }, []);

    const handleAlertClick = () => {
        if (isAlertModalOpen) {
            setIsAlertModalOpen(false);
            setAlertCount(0);
        } else if (alertCount > 0) {
            setIsAlertModalOpen(true);
        }
    };

    const closeAlertModal = () => {
        setIsAlertModalOpen(false);
        setAlertCount(0);
    }; 

    useEffect(() => {
        const fetchGuardianInfo = async () => {
            try {
                const response = await axios.get(
                    process.env.REACT_APP_apiHome + `guardians`,
                    {   
                        headers: { Authorization: `Bearer ${accessToken}` },
                    }
                );
                setGuardianInfo(response.data.data);  // 보호자 정보 상태에 저장
            } catch (error) {
                console.error('보호자 정보 가져오기 실패:', error);
            }
        };

        if (accessToken) {
            fetchGuardianInfo();  // 토큰이 있을 때만 API 호출
        }
    }, [accessToken]);


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
                        {userInfo?.loginType === 'admin' ? (
                            <div className="user-name">{userInfo.location} 님</div>
                        ) : (
                            guardianInfo ? (  // guardianInfo가 있을 때만 표시
                                <div className="user-name">{guardianInfo.name} 님</div>
                            ) : (
                                <div>로딩 중...</div>  // guardianInfo가 없을 때 로딩 중 표시
                            )
                        )}
                        <div className="welcome-message">환영합니다!</div>
                        </div>
                        <button className="logout-button" onClick={handleLogout}>로그아웃</button>
                    </div>
                ) : (
                    <div className="login-container">
                        <div className="profile-icon">
                            <img src="/image/profile.png" alt="프로필아이콘" />
                        </div>
                        <button className="login-button" onClick={() => setIsModalOpen(true)}>로그인</button>
                    </div>
                )}
            {isModalOpen && <LoginModal onClose={() => setIsModalOpen(false)} />}
            {isAlertModalOpen && <AlertModal onClose={() => setIsAlertModalOpen(false)} />}
        </div>
    );

};

export default Header;