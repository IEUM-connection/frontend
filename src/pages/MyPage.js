import React from 'react';
import './MyPage.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import HeaderBottom from '../components/HeaderBottom';

const ShowInfo = () => {
    const navigate = useNavigate();
    return (
        <div className="MyPage-signup-wrap">
            <div className="applicant-info">
                <h3>대상자 정보</h3>
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
            <button className="signup-submit" onClick={() => navigate('/request')}>정보 수정</button>
        </div>
    )
};

const MyPage = () => {
    const navigate = useNavigate();

    const handleNavigation = (item) => {
        if (item === "변경이력조회") {
            navigate('/history'); // 원하는 경로로 수정하세요
        }
    };
    return (
        <div className="app">
            <Header />
            <HeaderBottom text={["마이페이지", "변경이력조회"]} onNavigate={handleNavigation} />
            <ShowInfo />
            <Footer />
        </div>
    );
};

export default MyPage;