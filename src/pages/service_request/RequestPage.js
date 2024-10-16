import React, { useState, useRef, useContext, useEffect } from 'react';
import './RequestPage.css';
import Header from '../../components/Header';
import HeaderBottom from '../../components/HeaderBottom';
import Footer from '../../components/Footer';
import { MembershipTerms, PrivacyPolicy, SmsAgreement } from '../../components/TermsOfUse'; 
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import { useAuth } from '../../auth/AuthContext';

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

const CustomDropdown2 = ({ options, selected, onSelect, className }) => {
    const [isOpen, setIsOpen] = useState(false);
    const handleSelect = (option) => {
        onSelect(option);
        setIsOpen(false);
    };

    return (
        <div className={`custom-dropdown2 ${className}`}>
            <div 
                className="custom-dropdown3-selected" 
                onClick={() => setIsOpen(!isOpen)}
            >
              <div className="dropdown-title">{selected.split('▼')[0]}</div>
              <div className="dropdown-arrow2">▼</div>
            </div>
            {isOpen && (
                <ul className="custom-dropdown3-options">
                    {options.map((option, index) => (
                        <li 
                            key={index} 
                            className={`custom-option2 custom-option-${option.toLowerCase()}`} 
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
            <div className="modal-content-1">
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

const VerificationModal = ({ isOpen, onClose, timer, handleCompleteVerification, errorMessage }) => {
    const [remainingTime, setRemainingTime] = useState(timer);

    useEffect(() => {
        if (!isOpen) return;

        setRemainingTime(timer);

        const countdown = setInterval(() => {
            setRemainingTime((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(countdown);
    }, [isOpen, timer]);

    if (!isOpen) return null;

    let timeStyle = { color: 'black' };
    if (remainingTime <= 10) {
        timeStyle = { color: 'red' };
    } else if (remainingTime <= 30) {
        timeStyle = { color: 'orange' };
    }

    const blinkingClass = remainingTime <= 10 ? 'blinking' : '';

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-line">
                    <div className="modal-logo">
                        <img src="/image/logo-text.png" alt="메인로고" />
                    </div>
                    {errorMessage ? (
                        <div className={`modal-text2 ${blinkingClass}`}>{errorMessage}</div>
                    ) : (
                        <div className="modal-text1">휴대폰 본인 인증 요청을 완료해주세요.
                             <div className={`modal-text2 ${blinkingClass}`} style={timeStyle}>
                                남은 시간: {remainingTime}초
                            </div>
                        </div>
                    )}
                    <div className="modal-buttons">
                        <button 
                            className="modal-button" 
                            onClick={handleCompleteVerification} 
                            disabled={remainingTime === 0 || !!errorMessage}
                        >
                            인증 완료
                        </button>
                        <button className="modal-button" onClick={onClose}>닫기</button>
                    </div>
                </div>
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
                accept=".jpg, .jpeg, .png, .pdf, .hwp"
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
    ];

    const [checkItems, setCheckItems] = useState([]);
    const [address, setAddress] = useState(''); // 주소 api 사용을 위해서 상태 추가
    const [email, setEmail] = useState(''); // 이메일 상태 추가
    const [emailValid, setEmailValid] = useState(null); // 이메일 중복 확인 상태
    const [name, setName] = useState('');
    const [nameError, setNameError] = useState('');
    const [birthDate, setBirthDate] = useState('');
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
    const navigate = useNavigate();

    const [guardianInfo, setGuardianInfo] = useState(null);
    const [adminInfo, setAdminInfo] = useState(null);
    const loginType = localStorage.getItem('loginType'); 
    const { accessToken, userInfo } = useAuth(); // AuthContext에서 accessToken과 userInfo 가져오기

    const [residentNumber, setResidentNumber] = useState('');
    const [detailedAddress, setDetialedAddress] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [medicalHistory, setMedicalHistory] = useState('');
    const [notes, setNotes] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [emergencyContact, setEmergencyContact] = useState('');
    const [emergencyContactError, setEmergencyContactError] = useState('');
    const [milkDeliveryRequest, setMilkDeliveryRequest] = useState(''); 
    const [documentAttachment, setDocumentAttachment] = useState('');
    const [selectedCarrier, setSelectedCarrier] = useState('통신사');
    const [residentNumberLeft, setResidentNumberLeft] = useState(''); // 왼쪽 6자리
    const [residentNumberRight, setResidentNumberRight] = useState('');
    const [loading, setLoading] = useState(false); // 로딩 상태 관리
    const [verificationCompleted, setVerificationCompleted] = useState(false); // 인증 완료 상태 관리
    const [error, setError] = useState(''); // 오류 메시지 관리
    const [verificationModalOpen, setVerificationModalOpen] = useState(false);
    const [timeoutId, setTimeoutId] = useState('');
    const [passVerified, setPassVerified] = useState(false);
    const [remainingTime, setRemainingTime] = useState(60);
    const telecomOptions = ['SKT', 'KT', 'LG U+', '알뜰폰SKT', '알뜰폰KT', '알뜰폰LGU+'];
    const telecomMap = {
        'SKT': 0,
        'KT': 1,
        'LG U+': 2,
        '알뜰폰SKT': 0,
        '알뜰폰KT': 1,
        '알뜰폰LGU+': 2
    };

    let formData = new FormData();

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
        }
    };

    const handleFileUploadClick = async() => {
        formData.append('multipartFile', file);
        try {
            const response = await axios.post(
              process.env.REACT_APP_apiHome + 'document', formData,
              {
                headers: {
                  'Content-Type': 'multipart/form-data',
                },
              }
            );

            setDocumentAttachment(response.data);
          } catch (error) {
            alert("파일 첨부에 실패했습니다. ")
          }
    };

    const handleFileFindClick = () => {
        fileInputRef.current.click();
    };

    const handleFileDeleteClick = () => {
        formData = new FormData();
        setFile(null);
    };

    const handleResidentNumberLeftChange = (e) => {
        const value = e.target.value;
    
        // 입력값의 길이가 6자리일 때만 유효성 검사
        if (value.length <= 6) {
            setResidentNumberLeft(value); // 우선 입력된 값을 설정
    
            // 입력이 완료된 6자리일 경우에만 유효성 검사를 진행
            if (value.length === 6) {
                // 연도 부분 (앞 두자리)
                const year = value.slice(0, 2);
                // 월 부분 (가운데 두자리)
                const month = value.slice(2, 4);
                // 일 부분 (뒤 두자리)
                const day = value.slice(4, 6);
    
                // 유효성 검사
                const isValidYear = /^\d{2}$/.test(year); // 연도는 숫자 두 자리
                const isValidMonth = /^0[1-9]|1[0-2]$/.test(month); // 월은 01~12까지만 허용
                const isValidDay = /^0[1-9]|[12][0-9]|3[01]$/.test(day); // 일은 01~31까지만 허용
    
                // 생년월일 유효성 확인
                if (!isValidYear || !isValidMonth || !isValidDay) {
                    // 유효하지 않은 경우 알림 처리
                    alert('올바른 생년월일 형식으로 입력해주세요.');
                    setResidentNumberLeft(''); // 유효하지 않은 경우 입력 초기화
                }
            }
        }
    };

    const handleSubmit = () => {
        const fullResidentNumber = `${residentNumberLeft}-${residentNumberRight}`;
        // fullResidentNumber를 사용하여 서버에 전송하는 로직 작성
    };
    
    const handleResidentNumberRightChange = (e) => {
        const value = e.target.value;
        if (value.length <= 7) { // 오른쪽은 최대 7자리
            setResidentNumberRight(value);
        }
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

    const handleEmergencyContactChange = (e) => {
        setEmergencyContact(e.target.value);
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

    const handleEmergencyContactBlur = () => {
        // 일반 전화번호 유효성 검사 (빈칸이거나 지역번호-XXXX-XXXX 또는 XXXX-XXXX 형식)
        const regex = /^01[0-9]-?\d{3,4}-?\d{4}$/;
        if (emergencyContact === '' || regex.test(emergencyContact)) {
            setEmergencyContactError(''); // 빈칸이거나 유효한 형식일 경우 에러 메시지 초기화
        } else {
            setEmergencyContactError('유효한 휴대폰 번호를 입력하세요. 예시: 010-1234-5678 또는 01012345678');
        }
    };

    const handleAgeChange = (e) => {
        setAge(e.target.value);
    };

    const handleNotesChange = (e) => {
        setNotes(e.target.value);
    };

    const handleMedicalHistoryChange = (e) => {
        setMedicalHistory(e.target.value);
    };

    const handleResidentNumberChange = (e) => {
        setResidentNumber(e.target.value);
    }


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
                let fullAddress = data.roadAddress;
                let extraAddress = '';

                // 주소에 추가 정보가 있는 경우 처리
                if (data.bname !== '') {
                    extraAddress += data.bname;
                }
                if (data.buildingName !== '') {
                    extraAddress += (extraAddress !== '' ? ', ' + data.buildingName : data.buildingName);
                }
    
                if (extraAddress !== '') {
                    fullAddress += ` (${extraAddress})`;
                }

                console.log('도로명주소 : ' + data.roadAddress);
                console.log('지번주소 : ' + data.jibunAddress);
                console.log('우편번호 : ' + data.zonecode);
                setPostalCode(data.zonecode); 
                setAddress(fullAddress.trim()); 
    
                const geocoder = new kakao.maps.services.Geocoder();
                geocoder.addressSearch(data.roadAddress, (result, status) => {
                    if (status === kakao.maps.services.Status.OK) {
                        console.log('위도 : ' + result[0].y);
                        console.log('경도 : ' + result[0].x);
                        setLatitude(result[0].y);
                        setLongitude(result[0].x);
                    }
                });
            }
        }).open();
    };

    // 필수 항목들에 대한 유효성 검증
    const validateForm = () => {
        if (!name) {
            setNameError("이름을 입력해주세요.");
            return false;
        }
        if (!phoneNumber) {
            setPhoneNumberError("휴대폰 번호를 입력해주세요.");
            return false;
        }
        if (!age) {
            setAgeError("대상자 나이를 입력해주세요.");
            return false;
        }
        if (!address) {
            alert("주소를 입력해주세요.");
            return false;
        }
        if (![0, 1, 2].every(id => checkItems.includes(id))) {
            alert("약관에 모두 동의해주세요.");
            return false;
        }
        return true;
    };

    const handleDetailAddressChange = (e) => {
        setDetialedAddress(e.target.value);
    };

    const handleJoinButton = async () => {
        // 필수 필드와 약관 동의 모두 확인
        if (!name || !phoneNumber || !age || !address || !relationship) {
            alert('모든 항목을 올바르게 입력해주세요.');
            return;
        }

        const requiredTerms = [0, 1];  // 필수 항목 정의
        const hasAgreedToAllRequiredTerms = requiredTerms.every(term => checkItems.includes(term));
        
        let birthDate = '';
        if (residentNumberLeft.length === 6) {
            const yearPrefix = parseInt(residentNumberLeft.substring(0, 2), 10) > 21 ? '19' : '20'; 
            birthDate = `${yearPrefix}${residentNumberLeft.substring(0, 2)}-${residentNumberLeft.substring(2, 4)}-${residentNumberLeft.substring(4, 6)}`;
        }

        if (!hasAgreedToAllRequiredTerms) {
            alert('필수 약관에 모두 동의해 주세요.');
            return;
        }
            try {
                    const response = await axios.post(
                        process.env.REACT_APP_apiHome +`members`, 
                        {
                            name: name.trim(),
                            phone: phoneNumber.trim(),
                            tel: homeNumber.trim(),
                            address: address.trim(),
                            detailedAddress: detailedAddress.trim(),
                            postalCode: postalCode.trim(),
                            age: age,
                            relationship: relationship,
                            milkDeliveryRequest: milkDeliveryRequest,
                            notes: notes,
                            residentNumber: residentNumber,
                            medicalHistory: medicalHistory,
                            latitude: latitude,
                            longitude: longitude,
                            emergencyContact: emergencyContact,
                            documentAttachment : documentAttachment
                        },
                    { headers: { 
                        Authorization: `Bearer ${accessToken}` ,
                        'Content-Type': 'application/json'
                }}
            );

                // 성공 시 알림 및 메인 페이지로 이동
                alert("서비스 신청이 완료되었습니다.");
                navigate('/');
            } catch (error) {
                alert("서비스 신청 중 오류가 발생했습니다.");
        }
    };

    // guardian 정보 Get 요청
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                if (loginType === 'ADMIN') {
                    const adminResponse = await axios.get(
                        process.env.REACT_APP_apiHome + `admins`,
                        {
                            headers: { Authorization: `Bearer ${accessToken}` },
                        }
                    );
                    setAdminInfo(adminResponse.data.data);

                } else if (loginType === 'GUARDIAN') {
                    const guardianResponse = await axios.get(
                        process.env.REACT_APP_apiHome + `guardians`,
                        {
                            headers: { Authorization: `Bearer ${accessToken}` },
                        }
                    );
                    setGuardianInfo(guardianResponse.data.data);
                }
            } catch (error) {
                console.error('정보 가져오기 실패:', error);
            }
        };
    
        if (accessToken) {
            fetchUserInfo();
        }
    }, [accessToken]); // loginType이 고정되어 있다면 배열에서 제외 가능


    useEffect(() => {
        let interval;
        if (verificationModalOpen && remainingTime > 0) {
            interval = setInterval(() => {
                setRemainingTime((prevTime) => prevTime - 1);
            }, 1000);
        } else if (remainingTime === 0) {
            setError(
                <div className="error-message-modal">
                    본인 인증에 실패했습니다.<br />
                    1분 내에 인증이 완료되지 않았습니다.
                </div>
            );
            // setVerificationModalOpen(false);
        }
        return () => clearInterval(interval);
    }, [verificationModalOpen, remainingTime]);

    const handleIdentityVerification = async () => {
        if (!name.trim()) {
            alert('이름을 입력해주세요.');
            return;
        }
    
        if (selectedCarrier === '통신사 선택') {
            alert('통신사를 선택해주세요.');
            return;
        }
    
        if (!phoneNumber.trim()) {
            alert('휴대전화번호를 입력해주세요.');
            return;
        }
    
        if (!residentNumberLeft || !residentNumberRight) {
            alert('주민등록번호를 입력해주세요.');
            return;
        }
    
        const residentNumber = `${residentNumberLeft}${residentNumberRight}`;
        const telecomValue = telecomMap[selectedCarrier];
    
        try {
            setLoading(true);
            setError('');
            setVerificationModalOpen(true);
            setRemainingTime(60);
            setPassVerified(false);

            const passResponse = await axios.post(
                process.env.REACT_APP_apiHome + 'api/identity/verify',
                null,
                {
                    params: {
                        name: name.trim(),
                        phoneNo: phoneNumber.trim(),
                        identity: residentNumber.trim(),
                        telecom: telecomValue
                    },
                },
            );

            console.log('패스 응답 데이터: ', passResponse.data);

            // 첫 번째 인증이 성공했는지 확인
            if (passResponse.status === 200) {
                setPassVerified(true);
            } else {
                throw new Error('인증 요청 실패');
            }

            } catch (error) {
                setError('본인 인증에 실패했습니다. 다시 시도해주세요.');
                // setVerificationModalOpen(false);
                console.log("error", error);
            } finally {
                setLoading(false);
        }
    };


            // 2단계: 패스 인증 성공 후 추가 POST 요청
    const handleCompleteVerification = async () => { 

        if (!passVerified) {
            setError('패스 인증이 완료되지 않았습니다.');
            return;
        }
        
        const telecomValue = telecomMap[selectedCarrier]; 
        const residentNumber = `${residentNumberLeft}${residentNumberRight}`;
          
        try {
            const postResponse = await axios.post(
                process.env.REACT_APP_apiHome + 'api/identity/add-verify',
                null,
                {
                    params: {
                        name: name.trim(),
                        phoneNo: phoneNumber.trim(),
                        identity: residentNumber.trim(),
                        telecom: telecomValue
                    },
                },
            );

            console.log("postResponse:", postResponse); // 응답 확인

             // postResponse.data.response를 JSON 파싱
            const parsedResponse = JSON.parse(postResponse.data.response);
            console.log("Parsed response:", parsedResponse);

            if (parsedResponse.result && parsedResponse.result.code === "CF-00016") {
                alert('본인 인증이 완료되었습니다.');
                setVerificationModalOpen(false);
            } else {
                throw new Error('본인 인증에 실패했습니다.');
            }
        } catch (error) {
            console.error("에러 발생:", error);  // 에러 확인
            setError('인증 중 오류가 발생했습니다.');
        }
    };

        const handleTimeoutForAdditionalVerification = async () => {
        try {
            // 일정 시간 대기, 여기서는 30초를 예로 듭니다
            await new Promise((resolve) => setTimeout(resolve, 30000));

            // 타임아웃 후 추가 인증이 필요한 경우 CF-12001로 처리
            const timeoutResponse = await axios.post(
                process.env.REACT_APP_apiHome + 'api/identity/timeout',
                null,
                {
                    params: {
                        // 추가 인증 대기 중인 데이터를 타임아웃 처리로 전달
                        code: 'CF-12001', // 타임아웃 처리 코드
                        message: '추가 인증 대기 타임아웃이 발생했습니다.'
                    },
                },
            );

            console.log("Timeout response:", timeoutResponse.data);
            alert('추가 인증 대기 중 타임아웃이 발생했습니다. 다시 시도해주세요.');
        } catch (error) {
            console.error("추가 인증 타임아웃 처리 중 오류 발생:", error);
            setError('추가 인증 타임아웃 처리 중 오류가 발생했습니다.');
        }
    };

    if (!guardianInfo) {
        return <div className="admin-message">회원가입 후 사용이 가능합니다.</div>; // 보호자 정보 로딩 중일 때 표시
    }

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
                    <div className="signup-input-box-verify">
                    <input
                            className="signup-input-verify-left"
                            value={residentNumberLeft}
                            onChange={handleResidentNumberLeftChange}
                        /> -
                    <input
                            type="password"
                            className="signup-input-verify-right"
                            value={residentNumberRight}
                            onChange={handleResidentNumberRightChange}
                        />
                    </div>
                </div>
                <div className='signup-input-line'>
                    <div className="signup-title">휴대전화번호</div>
                    <div className="signup-input-box">
                        <div className="signup-input-box-phone">
                            <CustomDropdown2
                                options={['SKT', 'KT', 'LG U+', '알뜰폰SKT', '알뜰폰KT', '알뜰폰LGU+']}
                                selected={selectedCarrier}
                                onSelect={setSelectedCarrier}
                                className="carrier-dropdown"
                            />
                            <input className="signup-input-phone"
                                value={phoneNumber}
                                onBlur={handlePhoneNumberBlur}
                                onChange={handlePhoneNumberChange}
                            />
                        </div>
                        <div className={`signup-guide ${phoneNumberError ? 'error' : ''}`}>
                            {phoneNumberError || '예시: 010-1234-5678 또는 01012345678'}
                        </div>
                    </div>
                    {/* 본인 인증 버튼 */}
                    <button className="search-address" onClick={handleIdentityVerification} disabled={loading}>
                        {loading ? '인증 진행 중...' : '본인 인증'}
                    </button>
                    
                    {/* 인증 모달 */}
                    <VerificationModal
                        isOpen={verificationModalOpen}
                        onClose={() => setVerificationModalOpen(false)}
                        timer={60} // 1분 타이머
                        handleCompleteVerification={handleCompleteVerification} 
                        errorMessage={error} 
                    />
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
                    <div className="signup-title">비상연락처</div>
                    <div className="signup-input-box">
                         <input
                            className="signup-input"
                            value={emergencyContact}
                            onBlur={handleEmergencyContactBlur}
                            onChange={handleEmergencyContactChange}
                        />
                        <div className={`signup-guide ${emergencyContactError ? 'error' : ''}`}>
                            {emergencyContactError || '보호자가 연락되지 않을 경우에 사용됩니다. / 없다면 빈칸도 허용합니다.'}
                        </div>
                    </div>
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
                        <input 
                            className="signup-input" 
                            value={detailedAddress} 
                            onChange={handleDetailAddressChange}
                        />
                        <div className="signup-guide"></div>
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
                        <input
                            className="signup-input"
                            value={medicalHistory}
                            onChange={handleMedicalHistoryChange}
                        />
                    </div>
                </div>
                <div className='signup-input-line'>
                    <div className="signup-title">우유 가정 배달<br />서비스 신청 여부</div>
                    <div className='signup-input-box'>
                        <div className="signup-input-checkbox">
                            <Checkbox
                                id={3}
                                title="신청"
                                checked={milkDeliveryRequest === true}
                                onChange={() => setMilkDeliveryRequest(true)}
                            />
                            <Checkbox
                                id={4}
                                title="미신청"
                                checked={milkDeliveryRequest === false}
                                onChange={() => setMilkDeliveryRequest(false)}
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
                            accept=".jpg, .jpeg, .png, .pdf, .hwp"
                        />
                    </div>
                    {
                       file !== null ? <button className="search-email" onClick={handleFileUploadClick}>업로드</button>
                        : <button className="search-email" onClick={handleFileFindClick}>첨부</button> 
                    }
                    
                    {
                        <button className="search-email1" onClick={handleFileDeleteClick}>삭제</button>
                    }
                </div>
                <div className='signup-input-line'>
                    <div className="signup-title">대상자 특이사항</div>
                    <div className="signup-input-box">
                    <input
                            className="signup-input"
                            value={notes}
                            onChange={handleNotesChange}
                        />
                    </div>
                </div>
            </div>
            
            <div className="applicant-info">
                <h3>신청자 정보</h3>
                <div className="signup-container">
                    <div className='signup-input-line'>
                    <div className="applicant-info-title-Request">이름</div>
            <div className="applicant-info-content-Request">{guardianInfo.name}</div>
            <div className="applicant-info-title-Request">생년월일</div>
            <div className="applicant-info-content-Request">{guardianInfo.birthDate}</div>
        </div>
        <div className='signup-input-line'>
            <div className="applicant-info-title-Request">이메일</div>
            <div className="applicant-info-content-Request">{guardianInfo.email}</div>
            <div className="applicant-info-title-Request">가입일자</div>
            <div className="applicant-info-content-Request">{guardianInfo.createdAt}</div>
        </div>
        <div className='signup-input-line'>
            <div className="applicant-info-title-Request">주소</div>
            <div className="applicant-info-content-Request">{guardianInfo.address}</div>
            <div className="applicant-info-title-Request">상세주소</div>
            <div className="applicant-info-content-Request">{guardianInfo.detailedAddress}</div>
        </div>
        <div className='signup-input-line'>
            <div className="applicant-info-title-Request">휴대전화번호</div>
            <div className="applicant-info-content-Request">{guardianInfo.phone}</div>
            <div className="applicant-info-title-Request">일반전화번호</div>
            <div className="applicant-info-content-Request">{guardianInfo.tel || '없음'}</div>
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
                        onChange={(e) => {
                            const allChecked = e.target.checked;
                            if (allChecked) {
                                setCheckItems([0, 1, 2]);
                            } else {
                                setCheckItems([]);
                            }
                        }}
                        checked={[0, 1, 2].every(id => checkItems.includes(id))}
                    />
                    약관에 모두 동의합니다.
                </label>
            </div>
        </div>
            <button className="signup-submit"  onClick={handleJoinButton}>서비스 신청</button>
        </div>
    );
};

const RequestPage = () => {
    const navigate = useNavigate();
    const loginType = localStorage.getItem('loginType');

    const handleNavigation = (item) => {
        if (item === "변경이력조회") {
            navigate('/request');
        }
    };

    return (
        <div className="app">
            <Header />
            <HeaderBottom text={["서비스신청"]} onNavigate={handleNavigation}/>
            {loginType !== 'ADMIN' && (
                <div className="signup-logo">
                    <img src="/image/logo-text.png" alt="메인로고" />
                </div>
            )}
            <RequestContainer/>
            <Footer />
        </div>
    );
};

export default RequestPage;