import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from './pages/MainPage';
import SignupPage from './pages/login/SignupPage';
import MemberMap from './components/map/MemberMap';
import RequestPage from './pages/service_request/RequestPage';
import MyPage from './pages/mypage/MyPage';
import ServicePage from './pages/question/ServicePage';
import AdminPage from './pages/admin/AdminPage';
import MemberHistory from './pages/mypage/MemberHistory';
import PostQuestionPage from './pages/question/PostQuestion';
import MyQuestion from './pages/question/MyQuestion';
import MyQuestionDetail from './pages/question/MyQuestionDetail';
import FnaPage from './pages/question/FnaPage';
import ServiceRequestDetail from './pages/admin/ServiceRequetsDetail';
import SendAlert from './pages/admin/SendAlert';
import QuestionBoard from './pages/admin/QuestionBoard';
import QuestionInfo from './pages/admin/QuestionInfo';
import MemberManagement from './pages/admin/MemberManagement';
import MemberInfo from './pages/admin/MemberInfo';
import MemberNoteHistory from './pages/admin/MemberNoteHistory';
import * as firebaseApp from "firebase/app";
import * as firebaseMessage from "firebase/messaging";
export const VAPID_PUBLIC_KEY =process.env.REACT_APP_fcmapikey;

const App = () => {

  useEffect(() => {
    firebaseApp.initializeApp({
      apiKey: process.env.REACT_APP_apiKey,
        authDomain: process.env.REACT_APP_authDomain,
        projectId: process.env.REACT_APP_projectId,
        storageBucket: process.env.REACT_APP_storageBucket,
        messagingSenderId: process.env.REACT_APP_messagingSenderId,
        appId: process.env.REACT_APP_appId,
        measurementId: process.env.REACT_APP_measurementId
    });

    const messaging = firebaseMessage.getMessaging();

    firebaseMessage
      .getToken(messaging, {
        vapidKey: VAPID_PUBLIC_KEY,
      })
      .then((currentToken) => {
        if (currentToken) {
          console.log(currentToken);
          alert("토큰: " + currentToken);
          // 토큰을 서버에 전달...
        } else {
          // Show permission request UI
          console.log(
            "No registration token available. Request permission to generate one."
          );
        }
      })
      .catch((err) => {
        console.log("An error occurred while retrieving token. ", err);
        // ...
      });
  }, []);


  return (
      <Router>
        <Routes>
          <Route path="/" element={<MainPage />}/>
          <Route path="/signup" element={<SignupPage />}/>
          <Route path="/membermap" element={<MemberMap />}/>
          <Route path="/request" element={<RequestPage />}/>
          <Route path="/mypage" element={<MyPage />}/>
          <Route path="/service" element={<ServicePage />}/>
          <Route path="/admin" element={<AdminPage/>} />
          <Route path="/history" element={<MemberHistory/>} />
          <Route path="/question/post" element={<PostQuestionPage/>} />
          <Route path="/myquestion" element={<MyQuestion/>}/>
          <Route path="/myquestion/detail" element={<MyQuestionDetail/>}/>
          <Route path="/fna-detail" element={<FnaPage/>}/>
          <Route path="/admin/serviceRequest" element={<ServiceRequestDetail/>}/>
          <Route path="/admin/sendAlert" element={<SendAlert/>}/>
          <Route path="/admin/question" element={<QuestionBoard/>}/>
          <Route path="/admin/question/info" element={<QuestionInfo/>}/>
          <Route path="/admin/member" element={<MemberManagement/>}/>
          <Route path="/admin/memberInfo" element={<MemberInfo/>}/>
          <Route path="/admin/memberNote" element={<MemberNoteHistory/>}/>
      </Routes>
    </Router>
  );
};

export default App;