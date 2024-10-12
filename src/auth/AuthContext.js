import { createContext, useState, useContext, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [accessToken, setAccessToken] = useState(null);
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        // 애플리케이션이 로드될 때 localStorage에서 토큰과 사용자 정보를 불러와 상태를 업데이트
        const storedToken = localStorage.getItem('accessToken');
        const storedUserInfo = localStorage.getItem('userInfo');

        if (storedToken && storedUserInfo) {
            setAccessToken(storedToken);
            setUserInfo(JSON.parse(storedUserInfo));
            setIsAuthenticated(true);
        }
    }, []);  // 컴포넌트가 마운트될 때만 실행

    const login = (token, userData) => {
        console.log('로그인한 사용자 정보:', userData);
        setIsAuthenticated(true);
        setAccessToken(token);
        setUserInfo(userData);
        localStorage.setItem('accessToken', token);
        localStorage.setItem('userInfo', JSON.stringify(userData));
    };

    const logout = () => {
        setIsAuthenticated(false);
        setAccessToken(null);
        setUserInfo(null);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userInfo');
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, accessToken, userInfo, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};