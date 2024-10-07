import './MemberMap.css';
import { Map, MapMarker ,useMap } from "react-kakao-maps-sdk";
import React, { useEffect, useState } from "react";

/* global kakao */

const MemberMap = ( { markers } ) => {
  const [currentPosition, setCurrentPosition] = useState({
    lat: 	37.499653752945, // 기본 위치
    lng: 127.03053487955,
  });

  const [map, setMap] = useState(null); // 지도 객체를 저장할 상태

   // 사용자의 현재 위치 가져오기
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentPosition({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location: ", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  const data = [
    {
      content: <div style={{ color: "#000" }}>김점례</div>,
      latlng: { lat: 37.499653752945, lng: 127.03053487955 },
    },
    {
      content: <div style={{ color: "#000" }}>고세동</div>,
      latlng: { lat: 37.499, lng: 127.029 },
    },
    {
      content: <div style={{ color: "#000" }}>이기성</div>,
      latlng: { lat: 37.500, lng: 127.027 },
    },
    {
      content: <div style={{ color: "#000" }}>신형만</div>,
      latlng: { lat: 37.501, lng: 127.026 },
    },
  ];

  const EventMarkerContainer = ({ position, content }) => {
    const map = useMap();
    const [isVisible, setIsVisible] = useState(false);

    return (
      <MapMarker
        position={position}
        image={{
          src: "/image/marker.png",
          size: {
            width: 50,
            height: 50,
          },
        }}
        onClick={(marker) => {
          map.panTo(marker.getPosition());
        }}
        onMouseOver={() => setIsVisible(true)}
        onMouseOut={() => setIsVisible(false)}
      >
        {isVisible && content}
      </MapMarker>
    );
  };

  const moveToCurrentLocation = () => {
    if (map && currentPosition.lat && currentPosition.lng) {
      try {
        console.log("Moving to:", currentPosition);
        map.panTo(new kakao.maps.LatLng(currentPosition.lat, currentPosition.lng));
      } catch (error) {
        console.error("Error during panTo:", error);
      }
    } else {
      console.error("Map is not initialized or currentPosition is invalid");
    }
  };


  return (
    <div className="map-container" style={{ position: "relative" }}>
      <h3>지도 위치 확인</h3>
      <Map
        center={currentPosition}
        style={{
          width: "1080px",
          height: "450px",
        }}
        level={3}
        onCreate={setMap} // 지도가 생성될 때 지도 객체를 저장
      >
        {markers.map((marker, index) => (
          <EventMarkerContainer
            key={`marker-${index}`}
            position={marker.latlng} 
            content={
              <div className="marker-card" style={{ color: "#000" }}>
                <div>이름: {marker.name}</div>
                <div>전력 사용량: {marker.powerUsage} <span style={{ fontSize: 'small' }}>{marker.checkTime}</span></div>
                <div>미사용 시간: {marker.phoneInactiveDuration} <span style={{ fontSize: 'small' }}>{marker.checkTime}</span></div>
              </div>
            }
          />
        ))}
      </Map>
     {/* 현재 위치로 돌아가는 버튼 */}
     <button
       onClick={() => map.panTo(new kakao.maps.LatLng(currentPosition.lat, currentPosition.lng))}
        style={{
          position: "absolute",
          top: "50px",
          right: "16px",
          zIndex: 1000,
          height: "40px",
          padding: "10px",
          fontWeight: "700",
          color: "#ffffff",
          backgroundColor: "#FD967C",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        현재 위치로
      </button>
  </div>

  );
};

export default MemberMap;
