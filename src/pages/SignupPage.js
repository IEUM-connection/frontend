import React, { useState } from 'react';
import './SignupPage.css';
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
                        <input className="signup-input"></input>
                    </div>
                </div>
                <div className='signup-input-line'>
                    <div className="signup-title">생년월일</div>
                    <div className="signup-input-box">
                        <input className="signup-input"></input>
                        <div className="signup-guide">숫자만 입력이 가능합니다. 예시)1981201</div>
                    </div>
                </div>
                <div className='signup-input-line'>
                    <div className="signup-title">이메일</div>
                    <div className="signup-input-box">
                        <input className="signup-input"></input>
                        <div className="signup-guide">이메일을 로그인시 아이디로 사용됩니다.</div>
                    </div>
                    <button className="search-email" >중복 확인</button>
                </div>
                <div className='signup-input-line'>
                    <div className="signup-title">비밀번호</div>
                    <div className="signup-input-box">
                        <input className="signup-input"></input>
                        <div className="signup-guide">비밀번호는 특수문자를 포함하여 8~30자로 되어야 합니다.</div>
                    </div>
                </div>
                <div className='signup-input-line'>
                    <div className="signup-title">비밀번호 확인</div>
                    <div className="signup-input-box">
                        <input className="signup-input"></input>
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
                        <input className="signup-input"></input>
                        <div className="signup-guide"></div>
                    </div>
                </div>
                <div className='signup-input-line'>
                    <div className="signup-title">휴대폰 번호</div>
                    <div className="signup-input-box">
                        <input className="signup-input"></input>
                        <div className="signup-guide"></div>
                    </div>
                </div>
                <div className='signup-input-line'>
                    <div className="signup-title">일반 전화번호</div>
                    <div className="signup-input-box">
                        <input className="signup-input"></input>
                        <div className="signup-guide">빈칸도 가능합니다.</div>
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