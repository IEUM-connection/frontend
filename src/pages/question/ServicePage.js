import React, { useState, useEffect } from 'react';
import './ServicePage.css';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useNavigate, useLocation } from 'react-router-dom';
import HeaderBottom from '../../components/HeaderBottom';
import FaqData from '../../faq_data/FaqData';

const HistoryInfo = ({ currentPage, itemsPerPage, searchTerm, onSearch }) => {
    const [faqData, setFaqData] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const reversedData = [...FaqData].reverse();
        const filteredData = reversedData.filter(item => 
            item.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
        const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);
        setFaqData(paginatedData);
    }, [currentPage, itemsPerPage, searchTerm]);

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            onSearch();
        }
    };

    return (
        <div className="memberHistory">
            <div className="search-container">
                <input
                    className="search-bar"
                    placeholder="검색"
                    defaultValue={searchTerm}
                    onKeyDown={handleKeyPress} 
                />
                <div className="search-button" onClick={onSearch}> 검색
                    <img src="/image/searchIcon.png" alt="메인로고" />
                </div>
            </div>
            <div className='order-question-container'>
                <div className="history-view-count">조회결과 {faqData.length} 건</div>
                <button className="order-question" onClick={() => navigate('/question/post')}>문의하기</button>
            </div>
            <div className="memberHistory-container">
                <div className="memberHistory-header">
                    <div className="service-header"> 번호 </div>
                    <div className="service-title1"> 제목 </div>
                    <div className="service-date"> 등록날짜 </div>
                </div>
                {faqData.length === 0 ? (
                    <div className="no-results">검색 결과가 없습니다.</div>
                ) : (
                    faqData.map((item) => (
                        <div className="memberHistory-content" key={item.number} onClick={() => navigate(`/fna-detail/${item.number}`, { state: { searchTerm } })}>
                            <div className="service-header"> {item.number} </div> 
                            <div className="service-title"> {item.title} </div>
                            <div className="service-date"> {item.date} </div>
                        </div>
                    ))
                )}
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

const ServicePage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const itemsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState(location.state?.searchTerm || '');
    const [filteredItemsCount, setFilteredItemsCount] = useState(FaqData.length);
    const totalPages = Math.ceil(filteredItemsCount / itemsPerPage);

    const handleNavigation = (item) => {
        if (item === "내질문조회") {
            navigate('/myquestion');
            return;
        } else if (item === "자주묻는질문") {
            navigate('/service');
        }
    };

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleSearch = () => {
        const searchInput = document.querySelector('.search-bar').value;
        setSearchTerm(searchInput);
        const filteredCount = FaqData.filter(item => item.title.toLowerCase().includes(searchInput.toLowerCase())).length;
        setFilteredItemsCount(filteredCount); 
        setCurrentPage(1);
        navigate('/service', { state: { searchTerm: searchInput } });
    };

    return (
        <div className="app">
            <Header />
            <HeaderBottom text={["고객센터", "자주묻는질문", "내질문조회"]} onNavigate={handleNavigation} />
            <HistoryInfo 
                currentPage={currentPage} 
                itemsPerPage={itemsPerPage} 
                searchTerm={searchTerm} 
                setSearchTerm={setSearchTerm}
                onSearch={handleSearch}
            />
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
            <Footer />
        </div>
    );
};

export default ServicePage;