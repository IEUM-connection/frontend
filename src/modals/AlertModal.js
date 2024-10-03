import React, { useState, useEffect } from 'react';
import './AlertModal.css';

const AlertModal = ({ onClose }) => {
    // 모달 외부를 클릭하면 닫히도록 설정
    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (event.target.className === 'alert-modal-overlay') {
                onClose();
            }
        };
        
        window.addEventListener('click', handleOutsideClick);
        
        // 컴포넌트가 언마운트될 때 이벤트 리스너 제거
        return () => {
            window.removeEventListener('click', handleOutsideClick);
        };
    }, [onClose]);

    return (
        <div className="alert-modal-overlay">
            <div className="alert-modal">
                <div className="alert-modal-content">
                    <div className="alert-text">역삼 2동 김점례 님의 휴대폰이</div>
                    <div className="alert-text">24시간 이상 사용되지 않았습니다.</div>
                </div>
                <div className="alert-modal-content">
                    <div className="alert-text">역삼 2동 김점례 님께서</div>
                    <div className="alert-text">도움을 요청하셨습니다.</div>
                </div>
                <div className="alert-modal-content">
                    <div className="alert-text">역삼 2동 김점례 님의 휴대폰에서</div>
                    <div className="alert-text">낙상이 감지되었습니다.</div>
                </div>
            </div>
        </div>
    );
};

export default AlertModal;