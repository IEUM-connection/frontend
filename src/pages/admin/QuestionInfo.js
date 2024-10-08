import React, { useState, useEffect } from 'react';
// import './MyQuestionDetail.css';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useNavigate, useLocation } from 'react-router-dom';
import HeaderBottom from '../../components/HeaderBottom';

const QuestionDetailInfo = () => {
    const navigate=useNavigate();
    const location = useLocation();
    const { item } = location.state || {}; // 전달받은 데이터를 가져옵니다.
    const handleSendAlert = () => {
        alert('발송이 완료되었습니다.');
        navigate('/admin/question');
    };

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
                    <div className="post-question-content">{item?.questionDate || ''}</div>
                    <div className="post-question-title">문의상태</div>
                    <div className="post-question-content">{item?.status || '-'}</div>
                </div>
                <div className='post-question-line-1'>
                    <div className="post-question-title-1">문의내용</div>
                    <div className="post-question-content-1"> {item?.questionContent || ''} </div>
                </div>
                <div className='post-question-line-1'>
                    <div className="post-question-title-1">답변 내용</div>
                    <textarea className="post-question-content-1"></textarea>
                </div>
            </div>
            <button className="signup-submit" onClick={handleSendAlert}>답변 등록</button>
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