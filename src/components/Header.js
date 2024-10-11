import './Header.css';
import LoginModal from '../modals/LoginModal';
import AlertModal from '../modals/AlertModal';
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext'; 
import axios from 'axios';

const Header = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
    const [alertCount, setAlertCount] = useState(0);
    const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태 관리용
    const { userInfo, logout, login } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (userInfo) {
            setIsLoggedIn(true); // userInfo가 있으면 로그인 상태로 변경
        } else {
            setIsLoggedIn(false); // userInfo가 없으면 로그아웃 상태로 변경
        }
    }, [userInfo]);

    useEffect(()=> {
        const getUserInfo = async () => {
            try {
                let accessToken = localStorage.getItem('accessToken');
                let guardianId = localStorage.getItem('guardianId');

                 if (!accessToken || !guardianId) {
                console.log('토큰 또는 guardianId가 없습니다.');
                return;
            }

                const response = await axios.get(
                    process.env.REACT_APP_apiHome + `guardians/{guardian-id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );

                if (response.data) {
                    const userInfo = response.data;
                    login(accessToken, userInfo);
                } else {
                    console.log('사용자 정보를 가져오지 못했습니다.');
                }
            } catch (error) {
                console.error('사용자 정보를 가져오는 중 에러 발생:', error);
            } finally {
                setLoading(false);
            }
        };
        if (!userInfo) {
            getUserInfo();
        } else {
            setLoading(false);
        }
    }, [userInfo, login]);

    const handleLogout = () => {  // 로그아웃 로직 상태 변경 하기 위해
        setIsLoggedIn(false);
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


    // useEffect(() => {
    //     if (isAuthenticated && userInfo) {
    //         if (userInfo.loginType === 'admin') {
    //             setUserLocation(userInfo.location);
    //             setLoginType('admin');
    //         } else if (userInfo.loginType === 'guardian') {
    //             setUserName(userInfo.name);
    //             setLoginType('guardian');
    //         }
    //     }
    // }, [isAuthenticated, userInfo]); 

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
                            <div className="user-name">{userInfo.name} 님</div>
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