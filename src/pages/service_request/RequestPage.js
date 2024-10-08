import React, { useState, useRef } from 'react';
import './RequestPage.css';
import Header from '../../components/Header';
import HeaderBottom from '../../components/HeaderBottom';
import Footer from '../../components/Footer';
import { MembershipTerms, PrivacyPolicy, SmsAgreement } from '../../components/TermsOfUse'; 
import { useNavigate } from 'react-router-dom';

const CustomDropdown = ({ options, selected, onSelect, className }) => {
    const [isOpen, setIsOpen] = useState(false);
    const handleSelect = (option) => {
        onSelect(option);
        setIsOpen(false);
    };

    return (
        <div className={`custom-dropdown ${className}`}>
            <div 
                className="custom-dropdown2-selected" 
                onClick={() => setIsOpen(!isOpen)}
            >
              <span>{selected.split('▼')[0]}</span>
              <span className="dropdown-arrow">▼</span>
            </div>
            {isOpen && (
                <ul className="custom-dropdown2-options">
                    {options.map((option, index) => (
                        <li 
                            key={index} 
                            className={`custom-option custom-option-${option.toLowerCase()}`} 
                            onClick={() => handleSelect(option)}
                        >
                            {option}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

const CustomModal = ({ isOpen, onClose, onSubmit }) => {
    const [inputValue, setInputValue] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleInputBlur = () => {
        const regex = /^[가-힣]*$/; // 한글만 허용하는 정규식
        if (!regex.test(inputValue)) {
            setErrorMessage('한글만 입력 가능합니다.');
        } else {
            setErrorMessage(''); // 유효한 경우 에러 메시지 초기화
        }
    };

    const handleSubmit = () => {
        if (inputValue === '') {
            setErrorMessage('값을 입력해주세요.');
            return;
        }
        if (!errorMessage) {
            onSubmit(inputValue); // 입력값을 부모 컴포넌트로 전달
        }
    };

    if (!isOpen) return null;

    return (
        <div className="signup-input-box">
            <div className="modal-content">
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    className="signup-input"
                />
                {errorMessage && <div className="error-message">{errorMessage}</div>}
            </div>
        </div>
    );
};

const CustomFileInput = ({ onFileChange }) => {
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            onFileChange(file);
        }
    };

    return (
        <div className="file-input-container">
            <input
                type="file"
                onChange={handleFileChange}
                className="file-input"
                accept=".jpg, .jpeg, .png, .pdf"
            />
        </div>
    );
};


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
    const [name, setName] = useState('');
    const [nameError, setNameError] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [phoneNumberError, setPhoneNumberError] = useState('');
    const [homeNumber, setHomeNumber] = useState('');
    const [homeNumberError, setHomeNumberError] = useState('');
    const [age, setAge] = useState('');
    const [ageError, setAgeError] = useState('');
    const [relationship, setRelationship] = useState('관계여부▼');
    const [customRelationship, setCustomRelationship] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDropdownVisible, setIsDropdownVisible] = useState(true); 
    const [file, setFile] = useState(null);
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
        }
    };

    const handleFileUploadClick = () => {
        fileInputRef.current.click();
    };

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
    
    const handleNameChange = (e) => {
        setName(e.target.value);
    };

    const handleNameBlur = () => {
        const regex = /^[가-힣]*$/; // 한글만 입력을 허용하는 정규식
        if (regex.test(name) || name === '') {
            setNameError(''); // 유효한 경우 에러 메시지 초기화
        } else {
            setNameError('한글만 입력 가능합니다.');
        }
    };

    const handlePhoneNumberChange = (e) => {
        setPhoneNumber(e.target.value);
    };
    
    const handlePhoneNumberBlur = () => {
        // 휴대폰 번호 유효성 검사 (010-XXXX-XXXX 형식 또는 010XXXXXXXX 형식)
        const regex = /^01[0-9]-?\d{3,4}-?\d{4}$/;
        if (regex.test(phoneNumber) || phoneNumber === '') {
            setPhoneNumberError('');
        } else {
            setPhoneNumberError('유효한 휴대폰 번호를 입력하세요. 예시: 010-1234-5678 또는 01012345678');
        }
    };
    
    const handleHomeNumberChange = (e) => {
        setHomeNumber(e.target.value);
    };
    
    const handleHomeNumberBlur = () => {
        // 일반 전화번호 유효성 검사 (빈칸이거나 지역번호-XXXX-XXXX 또는 XXXX-XXXX 형식)
        const regex = /^\d{2,3}-?\d{3,4}-?\d{4}$/;
        if (homeNumber === '' || regex.test(homeNumber)) {
            setHomeNumberError(''); // 빈칸이거나 유효한 형식일 경우 에러 메시지 초기화
        } else {
            setHomeNumberError('유효한 전화번호를 입력하세요. 예시: 02-1234-5678 또는 1234-5678');
        }
    };

    const handleAgeChange = (e) => {
        setAge(e.target.value);
    };

    const handleAgeBlur = (e) => {
        const value = e.target.value.trim(); // 입력값에서 공백 제거
        const age = parseInt(value, 10); // 문자열을 정수로 변환

        if (!Number.isNaN(age) && age >= 1 && age <= 120) {
            setAgeError(''); // 유효한 경우 에러 메시지 초기화
        } else {
            setAgeError('1 ~ 120 사이의 숫자만 입력 가능합니다.');
        }
    };

    const handleCustomRelationshipChange = (e) => {
        setCustomRelationship(e.target.value);
    };

    const handleRelationshipSelect = (option) => {
        if (option === '직접입력') {
            setIsModalOpen(true);
            setIsDropdownVisible(false);
        } else {
            setRelationship(option);
        }
    };

    const handleModalSubmit = (value) => {
        setRelationship(value);
        setIsDropdownVisible(true); 
        setIsModalOpen(false); 
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setIsDropdownVisible(true); // 모달 닫을 때 드롭다운 다시 보이게 하기
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
                        <input
                            className="signup-input"
                            value={name}
                            onBlur={handleNameBlur}
                            onChange={handleNameChange}
                        />
                        {nameError && <div className="error-message">{nameError}</div>}
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
                        <input className="signup-input"
                            value={phoneNumber}
                            onBlur={handlePhoneNumberBlur}
                            onChange={handlePhoneNumberChange}
                        />
                        <div className={`signup-guide ${phoneNumberError ? 'error' : ''}`}>
                            {phoneNumberError || '예시: 010-1234-5678 또는 01012345678'}
                        </div>
                    </div>
                </div>
                <div className='signup-input-line'>
                    <div className="signup-title">일반전화번호</div>
                    <div className="signup-input-box">
                         <input
                            className="signup-input"
                            value={homeNumber}
                            onBlur={handleHomeNumberBlur}
                            onChange={handleHomeNumberChange}
                        />
                        <div className={`signup-guide ${homeNumberError ? 'error' : ''}`}>
                            {homeNumberError || '예시: 02-000-0000 / 빈칸도 허용합니다.'}
                        </div>
                    </div>
                </div>
                <div className='signup-input-line'>
                <div className="signup-title">대상자 나이 (만 나이)</div>
                <div className="signup-input-box">
                    <input
                        className="signup-input"
                        value={age}
                        onBlur={handleAgeBlur}
                        onChange={handleAgeChange}
                    />
                    {ageError && <div className="error-message">{ageError}</div>}
                </div>
                </div>
                <div className='signup-input-line'>
                <div className="signup-title">신청자와의 관계</div>
                {isDropdownVisible && (
                    <CustomDropdown
                        options={['할머니', '할아버지', '아버지', '어머니', '이모', '이모부', '고모', '고모부', '삼촌', '숙모', '직접입력']}
                        selected={relationship}
                        onSelect={handleRelationshipSelect}
                        className="alert-type-dropdown"
                    />
                    )}
                    <CustomModal
                        isOpen={isModalOpen} 
                        onClose={handleModalClose}
                        onSubmit={handleModalSubmit} 
                    />
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
                    <div className="file-name-box">
                        {file ? (
                            <div className="file-name">{file.name}</div>
                        ) : (
                            <div className="file-name">파일을 선택해주세요</div>
                        )}
                        <input
                            type="file"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            onChange={handleFileChange}
                            accept=".jpg, .jpeg, .png, .pdf"
                        />
                    </div>
                    <button className="search-email" onClick={handleFileUploadClick}>첨부</button>
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
                        <div className="applicant-info-title-Request">이름</div>
                        <div className="applicant-info-content-Request">윤영하</div>
                        <div className="applicant-info-title-Request">생년월일</div>
                        <div className="applicant-info-content-Request">1984.08.01.</div>
                    </div>
                    <div className='signup-input-line'>
                        <div className="applicant-info-title-Request">이메일</div>
                        <div className="applicant-info-content-Request">luckykor@gmail.com</div>
                        <div className="applicant-info-title-Request">가입일자</div>
                        <div className="applicant-info-content-Request">2024.08.01.</div>
                    </div>
                    <div className='signup-input-line'>
                        <div className="applicant-info-title-Request">주소</div>
                        <div className="applicant-info-content-Request">경기도 하남시 풍산로 가리봉동 남삼호 1224번길 (129-125)</div>
                        <div className="applicant-info-title-Request">상세주소</div>
                        <div className="applicant-info-content-Request">태영아파트 204동 102호</div>
                    </div>
                    <div className='signup-input-line'>
                        <div className="applicant-info-title-Request">휴대전화번호</div>
                        <div className="applicant-info-content-Request">010-4444-4444</div>
                        <div className="applicant-info-title-Request">일반전화번호</div>
                        <div className="applicant-info-content-Request"></div>
                    </div>
                </div>
            </div>

            <div className="stipulation">
                <h3>이용약관</h3>
                <div className="stipulation-text-box">
                    <MembershipTerms />
                </div>
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
                <div className="stipulation-text-box">
                    <PrivacyPolicy />
                </div>
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
                <div className="stipulation-text-box">
                    <SmsAgreement />
                </div>
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
            <button className="signup-submit">서비스 신청</button>
        </div>
    );
};

const RequestPage = () => {
    const navigate = useNavigate();

    const handleNavigation = (item) => {
        if (item === "변경이력조회") {
            navigate('/request');
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