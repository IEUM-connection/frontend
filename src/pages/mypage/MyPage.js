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
    const { accessToken, userInfo } = useAuth();
    const [guardianInfo, setGuardianInfo] = useState(null);
    const [memberInfo, setMemberInfo] = useState(null);
    

    useEffect(() => {
        const fetchGuardianAndMemberInfo = async () => {
            try {
                const guardianResponse = await axios.get(
                    process.env.REACT_APP_apiHome + `guardians`, 
                    {   
                        headers: { Authorization: `Bearer ${accessToken}` },
                    }
                );
                const guardianData = guardianResponse.data.data;
                setGuardianInfo(guardianData);

                // 2. guardianId를 이용해 member 정보를 가져옴
                const guardianId = guardianData.guardianId;
                if (guardianId) {
                    const memberResponse = await axios.get(
                        `${process.env.REACT_APP_apiHome}members/guardian`, // guardianId로 멤버 검색
                        {
                            headers: { Authorization: `Bearer ${accessToken}` },
                        }
                    );
                    setMemberInfo(memberResponse.data.data); // member 정보 상태에 저장
                }
            } catch (error) {
                console.error('정보 가져오기 실패:', error);
            }
        };

        if (accessToken) {
            fetchGuardianAndMemberInfo(); // 토큰이 있을 때만 API 호출
        }
    }, [accessToken]);

    const loginType = localStorage.getItem('loginType');

    if (!guardianInfo) {
        if (!userInfo) {
            // 로그인하지 않은 상태에서 보일 메시지
            return <div className="admin-message">로그인 후 이용해주세요.</div>;
        } else if (loginType === 'ADMIN') {
            // 로그인한 상태에서 admin일 경우
            return <div className="admin-message">관리자 페이지를 이용해주세요.</div>;
        }
    }

    return (
        <div className="MyPage-signup-wrap">
            <div className="applicant-info">
                <h3>대상자 정보</h3>
                <div className="signup-container">
                    <div className='signup-input-line'>
                        <div className="applicant-info-title">이름</div>
                        <div className="applicant-info-content">{memberInfo?.name}</div>
                        <div className="applicant-info-title">사용자 번호</div>
                        <div className="applicant-info-content">{memberInfo?.memberCode}</div>
                    </div>
                    <div className='signup-input-line'>
                        <div className="applicant-info-title">주소</div>
                        <div className="applicant-info-content">{memberInfo?.address}</div>
                        <div className="applicant-info-title">상세주소</div>
                        <div className="applicant-info-content">{memberInfo?.detailedAddress}</div>
                    </div>
                    <div className='signup-input-line'>
                        <div className="applicant-info-title">휴대전화번호</div>
                        <div className="applicant-info-content">{memberInfo?.phone}</div>
                        <div className="applicant-info-title">일반전화번호</div>
                        <div className="applicant-info-content">{memberInfo?.tel || '없음'}</div>
                    </div>
                    <div className='signup-input-line'>
                        <div className="applicant-info-title">대상자 나이<br />(만 나이)</div>
                        <div className="applicant-info-content">{memberInfo?.age} 세</div>
                        <div className="applicant-info-title">신청자와의 관계</div>
                        <div className="applicant-info-content">{memberInfo?.relationship}</div>
                    </div>
                    <div className='signup-input-line'>
                        <div className="applicant-info-title">병력사항</div>
                        <div className="applicant-info-content">{memberInfo?.medicalHistory}</div>
                        <div className="applicant-info-title">비상연락처</div>
                        <div className="applicant-info-content">{memberInfo?.emergencyContact}</div>
                    </div>
                    <div className='signup-input-line'>
                        <div className="applicant-info-title-1">우유 가정 배달<br />서비스 신청 여부</div>
                        <div className="applicant-info-content-1">{memberInfo?.milkDeliveryRequest ? '신청' : '미신청'}</div>
                    </div>
                    <div className='signup-input-line'>
                        <div className="applicant-info-title-1">관계 증명 서류</div>
                        <div className="applicant-info-content-1">{memberInfo?.documentAttachment ? '첨부됨' : '없음'}</div>
                    </div>
                    <div className='signup-input-line-1'>
                        <div className="applicant-info-title-2">대상자 특이사항</div>
                        <div className="applicant-info-content-1">{memberInfo?.notes}</div>
                    </div>
                </div>
            </div>

            <div className="applicant-info">
                <h3>신청자 정보</h3>
                <div className="signup-container">
                    <div className='signup-input-line'>
                        <div className="applicant-info-title">이름</div>
                        <div className="applicant-info-content">{guardianInfo?.name}</div>
                        <div className="applicant-info-title">생년월일</div>
                        <div className="applicant-info-content">{guardianInfo?.birthDate}</div>
                    </div>
                    <div className='signup-input-line'>
                        <div className="applicant-info-title">이메일</div>
                        <div className="applicant-info-content">{guardianInfo?.email}</div>
                        <div className="applicant-info-title">가입일자</div>
                        <div className="applicant-info-content">{guardianInfo?.createdAt}</div>
                    </div>
                    <div className='signup-input-line'>
                        <div className="applicant-info-title">주소</div>
                        <div className="applicant-info-content">{guardianInfo?.address}</div>
                        <div className="applicant-info-title">상세주소</div>
                        <div className="applicant-info-content">{guardianInfo?.detailedAddress}</div>
                    </div>
                    <div className='signup-input-line'>
                        <div className="applicant-info-title">휴대전화번호</div>
                        <div className="applicant-info-content">{guardianInfo?.phone}</div>
                        <div className="applicant-info-title">일반전화번호</div>
                        <div className="applicant-info-content">{guardianInfo?.tel || '없음'}</div>
                    </div>
                </div>
            </div>
            <button className="signup-submit" onClick={() => navigate('/mypage/modify')}> 내 정보 수정</button>
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