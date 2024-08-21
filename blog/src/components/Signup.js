import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MDBContainer, MDBInput, MDBBtn, MDBCard, MDBCardBody } from 'mdb-react-ui-kit';
import axios from 'axios';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import Navbar from './Navbar';
import Footer from './Footer';
const MySwal = withReactContent(Swal)

function Signup() {
  const [email, setEmail] = useState('');
  const [roll, setRoll] = useState('')
  const [name, setName] = useState('')
  const [associatedWith, setAssociatedWith] = useState('LitSoc')
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async() => {
    setIsLoading(true);
    try {
      const newUser = {
        email,
        roll,
        name,
        associatedWith,
        password
      }
      const response = await axios.post(`${process.env.REACT_APP_API}/users`, newUser);
      console.log("User created: ", response.data); 

      MySwal.fire({
        title: <p>User created successfully!</p>,
        icon: 'success',
        showConfirmButton: true,
        confirmButtonText: "Go to Login",
      }).then((result) => {
        
        if (result.isConfirmed) {
          navigate('/login');
        }
      })
    }
    catch (error) {
      console.error("Error creating user: ", error);
    }

  };

  return (
    <>
      <Navbar />
    <MDBContainer className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      <MDBCard style={{ maxWidth: '400px', width: '100%' }}>
        <MDBCardBody>
          <h2 className="text-center mb-4">Signup</h2>
          <MDBInput
            label="Roll"
            type="tel"
            value={roll}
            onChange={(e) => setRoll(e.target.value)}
            className="mb-3"
            />
          <MDBInput
            label="Name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mb-3"
          />
          
          <MDBInput
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mb-3"
            />
          <MDBInput
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-3"
            />
             <MDBInput
            label="Club Name/Associated With"
            type="text"
            value={associatedWith}
            onChange={(e) => setAssociatedWith(e.target.value)}
            className="mb-3"
            disabled
            />
          <MDBBtn
            color="secondary"
            onClick={handleSignup}
            className="w-100"
            >

           {isLoading ? 'Submitting...' : 'Signup'}
          </MDBBtn>
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
    <Footer />
            </>
  );
}

export default Signup;
