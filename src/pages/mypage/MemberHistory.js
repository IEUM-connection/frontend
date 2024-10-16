import React, { useState, useEffect } from 'react';
import './MemberHistory.css';
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
        age: '나이'
    };

    const fieldsToCompare = Object.keys(fieldMap); // 필드명 리스트

    fieldsToCompare.forEach(field => {
        let oldValue = prevHistory[field];
        let newValue = currentHistory[field];

        // milkDeliveryRequest의 경우 Boolean 값을 "신청"/"미신청"으로 변환
        if (field === 'milkDeliveryRequest') {
            oldValue = oldValue ? '신청' : '미신청';
            newValue = newValue ? '신청' : '미신청';
        }

        if (oldValue !== newValue) {
            changedFields.push({
                field: fieldMap[field],
                oldValue: oldValue, 
                newValue: newValue, 
            });
        }
    });

    return changedFields;
};

// 변경된 필드를 출력하는 컴포넌트
const ChangedFieldsView = ({ changedFields }) => {
    return (
        <div className="changed-fields">
            {changedFields.map(({ field, oldValue, newValue }, index) => (
                <div key={index} className="changed-field">
                    <span className="changed-field-name">{field}</span>
                    <span className="changed-field-values"> :
                        <span className="old-value"> {oldValue || '없음'} </span>
                    </span>
                    <div className="arrow"> →
                        <span className="new-value"> {newValue || '없음'} </span>
                    </div>
                </div>
            ))}
        </div>
    );
};

const HistoryInfo = ({ currentPage, itemsPerPage, totalItems, historyData }) => {

    // // 클릭 이벤트 핸들러
    // const handleRowClick = (historyId) => {
    //     navigate(`/history/info/${historyId}`); // 클릭 시 이동할 경로 지정 (historyId를 경로에 추가 가능)
    // };

    return (
        <div className="memberHistory">
            <div className="history-title">대상자 변경 이력</div>
            <div className="history-view-count">조회결과 {totalItems} 건</div>
            <div className="memberHistory-container">
                <div className="memberHistory-header">
                    <div className="service-header"> 번호 </div>
                    <div className="service-title1"> 변경항목 </div>
                    <div className="service-date"> 변경날짜 </div>
                </div>
                {historyData.map((item, index) => {
                    const prevItem = index < historyData.length - 1 ? historyData[index + 1] : null;
                    const changedFields = prevItem ? getChangedFields(prevItem, item) : null;
                    const itemNumber = totalItems - ((currentPage - 1) * itemsPerPage + index);

                    return (
                        <div className="memberHistory-content" key={item.historyId}>
                            <div className="service-header">{itemNumber}</div>
                            {prevItem === null ? (
                                <div className="service-title1">대상자 정보 최초 입력</div>
                            ) : changedFields && changedFields.length > 0 ? (
                                <div className="service-title1">
                                    <ChangedFieldsView changedFields={changedFields} />
                                </div>
                            ) : (
                                <div className="service-title1">변경된 내용 없음</div>
                            )}
                            <div className="service-date">{new Date(item.modifiedAt).toLocaleDateString()}</div>
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

const MemberHistory = () => {
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
        if (item === "마이페이지") {
            navigate('/mypage');
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

                 // 1. userInfo에 memberId가 있다면 바로 사용
                 if (userInfo?.memberId) {
                    fetchedMemberId = userInfo.memberId;
                } else {
                    // 2. guardianId를 통해 memberId 조회
                    const response = await axios.get(
                        `${process.env.REACT_APP_apiHome}members/guardian`, {
                            headers: {
                                Authorization: `Bearer ${accessToken}`,
                            },
                        }
                    );
                    fetchedMemberId = response.data.data.memberId;
                }
    
                setMemberId(fetchedMemberId);
            } catch (error) {
                console.error('Error fetching member info:', error);
            }
        };
    
        if (accessToken) {
            fetchMemberId();                                                        
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
                    const sortedHistoryData = response.data.data.sort((a, b) => new Date(b.modifiedAt) - new Date(a.modifiedAt));

                    setHistoryData(sortedHistoryData); // 최신순으로 정렬된 데이터를 상태로 저장
                    setTotalItems(response.data.pageInfo.totalElements);
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
            <HeaderBottom text={["마이페이지", "변경이력조회"]} onNavigate={handleNavigation} />
            {!userInfo ? (
                <div className="admin-message">
                    로그인 후 이용해주세요.
                </div>
            ) : loginType !== 'ADMIN' ? (
                <>
                    <HistoryInfo currentPage={currentPage} itemsPerPage={itemsPerPage} totalItems={totalItems} historyData={historyData} />
                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
                </>
            ) : (
                <div className="admin-message">
                    관리자는 관리자 페이지를 이용해주세요.
                </div>
            )}
            <Footer />
        </div>
    );
};

export default MemberHistory;