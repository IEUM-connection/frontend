import React, { useState, useEffect } from 'react';
import './ServiceRequestDetail.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useNavigate, useLocation } from 'react-router-dom';
import HeaderBottom from '../components/HeaderBottom';

const ShowInfo = ( { } ) => {
    const navigate=useNavigate();
    const [currentTime, setCurrentTime] = useState('');
    const location = useLocation();
    const { item } = location.state || {};

    useEffect(() => {
        const now = new Date();
        const formattedTime = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        setCurrentTime(formattedTime);
    }, []);


    return (
        <div className="MyPage-signup-wrap">
            <div className="applicant-info">
                <div className="search-container">
                    <h3>대상자 정보</h3>
                    <div className='request-number'>no.{item?.serviceId || ''}</div>
                </div>
                <div className="signup-container">
                    <div className='signup-input-line'>
                        <div className="applicant-info-title">이름</div>
                        <div className="applicant-info-content">고세동</div>
                        <div className="applicant-info-title">생년월일</div>
                        <div className="applicant-info-content">1949.12.31.</div>
                    </div>
                    <div className='signup-input-line'>
                        <div className="applicant-info-title">주소</div>
                        <div className="applicant-info-content">경기도 하남시 풍산로 1224번길 (129-125)</div>
                        <div className="applicant-info-title">상세주소</div>
                        <div className="applicant-info-content">태영아파트 204동 102호</div>
                    </div>
                    <div className='signup-input-line'>
                        <div className="applicant-info-title">휴대전화번호</div>
                        <div className="applicant-info-content">010-4444-4444</div>
                        <div className="applicant-info-title">일반전화번호</div>
                        <div className="applicant-info-content"></div>
                    </div>
                    <div className='signup-input-line'>
                        <div className="applicant-info-title">대상자 나이<br />(만 나이)</div>
                        <div className="applicant-info-content">74 세</div>
                        <div className="applicant-info-title">신청자와의 관계</div>
                        <div className="applicant-info-content">아버지</div>
                    </div>
                    <div className='signup-input-line'>
                        <div className="applicant-info-title">병력사항</div>
                        <div className="applicant-info-content">고혈압, 당뇨</div>
                        <div className="applicant-info-title">우유 가정 배달<br />서비스 신청 여부</div>
                        <div className="applicant-info-content">미신청</div>
                    </div>
                    <div className='signup-input-line'>
                        <div className="applicant-info-title-1">관계 증명 서류</div>
                        <div className="applicant-info-content-1"></div>
                    </div>
                    <div className='signup-input-line-1'>
                        <div className="applicant-info-title-2">대상자 특이사항</div>
                        <div className="applicant-info-content-1">식사를 잘 거르세요.</div>
                    </div>
                </div>
            </div>

            <div className="applicant-info">
                <h3>신청자 정보</h3>
                <div className="signup-container">
                    <div className='signup-input-line'>
                        <div className="applicant-info-title">이름</div>
                        <div className="applicant-info-content">윤영하</div>
                        <div className="applicant-info-title">생년월일</div>
                        <div className="applicant-info-content">1984.08.01.</div>
                    </div>
                    <div className='signup-input-line'>
                        <div className="applicant-info-title">이메일</div>
                        <div className="applicant-info-content">luckykor@gmail.com</div>
                        <div className="applicant-info-title">가입일자</div>
                        <div className="applicant-info-content">2024.08.01.</div>
                    </div>
                    <div className='signup-input-line'>
                        <div className="applicant-info-title">주소</div>
                        <div className="applicant-info-content">경기도 하남시 풍산로 1224번길 (129-125)</div>
                        <div className="applicant-info-title">상세주소</div>
                        <div className="applicant-info-content">태영아파트 204동 102호</div>
                    </div>
                    <div className='signup-input-line'>
                        <div className="applicant-info-title">휴대전화번호</div>
                        <div className="applicant-info-content">010-4444-4444</div>
                        <div className="applicant-info-title">일반전화번호</div>
                        <div className="applicant-info-content"></div>
                    </div>
                </div>
            </div>
            <button className="signup-submit">승인</button>
        </div>
    )
};

const ServiceRequestDetail = () => {
    const navigate = useNavigate();

    const handleNavigation = (item) => {
        if (item === "관리자페이지") {
            navigate('/admin');
            return;
        } else if (item === "서비스승인") {
            navigate('/admin');
            return;
        } else if (item === "알림보내기") {
            navigate('/admin/sendAlert');
            return;
        } else if (item === "문의내역") {
            navigate('/admin/question');
            return;
        } else if (item === "특이사항변경") {
            navigate('/admin/memberNote');
            return;
        } else if (item === "사용자관리") {
            navigate('/admin/member');
        }
    };

    return (
        <div className="app">
            <Header />
            <HeaderBottom text={["관리자페이지", "서비스승인", "알림보내기", "문의내역", "특이사항변경", "사용자관리"]} onNavigate={handleNavigation} />
            <ShowInfo/>
            <Footer />
        </div>
    );
};

export default ServiceRequestDetail;