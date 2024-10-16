import React, { useState } from 'react';
import axios from 'axios';
import './LoginModal.css';

const FindEmail = ({ onClose }) => {
    const [name, setName] = useState(''); // 사용자가 입력한 이름을 저장하는 상태
    const [phone, setPhone] = useState(''); // 사용자가 입력한 전화번호를 저장하는 상태
    const [email, setEmail] = useState(''); // 조회된 이메일을 저장하는 상태
    const [errorMessage, setErrorMessage] = useState(''); // 오류 메시지 상태
    const [isLoading, setIsLoading] = useState(false); // 로딩 상태

    const handleFindEmail = async () => {
        setIsLoading(true);
        setErrorMessage(''); // 오류 메시지를 초기화
        setEmail(''); // 이전에 조회된 이메일을 초기화
        
        try {
            // 서버에 이름과 전화번호로 이메일 조회 요청을 보냄
            const response = await axios.get(
                process.env.REACT_APP_apiHome + 'email/find', 
                {
                    params: { name, phone },
                }
            );
            
            // 서버로부터 이메일 응답을 받으면 상태에 저장
            setEmail(response.data);
        } catch (error) {
            // 오류 발생 시 오류 메시지 상태에 저장
            if (error.response && error.response.status === 404) {
                setErrorMessage('해당 정보로 이메일을 찾을 수 없습니다.');
            } else {
                setErrorMessage('이메일 조회 중 오류가 발생했습니다.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-modal">
            <div className="login-inner">
                <div className="close-button" onClick={onClose}>
                    <img src="/image/close-button.png" alt="닫기" />
                </div>
                <div className="login-logo">
                    <img src="/image/logo-text.png" alt="메인로고" />
                </div>
                <div className="login-wrap">
                    <div className="login-input-container">
                        <input
                            className="email-input"
                            type="text"
                            placeholder="이름"
                            value={name}
                            onChange={(e) => setName(e.target.value)} // 입력된 이름을 상태에 저장
                            disabled={isLoading} // 로딩 중일 때 입력 불가
                        />
                        <input
                            className="email-input"
                            type="text"
                            placeholder="전화번호"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)} // 입력된 전화번호를 상태에 저장
                            disabled={isLoading} // 로딩 중일 때 입력 불가
                        />
                        <button
                            className="login-modal-button"
                            onClick={handleFindEmail} // 버튼 클릭 시 이메일 찾기 요청
                            disabled={isLoading} // 로딩 중일 때 버튼 비활성화
                        >
                            {isLoading ? '조회 중...' : '이메일 찾기'}
                        </button>
                    </div>
                    {email && <div className="email-result">조회된 이메일: {email}</div>}
                    {errorMessage && <div className="error-message">{errorMessage}</div>}
                </div>
            </div>
        </div>
    );
};

export default FindEmail;