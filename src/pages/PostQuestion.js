import React, { useState, useEffect } from 'react';
import './PostQuestion.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import HeaderBottom from '../components/HeaderBottom';

const PostQuestion = () => {
    const navigate=useNavigate();
    const [currentTime, setCurrentTime] = useState('');

    useEffect(() => {
        const now = new Date();
        const formattedTime = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        setCurrentTime(formattedTime);
    }, []);

    return (
        <div className="MyPage-signup-wrap">
            <div className="applicant-info">
                <h3>문의하기</h3>
                <div className="post-question-container">
                    <div className='signup-input-line'>
                        <div className="post-question-title">문의제목</div>
                        <input className="post-question-title-input" type="text"></input>
                    </div> 
                </div>
                <div className='post-question-line'>
                    <div className="post-question-title">문의시간</div>
                    <div className="post-question-content">{currentTime}</div>
                    <div className="post-question-title">문의상태</div>
                    <div className="post-question-content">-</div>
                </div>
                <div className='post-question-line-1'>
                    <div className="post-question-title-1">문의내용</div>
                    <textarea className="post-question-content-1"></textarea>
                </div>
            </div>
            <button className="signup-submit" onClick={() => navigate('/request/my')}>문의등록</button>
        </div>
    )
};

const PostQuestionPage = () => {
    const navigate = useNavigate();

    const handleNavigation = (item) => {
        if (item === "내질문조회") {
            navigate('/'); // 원하는 경로로 수정하세요
            return;
        } else if (item === "자주묻는질문") {
            navigate('/service');
        }
    };

    return (
        <div className="app">
            <Header />
            <HeaderBottom text={["고객센터", "자주묻는질문", "내질문조회"]} onNavigate={handleNavigation} />
            <PostQuestion/>
            <Footer />
        </div>
    );
};

export default PostQuestionPage;