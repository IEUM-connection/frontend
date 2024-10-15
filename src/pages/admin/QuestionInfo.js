import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useNavigate, useLocation } from 'react-router-dom';
import HeaderBottom from '../../components/HeaderBottom';
import { useAuth } from '../../auth/AuthContext';
import axios from 'axios'; 

const QuestionDetailInfo = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { item } = location.state || {};
    const [responseContent, setResponseContent] = useState('');
    const { accessToken } = useAuth();
    const questionId = item?.questionId; 
    const [guardianPhone, setGuardianPhone] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        console.log('item:', item);
        console.log('questionId:', questionId);
        if (item?.responseContent) {
            setResponseContent(item.responseContent);
        }

        // guardianPhone 패칭
        const fetchGuardianPhone = async () => {
            if (!questionId) {
                console.error("질문 ID가 유효하지 않습니다.");
                setLoading(false);
                return;
            }

            try {
                // 질문 상세 정보 API 호출
                const response = await axios.get(`${process.env.REACT_APP_apiHome}questions/${questionId}`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    },
                });

                const data = response.data.data;
                setGuardianPhone(data.guardianPhone);
                console.log("Fetched guardianPhone:", data.guardianPhone);
                setLoading(false);
            } catch (error) {
                console.error("guardianPhone 패칭 오류:", error);
                setError(error);
                setLoading(false);
            }
        };

        fetchGuardianPhone();
    }, [item, questionId, accessToken]);

    const handleAnswerChange = (e) => {
        setResponseContent(e.target.value);
    };
  
    const handleSendAnswer = async () => {
        if (!responseContent.trim()) {
            alert('답변 내용을 입력해주세요.');
            return;
        }

        if (!questionId) {
            alert('질문 ID가 유효하지 않습니다.');
            return;
        }

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_apiHome}answers`,
                { 
                    questionId: questionId,
                    responseContent: responseContent
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            handleSendAlert();
            setResponseContent('');
            // 성공 후 필요한 처리 (예: 페이지 새로고침 또는 리다이렉트)
        } catch (error) {
            console.error('답변 등록 실패:', error);
            alert(`답변 등록에 실패했습니다. 에러: ${error.response?.status}`);
        }
    };
    
    const handleSendAlert = async () => {
        alert('답변이 완료되었습니다.');
        sendSms();
        navigate('/admin/question');
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // 월을 2자리로 맞춤
        const day = String(date.getDate()).padStart(2, '0'); // 일을 2자리로 맞춤
        const hours = String(date.getHours()).padStart(2, '0'); // 시를 2자리로 맞춤
        const minutes = String(date.getMinutes()).padStart(2, '0'); // 분을 2자리로 맞춤
        const seconds = String(date.getSeconds()).padStart(2, '0'); // 초를 2자리로 맞춤
        const formattedDate = `${year}-${month}-${day}`;
        const formattedTime = `${hours}:${minutes}:${seconds}`;
        
        return `${formattedDate} ${formattedTime}`;
    };

    const getQuestionStatusText = (status) => {
        if (status === 'PENDING') {
            return '답변 대기중';
        } else if (status === 'ANSWERED') {
            return '답변 완료';
        } else {
            return status; // 다른 상태가 있는 경우 그대로 출력
        }
    };

    const sendSms = async () => {
        if (!guardianPhone) {
            console.error("guardianPhone이 유효하지 않습니다.");
            return;
        }

        const smsRequest = {
            body: `${item.name}님, 안녕하세요.\n문의하신 내용에 대한 답변이 완료되었습니다.\n보다 자세한 내용을 확인하시려면 저희 사이트를 방문해주시기 바랍니다.\n항상 저희 서비스를 이용해 주셔서 감사드리며, 추가 문의 사항이 있으시면 언제든지 말씀해 주세요.\n감사합니다.\n-이음-`,
            from: "01087683806",
            gudianNum: guardianPhone 
        };

        const smsData = JSON.stringify(smsRequest);
        console.log("sms 전송 데이터", smsData);

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_apiHome}send-sms`,
                smsRequest,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    },
                }
            );

            if (response.status >= 200 && response.status < 300) { // 응답이 성공적인지 확인
                console.log("SMS 전송 성공:", response.data); // 성공 로그 출력
            } else { // 응답이 실패한 경우
                console.error(`SMS 전송 실패: ${response.statusText}, 응답 코드: ${response.status}, 에러 내용: ${response.data}`); // 실패 로그 출력
            }
        } catch (error) {
            console.error("SMS 전송 중 오류 발생:", error);
        }
    }

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div className="MyPage-signup-wrap">
            <div className="applicant-info">
                <h3>문의하기</h3>
                <div className="post-question-container">
                <div className='signup-input-line'>
                    <div className="post-question-title">문의제목</div>
                    <div className="post-question-title-content">
                            {item?.questionTitle || ''}
                        </div>
                    </div> 
                </div>
                <div className='post-question-line'>
                    <div className="post-question-title">작성자</div>
                    <div className="post-question-content">{item?.name || ''}</div>
                </div>
                <div className='post-question-line'>
                    <div className="post-question-title">문의시간</div>
                    <div className="post-question-content">{formatDate(item?.questionDate || '')}</div>
                    <div className="post-question-title">문의상태</div>
                    <div className="post-question-content">{getQuestionStatusText(item.questionStatus)}</div>
                </div>
                <div className='post-question-line-1'>
                    <div className="post-question-title-1">문의내용</div>
                    <div className="post-question-content-1"> {item?.questionContent || ''} </div>
                </div>
                <div className='post-question-line-1'>
                    <div className="post-question-title-1">답변 내용</div>
                    <textarea
                            className="post-question-content-1"
                            value={responseContent}
                            onChange={handleAnswerChange}
                            placeholder="답변을 입력하세요"
                        />
                </div>
            </div>
            <button className="signup-submit" onClick={handleSendAnswer}>답변 등록</button>
        </div>
    )
};



const QuestionInfo = () => {
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
            <QuestionDetailInfo/>
            <Footer />
        </div>
    );
};

export default QuestionInfo;
