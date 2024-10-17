import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useNavigate } from 'react-router-dom';
import HeaderBottom from '../../components/HeaderBottom';
import axios from 'axios';

const HistoryInfo = ({ currentPage, itemsPerPage, totalItems, historyData }) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const sortedData = historyData.sort((a, b) => b.alertId - a.alertId);
    const paginatedData = sortedData.slice(startIndex, startIndex + itemsPerPage);
    const navigate = useNavigate();

    return (
        <div className="memberHistory">
            <div className="history-title">알림 전송 내역</div>
            <div className="history-view-count">조회결과 {totalItems} 건</div>
            <div className="memberHistory-container">
                <div className="memberHistory-header">
                    <div className="header-number"> 번호 </div>
                    <div className='header-type'> 유형 </div>
                    <div className="header-history"> 대상 </div>
                    <div className="header-date"> 전송일자 </div>
                </div>
                {paginatedData.map((item, index) => (
                    <div className="memberHistory-content" key={item.alertId} 
                         onClick={() => navigate(`/admin/${item.alertId}`, { state: { item } })}>
                        <div className="header-number">  {totalItems - startIndex - index} </div> {/* 역순 번호 */}
                        <div className="header-type"> {item.alertType} </div>
                        <div className="header-history"> {item.recipient} </div>
                        <div className="header-date"> {new Date(item.createdAt).toLocaleDateString()} </div>
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


const SendAlertHistory = () => {
    const navigate = useNavigate();
    const itemsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [historyData, setHistoryData] = useState([]);
    const [loading, setLoading] = useState(true);

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

    useEffect(() => {
        const fetchAlerts = async () => {
            setLoading(true);
            try {
                const response = await axios.get(
                     `${process.env.REACT_APP_apiHome}alerts`, {
                    params: {
                        page: currentPage - 1, // 서버 페이지는 0부터 시작하므로 -1
                        size: itemsPerPage,
                    },
                });
                setHistoryData(response.data); // 성공 시 데이터 설정
                setTotalItems(response.data.length);
            } catch (error) {
                console.error('Error fetching alert data:', error);
            } finally {
                setLoading(false); // 로딩 상태 해제
            }
        };

        fetchAlerts();
    }, [currentPage, itemsPerPage]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="app">
            <Header />
            <HeaderBottom text={["관리자페이지", "서비스승인", "알림보내기", "알림전송기록", "문의내역", "특이사항변경", "사용자관리"]} onNavigate={handleNavigation} />
            <HistoryInfo currentPage={currentPage} itemsPerPage={itemsPerPage} totalItems={totalItems} historyData={historyData} />
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
            <Footer />
        </div>
    );
};

export default SendAlertHistory;