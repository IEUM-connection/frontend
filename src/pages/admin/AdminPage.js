import React, { useState, useEffect } from 'react';
import './AdminPage.css';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useNavigate } from 'react-router-dom';
import HeaderBottom from '../../components/HeaderBottom';
import { useAuth } from '../../auth/AuthContext';
import axios from 'axios';


const ServiceApproval = ({ currentPage, itemsPerPage }) => {
    const [historyData, setHistoryData] = useState([]); // 서버에서 불러온 데이터를 저장할 상태
    const [totalItems, setTotalItems] = useState(0); // 총 신청 내역 수 저장
    const { accessToken, userInfo } = useAuth();
    const navigate = useNavigate();
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = historyData.slice(startIndex, startIndex + itemsPerPage);
    const [status, setStatus] = useState('AWAITING_APPROVAL');

    const handleStatusChange = (newStatus) => {
        setStatus(newStatus); // 상태 변경 시 새로운 status 값을 설정
    };

    const formatDate = (dateString) => {
        // createdAt에서 년-월-일 추출
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    useEffect(() => {
        const fetchServiceRequests = async () => {
            try {
                const response = await axios.get(process.env.REACT_APP_apiHome + `members/status/${status}`, {
                    params: {
                        page: currentPage,
                        size: itemsPerPage,
                        // status: 'AWAITING_APPROVAL',
                    },
                    headers: {  // 수정된 부분
                        Authorization: `Bearer ${accessToken}`,
                    } // 수정된 부분
                });
                setHistoryData(response.data.data); // 서버에서 받은 데이터를 상태에 저장
                setTotalItems(response.data.totalItems); // 총 아이템 수를 상태에 저장
            } catch (error) {
                console.error('서비스 신청 내역 불러오기 실패:', error);
            }
        };

        fetchServiceRequests();
    }, [currentPage, itemsPerPage]);

    return (
        <div className="memberHistory">
            <h3>서비스 신청 내역</h3>
            <div className="history-view-count">조회결과 {totalItems} 건</div>
            <div className="memberHistory-container">
                <div className="memberHistory-header">
                    <div className="header-number"> 신청인 </div>
                    <div className="header-title"> 신청 정보 </div>
                    <div className="header-date"> 신청 날짜 </div>
                </div>
                {paginatedData.map((item) => (
                    <div className="memberHistory-content" key={item.serviceId} 
                        onClick={() => navigate('/admin/serviceRequest', { state: { item } })}>
                        <div className="header-number"> {item.guardianName} </div> 
                        <div className="content-title"> {item.name}({item.age}세) / {item.address}</div>
                        <div className="header-date"> {formatDate(item.createdAt)} </div>
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

const AdminPage = () => {
    const navigate = useNavigate();
    const itemsPerPage = 10;
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

    return (
        <div className="app">
            <Header />
            <HeaderBottom text={["관리자페이지", "서비스승인", "알림보내기", "문의내역", "특이사항변경", "사용자관리"]} onNavigate={handleNavigation} />
            <ServiceApproval currentPage={currentPage} itemsPerPage={itemsPerPage} totalItems={totalItems} />
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
            <Footer />
        </div>
    );
};

export default AdminPage;