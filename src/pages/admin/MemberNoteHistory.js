import React, { useState } from 'react';
import './MemberNoteHistory.css';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useNavigate } from 'react-router-dom';
import HeaderBottom from '../../components/HeaderBottom';

const HistoryInfo = ({ currentPage, itemsPerPage, totalItems }) => {
    // 더미데이터
    const historyData = Array.from({ length: totalItems }, (_, i) => ({
        number: i + 1,
        name: `고세동`,
        history: `대상자 특이사항 변경`,
        date: `2024.10.${(i % 30) + 1}`,
    })).reverse();

    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = historyData.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div className="memberHistory">
            <div className="history-title">변경 이력 조회</div>
            <div className="history-view-count">조회결과 {totalItems} 건</div>
            <div className="memberHistory-container">
                <div className="memberHistory-header">
                    <div className="header-number"> 번호 </div>
                    <div className='header-type'> 이름 </div>
                    <div className="header-history"> 변경 내역 </div>
                    <div className="header-date"> 변경날짜 </div>
                </div>
                {paginatedData.map((item) => (
                    <div className="memberHistory-content" key={item.number}>
                        <div className="header-number"> {item.number} </div>
                        <div className="header-type"> {item.name} </div>
                        <div className="header-history"> {item.history} </div>
                        <div className="header-date"> {item.date} </div>
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

const MemberNoteHistory = () => {
    const navigate = useNavigate();
    const itemsPerPage = 10;
    const totalItems = 47; // Example total items
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(totalItems / itemsPerPage);

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
        } else if (item === "알림전송기록") {
            navigate('/admin/sendAlerts');
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
            <HeaderBottom text={["관리자페이지", "서비스승인", "알림보내기", "알림전송기록", "문의내역", "특이사항변경", "사용자관리"]} onNavigate={handleNavigation} />
            <HistoryInfo currentPage={currentPage} itemsPerPage={itemsPerPage} totalItems={totalItems} />
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
            <Footer />
        </div>
    );
};

export default MemberNoteHistory;