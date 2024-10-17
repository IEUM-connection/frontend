import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const PersonalInfo = () => {
    return (
        <div className="app">
            <Header />
            <div className="header-line"></div>
            <div className="Info-text">
                <p>
                1. 수집 및 이용 목적<br />
                회원이 수집 및 이용에 동의한 개인정보를 활용하여, SMS/MMS 등 다양한 전자적 전송매체를 통해 신청자에게 대상자의 상태 알림 및 관리자의 알림을 전송할 수 있습니다.<br /><br />
                2. 수집하는 개인정보 항목<br />
                필수 동의사항에서 개인정보 수집 및 이용에 동의한 항목<br /><br />
                3. 보유 및 이용기간<br />
                회원탈퇴를 요청하거나 개인정보의 수집 및 이용에 대한 동의를 철회하는 경우, 수집 및 이용목적이 달성되거나 이용기간이 종료한 경우 개인정보를 지체 없이 파기합니다.<br />
                단, 상법 등 관계법령의 규정에 의하여 보존할 필요가 있는 경우 법령에서 규정한 보존기간 동안 거래내역과 최소한의 기본정보를 보유합니다.<br /><br />
                4. 수신동의 거부 및 철회방법 안내<br />
                본 동의는 거부하실 수 있습니다. 다만 거부 시 동의를 통해 제공 가능한 각종 혜택, 이벤트 안내를 받아보실 수 없습니다.<br />
                본 수신동의를 철회하고자 할 경우에는 메일링/문자메시지 설정 페이지에서 수신여부를 변경하실 수 있습니다.<br />
                </p>
            </div>
            <Footer />
        </div>
    );
};

export default PersonalInfo;