import React, { useState } from 'react';
import './MemberManagement.css';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useNavigate } from 'react-router-dom';
import HeaderBottom from '../../components/HeaderBottom';
import MemberMap from '../../components/map/MemberMap';

const MemberManage = ({ currentPage, itemsPerPage, totalItems }) => {
    // 더미데이터
    const historyData = Array.from({ length: totalItems }, (_, i) => ({
        name: `고세동`,
        powerUsage: `3khw /`,
        phoneInactiveDuration: `20시간 /`,
    })).reverse();

    const navigate = useNavigate();
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = historyData.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div className="memberHistory">
            <div className="search-container">
                <input className="search-bar" placeholder='검색'></input>
                <div className="search-button"> 검색
                    <img src="/image/searchIcon.png" alt="메인로고" />
                </div>
            </div>
            <div className="history-view-count">조회결과 {totalItems} 건</div>
            <div className="memberHistory-container">
                <div className="memberHistory-header">
                    <div className="management-header-name"> 대상자 이름 </div>
                    <div className="management-header-power"> 1일 전력 사용량 </div>
                    <div className="management-header-time"> 휴대폰 미사용 시간</div>
                </div>
                {paginatedData.map((item) => (
                    <div className="memberHistory-content" key={item.number} onClick={() => navigate('/admin/memberInfo')}>
                        <div className="management-header-name"> {item.name} </div> 
                        <div className="management-header-power"> {item.powerUsage} <span style={{ fontSize: 'small', fontWeight: '500' }}>(마지막 체크 시간 24.09.12. 23:00)</span></div>
                        <div className="management-header-time"> {item.phoneInactiveDuration} <span style={{ fontSize: 'small', fontWeight: '500' }}>(마지막 체크 시간 24.09.12. 23:00)</span></div>
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

const MemberManagement = () => {
    const navigate = useNavigate();
    const itemsPerPage = 5;
    const totalItems = 11; // Example total items
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

    const historyData = Array.from({ length: totalItems }, (_, i) => ({
        name: `고세동`,
        powerUsage: `3kWh`,
        phoneInactiveDuration: `20시간`,
        checkTime: `(마지막 체크시간 24.10.01. 23:30:00)`,
        latlng: { lat: 37.499653752945 + i * 0.001, lng: 127.03053487955 + i * 0.001 }, // 임의의 위치 데이터
    })).reverse();

    return (
        <div className="app">
            <Header />
            <HeaderBottom text={["관리자페이지", "서비스승인", "알림보내기", "문의내역", "특이사항변경", "사용자관리"]} onNavigate={handleNavigation} />
            <MemberManage currentPage={currentPage} itemsPerPage={itemsPerPage} totalItems={totalItems} />
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
            <MemberMap markers={historyData}/>
            <Footer />
        </div>
    );
};

export default MemberManagement;