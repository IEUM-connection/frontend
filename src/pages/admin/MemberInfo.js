import React from 'react';
import './MemberInfo.css';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useNavigate } from 'react-router-dom';
import HeaderBottom from '../../components/HeaderBottom';

const ShowInfo = () => {
    const navigate = useNavigate();
    return (
        <div className="MyPage-signup-wrap">
            <div className="applicant-info">
                <h3>대상자 정보</h3>
                <div className="signup-container">
                    <div className='signup-input-line'>
                        <div className="applicant-info-title">이름</div>
                        <div className="applicant-info-content"></div>
                        <div className="applicant-info-title">생년월일</div>
                        <div className="applicant-info-content"></div>
                    </div>
                    <div className='signup-input-line'>
                        <div className="applicant-info-title">주소</div>
                        <div className="applicant-info-content"></div>
                        <div className="applicant-info-title">상세주소</div>
                        <div className="applicant-info-content"></div>
                    </div>
                    <div className='signup-input-line'>
                        <div className="applicant-info-title">휴대전화번호</div>
                        <div className="applicant-info-content"></div>
                        <div className="applicant-info-title">일반전화번호</div>
                        <div className="applicant-info-content"></div>
                    </div>
                    <div className='signup-input-line'>
                        <div className="applicant-info-title">대상자 나이<br />(만 나이)</div>
                        <div className="applicant-info-content"> 세</div>
                        <div className="applicant-info-title">신청자와의 관계</div>
                        <div className="applicant-info-content"></div>
                    </div>
                    <div className='signup-input-line'>
                        <div className="applicant-info-title">병력사항</div>
                        <div className="applicant-info-content"></div>
                        <div className="applicant-info-title">우유 가정 배달<br />서비스 신청 여부</div>
                        <div className="applicant-info-content"></div>
                    </div>
                    <div className='signup-input-line'>
                        <div className="applicant-info-title-1">관계 증명 서류</div>
                        <div className="applicant-info-content-1"></div>
                    </div>
                    <div className='signup-input-line-1'>
                        <div className="applicant-info-title-2">대상자 특이사항</div>
                        <div className="applicant-info-content-1"></div>
                    </div>
                    <div className='signup-input-line'>
                        <div className="applicant-info-title">최근 1일 < br/>전력 사용량</div>
                        <div className="applicant-info-content">4khw<div style={{ fontSize: 'small', fontWeight: '500' }}>(마지막 체크 시간 24.09.12. 23:00)</div></div>
                        <div className="applicant-info-title">휴대폰<br />미사용 시간</div>
                        <div className="applicant-info-content">7시간 <div style={{ fontSize: 'small', fontWeight: '500' }}>(마지막 체크 시간 24.09.12. 23:00)</div></div>
                    </div>
                    <div className='signup-input-line-1'>
                    <div className="applicant-info-title-3">관리자 기록사항<div style={{ fontSize: '13px', fontWeight: '500' }}><br />*관리자만 볼 수 있습니다.</div></div>
                        <textarea className="applicant-info-content-3">전화를 잘 받지 않으십니다. 옥상 텃밭에 주로 계심</textarea>
                    </div>
                </div>
            </div>

            <div className="applicant-info">
                <h3>신청자 정보</h3>
                <div className="signup-container">
                    <div className='signup-input-line'>
                        <div className="applicant-info-title">이름</div>
                        <div className="applicant-info-content"></div>
                        <div className="applicant-info-title">생년월일</div>
                        <div className="applicant-info-content"></div>
                    </div>
                    <div className='signup-input-line'>
                        <div className="applicant-info-title">이메일</div>
                        <div className="applicant-info-content"></div>
                        <div className="applicant-info-title">가입일자</div>
                        <div className="applicant-info-content"></div>
                    </div>
                    <div className='signup-input-line'>
                        <div className="applicant-info-title">주소</div>
                        <div className="applicant-info-content"></div>
                        <div className="applicant-info-title">상세주소</div>
                        <div className="applicant-info-content"></div>
                    </div>
                    <div className='signup-input-line'>
                        <div className="applicant-info-title">휴대전화번호</div>
                        <div className="applicant-info-content"></div>
                        <div className="applicant-info-title">일반전화번호</div>
                        <div className="applicant-info-content"></div>
                    </div>
                </div>
            </div>
            <button className="signup-submit" onClick={() => navigate('/admin/member')}>정보 수정</button>
        </div>
    )
};

const MemberInfo = () => {
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
            <ShowInfo />
            <Footer />
        </div>
    );
};

export default MemberInfo;