import React, { useState, useEffect } from 'react';
import './ServiceRequestDetail.css';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useNavigate, useLocation } from 'react-router-dom';
import HeaderBottom from '../../components/HeaderBottom';
import { useAuth } from '../../auth/AuthContext';
import axios from 'axios';

const ShowInfo = ( { } ) => {
    const navigate=useNavigate();
    const [currentTime, setCurrentTime] = useState('');
    const location = useLocation();
    const { item } = location.state || {};
    const { accessToken, userInfo } = useAuth(); // AuthContext에서 accessToken과 userInfo 가져오기
    const [guardianInfo, setGuardianInfo] = useState(null);
    const [memberInfo, setMemberInfo] = useState(null);
    const [status, setStatus] = useState('AWAITING_APPROVAL');

    useEffect(() => {
        const now = new Date();
        const formattedTime = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        setCurrentTime(formattedTime);
    }, []);


    const handleApprove = async () => {
        try {
            const response = await axios.patch(process.env.REACT_APP_apiHome + `members/${item.serviceId}/approve`, {}, {
            headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            alert('승인이 완료되었습니다.');
            navigate('/admin');
        } catch (error) {
            console.error('승인 실패:', error);
            alert('승인 중 오류가 발생했습니다.');
        }
    };

    useEffect(() => {
        const fetchGuardianInfo = async () => {
            try {
                const response = await axios.get(
                    process.env.REACT_APP_apiHome + `guardians`,
                    {   
                        headers: { Authorization: `Bearer ${accessToken}` },
                    }
                );
                setGuardianInfo(response.data.data);
            } catch (error) {
                console.error('보호자 정보 가져오기 실패:', error);
            }
        };
    
        const fetchMemberInfo = async () => {
            try {
                const response = await axios.get(process.env.REACT_APP_apiHome + `members/status/${status}`,
                    {
                        headers: { Authorization: `Bearer ${accessToken}` },
                    }
                );
                setMemberInfo(response.data.data);
            } catch (error) {
                console.error('member 정보 가져오기 실패:', error);
            }
        };
    
        if (accessToken) {
            fetchGuardianInfo();
            fetchMemberInfo();
        }
    }, [accessToken]);
    
    if (!memberInfo || !guardianInfo) {
        return <div>로딩 중...</div>;
    }

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
            <button className="signup-submit" onClick={handleApprove} >승인</button>
        </div>
    );
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
