import React, { useState } from 'react';
import './RequestPage.css';
import Header from '../components/Header';
import HeaderBottom from '../components/HeaderBottom';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';

const Checkbox = ({ id, title, status, checked, onChange }) => (
    <div className="checkbox-container">
        <input
            type="checkbox"
            id={`checkbox-${id}`}
            className="checkbox"
            onChange={(e) => onChange(e.target.checked, id)}
            checked={checked}
        />
        <label htmlFor={`checkbox-${id}`}>
            {title} {status}
        </label>
    </div>
);

const RequestContainer = () => {
    const data = [
        { id: 0, title: '멤버십 이용약관 동의', status: '(필수)' },
        { id: 1, title: '개인정보 수집 및 이용 동의', status: '(필수)' },
        { id: 2, title: 'SMS 수신 동의', status: '(선택)' },
        { id: 3, title: '신청' },
        { id: 4, title: '미신청' }
    ];

    const [checkItems, setCheckItems] = useState([]);
    const [address, setAddress] = useState(''); // 주소 api 사용을 위해서 상태 추가
    const [email, setEmail] = useState(''); // 이메일 상태 추가
    const [emailValid, setEmailValid] = useState(null); // 이메일 중복 확인 상태

    // 체크박스 개별 선택하기
    const selectChecked = (checked, id) => {
        if (checked) {
            setCheckItems((items) => [...items, id]);
        } else {
            setCheckItems(checkItems.filter((el) => el !== id));
        }
    };

    // 체크박스 전체 선택하기
    const allChecked = (checked) => {
        if (checked) {
            const itemList = data.filter(item => item.id <= 2).map(item => item.id);
            setCheckItems([...checkItems.filter(id => id > 2), ...itemList]);
        } else {
            setCheckItems(checkItems.filter(id => id > 2));
        }
    };
    

    const onInputPhone = (e) => { // 전화번호 형식으로 변경해주는 함수
        e.target.value = e.target.value
            .replace(/[^0-9]/g, '')
            .replace(/(^02.{0}|^01.{1}|[0-9]{3,4})([0-9]{3,4})([0-9]{4})/g, "$1-$2-$3");
    };

    const openDaumPostcode = () => {
        /* global kakao */ // 이 주석을 추가하여 ESLint에게 kakao가 전역 객체임을 알림
        new window.daum.Postcode({
            oncomplete: (data) => {
                let fullAddress = data.address;
                let extraAddress = '';
    
                console.log('도로명주소 : ' + data.roadAddress);
                console.log('지번주소 : ' + data.jibunAddress);
                console.log('우편번호 : ' + data.zonecode);
    
                const geocoder = new kakao.maps.services.Geocoder();
                geocoder.addressSearch(data.roadAddress, (result, status) => {
                    if (status === kakao.maps.services.Status.OK) {
                        console.log('위도 : ' + result[0].y);
                        console.log('경도 : ' + result[0].x);
                    }
                });
    
                // 주소에 추가 정보가 있는 경우 처리
                if (data.addressType === 'R') {
                    if (data.bname !== '') {
                        extraAddress += data.bname;
                    }
                    if (data.buildingName !== '') {
                        extraAddress += (extraAddress !== '' ? ', ' + data.buildingName : data.buildingName);
                    }
                    fullAddress += (extraAddress !== '' ? ' (' + extraAddress + ')' : '');
                }
    
                // 우편번호와 주소를 결합하여 하나의 문자열로 설정
                const combinedAddress = `(${data.zonecode}) ${fullAddress}`;
                setAddress(combinedAddress); // 주소 상태 업데이트
            }
        }).open();
    };

    return (
        <div className="signup-wrap">
            <h3>대상자 정보</h3>
            <div className="signup-container">
                <div className='signup-input-line'>
                    <div className="signup-title">이름</div>
                    <div className="signup-input-box">
                        <input className="signup-input"></input>
                    </div>
                </div>
                <div className='signup-input-line'>
                    <div className="signup-title">주민등록번호</div>
                    <div className="signup-input-box">
                        <input className="signup-input"></input>
                    </div>
                    <button className="search-email" >본인 인증</button>
                </div>
                <div className='signup-input-line'>
                    <div className="signup-title">주소</div>
                    <div className="signup-input-box">
                        <input
                            className="signup-input"
                            value={address}
                            readOnly
                        />
                    </div>
                    <button className="search-address" onClick={openDaumPostcode}>주소 검색</button>
                </div>
                <div className='signup-input-line'>
                    <div className="signup-title">상세주소</div>
                    <div className="signup-input-box">
                        <input className="signup-input"></input>
                        <div className="signup-guide"></div>
                    </div>
                </div>
                <div className='signup-input-line'>
                    <div className="signup-title">휴대전화번호</div>
                    <div className="signup-input-box">
                        <input className="signup-input"></input>
                    </div>
                </div>
                <div className='signup-input-line'>
                    <div className="signup-title">일반전화번호</div>
                    <div className="signup-input-box">
                        <input className="signup-input" type="text" oninput="oninputPhone(this)"
                        maxlength="14"></input>
                    </div>
                </div>
                <div className='signup-input-line'>
                    <div className="signup-title">대상자 나이 (만 나이)</div>
                    <div className="signup-input-box">
                        <input className="signup-input"></input>
                    </div>
                </div>
                <div className='signup-input-line'>
                    <div className="signup-title">신청자와의 관계</div>
                    <div className="signup-input-box">
                        <input className="signup-input"></input>
                    </div>
                </div>
                <div className='signup-input-line'>
                    <div className="signup-title">병력 사항</div>
                    <div className="signup-input-box">
                        <input className="signup-input"></input>
                    </div>
                </div>
                <div className='signup-input-line'>
                    <div className="signup-title">우유 가정 배달<br />서비스 신청 여부</div>
                    <div className='signup-input-box'>
                        <div className="signup-input-checkbox">
                            <Checkbox
                                id={3}
                                title="신청"
                                checked={checkItems.includes(3)}
                                onChange={(checked) => {
                                    if (checked) {
                                        setCheckItems((items) => items.filter((el) => el !== 4).concat(3));
                                    } else {
                                        setCheckItems((items) => items.filter((el) => el !== 3));
                                    }
                                }}
                            />
                            <Checkbox
                                id={4}
                                title="미신청"
                                checked={checkItems.includes(4)}
                                onChange={(checked) => {
                                    if (checked) {
                                        setCheckItems((items) => items.filter((el) => el !== 3).concat(4));
                                    } else {
                                        setCheckItems((items) => items.filter((el) => el !== 4));
                                    }
                                }}
                            />
                        </div>
                        <div className="signup-guide-milk">*우유 가정 배달 서비스는 우유배달을 통해 안부를 묻는 서비스입니다.</div>
                    </div>
                </div>
                <div className='signup-input-line'>
                    <div className="signup-title">관계 증명 서류</div>
                    <div className="signup-input-box">
                        <input className="signup-input"></input>
                    </div>
                    <button className="search-email" >첨부</button>
                </div>
                <div className='signup-input-line'>
                    <div className="signup-title">대상자 특이사항</div>
                    <div className="signup-input-box">
                        <input className="signup-input"></input>
                    </div>
                </div>
            </div>
            
            <div className="applicant-info">
                <h3>신청자 정보</h3>
                <div className="signup-container">
                    <div className='signup-input-line'>
                        <div className="applicant-info-title">이름</div>
                        <div className="applicant-info-content">윤영하</div>
                        <div className="applicant-info-title">생년월일</div>
                        <div className="applicant-info-content">1984.08.01.</div>
                    </div>
                    <div className='signup-input-line'>
                        <div className="applicant-info-title">이메일</div>
                        <div className="applicant-info-content">luckykor@gmail.com</div>
                        <div className="applicant-info-title">가입일자</div>
                        <div className="applicant-info-content">2024.08.01.</div>
                    </div>
                    <div className='signup-input-line'>
                        <div className="applicant-info-title">주소</div>
                        <div className="applicant-info-content">경기도 하남시 풍산로 1224번길 (129-125)</div>
                        <div className="applicant-info-title">상세주소</div>
                        <div className="applicant-info-content">태영아파트 204동 102호</div>
                    </div>
                    <div className='signup-input-line'>
                        <div className="applicant-info-title">휴대전화번호</div>
                        <div className="applicant-info-content">010-4444-4444</div>
                        <div className="applicant-info-title">일반전화번호</div>
                        <div className="applicant-info-content"></div>
                    </div>
                </div>
            </div>

            <div className="stipulation">
                <h3>이용약관</h3>
                <div className="stipulation-text-box"></div>
                <Checkbox
                    id={0}
                    title="서비스 이용약관 동의"
                    status="(필수)"
                    checked={checkItems.includes(0)}
                    onChange={selectChecked}
                />
            </div>
            <div className="stipulation">
                <h3>개인정보 수집 및 이용</h3>
                <div className="stipulation-text-box"></div>
                <Checkbox
                    id={1}
                    title="개인정보 수집 및 이용 동의"
                    status="(필수)"
                    checked={checkItems.includes(1)}
                    onChange={selectChecked}
                />
            </div>
            <div className="stipulation">
                <h3>SMS 수신 동의</h3>
                <div className="stipulation-text-box"></div>
                <Checkbox
                    id={2}
                    title="SMS 수신 동의"
                    status="(필수)"
                    checked={checkItems.includes(2)}
                    onChange={selectChecked}
                />
            </div>
            
            {/* 전체 동의 체크박스 */}
            <div className="stipulation">
            <div className="checkbox-container">
                <label>
                    <input
                        type="checkbox"
                        className="all-agree-checkbox"
                        onChange={(e) => allChecked(e.target.checked)}
                        checked={[0, 1, 2].every(id => checkItems.includes(id))}
                    />
                    약관에 모두 동의합니다.
                </label>
            </div>
        </div>
            <button className="signup-submit">회원가입</button>
        </div>
    );
};

const RequestPage = () => {
    const navigate = useNavigate();

    const handleNavigation = (item) => {
        if (item === "변경이력조회") {
            navigate('/request'); // 원하는 경로로 수정하세요
        }
    };

    return (
        <div className="app">
            <Header />
            <HeaderBottom text={["서비스신청"]} onNavigate={handleNavigation}/>
            <div className="signup-logo">
                <img src="/image/logo-text.png" alt="메인로고" />
            </div>
            <RequestContainer />
            <Footer />
        </div>
    );
};

export default RequestPage;