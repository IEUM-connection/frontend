import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [accessToken, setAccessToken] = useState(null);
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        
        if (token) {
            // 토큰이 존재하면 Authorization 헤더에 추가
            setAccessToken(token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            // 토큰을 사용해 서버에서 사용자 정보 요청
            fetchUserInfo(token);
        }
    }, []);

    const fetchUserInfo = async (token) => {
        try {
            const response = await axios.get('guardians/{guardian-id}'); // 서버에서 토큰으로 사용자 정보 가져오기
            const userInfo = response.data.data; // 응답에서 사용자 정보 추출
            setUserInfo(userInfo);
            setIsAuthenticated(true);
            
            // 로컬 스토리지에 사용자 정보 저장
            localStorage.setItem('userInfo', JSON.stringify(userInfo));
        } catch (error) {
            console.error('Failed to fetch user info:', error);
            logout(); // 오류 발생 시 로그아웃 처리
        }
    };


    const login = (token, userInfo) => {
        setAccessToken(token);
        // userInfo를 올바르게 설정
        setUserInfo({ ...userInfo, guardianId: userInfo.guardianId });
        setIsAuthenticated(true);
        // 로컬 스토리지에 토큰과 사용자 정보 저장
        localStorage.setItem('accessToken', token);
        localStorage.setItem('userInfo', JSON.stringify({...userInfo, guardianId: userInfo.guardianId}));

        // axios에 기본 Authorization 헤더 설정
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    };


    const logout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userInfo');
        setAccessToken(null);
        setUserInfo(null);
        setIsAuthenticated(false);

         // axios 기본 Authorization 헤더 제거
         delete axios.defaults.headers.common['Authorization'];
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, accessToken, userInfo, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};