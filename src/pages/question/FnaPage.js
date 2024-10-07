import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useNavigate } from 'react-router-dom';
import HeaderBottom from '../../components/HeaderBottom';

const ShowInfo = () => {
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
                <h3>자주묻는질문</h3>
                <div className="post-question-container">
                    <div className='signup-input-line'>
                        <div className="post-question-title">문의제목</div>
                        <div className="post-question-title-input" type="text"></div>
                    </div> 
                </div>
                <div className='post-question-line-1'>
                    <div className="post-question-title-1">문의내용</div>
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
            <ShowInfo/>
            <Footer />
        </div>
    );
};

export default MyQuestionDetail;