import React, { useState, useEffect } from 'react';
import './SignupPage.css';
import Header from '../../components/Header';
import HeaderBottom from '../../components/HeaderBottom';
import Footer from '../../components/Footer';
import axios from 'axios'
import { MembershipTerms, PrivacyPolicy, SmsAgreement } from '../../components/TermsOfUse'; 
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';

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

const SignupContainer = () => {
    const data = [
        {
            id: 0,
            title: '멤버십 이용약관 동의',
            status: '(필수)',
        },
        {
            id: 1,
            title: '개인정보 수집 및 이용 동의',
            status: '(필수)',
        },
        {
            id: 2,
            title: 'SMS 수신 동의',
            status: '(선택)',
        }
    ];

    const navigate = useNavigate();
    const [checkItems, setCheckItems] = useState([]);
    const [address, setAddress] = useState(''); // 주소 api 사용을 위해서 상태 추가
    const [name, setName] = useState('');
    const [nameError, setNameError] = useState('');
    const [birth, setBirth] = useState('');
    const [birthError, setBirthError] = useState('');
    const [email, setEmail] = useState(''); // 이메일 상태 추가
    const [emailError, setEmailError] = useState('');
    const [emailValid, setEmailValid] = useState(null); // 이메일 중복 확인 상태
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false); 
    const [phoneNumber, setPhoneNumber] = useState('');
    const [phoneNumberError, setPhoneNumberError] = useState('');
    const [homeNumber, setHomeNumber] = useState('');
    const [homeNumberError, setHomeNumberError] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [detailAddress, setdetialAddress] = useState('');
    const { accessToken } = useAuth();
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
        '알뜰폰SKT': 3,
        '알뜰폰KT': 4,
        '알뜰폰LGU+': 5
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
            const itemList = data.map((item) => item.id);
            setCheckItems(itemList);
        } else {
            setCheckItems([]);
        }
    };

    //이메일 중복 확인
    const checkEmail = async () => {
        if (!email) {
            alert('이메일을 입력하세요.');
            return;
        }
    
        try {
            const response = await axios.get(
                process.env.REACT_APP_apiHome + `guardians/email`,
                {
                    params: { email: email }
                },
            );
    
            // 서버 응답에 따른 조건문 변경
            if (response.data === "Email is already in use") {
                setEmailValid(false);
                alert('이미 사용 중인 이메일입니다.');
            } else if (response.data === "Email is available") {
                setEmailValid(true);
                alert('사용 가능한 이메일입니다.');
            }
        } catch (error) {
            if (error.response) {
                // 서버에서의 에러 응답이 있을 경우
                console.error('이메일 중복 확인 오류:', error.response.status, error.response.data);
            } else if (error.request) {
                // 요청은 보내졌으나 서버 응답이 없을 경우
                console.error('서버 응답 없음:', error.request);
            } else {
                // 기타 에러
                console.error('이메일 중복 확인 중 오류 발생:', error.message);
            }
            alert('이메일 중복 확인 중 오류가 발생했습니다.');
        }
    };

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

    const handleBirthChange = (e) => {
        setBirth(e.target.value);
    };

    const handleBirthBlur = (e) => {
        const value = e.target.value;
        const regex = /^\d{4}-\d{2}-\d{2}$/; // yyyy-MM-dd 형식 허용
    
        if (!regex.test(value)) {
            setBirthError('올바른 날짜 형식을 입력하세요. (예: 1992-12-12)');
            return;
        }
    
        // 날짜 범위 검증
        const year = parseInt(value.substring(0, 4), 10);
        const month = parseInt(value.substring(5, 7), 10);
        const day = parseInt(value.substring(8, 10), 10);
        
        const inputDate = new Date(`${year}-${month}-${day}`);
        const minDate = new Date('1924-01-01');
        const maxDate = new Date('2024-12-31');
    
        if (inputDate >= minDate && inputDate <= maxDate && month >= 1 && month <= 12 && day >= 1 && day <= 31) {
            setBirth(value); // 입력값을 그대로 유지
            setBirthError(''); // 입력값이 유효할 경우 에러 메시지 초기화
        } else {
            setBirthError('1924-01-01 ~ 2024-12-31 사이의 날짜만 입력 가능합니다.');
        }
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

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handleEmailBlur = (e) => {
        const value = e.target.value;
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (regex.test(value) || value === '') {
            setEmail(value);
            setEmailError('');
        } else {
            setEmailError('올바른 이메일 형식을 입력하세요.');
        }
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };
    
    const handlePasswordBlur = (e) => {
        const value = e.target.value;
        const regex = /^(?=.*[!@#$%^&*(),.?":{}|<>]).{8,30}$/;
        if (regex.test(value) || value === '') {
            setPasswordError('');
        } else {
            setPasswordError('특수문자를 포함한 8~30자를 입력하세요.');
        }
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
    };
    
    const handleConfirmPasswordBlur = () => {
        if (confirmPassword !== password) {
            setConfirmPasswordError('입력한 비밀번호가 다릅니다.');
        } else {
            setConfirmPasswordError('');
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

    const handleDetailAddressChange = (e) => {
        setdetialAddress(e.target.value);
    };

    // 주소 api 검색 호출
    const openDaumPostcode = () => {
        new window.daum.Postcode({
            oncomplete: (data) => {
                let fullAddress = data.address;
                let extraAddress = '';

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
                setPostalCode(data.zonecode); 
            }
        }).open();
    };

    const requiredTerms = [0, 1]; // 0: 멤버십 이용약관, 1: 개인정보 수집 및 이용

    // 회원가입
    const handleJoinButton = async () => {
        if (!emailValid) {
            alert('이미 사용 중인 이메일입니다. 다른 이메일을 사용해 주세요.');
            return;
        }
    
        if (!email || emailError || !password || password !== confirmPassword || !phoneNumber || !address) {
            alert('모든 항목을 올바르게 입력해주세요.');
            return;
        }
    
        const hasAgreedToAllRequiredTerms = requiredTerms.every(term => checkItems.includes(term));
    
        if (!hasAgreedToAllRequiredTerms) {
            alert('필수 약관에 모두 동의해 주세요.');
            return;
        }

        // 주민등록번호 앞자리에서 생년월일 추출
        let birthDate = '';
        if (residentNumberLeft.length === 6) {
            const yearPrefix = parseInt(residentNumberLeft.substring(0, 2), 10) > 21 ? '19' : '20'; 
            birthDate = `${yearPrefix}${residentNumberLeft.substring(0, 2)}-${residentNumberLeft.substring(2, 4)}-${residentNumberLeft.substring(4, 6)}`;
        }
    
        try {
                const response = await axios.post(process.env.REACT_APP_apiHome + `guardians`, 
            {
                "email": email,
                "password": password,
                "name": name,
                "tel": homeNumber,
                "phone": phoneNumber,
                "address": address,
                "detailedAddress": detailAddress,
                "postalCode": postalCode,
                "birthDate": birthDate,
            });
    
            // 회원가입 완료 후 알림창과 페이지 이동
            alert('회원가입이 완료되었습니다.');
            navigate('/');
        } catch (error) {
            if (error.response && error.response.data === "이미 가입된 회원입니다.") {
                alert('이미 가입한 회원입니다.'); // 이미 가입한 회원일 경우 알림
            } else {
                console.error('회원가입 중 오류:', error);
                alert('회원가입에 실패하였습니다.');
            }
        }
    };
    

    return (
        <div className="signup-wrap">
            <h3>회원가입</h3>
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
                    <div className="signup-title">이메일</div>
                    <div className="signup-input-box">
                        <input
                            className="signup-input"
                            value={email}
                            onBlur={handleEmailBlur}
                            onChange={handleEmailChange}
                        />
                        <div className={`signup-guide ${emailError ? 'error' : ''}`}>
                            {emailError || '이메일은 로그인시 아이디로 사용됩니다.'}
                        </div>
                    </div>
                    <button className="search-email" onClick={checkEmail}>중복 확인</button>
                </div>
                <div className='signup-input-line'>
                    <div className="signup-title">비밀번호</div>
                    <div className="signup-input-box">
                        <input className="signup-input"
                            type={passwordVisible ? 'text' : 'password'}
                            value={password}
                            onBlur={handlePasswordBlur}
                            onChange={handlePasswordChange}
                        />
                        <div className={`signup-guide ${passwordError ? 'error' : ''}`}>
                        {passwordError || '비밀번호는 특수문자를 포함하여 8~30자로 되어야 합니다.'}
                        </div>
                    </div>
                    <button
                            type="button"
                            onClick={() => setPasswordVisible(!passwordVisible)}
                            className="show-password"
                        >
                        {passwordVisible ? '숨기기' : '비밀번호 표시'}
                    </button>
                </div>
                <div className='signup-input-line'>
                    <div className="signup-title">비밀번호 확인</div>
                    <div className="signup-input-box">
                        <input
                            className="signup-input"
                            type={confirmPasswordVisible ? 'text' : 'password'}
                            value={confirmPassword}
                            onBlur={handleConfirmPasswordBlur}
                            onChange={handleConfirmPasswordChange}
                        />
                        {confirmPasswordError && <div className="error-message">{confirmPasswordError}</div>}
                    </div>
                    <button
                        type="button"
                        onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                        className="show-password"
                    >
                        {confirmPasswordVisible ? '숨기기' : '비밀번호 표시'}
                    </button>
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
                            value={detailAddress} 
                            onChange={handleDetailAddressChange} // 상세주소 입력 시 상태 업데이트
                        />
                        <div className="signup-guide"></div>
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
                    title="멤버십 이용약관 동의"
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
                <div className="checkbox-container ">
                    <label>
                        <input
                            type="checkbox"
                            className="all-agree-checkbox"
                            onChange={(e) => allChecked(e.target.checked)}
                            checked={checkItems.length === data.length}
                        />
                        약관에 모두 동의합니다.
                    </label>
                </div>
            </div>
            <button className="signup-submit" onClick={handleJoinButton}>회원가입</button>
        </div>
    );
};


const SignupPage = () => {
    return (
        <div className="app">
            <Header />
            <HeaderBottom text={["회원가입"]}  />
            <div className="signup-logo">
                <img src="/image/logo-text.png" alt="메인로고" />
            </div>
            <SignupContainer />
            <Footer />
        </div>
    );
};

export default SignupPage;