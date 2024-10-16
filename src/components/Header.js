import './Header.css';
import LoginModal from '../modals/LoginModal';
import AlertModal from '../modals/AlertModal';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import axios from 'axios';

const Header = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
    const [alertCount, setAlertCount] = useState(0);
    const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태 관리용
    const { accessToken, userInfo, isAuthenticated, logout } = useAuth();  // useAuth()로 수정
    const [userDetails, setUserDetails] = useState(null); 
    const [loginType, setLoginType] = useState(''); 
    const navigate = useNavigate();

    useEffect(() => {
        console.log('User Info:', userInfo);  // loginType 확인
        if (userInfo) {
            setIsLoggedIn(true);
            setLoginType(localStorage.getItem('loginType')); 
        } else {
            setIsLoggedIn(false);
        }
    }, [userInfo]);


    const handleLogout = () => {  // 로그아웃 로직 상태 변경 하기 위해
        logout();  // 로그아웃 시 AuthContext의 logout 함수 호출
        navigate('/');
    };
    
    // //알림 숫자 더미데이터 (나중에 지우고 데이터 받아오기)
    // useEffect(() => {
    //     setAlertCount(20);
    // }, []);

    // const handleAlertClick = () => {
    //     if (isAlertModalOpen) {
    //         setIsAlertModalOpen(false);
    //         setAlertCount(0);
    //     } else if (alertCount > 0) {
    //         setIsAlertModalOpen(true);
    //     }
    // };

    // const closeAlertModal = () => {
    //     setIsAlertModalOpen(false);
    //     setAlertCount(0);
    // }; 

    useEffect(() => {
        const fetchUserInfo = async () => {
            if (!accessToken) {
                console.log('No access token available');
                return;
            }

            try {
                const loginType = localStorage.getItem('loginType');
                console.log('Login Type:', loginType);

                let url;
                if (loginType === 'ADMIN') {
                    url = `${process.env.REACT_APP_apiHome}admins`;
                    console.log('Fetching admin info');
                } else {
                    url = `${process.env.REACT_APP_apiHome}guardians`;
                    console.log('Fetching guardian info');
                }

                const response = await axios.get(url, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                });

                if (response.data && response.data.data) {
                    setUserDetails(response.data.data);
                } else {
                }
            } catch (error) {
                console.error('정보 가져오기 실패:', error.response ? error.response.data : error.message);
            }
        };

        fetchUserInfo();
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
                {loginType === 'ADMIN' && (
                    <div className="header-navigation" onClick={() => navigate('/admin')}> 관리자페이지 </div>
                )}
            </div>
            {isLoggedIn ? (
                    <div className="user-info-container">
                        {/* <div className="alert-icon" onClick={handleAlertClick}>
                            <img src="/image/alert.png" alt="알림" />
                            {alertCount > 0 && (
                                <div className="alert-count">{alertCount}</div>
                            )}
                        </div> */}
                        <div className="user-welcome">
                            {userDetails ? (
                                <>
                                    {localStorage.getItem('loginType') === 'ADMIN' ? (
                                        <>
                                            {/* admin일 경우 location과 name 출력 */}
                                            <div className="user-name">{userDetails.location}</div>
                                            <div className="welcome-message-admin">{userDetails.name} 님</div>
                                        </>
                                    ) : (
                                        <>
                                            {/* guardian일 경우 기존처럼 name과 환영 메시지 출력 */}
                                            <div className="user-name">{userDetails.name} 님</div>
                                            <div className="welcome-message">환영합니다!</div>
                                        </>
                                    )}
                                </>
                            ) : (
                                <div>로딩 중...</div>
                            )}
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