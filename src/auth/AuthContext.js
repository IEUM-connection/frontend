import { createContext, useState, useEffect, useContext } from 'react';

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
        }
    }, []);

    const login = (token, userInfo) => {
        setAccessToken(token);
        setUserInfo(userInfo);
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userInfo');
        setAccessToken(null);
        setUserInfo(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, accessToken, userInfo, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};