import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useNavigate, useParams } from 'react-router-dom';
import HeaderBottom from '../../components/HeaderBottom';
import FaqData from '../../faq_data/FaqData';

const ShowInfo = () => {
    const { id } = useParams();
    const [faqDetail, setFaqDetail] = useState(null);

    useEffect(() => {
        const faqItem = FaqData.find(item => item.number === parseInt(id));
        if (faqItem) {
            setFaqDetail(faqItem);
        }
    }, [id]);
    
    if (!faqDetail) {
        return <div>로딩 중...</div>;
    }

    return (
        <div className="MyPage-signup-wrap">
            <div className="applicant-info">
                <h3>자주묻는질문</h3>
                <div className="post-question-container">
                    <div className='signup-input-line'>
                        <div className="post-question-title">문의제목</div>
                        <div className="post-question-title-input" type="text">{faqDetail.title}</div>
                    </div> 
                </div>
                <div className='post-question-line-1'>
                    <div className="post-question-title-1">문의내용</div>
                    <div className="post-question-content-1">
                        {faqDetail.content.split('\n').map((line, index) => (
                            <React.Fragment key={index}>
                                {line}
                                <br />
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
};

const MyQuestionDetail = () => {
    const navigate = useNavigate();

    const handleNavigation = (item) => {
        if (item === "내질문조회") {
            navigate('/');
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