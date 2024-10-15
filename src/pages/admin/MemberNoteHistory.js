import React, { useState, useEffect } from 'react';
import './MemberNoteHistory.css'
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useNavigate } from 'react-router-dom';
import HeaderBottom from '../../components/HeaderBottom';
import axios from 'axios';
import { useAuth } from '../../auth/AuthContext';

// 두 개의 이력 항목을 비교해서 변경된 부분을 반환하는 함수
const getChangedFields = (prevHistory, currentHistory) => {
    const changedFields = [];

    // 영어 필드명과 한글 필드명을 매핑
    const fieldMap = {
        address: '주소',
        detailedAddress: '상세주소',
        postalCode: '우편번호',
        tel: '전화번호',
        phone: '휴대전화번호',
        emergencyContact: '비상연락처',
        memberStatus: '회원상태',
        medicalHistory: '병력사항',
        milkDeliveryRequest: '우유배달요청',
        documentAttachment: '첨부서류',
        notes: '특이사항',
        adminName: '관리자이름',
        adminNote: '관리자메모'
    };

    const fieldsToCompare = Object.keys(fieldMap); // 필드명 리스트

    fieldsToCompare.forEach(field => {
        if (prevHistory[field] !== currentHistory[field]) {
            changedFields.push({
                field: fieldMap[field], // 영어 필드명을 한글로 변환
                oldValue: prevHistory[field], // 이전 값
                newValue: currentHistory[field], // 새로운 값
            });
        }
    });

    return changedFields;
};


// 변경된 필드를 출력하는 컴포넌트
const ChangedFieldsView = ({ changedFields }) => {
    if (!changedFields || changedFields.length === 0) {
        return <div>변경된 내용 없음</div>; // 변경된 내용이 없을 경우 표시
    }

    return (
        <div className="changed-fields">
            {changedFields.map(({ field, oldValue, newValue }, index) => (
                <div key={index} className="changed-field">
                    {/* 한 줄로 변경된 필드명과 값을 표시 */}
                    <span className="changed-field-name">{field}</span> {/* 한글 필드명 */}
                    <span className="changed-field-values"> :
                        <span className="old-value"> {oldValue || '없음'} </span>
                        <span className="arrow"> → </span>
                        <span className="new-value"> {newValue || '없음'} </span>
                    </span>
                </div>
            ))}
        </div>
    );
};

const HistoryInfo = ({ currentPage, itemsPerPage, totalItems, historyData }) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const sortedData = historyData.sort((a, b) => b.historyId - a.historyId); // 최신순으로 정렬
    const paginatedData = sortedData.slice(startIndex, startIndex + itemsPerPage);
    const navigate = useNavigate();
    // const navigate = useNavigate(); // useNavigate 훅 선언

    // // 클릭 이벤트 핸들러
    // const handleRowClick = (historyId) => {
    //     navigate(`/history/info/${historyId}`); // 클릭 시 이동할 경로 지정 (historyId를 경로에 추가 가능)
    // };

    return (
        <div className="memberHistory">
            <div className="history-title">변경 이력 조회</div>
            <div className="history-view-count">조회결과 {totalItems} 건</div>
            <div className="memberHistory-container">
            <div className="memberHistory-header">
                    <div className="header-number-admin"> 번호 </div>
                    <div className='header-type-admin'> 사용자 </div>
                    <div className="header-history-admin"> 변경항목 </div>
                    <div className="header-date-admin"> 변경일자 </div>
                </div>
                {paginatedData.map((item, index) => {
                    const prevItem = sortedData[index + 1]; // 이전 이력 항목
                    const changedFields = prevItem ? getChangedFields(prevItem, item) : null; // 이전 항목과 비교

                    return (
                        <div className="memberHistory-content-admin" key={item.historyId} onClick={() => navigate(`/admin/memberInfo/${item.memberId}`)}
                            //onClick={() => handleRowClick(item.historyId)}
                        >
                            <div className="header-number-admin">{item.historyId}</div>
                            <div className="header-type-admin">{item.name}</div>
                            <div className="header-history-admin">
                                <ChangedFieldsView changedFields={changedFields} />
                            </div>
                            <div className="header-date-admin"> {new Date(item.modifiedAt).toLocaleDateString()} </div>
                        </div>
                    );
                })}
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


const MemberNoteHistory = () => {
    const navigate = useNavigate();
    const itemsPerPage = 10;
    const [totalItems, setTotalItems] = useState(0); 
    const [historyData, setHistoryData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const { accessToken, userInfo } = useAuth();
    const [memberId, setMemberId] = useState(null);
    const loginType = localStorage.getItem('loginType');

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
        if (page >= 1 && page <= Math.ceil(totalItems / itemsPerPage)) {
            setCurrentPage(page);
        }
    };

    // memberId를 가져오기 위한 useEffect
    useEffect(() => {
        const fetchMemberId = async () => {
            try {
                let fetchedMemberId = null;

                const loginType = localStorage.getItem('loginType');
                
                if (loginType === 'ADMIN') {
                    // Admin으로 로그인된 경우 members 리스트를 가져와서 첫 번째 memberId를 사용
                    const response = await axios.get(
                        `${process.env.REACT_APP_apiHome}members`, {
                            params: {
                                page: 1,  // 첫 번째 페이지에서 데이터를 가져옴
                                size: 1,  // 한 개만 가져와서 memberId를 사용
                            },
                            headers: {
                                Authorization: `Bearer ${accessToken}`,
                            },
                        }
                    );
                    if (response.data.data && response.data.data.length > 0) {
                        fetchedMemberId = response.data.data[0].memberId; // 첫 번째 member의 ID 사용
                    }
                } else if (userInfo?.memberId) {
                    // guardian이나 다른 사용자 타입의 경우 memberId를 직접 사용
                    fetchedMemberId = userInfo.memberId;
                }

                setMemberId(fetchedMemberId);
            } catch (error) {
                console.error('Error fetching member info:', error);
            }
        };

    if (accessToken) {
        fetchMemberId();  // 토큰이 있을 때만 호출
    }
}, [userInfo, accessToken]);

    // 히스토리 데이터를 가져오기 위한 useEffect
    useEffect(() => {
        const fetchMemberHistory = async () => {
            setLoading(true);
            try {
                if (memberId) {
                    const response = await axios.get(
                        `${process.env.REACT_APP_apiHome}members/history/${memberId}`, // 서버 API 호출
                        {
                            params: {
                                page: currentPage, // 페이지는 1-based
                                size: itemsPerPage,
                            },
                            headers: {
                                Authorization: `Bearer ${accessToken}`,
                            },
                        }
                    );
                    setHistoryData(response.data.data); // 서버에서 받아온 데이터를 상태로 저장
                    setTotalItems(response.data.pageInfo.totalElements); // 전체 아이템 수를 설정
                }
            } catch (error) {
                console.error('Error fetching member history:', error);
            } finally {
                setLoading(false);
            }
        };

        if (memberId) {
            fetchMemberHistory(); // memberId가 설정된 후 호출
        }
    }, [currentPage, memberId, itemsPerPage, accessToken]);

    const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

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

export default MemberNoteHistory;