import React, { useState, useEffect } from 'react';
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
    const navigate = useNavigate();
    const [currentTime, setCurrentTime] = useState('');
    const [recipient, setRecipient] = useState('전체 ▼');
    const [alertType, setAlertType] = useState('공지 ▼');
    const [scheduledTime, setScheduledTime] = useState('');
    const [scheduleOption, setScheduleOption] = useState('즉시발송 ▼');
    const [alertContent, setAlertContent] = useState('');

    const getCurrentDatetimeLocal = () => {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}T${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    };

    useEffect(() => {
        const formattedTime = `${getCurrentDatetimeLocal().replace('T', ' ')}`;
        setCurrentTime(formattedTime);
        setScheduledTime(getCurrentDatetimeLocal());
    }, []);

    const handleScheduleOptionChange = (option) => {
        setScheduleOption(option);
        if (option === '즉시') {
            const now = new Date();
            const formattedTime = `${getCurrentDatetimeLocal().replace('T', ' ')}`;
            setCurrentTime(formattedTime);
            setScheduledTime(getCurrentDatetimeLocal());
        }
    };

    const sendAlertToServer = async (alertData) => {
        const token = localStorage.getItem('accessToken');
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_apiHome}alerts/send-alert`,
                alertData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            console.log('Alert sent and saved successfully:', response.data);
            return { success: true, message: response.data.message, alertId: response.data.alertId };
        } catch (error) {
            console.error('Error sending or saving alert:', error);
            let errorMessage = '알 수 없는 오류가 발생했습니다.';
            if (error.response) {
                errorMessage = error.response.data.message || '서버 오류가 발생했습니다.';
            } else if (error.request) {
                errorMessage = '서버에 연결할 수 없습니다.';
            }
            return { success: false, message: errorMessage };
        }
    };

    const handleSendAlert = async () => {
        if (
            !recipient ||
            !alertType ||
            (scheduleOption === '예약' && !scheduledTime) ||
            !alertContent.trim()
        ) {
            alert('모든 항목을 입력해 주세요.');
            return;
        }

        const alertData = {
            recipient: recipient.replace(' ▼', ''),
            alertType: alertType.replace(' ▼', ''),
            scheduledTime: scheduleOption === '즉시' ? new Date().toISOString() : scheduledTime,
            content: alertContent
        };

        const result = await sendAlertToServer(alertData);
        if (result.success) {
            alert(`알림이 성공적으로 발송되고 저장되었습니다. (알림 ID: ${result.alertId})`);
            navigate('/admin/sendAlert');
        } else {
            alert(`알림 발송 또는 저장 실패: ${result.message}`);
        }
    };

    return (
        <div className="MyPage-signup-wrap">
            <div className="applicant-info">
                <h3>알림 보내기</h3>
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
                <div className='post-question-line'>
                    <div className="alert-title">발송일시 선택</div>
                    <CustomDropdown
                        options={['즉시', '예약']}
                        selected={scheduleOption}
                        onSelect={handleScheduleOptionChange}
                        className="select-time"
                    />
                    {scheduleOption === '즉시' ? (
                        <div className="select-date-time">{currentTime}</div>
                    ) : (
                        <input
                            type="datetime-local"
                            className="select-date-time"
                            value={scheduledTime}
                            onChange={(e) => setScheduledTime(e.target.value)}
                        />
                    )}
                </div>
                <div className='post-question-line-1'>
                    <div className="post-question-title-1">알림 내용</div>
                    <textarea
                        className="post-question-content-1"
                        value={alertContent}
                        onChange={(e) => setAlertContent(e.target.value)}
                        placeholder='내용을 입력해주세요.'
                    ></textarea>
                </div>
            </div>
            <button className="signup-submit" onClick={handleSendAlert}>알림 보내기</button>
        </div>
    );
};

const SendAlertInfo = () => {
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
            <AdminAlert/>
            <Footer />
        </div>
    );
};

export default SendAlertInfo;
