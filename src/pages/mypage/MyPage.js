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
    const { accessToken, userInfo } = useAuth(); // AuthContext에서 accessToken과 userInfo 가져오기
    const [guardianInfo, setGuardianInfo] = useState(null);
    const [memberInfo, setMemberInfo] = useState(null);

    useEffect(() => {
        const fetchGuardianInfo = async () => {
            try {
                const response = await axios.get(
                    process.env.REACT_APP_apiHome + `guardians`, // userInfo에서 guardianId를 사용
                    {   
                        headers: { Authorization: `Bearer ${accessToken}` },
                    }
                );
                setGuardianInfo(response.data.data); // 보호자 정보 상태에 저장
            } catch (error) {
                console.error('보호자 정보 가져오기 실패:', error);
            }
        };

        if (accessToken) {
            fetchGuardianInfo(); // 토큰이 있을 때만 API 호출
        }
    }, [accessToken]);

    useEffect(() => {
        const fetchMemberInfo = async () => {
            try {
                const response = await axios.get(
                    process.env.REACT_APP_apiHome + `members`,
                    {
                        headers: { Authorization: `Bearer ${accessToken}` },
                    }
                );
                setMemberInfo(response.data.data); // member 정보 상태에 저장
            } catch (error) {
                console.error('member 정보 가져오기 실패:', error);
            }
        };
        console.log(fetchMemberInfo);
        if (accessToken) {
            fetchMemberInfo(); // 토큰이 있을 때만 API 호출
        }
    }, [accessToken]);

    if (!guardianInfo || !memberInfo) {
        return <div>로딩 중...</div>; // 정보 로딩 중일 때 표시
    }

    return (
        <div className="MyPage-signup-wrap">
            <div className="applicant-info">
                <h3>대상자 정보</h3>
                <div className="signup-container">
                    <div className='signup-input-line'>
                        <div className="applicant-info-title">이름</div>
                        <div className="applicant-info-content">{memberInfo.name}</div>
                        <div className="applicant-info-title">생년월일</div>
                        <div className="applicant-info-content">{memberInfo.birthDate}</div>
                    </div>
                    <div className='signup-input-line'>
                        <div className="applicant-info-title">주소</div>
                        <div className="applicant-info-content">{memberInfo.address}</div>
                        <div className="applicant-info-title">상세주소</div>
                        <div className="applicant-info-content">{memberInfo.detailAddress}</div>
                    </div>
                    <div className='signup-input-line'>
                        <div className="applicant-info-title">휴대전화번호</div>
                        <div className="applicant-info-content">{memberInfo.phone}</div>
                        <div className="applicant-info-title">일반전화번호</div>
                        <div className="applicant-info-content">{memberInfo.tel || '없음'}</div>
                    </div>
                    <div className='signup-input-line'>
                        <div className="applicant-info-title">대상자 나이<br />(만 나이)</div>
                        <div className="applicant-info-content">{memberInfo.age} 세</div>
                        <div className="applicant-info-title">신청자와의 관계</div>
                        <div className="applicant-info-content">{memberInfo.relationship}</div>
                    </div>
                    <div className='signup-input-line'>
                        <div className="applicant-info-title">병력사항</div>
                        <div className="applicant-info-content">{memberInfo.medicalHistory}</div>
                        <div className="applicant-info-title">우유 가정 배달<br />서비스 신청 여부</div>
                        <div className="applicant-info-content">{memberInfo.milkDeliveryRequest ? '신청' : '미신청'}</div>
                    </div>
                    <div className='signup-input-line'>
                        <div className="applicant-info-title-1">관계 증명 서류</div>
                        <div className="applicant-info-content-1">{memberInfo.documentAttachment ? '첨부됨' : '없음'}</div>
                    </div>
                    <div className='signup-input-line-1'>
                        <div className="applicant-info-title-2">대상자 특이사항</div>
                        <div className="applicant-info-content-1">{memberInfo.notes}</div>
                    </div>
                </div>
            </div>

            <div className="applicant-info">
                <h3>신청자 정보</h3>
                <div className="signup-container">
                    <div className='signup-input-line'>
                        <div className="applicant-info-title">이름</div>
                        <div className="applicant-info-content">{guardianInfo.name}</div>
                        <div className="applicant-info-title">생년월일</div>
                        <div className="applicant-info-content">{guardianInfo.birthDate}</div>
                    </div>
                    <div className='signup-input-line'>
                        <div className="applicant-info-title">이메일</div>
                        <div className="applicant-info-content">{guardianInfo.email}</div>
                        <div className="applicant-info-title">가입일자</div>
                        <div className="applicant-info-content">{guardianInfo.createdAt}</div>
                    </div>
                    <div className='signup-input-line'>
                        <div className="applicant-info-title">주소</div>
                        <div className="applicant-info-content">{guardianInfo.address}</div>
                        <div className="applicant-info-title">상세주소</div>
                        <div className="applicant-info-content">{guardianInfo.detailedAddress}</div>
                    </div>
                    <div className='signup-input-line'>
                        <div className="applicant-info-title">휴대전화번호</div>
                        <div className="applicant-info-content">{guardianInfo.phone}</div>
                        <div className="applicant-info-title">일반전화번호</div>
                        <div className="applicant-info-content">{guardianInfo.tel || '없음'}</div>
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