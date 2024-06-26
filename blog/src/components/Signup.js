import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MDBContainer, MDBInput, MDBBtn, MDBCard, MDBCardBody } from 'mdb-react-ui-kit';
import axios from 'axios';


function Signup() {
  const [email, setEmail] = useState('');
  const [roll, setRoll] = useState('')
  const [name, setName] = useState('')
  const [associatedWith, setAssociatedWith] = useState('')
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async() => {
    try {
      const newUser = {
        email,
        roll,
        name,
        associatedWith,
        password
      }
      const response = await axios.post('http://localhost:4000/users', newUser);
      console.log("User created: ", response.data);
      navigate('/login');
    }
    catch (error) {
      console.error("Error creating user: ", error);
    }

  };

  return (
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
            label="Club Name/Associated With"
            type="text"
            value={associatedWith}
            onChange={(e) => setAssociatedWith(e.target.value)}
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
          <MDBBtn
            color="secondary"
            onClick={handleSignup}
            className="w-100"
          >
            Signup
          </MDBBtn>
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
}

export default Signup;
