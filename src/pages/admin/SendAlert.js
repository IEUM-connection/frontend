import React, { useState } from 'react';
import './SendAlert.css';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useNavigate } from 'react-router-dom';
import HeaderBottom from '../../components/HeaderBottom';
import axios from 'axios';

const CustomDropdown = ({ options, selected, onSelect, className }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleSelect = (option) => {
        onSelect(option);
        setIsOpen(false);
    };

    return (
        <div className={`custom-dropdown ${className}`}>
            <div
                className="custom-dropdown-selected"
                onClick={() => setIsOpen(!isOpen)}
            >
                {selected}
            </div>
            {isOpen && (
                <ul className="custom-dropdown-options">
                    {options.map((option, index) => (
                        <li
                            key={index}
                            className={`custom-option custom-option-${option.toLowerCase()}`}
                            onClick={() => handleSelect(option)}
                        >
                            {option}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

const AdminAlert = () => {
    const [recipient, setRecipient] = useState('전체 ▼');
    const [alertType, setAlertType] = useState('공지 ▼');
    const [alertContent, setAlertContent] = useState('');

    const handleSendSms = async () => {

        const currentAlertType = alertType === '공지 ▼' ? '공지' : alertType;

        let smsRequest = {
            body: `[${currentAlertType}]\n ${alertContent}`,
            isMember: true, // 기본값
        };

        if (recipient === '보호자') {
            smsRequest.isMember = false;
        } else if (recipient === '대상자') {
            smsRequest.isMember = true;
        } else if (recipient === '전체' || recipient === '전체 ▼') {
            smsRequest.isMember = true;
        } else {
            // 예기치 않은 recipient 값 처리
            smsRequest.isMember = false;
        }

        try {
            const response = await axios.post(`${process.env.REACT_APP_apiHome}send-allsms`, smsRequest);
            if (response.status >= 200 && response.status < 300) {
                console.log("SMS 전송 성공:", response.data);
                alert("SMS 전송에 성공했습니다.");
            } else {
                console.error(`SMS 전송 실패: ${response.statusText}`);
                alert("SMS 전송에 실패했습니다.");
            }
        } catch (error) {
            console.error("오류 발생:", error);
            alert("SMS 전송을 하는데 오류가 발생했습니다.\n잠시 후 다시 시도해주세요.");
        }
    };

    return (
        <div className="MyPage-signup-wrap">
            <div className="applicant-info">
                <h3>문자 보내기</h3>
                <div className="post-question-container">
                    <div className='signup-input-line'>
                        <div className="alert-title">수신인</div>
                        <CustomDropdown
                            options={['전체', '보호자', '대상자']}
                            selected={recipient}
                            onSelect={setRecipient}
                            className="recipient-dropdown"
                        />
                        <div className="alert-title">알림 유형</div>
                        <CustomDropdown
                            options={['정기', '일반', '공지', '긴급']}
                            selected={alertType}
                            onSelect={setAlertType}
                            className="alert-type-dropdown"
                        />
                    </div>
                </div>
                <div className='post-question-line-1'>
                    <div className="post-question-title-1">메시지 내용</div>
                    <textarea
                        className="post-question-content-1"
                        value={alertContent}
                        onChange={(e) => setAlertContent(e.target.value)}
                        placeholder='내용을 입력해주세요.'
                    ></textarea>
                </div>
            </div>
            <button className="signup-submit" onClick={handleSendSms}>문자 보내기</button>
        </div>
    );
};

const SendAlert = () => {
    const navigate = useNavigate();

    const handleNavigation = (item) => {
        if (item === "관리자페이지") {
            navigate('/admin');
        } else if (item === "서비스승인") {
            navigate('/admin');
        } else if (item === "알림보내기") {
            navigate('/admin/sendAlert');
        } else if (item === "알림전송기록") {
            navigate('/admin/sendAlerts');
            return;
        } else if (item === "문의내역") {
            navigate('/admin/question');
        } else if (item === "특이사항변경") {
            navigate('/admin/memberNote');
        } else if (item === "사용자관리") {
            navigate('/admin/member');
        }
    };

    return (
        <div className="app">
            <Header />
            <HeaderBottom text={["관리자페이지", "서비스승인", "알림보내기", "알림전송기록", "문의내역", "특이사항변경", "사용자관리"]} onNavigate={handleNavigation} />
            <AdminAlert />
            <Footer />
        </div>
    );
};

export default SendAlert;
