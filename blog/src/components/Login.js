import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MDBContainer, MDBInput, MDBBtn, MDBCard, MDBCardBody } from 'mdb-react-ui-kit';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();


  const handleLogin = async () => {
     try {
      const response = await axios.post('http://localhost:4000/login', { email, password });
      console.log('User logged in successfully:', response.data);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userId', response.data.user._id);
      login({ email: response.data.email, token: response.data.token });
      navigate('/dashboard');
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  return (
    <>
      <MDBContainer className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <MDBCard style={{ maxWidth: '400px', width: '100%' }}>
          <MDBCardBody>
            <h2 className="text-center mb-4">Login</h2>
            <MDBInput label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mb-3" />
            <MDBInput label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mb-3" />
            <MDBBtn color="primary" onClick={handleLogin} className="w-100">Login</MDBBtn>
          </MDBCardBody>
        </MDBCard>
      </MDBContainer>
    </>

  );
}

export default Login;
