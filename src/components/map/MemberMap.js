import './MemberMap.css';
import { Map, MapMarker ,useMap } from "react-kakao-maps-sdk";
import React, { useEffect, useState } from "react";

const MemberMap = () => {
  const data = [
    {
      content: <div style={{ color: "#000" }}>카카오</div>,
      latlng: { lat: 33.450705, lng: 126.570677 },
    },
    {
      content: <div style={{ color: "#000" }}>생태연못</div>,
      latlng: { lat: 33.450936, lng: 126.569477 },
    },
    {
      content: <div style={{ color: "#000" }}>텃밭</div>,
      latlng: { lat: 33.450879, lng: 126.56994 },
    },
    {
      content: <div style={{ color: "#000" }}>근린공원</div>,
      latlng: { lat: 33.451393, lng: 126.570738 },
    },
  ];

  const EventMarkerContainer = ({ position, content }) => {
    const map = useMap();
    const [isVisible, setIsVisible] = useState(false);

    return (
      <MapMarker
        position={position} // 마커를 표시할 위치
        image={
          {src: "https://em-content.zobj.net/source/google/298/old-man_1f474.png",
            size: {
              width: 50,
              height: 50
          }
          }
        }
        // @ts-ignore
        onClick={(marker) => {
          map.panTo(marker.getPosition())
        }}
        onMouseOver={() => setIsVisible(true)}
        onMouseOut={() => setIsVisible(false)}
      >
        {isVisible && content}
      </MapMarker>
    )
  };

  return (<div>
    <Map // 지도를 표시할 Container
      center={{
        // 지도의 중심좌표
        lat: 33.450701,
        lng: 126.570667,
      }}
      style={{
        // 지도의 크기
        width: "1000px",
        height: "1000px",
      }}
      level={3} // 지도의 확대 레벨
    >
      {data.map((value) => (
        <EventMarkerContainer
          key={`EventMarkerContainer-${value.latlng.lat}-${value.latlng.lng}`}
          position={value.latlng}
          content={value.content}
        />
      ))}
    </Map>
  </div>

  );
};

export default MemberMap;
