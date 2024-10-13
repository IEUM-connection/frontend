import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useNavigate } from 'react-router-dom';
import HeaderBottom from '../../components/HeaderBottom';
import axios from 'axios';
import { useAuth } from '../../auth/AuthContext';

const ConfirmQuestion = ({ totalItems, paginatedData }) => {
    const navigate = useNavigate();
    // const startIndex = (currentPage - 1) * itemsPerPage;
    // const paginatedData = historyData.slice(startIndex, startIndex + itemsPerPage);

    // 답변대기중, 답변완료로 출력변경
    const getQuestionStatusText = (status) => {
        if (status === 'PENDING') {
            return '답변 대기중';
        } else if (status === 'ANSWERED') {
            return '답변 완료';
        } else {
            return status; // 다른 상태가 있는 경우 그대로 출력
        }
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

    return (
        <div className="memberHistory">
            <h3 className="history-title">문의 내역</h3>
            <div className="history-view-count">조회결과 {totalItems} 건</div>
            <div className="memberHistory-container">
                <div className="memberHistory-header">
                    <div className="header-number"> 번호 </div>
                    <div className="header-date"> 작성자 </div>
                    <div className="header-history"> 문의 제목 </div>
                    <div className="header-type"> 문의 날짜 </div>
                    <div className="header-date"> 답변 상태 </div>
                </div>
                {paginatedData.map((item) => (
                    <div className="memberHistory-content" 
                    key={item.questionId} 
                    onClick={() => navigate('/admin/question/info', { state: { item } })}
                    >   
                        <div className="header-number"> {item.questionId} </div>
                        <div className="header-date"> {item.name} </div>
                        <div className="header-history"> {item.questionTitle} </div>
                        <div className="header-date"> {formatDate(item.questionDate)} </div>
                        <div className="header-type"> {getQuestionStatusText(item.questionStatus)} </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const getPaginationRange = (currentPage, totalPages) => {
        const range = [];
        const start = Math.floor((currentPage - 1) / 5) * 5 + 1;
        const end = Math.min(start + 4, totalPages);
        for (let i = start; i <= end; i++) {
            range.push(i);
        }
        return range;
    };

    const paginationRange = getPaginationRange(currentPage, totalPages);

    return (
        <div className="pagination">
            <button 
                onClick={() => onPageChange(currentPage - 1)} 
                disabled={currentPage === 1}
            >
                &lt;
            </button>
            {paginationRange.map((page) => (
                <button 
                    key={page} 
                    onClick={() => onPageChange(page)} 
                    className={page === currentPage ? 'active' : ''}
                >
                    {page}
                </button>
            ))}
            <button 
                onClick={() => onPageChange(currentPage + 1)} 
                disabled={currentPage === totalPages}
            >
                &gt;
            </button>
        </div>
    );
};

const QuestionBoard = () => {
    const navigate = useNavigate();
    const { accessToken } = useAuth();
    const itemsPerPage = 10;
    const [totalItems, setTotalItems] = useState(0);
    const [paginatedData, setPaginatedData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await axios.get(process.env.REACT_APP_apiHome + 'questions', {
                    params: {
                        page: currentPage,
                        size: itemsPerPage,
                        sort: 'questionId_desc', // questionId로 기본 정렬
                    },
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
    
                let fetchedData = response.data.data;
    
                const pendingQuestions = fetchedData.filter(item => item.questionStatus === 'PENDING');
    
                setPaginatedData(pendingQuestions);
                setTotalItems(response.data.pageInfo.totalElements); // 전체 아이템 개수를 상태로 설정
            } catch (error) {
                console.error('질문 데이터를 가져오는데 실패했습니다:', error);
            }
        };
    
        fetchQuestions();
    }, [currentPage, accessToken]);

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

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <div className="app">
            <Header />
            <HeaderBottom text={["관리자페이지", "서비스승인", "알림보내기", "문의내역", "특이사항변경", "사용자관리"]} onNavigate={handleNavigation} />
            <ConfirmQuestion currentPage={currentPage} itemsPerPage={itemsPerPage} totalItems={totalItems} paginatedData={paginatedData} />
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
            <Footer />
        </div>
    );
};

export default QuestionBoard;