import React, { useState, useEffect } from 'react';
import './MyQuestionDetail.css';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useNavigate, useLocation } from 'react-router-dom';
import HeaderBottom from '../../components/HeaderBottom';

const MyQuestionInfo = () => {
    const navigate=useNavigate();
    const location = useLocation();
    const { item } = location.state || {};

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
                    <div className="post-question-title-1">답변내용</div>
                    <div className="post-question-content-1"></div>
                </div>
            </div>
        </div>
    )
};

const MyQuestionDetail = () => {
    const navigate = useNavigate();

    const handleNavigation = (item) => {
        if (item === "내질문조회") {
            navigate('/myquestion');
            return;
        } else if (item === "자주묻는질문") {
            navigate('/service');
        }
    };

    return (
        <div className="app">
            <Header />
            <HeaderBottom text={["고객센터", "자주묻는질문", "내질문조회"]} onNavigate={handleNavigation} />
            <MyQuestionInfo/>
            <Footer />
        </div>
    );
};

export default MyQuestionDetail;