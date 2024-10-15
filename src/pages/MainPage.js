import React from 'react';
import './MainPage.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const ShowService = () => {
    const navigate = useNavigate();
    var settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 5000, 
    };

    return (
        <div className="main-banner">
            <Slider {...settings} className="main-banner-content">
                <div className="slide-banner">
                    <img src="/image/Main.png" alt="Slide 1" className="slide-image" />
                </div>
                <div className="slide-banner">
                    <img src="/image/main-service.png" alt="Slide 2" className="slide-image" onClick={() => navigate('/request')}/>
                </div>
                <div className="slide-banner">
                    <img src="/image/main-question.png" alt="Slide 2" className="slide-image" onClick={() => navigate('/service')}/>
                </div>
            </Slider>
        </div>
    )
};

const IntroduceService = () => {
    return (
        <div className="main-contents">
            <div className="intro-section"> 서비스 소개
                <div className="introduce-container">
                    <div className="intro-title">
                        당신을 혼자 두고 싶지 않다는 마음
                        <div className="intro-content">
                        계절에 관계없이 불어오는 바람은 누구에게나 같습니다. <br/>
                        같은 바람일지라도 누군가에겐 휴식이, 누군가에겐 외로움이 되곤 합니다. <br/>
                        저희 이음은 외로이 느낄 바람에 온기를 더하는 매개 역할을 맡으려 시작되었습니다. <br/><br/>
                        이음 애플리케이션은 1인 가구, 홀로 있는 피보호자의 곁에서 온기를 나누고 지킵니다. <br/>
                        휴대폰 미사용 시간, 낙상 감지 등 사용자의 곁에서 늘 확인하며 <br/>보호자, 관리자와 이어주는 서비스입니다. 
                        </div>
                    </div>
                </div>
            </div>

            <div className="intro-section"> 이용 안내
                <div className="introduce-container">
                    <div className="introduce-text">
                        <div className="intro-title"> 대상자 상태 <br/>실시간 확인</div>
                        <div className="intro-content">
                            담당자 관할 구역 내 대상자 <br/>
                            낙상 감지, 휴대폰 미사용 시간<br/>
                            실시간 확인을  통한 관리<br/>
                        </div>
                    </div>
                    <div className="introduce-map-img">
                        <img src="/image/map.png" alt="지도"></img>
                    </div>
                </div>
                <div className="introduce-container">
                    <div className="introduce-text">
                        <div className="intro-title"> 실시간 도움 요청</div>
                        <div className="intro-content">
                            실시간으로 보호자 및 관리자에게 <br/>
                            도움 요청이 가능합니다.
                        </div>
                    </div>
                    <div className="introduce-img">
                        <img src="/image/phone1.png" alt="지도"></img>
                    </div>
                </div>
                <div className="introduce-container">
                    <div className="introduce-text">
                        <div className="intro-title"> 근처 병원 및 약 복용 시간 <br/>알림까지</div>
                        <div className="intro-content">
                            주변 병원을 간편하게 찾아보세요. <br/>
                            또한 규칙적인 복용시간 알람 기능으로<br/>
                            잊어버리지 않고 제때 섭취하도록 도와드립니다.<br/>
                        </div>
                    </div>
                    <div className="introduce-img">
                        <img src="/image/phone2.png" alt="지도"></img>
                    </div>
                </div>
                <div className="intro-section"> 후원 안내
                    <div className="introduce-container">
                        <div className="intro-title">
                            따뜻한 마음이 모여 온기를 만듭니다.
                            <div className="intro-content"> 
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

const MainPage = () => {
    return (
        <div className="app">
            <Header />
            <ShowService/>
            <IntroduceService/>
            <Footer />
        </div>
    );
};

export default MainPage;