import React from 'react';
import { Link } from 'react-router-dom';
import { MDBContainer, MDBBtn } from 'mdb-react-ui-kit';


function Home() {
  return (
    <MDBContainer className="text-center my-5">
      <h1>Welcome to the Blog App</h1>
      <MDBBtn tag={Link} to="/login" color="primary" className="mx-2">Login here</MDBBtn>
      <MDBBtn tag={Link} to="/signup" color="secondary" className="mx-2">Signup</MDBBtn>
    </MDBContainer>
  );
}

export default Home;
