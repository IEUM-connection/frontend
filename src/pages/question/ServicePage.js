import React, { useState, useEffect } from 'react';
import './ServicePage.css';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useNavigate } from 'react-router-dom';
import HeaderBottom from '../../components/HeaderBottom';
import axios from 'axios'

const HistoryInfo = ({ currentPage, itemsPerPage, totalItems }) => {
    // 더미데이터
    const historyData = Array.from({ length: totalItems }, (_, i) => ({
        number: i + 1,
        questionTitle: `자주묻는질문?! ${i + 1}`,
        date: `2024.10.${(i % 30) + 1}`,
        responseContent: `답변입니다`
    })).reverse();
    const navigate = useNavigate();
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = historyData.slice(startIndex, startIndex + itemsPerPage);

    const simpleday = (day) =>
        (
            // yyyy-mm-dd
            `${(new Date(day).getFullYear()).toString().padStart(4, '0')}-${(new Date(day).getMonth() + 1).toString().padStart(2, '0')}-${new Date(day).getDate().toString().padStart(2, '0')}`
        );
    

    return (
        <div className="memberHistory">
            <div className="search-container">
                <input className="search-bar" placeholder='검색'></input>
                <div className="search-button"> 검색
                    <img src="/image/searchIcon.png" alt="메인로고" />
                </div>
            </div>
            <div className='order-question-container'>
                <div className="history-view-count">조회결과 {totalItems} 건</div>
                <button className="order-question" onClick={() => navigate('/question/post')}>문의하기</button>
            </div>
            <div className="memberHistory-container">
                <div className="memberHistory-header">
                    <div className="service-header"> 번호 </div>
                    <div className="service-title1"> 제목 </div>
                    <div className="service-date"> 등록날짜 </div>
                </div>
                {paginatedData.map((item) => (
                    <div className="memberHistory-content" key={item.number} onClick={() => navigate('/fna-detail', { state: { item } })}>
                        <div className="service-header"> {item.number} </div> 
                        <div className="service-title"> {item.questionTitle} </div>
                        <div className="service-date"> {simpleday(item.date)} </div>
                    </div>
                ))}
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

const ServicePage = () => {
    const navigate = useNavigate();
    const itemsPerPage = 10;
    const totalItems = 11; // Example total items
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(totalItems / itemsPerPage);

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

    return (
        <div className="app">
            <Header />
            <HeaderBottom text={["고객센터", "자주묻는질문", "내질문조회"]} onNavigate={handleNavigation} />
            <HistoryInfo currentPage={currentPage} itemsPerPage={itemsPerPage} totalItems={totalItems} />
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
            <Footer />
        </div>
    );
};

export default ServicePage;