import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
} from "react-router-dom";import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import CreateBlogPage from './pages/CreateBlogPage';
import UpdateBlogPage from './pages/UpdateBlogPage';
// import PrivateRoute from './components/PrivateRoute';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" exact element={<HomePage/>} />
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/signup" element={<SignupPage/>} />
        <Route path="/dashboard" element={<DashboardPage/>} />
        <Route path="/create-blog" element={<CreateBlogPage/>} />
        <Route path="/update-blog/:id" element={<UpdateBlogPage/>} />
      </Routes>
    </Router>
  );
}

export default App;
