import React, { useState, useEffect } from 'react';
import './MemberInfo.css';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useNavigate, useParams } from 'react-router-dom';
import HeaderBottom from '../../components/HeaderBottom';
import { useAuth } from '../../auth/AuthContext';
import axios from 'axios';

const ShowInfo = () => {
    const navigate = useNavigate();
    const { accessToken } = useAuth();
    const { memberId } = useParams();
    const [guardianInfo, setGuardianInfo] = useState(null);
    const [memberInfo, setMemberInfo] = useState(null);
    const [adminNote, setAdminNote] = useState(""); 

    const fetchMemberAndGuardianInfo = async () => {
        try {
            // 1. memberId로 멤버 정보 가져오기
            const memberResponse = await axios.get(
                `${process.env.REACT_APP_apiHome}members/${memberId}`, 
                {   
                    headers: { Authorization: `Bearer ${accessToken}` },
                }
            );
            const memberData = memberResponse.data.data;
            setMemberInfo(memberData);
            setAdminNote(memberData.adminNote);

            // 2. member의 guardianId로 가디언 정보 가져오기
            const guardianId = memberData.guardianId;
            if (guardianId) {
                const guardianResponse = await axios.get(
                    `${process.env.REACT_APP_apiHome}guardians/${guardianId}`, 
                    {
                        headers: { Authorization: `Bearer ${accessToken}` },
                    }
                );
                setGuardianInfo(guardianResponse.data.data);
            }
        } catch (error) {
            console.error('정보를 불러오는 중 오류 발생:', error);
        }
    };

    useEffect(() => {
        if (accessToken) {
            fetchMemberAndGuardianInfo(); 
        }
    }, [accessToken, memberId]); // 초기 렌더링 시 데이터 불러오기

    const handleUpdate = async () => {
        try {
                const patchData = {
                    adminNote: adminNote,
                };

                console.log('Patch Data:', patchData);

                const response = await axios.patch(
                    `${process.env.REACT_APP_apiHome}members/${memberId}`,
                    patchData, 
                {
                    headers: { Authorization: `Bearer ${accessToken}` },
                }
            );

            console.log('수정 완료:', response.data);
            alert('정보가 성공적으로 수정되었습니다.');
            fetchMemberAndGuardianInfo();
            // navigate('/admin/member');
        } catch (error) {
            console.error('정보 수정 중 오류 발생:', error);
            alert('정보 수정에 실패했습니다.');
        }
    };

    if (!memberInfo || !guardianInfo) {
        return <div>정보를 불러오는 중입니다...</div>; 
    }

    return (
    <div className="MyPage-signup-wrap">
        <div className="applicant-info">
            <h3>대상자 정보</h3>
            <div className="signup-container">
                <div className='signup-input-line'>
                    <div className="applicant-info-title">이름</div>
                    <div className="applicant-info-content">{memberInfo?.name}</div>
                    <div className="applicant-info-title">생년월일</div>
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
                    <div className="applicant-info-title">우유 가정 배달<br />서비스 신청 여부</div>
                    <div className="applicant-info-content">{memberInfo?.milkDeliveryRequest ? '신청' : '미신청'}</div>
                </div>
                <div className='signup-input-line'>
                    <div className="applicant-info-title-1">관계 증명 서류</div>
                    <div className="applicant-info-content-1">{memberInfo?.documentAttachment ? '첨부됨' : '없음'}</div>
                </div>
                <div className='signup-input-line-1'>
                    <div className="applicant-info-title-2">대상자 특이사항</div>
                    <div className="applicant-info-content-1">{memberInfo?.notes}</div>
                </div>
                <div className='signup-input-line'>
                    <div className="applicant-info-title">최근 1일 < br/>전력 사용량</div>
                    <div className="applicant-info-content">{memberInfo?.powerUsage}<div style={{ fontSize: 'small', fontWeight: '500' }}>(마지막 체크 시간 )</div></div>
                    <div className="applicant-info-title">휴대폰<br />미사용 시간</div>
                    <div className="applicant-info-content">{memberInfo?.phoneInactiveTimeMs}<div style={{ fontSize: 'small', fontWeight: '500' }}>(마지막 체크 시간 )</div></div>
                </div>
                <div className='signup-input-line-1'>
                <div className="applicant-info-title-3">관리자 기록사항<div style={{ fontSize: '13px', fontWeight: '500' }}><br />*관리자만 볼 수 있습니다.</div></div>
                    <textarea 
                        className="applicant-info-content-3" 
                        value={adminNote}
                        onChange={(e) => setAdminNote(e.target.value)}
                    />
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
        <button className="signup-submit" onClick={handleUpdate}>정보 수정</button>
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
        } else if (item === "알림전송기록") {
            navigate('/admin/sendAlerts');
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
            <HeaderBottom text={["관리자페이지", "서비스승인", "알림보내기", "알림전송기록", "문의내역", "특이사항변경", "사용자관리"]} onNavigate={handleNavigation} />
            <ShowInfo />
            <Footer />
        </div>
    );
};

export default MemberInfo;