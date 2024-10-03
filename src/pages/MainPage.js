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
      slidesToShow: 3,
      slidesToScroll: 1,
    };

    return (
        <div className="main-banner" onClick={() => navigate('/')}>
            <Slider {...settings} className="main-banner-content"> 
            </Slider>
        </div>
    )
};

const MainPage = () => {
    return (
        <div className="app">
            <Header />
            <ShowService/>
            <div className="main-contents">
                <h3>서비스 소개</h3>
                <div className="show-service">서비스 소개</div>
            </div>
            <div className="main-contents">
                <h3>안내글</h3>
                <div className="show-guide">안내글</div>
            </div>
            <div className="main-contents">
                <h3>후원 안내</h3>
                <div className="sponsorship-guide">후원 안내</div>
            </div>
            <Footer />
        </div>
    );
};

export default MainPage;