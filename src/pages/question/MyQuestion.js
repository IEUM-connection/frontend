import React, { useState , useEffect} from 'react';
import './MyQuestion.css';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useNavigate } from 'react-router-dom';
import HeaderBottom from '../../components/HeaderBottom';
import axios from 'axios'

const MyQuestionInfo = ({ currentPage, totalItems, paginatedData }) => {
    const simpleday = (day) => (
         `${(new Date(day).getFullYear()).toString().padStart(4, '0')}-${(new Date(day).getMonth() + 1).toString().padStart(2, '0')}-${new Date(day).getDate().toString().padStart(2, '0')}`
    );

    const navigate = useNavigate();

    return (
        <div className="memberHistory">
            <div className="history-title">내 질문 조회</div>
            <div className="history-view-count">조회결과 {totalItems} 건</div>
            <div className="memberHistory-container">
                <div className="memberHistory-header">
                    <div className="header-number"> 번호 </div>
                    <div className="header-history"> 문의 제목 </div>
                    <div className="header-type"> 문의 상태 </div>
                    <div className="header-date"> 문의 날짜 </div>
                </div>
                {paginatedData.length > 0 ? paginatedData.map((item, index) => (
                    <div className="memberHistory-content" 
                        key={item.questionId} 
                        onClick={() => navigate('/myquestion/detail', { state: { item } })}
                    >
                        <div className="header-number"> {item.questionId} </div>
                        <div className="header-history"> {item.questionTitle} </div>
                        <div className="header-type"> {item.questionStatus === "PENDING" ? "답변대기중" : "답변완료"} </div>
                        <div className="header-date"> {simpleday(item.questionDate)} </div>
                    </div>
                )) : <></>}
            </div>
        </div>
    )
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

const MyQuestion = () => {
    const navigate = useNavigate();

    const [paginatedData, setPaginatedData] = useState({});
    const [totalPage, setTotalPage] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

    const searchPosts = async () => {
        try {
            const accessToken = localStorage.getItem('accessToken'); 
            const response = await axios.get(process.env.REACT_APP_apiHome + 'questions', { 
                params: {
                    page: currentPage,
                    size: 10,
                    sort: 'questionId_desc'
                },
                headers: { Authorization: `Bearer ${accessToken}` }
            });

            if (response !== undefined) {
                setTotalPage(response.data.pageInfo.totalPages);
                setPaginatedData(response.data.data);
                setTotalItems(response.data.pageInfo.totalElements);
                console.log(response);
            }
        } catch (error) {
            alert("내 질문을 조회하는 중 오류가 발생했습니다. 다시 시도해주세요.");
        }
    };

    useEffect(() => {
        searchPosts();
    }, [currentPage]);

    const handleNavigation = (item) => {
        if (item === "내질문조회") {
            navigate('/myquestion');
            return;
        } else if (item === "자주묻는질문") {
            navigate('/service');
        }
    };

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPage) {
            setCurrentPage(page);
        }
    };

    return (
        <div className="app">
            <Header />
            <HeaderBottom text={["고객센터", "자주묻는질문", "내질문조회"]} onNavigate={handleNavigation} />
            <MyQuestionInfo currentPage={currentPage} totalItems={totalItems} paginatedData={paginatedData} />
            <Pagination curruntpage={currentPage} totalpage={totalPage} onPageChange={handlePageChange} />
            <Footer />
        </div>
    );
};

export default MyQuestion;