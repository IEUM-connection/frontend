import React, { useState, useEffect } from 'react';
import './MyPage.css';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useNavigate } from 'react-router-dom';
import HeaderBottom from '../../components/HeaderBottom';
import { useAuth } from '../../auth/AuthContext';
import axios from 'axios'

const ShowInfo = () => {
    const navigate = useNavigate();
    const { accessToken } = useAuth();
    const [guardianId, setGuardianId] = useState();
    const [guardianInfo, setGuardianInfo] = useState(null);

    useEffect(() => {
        // API 호출로 guardian 정보 가져오기
        const fetchGuardianInfo = async () => {
            try {
                const response = await axios.get(
                    process.env.REACT_APP_apiHome + 'guardian/${guardianId}', {
                        headers: {
                            Authorization: `${accessToken}`
                        }
                });
                setGuardianInfo(response.data);  // 받아온 데이터를 상태에 저장
            } catch (error) {
                console.error('보호자 정보 가져오기 실패:', error);
            }
        };

        fetchGuardianInfo();
    }, [accessToken, guardianId]);

    if (!guardianInfo) {
        return <div>로딩 중...</div>;  // 데이터를 불러오는 동안 표시될 내용
    }

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
                </div>
            </div>

            <div className="applicant-info">
                <h3>신청자 정보</h3>
                <div className="signup-container">
                    <div className='signup-input-line'>
                        <div className="applicant-info-title">이름</div>
                        <div className="applicant-info-content">{guardianInfo.applicantName}</div>
                        <div className="applicant-info-title">생년월일</div>
                        <div className="applicant-info-content">{guardianInfo.applicantBirthDate}</div>
                    </div>
                    <div className='signup-input-line'>
                        <div className="applicant-info-title">이메일</div>
                        <div className="applicant-info-content">{guardianInfo.applicantEmail}</div>
                        <div className="applicant-info-title">가입일자</div>
                        <div className="applicant-info-content">{guardianInfo.registrationDate}</div>
                    </div>
                    <div className='signup-input-line'>
                        <div className="applicant-info-title">주소</div>
                        <div className="applicant-info-content">{guardianInfo.applicantAddress}</div>
                        <div className="applicant-info-title">상세주소</div>
                        <div className="applicant-info-content">{guardianInfo.applicantDetailedAddress}</div>
                    </div>
                    <div className='signup-input-line'>
                        <div className="applicant-info-title">휴대전화번호</div>
                        <div className="applicant-info-content">{guardianInfo.applicantPhone}</div>
                        <div className="applicant-info-title">일반전화번호</div>
                        <div className="applicant-info-content">{guardianInfo.applicantHomePhone || '없음'}</div>
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
            navigate('/history');
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