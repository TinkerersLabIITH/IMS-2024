// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import NotAuthorized from './components/NotAuthorized';
import BuyerPage from './components/BuyerPage';
import Home from './components/Home';
import StudentPage from './components/StudentPage';
import NewItem from './components/NewItem';

function App() {
  return (
    <Router>
      <div style={{ margin: 0, padding: 0 }}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/not-authorized" element={<NotAuthorized />} />
          <Route path="/assign-items" element={<BuyerPage />} />
          <Route path="/student" element={<StudentPage />} />
          <Route path="/" element={<Home />} />
          <Route path="/new-item" element={<NewItem />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
