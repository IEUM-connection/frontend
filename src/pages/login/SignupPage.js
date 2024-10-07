import React, { useState } from 'react';
import './SignupPage.css';
import Header from '../../components/Header';
import HeaderBottom from '../../components/HeaderBottom';
import Footer from '../../components/Footer';
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

    // 이메일 중복 확인
    // const checkEmail = async () => {
    //     if (!email) {
    //         alert('이메일을 입력하세요.');
    //         return;
    //     }

    //     try {
    //         const response = await axios.post('API_ENDPOINT', { email });
    //         if (response.data.exists) {
    //             setEmailValid(false);
    //             alert('이미 사용 중인 이메일입니다.');
    //         } else {
    //             setEmailValid(true);
    //             alert('사용 가능한 이메일입니다.');
    //         }
    //     } catch (error) {
    //         console.error('이메일 중복 확인 오류:', error);
    //         alert('이메일 중복 확인 중 오류가 발생했습니다.');
    //     }
    // };

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
        const regex = /^[0-9]{8}$/; // 8자리 숫자만 허용

        if (!regex.test(value)) {
            setBirthError('8자리 숫자만 입력 가능합니다.');
            return;
        }

        // 날짜 범위 검증
        const year = parseInt(value.substring(0, 4), 10);
        const month = parseInt(value.substring(4, 6), 10);
        const day = parseInt(value.substring(6, 8), 10);
        
        const inputDate = new Date(`${year}-${month}-${day}`);
        const minDate = new Date('1924-01-01');
        const maxDate = new Date('2024-12-31');

        if (inputDate >= minDate && inputDate <= maxDate && month >= 1 && month <= 12 && day >= 1 && day <= 31) {
            setBirthError(''); // 입력값이 유효할 경우 에러 메시지 초기화
        } else {
            setBirthError('19240101 ~ 20241231 사이의 날짜만 입력 가능합니다.');
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
            }
        }).open();
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
                    <div className="signup-title">생년월일</div>
                    <div className="signup-input-box">
                        <input
                            className="signup-input"
                            value={birth}
                            onBlur={handleBirthBlur}
                            onChange={handleBirthChange}
                        />
                        <div className={`signup-guide ${birthError ? 'error' : ''}`}>
                            19240101 ~ 20241231 사이의 날짜만 입력 가능합니다. 예시)19811201
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
                    <button className="search-email" >중복 확인</button>
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
                        <input className="signup-input"></input>
                        <div className="signup-guide"></div>
                    </div>
                </div>
                <div className='signup-input-line'>
                    <div className="signup-title">휴대폰 번호</div>
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
                    <div className="signup-title">일반 전화번호</div>
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
            </div>
            <div className="stipulation">
                <h3>이용약관</h3>
                <div className="stipulation-text-box"></div>
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
            <button className="signup-submit">회원가입</button>
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