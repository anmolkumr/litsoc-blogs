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
import PostPage from './pages/Post';
import Authors from './pages/Authors';
import AuthorPage from './pages/AuthorProfile';
// import PrivateRoute from './components/PrivateRoute';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" exact element={<HomePage/>} />
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/signup" element={<SignupPage/>} />
        <Route path="/dashboard" element={<DashboardPage/>} />
        <Route path="/authors" element={<Authors/>} /> 
        <Route path="/author/:id" element={<AuthorPage/>} /> 
        <Route path="/create-blog" element={<CreateBlogPage/>} />
        <Route path="/post/:id" element={<PostPage/>} />
        <Route path="/update-blog/:id" element={<UpdateBlogPage/>} />
      </Routes>
    </Router>
  );
}

export default App;
