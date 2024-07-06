import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MDBContainer, MDBInput, MDBBtn, MDBCard, MDBCardBody, MDBSpinner} from 'mdb-react-ui-kit';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import cookie from 'react-cookies';

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)


function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();


  const handleLogin = async () => {
    setIsLoading(true);
     try {
      const response = await axios.post(`${process.env.REACT_APP_API}/login`, { email, password });
      cookie.save('token', response.data.token);
      MySwal.fire({
        title: <p>Login Successful!</p>,
        icon: 'success',
        showConfirmButton: true,
        confirmButtonText: "Go to Dashboard",
      }).then((result) => {
        
        if (result.isConfirmed) {
          navigate('/dashboard');
        }
      })
      login({ email: response.data.email, token: response.data.token });
    } catch (error) {
      setIsLoading(false);
      MySwal.fire({
        title: <p>Oops! Couldn't Log you In!</p>,
        icon: 'error',
        showConfirmButton: true,
        confirmButtonText: "Try Again",
      }).then((result) => {
        
        if (result.isConfirmed) {
          navigate('/login');
        }
      })
      console.error('Error logging in:', error);
    }
  };

  return (
    <>
    <div className='bg-login'>

      <MDBContainer className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <MDBCard style={{ maxWidth: '400px', width: '100%' }}>
          <MDBCardBody>
            <h2 className="text-center mb-4">Login</h2>
            <MDBInput label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mb-3" />
            <MDBInput label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mb-3" />
            <MDBBtn color="primary" onClick={handleLogin} className="w-100" disabled={isLoading}>{isLoading ? 'Logging In...' : 'Login'}</MDBBtn>
          </MDBCardBody>
        </MDBCard>
      </MDBContainer>
    </div>
    </>

  );
}

export default Login;
