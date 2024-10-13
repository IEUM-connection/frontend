import React, { useState, useEffect, useRef } from 'react';
import './MyPage.css';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useNavigate } from 'react-router-dom';
import HeaderBottom from '../../components/HeaderBottom';
import { useAuth } from '../../auth/AuthContext';
import axios from 'axios'

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
                accept=".jpg, .jpeg, .png, .pdf, .hwp"
            />
        </div>
    );
};

const ModifyApplicantInfo = ({ initialData, onSave }) => {
    const [name, setName] = useState(initialData.name || '');
    const [residentNumber, setResidentNumber] = useState(initialData.residentNumber || '');
    const [address, setAddress] = useState(initialData.address || '');
    const [detailAddress, setDetailAddress] = useState(initialData.detailAddress || '');
    const [phoneNumber, setPhoneNumber] = useState(initialData.phoneNumber || '');
    const [homeNumber, setHomeNumber] = useState(initialData.homeNumber || '');
    const [age, setAge] = useState(initialData.age || '');
    const [relationship, setRelationship] = useState(initialData.relationship || '');
    const [medicalHistory, setMedicalHistory] = useState(initialData.medicalHistory || '');
    const [milkDeliveryRequest, setMilkDeliveryRequest] = useState(initialData.milkDeliveryRequest || false);
    const [notes, setNotes] = useState(initialData.notes || '');
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

    // 나머지 로직은 그대로 유지
    const handleSave = () => {
        const updatedData = {
            name,
            residentNumber,
            address,
            detailAddress,
            phoneNumber,
            homeNumber,
            age,
            relationship,
            medicalHistory,
            milkDeliveryRequest,
            notes,
        };
        onSave(updatedData);
    };

    return (
        <div className="signup-wrap">
            {/* 수정할 필드들을 여기에서 보여줌 */}
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

const ShowInfo = () => {
    const navigate = useNavigate();
    const { accessToken } = useAuth();
    const [guardianInfo, setGuardianInfo] = useState(null);
    const [memberInfo, setMemberInfo] = useState(null);

    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [detailedAddress, setDetailedAddress] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [phoneNumberError, setPhoneNumberError] = useState('');
    const [homeNumber, setHomeNumber] = useState('');
    const [homeNumberError, setHomeNumberError] = useState('');
    const [age, setAge] = useState('');
    const [ageError, setAgeError] = useState('');
    const [medicalHistory, setMedicalHistory] = useState('');
    const [milkDeliveryRequest, setMilkDeliveryRequest] = useState(false);
    const [notes, setNotes] = useState('');
    const [relationship, setRelationship] = useState('');

    const [file, setFile] = useState(null);
    const [postalCode, setPostalCode] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const fileInputRef = useRef(null);
    const [emergencyContact, setEmergencyContact] = useState('');

    const [guardianName, setGuardianName] = useState('');
    const [guardianBirth, setGuardianBirth] = useState('');
    const [guardianEmail, setGuardianEmail] = useState('');
    const [guardianAddress, setGuardianAddress] = useState('');
    const [guardianDetailedAddress, setGuardianDetailedAddress] = useState('');
    const [guardianPhone, setGuardianPhone] = useState('');
    const [guardianTel, setGuardianTel] = useState('');

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
        }
    };

    const handleFileUploadClick = () => {
        fileInputRef.current.click();
    };

    useEffect(() => {
        const fetchGuardianAndMemberInfo = async () => {
            try {
                const guardianResponse = await axios.get(
                    process.env.REACT_APP_apiHome + `guardians`, 
                    {   
                        headers: { Authorization: `Bearer ${accessToken}` },
                    }
                );
                const guardianData = guardianResponse.data.data;
                setGuardianInfo(guardianData);

                setGuardianName(guardianData.name);
                setGuardianBirth(guardianData.birthDate);
                setGuardianEmail(guardianData.email);
                setGuardianAddress(guardianData.address);
                setGuardianDetailedAddress(guardianData.detailedAddress);
                setGuardianPhone(guardianData.phone);
                setGuardianTel(guardianData.tel || '');

                // 2. guardianId를 이용해 member 정보를 가져옴
                const guardianId = guardianData.guardianId;
                if (guardianId) {
                    const memberResponse = await axios.get(
                        `${process.env.REACT_APP_apiHome}members/guardian`, // guardianId로 멤버 검색
                        {
                            headers: { Authorization: `Bearer ${accessToken}` },
                        }
                    );
                    const memberData = memberResponse.data.data;
                    setMemberInfo(memberData);// member 정보 상태에 저장

                    setName(memberData.name);
                    setAddress(memberData.address);
                    setDetailedAddress(memberData.detailedAddress);
                    setPhoneNumber(memberData.phone);
                    setHomeNumber(memberData.tel || '');
                    setAge(memberData.age);
                    setMedicalHistory(memberData.medicalHistory);
                    setMilkDeliveryRequest(memberData.milkDeliveryRequest);
                    setNotes(memberData.notes);
                    setRelationship(memberData.relationship);
                }
            } catch (error) {
                console.error('정보 가져오기 실패:', error);
            }
        };

        if (accessToken) {
            fetchGuardianAndMemberInfo(); // 토큰이 있을 때만 API 호출
        }
    }, [accessToken]);

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

    const handleSave = async () => {
        console.log("저장 전 상세주소 값:", detailedAddress); // 저장 전 값 로그 출력
        console.log("저장 전 우편번호 값:", postalCode); 
        try {
            // 서버에 수정된 데이터를 PATCH 요청
            await axios.patch(
                `${process.env.REACT_APP_apiHome}members/${memberInfo.memberId}`,
                {   
                    name: name?.trim() || '',   // null이거나 undefined인 경우를 방지
                    phone: phoneNumber?.trim() || '',
                    tel: homeNumber?.trim() || '',
                    address: address?.trim() || '',
                    detailAddress: detailedAddress?.trim() || '',
                    postalCode: postalCode?.trim() || '',
                    age: age || '',
                    documentAttachment: file || null,  // 파일이 없을 때 null
                    milkDeliveryRequest: milkDeliveryRequest || false,
                    notes: notes?.trim() || '',
                    medicalHistory: medicalHistory?.trim() || '',
                    latitude: latitude || '',
                    longitude: longitude || '',
                    emergencyContact: emergencyContact?.trim() || ''
                },
                { 
                    headers: { Authorization: `Bearer ${accessToken}` } 
                }
            );

            await axios.patch(
                `${process.env.REACT_APP_apiHome}guardians/${guardianInfo.guardianId}`,
                {
                    name: guardianName?.trim() || '',
                    birthDate: guardianBirth || '',
                    email: guardianEmail?.trim() || '',
                    address: guardianAddress?.trim() || '',
                    detailAddress: guardianDetailedAddress?.trim(),
                    phone: guardianPhone?.trim() || '',
                    tel: guardianTel?.trim() || ''
                },
                { 
                    headers: { Authorization: `Bearer ${accessToken}` } 
                }
            );
            alert('정보가 성공적으로 수정되었습니다.');
            navigate('/mypage');
        } catch (error) {
            console.error('정보 수정 실패:', error);
            alert('정보 수정에 실패했습니다.');
        }
    };

    return (
        <div className="MyPage-signup-wrap">
            <div className="applicant-info">
                <h3>대상자 정보</h3>
                <div className="signup-container">
                    <div className='signup-input-line'>
                        <div className="signup-title">이름</div>
                        <div className="signup-input-box">{memberInfo?.name}</div>
                    </div>
                    <div className='signup-input-line'>
                        <div className="signup-title">사용자 번호</div>
                        <div className="applicant-info-content">{memberInfo?.memberCode}</div>
                    </div>
                    <div className='signup-input-line'>
                        <div className="signup-title">주소</div>
                        <div className="signup-input-box">
                            <input
                                className="signup-input"
                                value={address}
                                readOnly
                            /></div>
                        <button className="search-address" onClick={openDaumPostcode}>주소 검색</button>
                    </div>
                    <div className='signup-input-line'>
                    <div className="signup-title">상세주소</div>
                        <div className="signup-input-box">
                            <input 
                                className="signup-input" 
                                value={detailedAddress} 
                                onChange={(e) => setDetailedAddress(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className='signup-input-line'>
                        <div className="signup-title">휴대전화번호</div>
                        <div className="signup-input-box">
                            <input 
                                className="signup-input"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
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
                                onChange={(e) => setHomeNumber(e.target.value)}
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
                                onChange={(e) => setAge(e.target.value)}
                            />
                            {ageError && <div className="error-message">{ageError}</div>}
                        </div>
                    </div>
                    <div className='signup-input-line'>
                        <div className="signup-title">신청자와의 관계</div>
                        <div className="applicant-info-content">{memberInfo?.relationship}</div>
                    </div>
                    <div className='signup-input-line'>
                        <div className="signup-title">병력 사항</div>
                        <div className="signup-input-box">
                        <input
                            className="signup-input"
                            value={medicalHistory}
                            onChange={(e) => setMedicalHistory(e.target.value)}
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
                        <button className="search-email" onClick={handleFileUploadClick}>첨부</button>
                    </div>
                    <div className='signup-input-line'>
                        <div className="signup-title">대상자 특이사항</div>
                        <div className="signup-input-box">
                        <input
                            className="signup-input"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />
                        </div>
                    </div>
                </div>
            </div>

            <div className="applicant-info">
                <h3>신청자 정보</h3>
                <div className="signup-container">
                <div className='signup-input-line'>
                    <div className="signup-title">이름</div>
                        <div className="applicant-info-content">{guardianInfo?.name}</div>
                </div>
                <div className='signup-input-line'>
                    <div className="signup-title">생년월일</div>
                        <div className="applicant-info-content">{guardianInfo?.birthDate}</div>
                </div>
                <div className='signup-input-line'>
                    <div className="signup-title">이메일</div>
                        <div className="applicant-info-content">{guardianInfo?.email}</div>
                </div>
                <div className='signup-input-line'>
                    <div className="signup-title">가입일자</div>
                        <div className="applicant-info-content">{guardianInfo?.createdAt}</div>
                    </div>
                    <div className='signup-input-line'>
                        <div className="signup-title">주소</div>
                        <div className="signup-input-box">
                            <input 
                                className="signup-input"
                                value={guardianAddress}
                                onChange={(e) => setGuardianAddress(e.target.value)}
                            />
                        </div>
                        <button className="search-address" onClick={openDaumPostcode}>주소 검색</button>
                    </div>
                    <div className='signup-input-line'>
                        <div className="signup-title">상세주소</div>
                        <div className="signup-input-box">
                            <input 
                                className="signup-input"
                                value={guardianDetailedAddress}
                                onChange={(e) => {
                                    setGuardianDetailedAddress(e.target.value);
                                    console.log(setGuardianDetailedAddress, e.target.value); 
                                }}
                            />
                            <div className="signup-guide"></div>
                        </div>
                    </div>
                    <div className='signup-input-line'>
                    <div className="signup-title">휴대폰 번호</div>
                    <div className="signup-input-box">
                        <input 
                                className="signup-input"
                                value={guardianPhone}
                                onChange={(e) => setGuardianPhone(e.target.value)}
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
                                value={guardianTel}
                                onChange={(e) => setGuardianTel(e.target.value)}
                        />
                        <div className={`signup-guide ${homeNumberError ? 'error' : ''}`}>
                            {homeNumberError || '예시: 02-000-0000 / 빈칸도 허용합니다.'}
                        </div>
                    </div>
                </div>
                </div>
            </div>
            <button className="signup-submit" onClick={handleSave}>정보 수정하기</button>
        </div>
    )
};

const ModifyMyInfo = () => {
    const navigate = useNavigate();

    const handleNavigation = (item) => {
        if (item === "변경이력조회") {
            navigate('/history');
        }
    };
    return (
        <div className="app">
            <Header />
            <HeaderBottom text={["마이페이지", "변경이력조회"]} onNavigate={handleNavigation} />
            <ShowInfo />
            <Footer />
        </div>
    );
};

export default ModifyMyInfo;