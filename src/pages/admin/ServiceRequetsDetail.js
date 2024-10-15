import React, { useState, useEffect } from 'react';
import './ServiceRequestDetail.css';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useNavigate, useParams } from 'react-router-dom'; // useParams 추가
import HeaderBottom from '../../components/HeaderBottom';
import { useAuth } from '../../auth/AuthContext';
import axios from 'axios';

const ShowInfo = () => {
    const navigate = useNavigate();
    const { memberId } = useParams(); // useParams로 URL에서 memberId 추출
    const { accessToken } = useAuth(); // 인증 토큰 가져오기
    const [guardianInfo, setGuardianInfo] = useState(null);
    const [memberInfo, setMemberInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    console.log(`Extracted memberId: ${memberId}`);
   
    useEffect(() => {
        const fetchMemberInfo = async () => {
            if (!accessToken || !memberId) {
                setLoading(false);
                return;
            }
            try {
                const response = await axios.get(
                     `${process.env.REACT_APP_apiHome}members/${memberId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );
                console.log('API Response:', response.data);
                setMemberInfo(response.data.data);
                
                 // 멤버 정보에서 guardianId 추출 후 가디언 정보 가져오기
                 const guardianId = response.data.data.guardianId;
                 if (guardianId) {
                     const guardianResponse = await axios.get(
                         `${process.env.REACT_APP_apiHome}guardians/${guardianId}`,
                         {
                             headers: {
                                 Authorization: `Bearer ${accessToken}`,
                             },
                         }
                     );
                     console.log('Guardian API Response:', guardianResponse.data);
                     setGuardianInfo(guardianResponse.data.data);
                 }
 
                 setLoading(false);
             } catch (err) {
                 console.error('Error fetching member or guardian info:', err);
                 setError(err);
                 setLoading(false);
             }
         };
 
         fetchMemberInfo();
     }, [accessToken, memberId]);

    const handleApprove = async () => {
        try {
            const response = await axios.patch(
                `${process.env.REACT_APP_apiHome}members/${memberId}/approve`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            console.log('승인 성공:', response.data);
            alert('승인이 완료되었습니다.'); // 성공 시 alert
            await sendSms();
            navigate('/admin'); // 승인 후 관리자 페이지로 이동
        } catch (error) {
            console.error('승인 실패:', error);
            alert('승인에 실패했습니다.'); // 실패 시 alert
            setError(error);
        }
    };
    
    const sendSms = async () => {
        if(!guardianInfo) {
            console.error("guardianInfo가 로드되지 않았습니다.");
            return;
        }

        console.log("guardianInfo", guardianInfo);

            const smsRequest ={
                body : `${guardianInfo.name}님, 안녕하세요.\n신청하신 서비스가 성공적으로 승인되었습니다.\n\n사용자 인증 번호는${memberInfo.memberCode}입니다.\n\n앞으로 이음은 홀로 있는 피보호자의 곁에서 온기를 나누고 지키겠습니다.\n서비스 관련 문의 사항이 있어거나 도움이 필요하시면 언제든지 연락해 주세요. \n항상 최선을 다해 도와드리겠습니다. \n감사합니다.\n-이음-`,
                from : "01087683806",
                gudianNum : guardianInfo.phone
            }

            const smsData = JSON.stringify(smsRequest);
            console.log("sms 전송 데이터", smsData);
    

        try{
            const response = await axios.post(`${process.env.REACT_APP_apiHome}send-sms`, 
                smsRequest,
                {
                // headers: {
                //     Authorization: `Bearer ${accessToken}`
                // },
             
        }
    );

        if (response.status >= 200 && response.status < 300) { // 응답이 성공적인지 확인
            const responseBody = await response.json();
            console.log("SMS 전송 성공:", responseBody); // 성공 로그 출력
        } else { // 응답이 실패한 경우
            const errorBody = await response.text(); // 에러 본문 가져오기
            console.error(`SMS 전송 실패: ${response.statusText}, 응답 코드: ${response.status}, 에러 내용: ${errorBody}`); // 실패 로그 출력
        }
    } catch (error) {
        console.error("오류 발생:", error);
       }
    }
        
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div className="MyPage-signup-wrap">
            <div className="applicant-info">
                <div className="search-container">
                    <h3>대상자 정보</h3>
                    <div className='request-number'>no.{memberInfo.memberId}</div>
                </div>
                <div className="signup-container">
                    <div className='signup-input-line'>
                        <div className="applicant-info-title">이름</div>
                        <div className="applicant-info-content">{memberInfo.name}</div>
                        <div className="applicant-info-title">사용자 코드</div>
                        <div className="applicant-info-content">{memberInfo.memberCode}</div>
                    </div>
                    <div className='signup-input-line'>
                        <div className="applicant-info-title">주소</div>
                        <div className="applicant-info-content">{memberInfo.address}</div>
                        <div className="applicant-info-title">상세주소</div>
                        <div className="applicant-info-content">{memberInfo.detailedAddress}</div>
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
                        <div className="applicant-info-content">{guardianInfo.phone}</div>
                        <div className="applicant-info-title">일반전화번호</div>
                        <div className="applicant-info-content">{guardianInfo?.tel || '없음'}</div>
                    </div>
                </div>
            </div>
            <button className="signup-submit" onClick={handleApprove}>승인</button>
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

export default ServiceRequestDetail;
