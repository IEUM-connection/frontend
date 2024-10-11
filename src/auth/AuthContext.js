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
        const storedUserInfo = localStorage.getItem('userInfo');
        
        if (token && storedUserInfo) {
            setAccessToken(token);
            setUserInfo(JSON.parse(storedUserInfo));
            setIsAuthenticated(true);

            // 새로고침 후에도 axios 요청에 토큰을 자동으로 포함
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
    }, []);

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
    useEffect(() => {
        console.log('Current userInfo in AuthContext:', userInfo);
    }, [userInfo]);

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