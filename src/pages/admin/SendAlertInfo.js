import React, { useState, useEffect } from 'react';
import './SendAlert.css';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useNavigate, useParams } from 'react-router-dom';
import HeaderBottom from '../../components/HeaderBottom';
import axios from 'axios';


const AdminAlert = () => {
    const navigate = useNavigate();
    const { alertId } = useParams(); // useParams로 경로에서 alertId 추출
    const [alertData, setAlertData] = useState(null); // 데이터를 저장할 상태
    const [loading, setLoading] = useState(true); // 로딩 상태 추가

    const getCurrentDatetimeLocal = () => {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}T${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    };

    useEffect(() => {
        const fetchAlertData = async () => {
            const token = localStorage.getItem('accessToken');
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_apiHome}alerts/${alertId}`, // alertId 사용
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );
                setAlertData(response.data); // 데이터 저장
            } catch (error) {
                console.error('Error fetching alert data:', error);
            } finally {
                setLoading(false); // 로딩 종료
            }
        };

        fetchAlertData();
    }, [alertId]);

    if (loading) {
        return <div>Loading...</div>; // 로딩 상태 처리
    }

    if (!alertData) {
        return <div>데이터가 없습니다</div>; // 데이터가 없을 때 처리
    }

    return (
        <div className="MyPage-signup-wrap">
            <div className="applicant-info">
                <div className="alert-info-title">알림 상세 정보</div>
                <div className="alert-id">알림 번호: no. {alertData.alertId}</div>
                <div className="post-question-container">
                    <div className='signup-input-line'>
                        <div className="alert-title">수신인</div>
                        <div className="alert-detail-info">{alertData.recipient}</div>
                        <div className="alert-title">알림 유형</div>
                        <div className="alert-detail-info">{alertData.alertType}</div>
                    </div>
                </div>
                <div className='post-question-line'>
                    <div className="alert-title">발송일시</div>
                    <div className="alert-detail-info">{new Date(alertData.createdAt).toLocaleString()}</div>
                    <div className="alert-title">알림 상태</div>
                    <div className="alert-detail-info">{alertData.status}</div>
                </div>
                <div className='post-question-line-1'>
                    <div className="post-question-title-1">알림 내용</div>
                    <div className="alert-message">{alertData.message}</div>
                </div>
            </div>
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
