import React from 'react';
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

const App = () => {
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