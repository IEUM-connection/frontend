import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from './pages/MainPage';
import SignupPage from './pages/SignupPage';
import MemberMap from './components/map/MemberMap';
import RequestPage from './pages/RequestPage';
import MyPage from './pages/MyPage';
import ServicePage from './pages/ServicePage';
import AdminPage from './pages/AdminPage';
import MemberHistory from './pages/MemberHistory';
import PostQuestionPage from './pages/PostQuestion';
import MyQuestion from './pages/MyQuestion';
import MyQuestionDetail from './pages/MyQuestionDetail';
import FnaPage from './pages/FnaPage';
import ServiceRequestDetail from './pages/ServiceRequetsDetail';
import SendAlert from './pages/SendAlert';
import QuestionBoard from './pages/QuestionBoard';
import QuestionInfo from './pages/QuestionInfo';
import MemberManagement from './pages/MemberManagement';
import MemberInfo from './pages/MemberInfo';
import MemberNoteHistory from './pages/MemberNoteHistory';

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