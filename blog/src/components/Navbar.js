import React, { useState } from 'react';
import {
  MDBNavbar,
  MDBContainer,
  MDBNavbarBrand,
  MDBNavbarToggler,
  MDBNavbarItem,
  MDBNavbarLink,
  MDBCollapse,
  MDBBtn,
  MDBIcon,
  MDBNavbarNav,
  MDBInputGroup
} from 'mdb-react-ui-kit';
import { jwtDecode } from "jwt-decode";
import cookie from 'react-cookies';


export default function Navbar() {
  const [openNavNoTogglerSecond, setOpenNavNoTogglerSecond] = useState(false);

  const token = cookie.load('token');
  if(token){
    const decoded = jwtDecode(token);
    console.log(decoded);
    localStorage.setItem('username', decoded.name);

  }
  else{
    console.log("Not Logged In");
  }
  return (
    <>
      <MDBNavbar bgColor='light' className='literata-regular'>
        <MDBContainer fluid> 
          <MDBNavbarBrand href='/'><img className='text-center' style={{height: 40, width:40,}} src={`${process.env.PUBLIC_URL}/logo.png`} alt="Logo" />
          LitSoc IITGN</MDBNavbarBrand>

          <MDBNavbarToggler
            type='button'
            data-target='#navbarTogglerDemo02'
            aria-controls='navbarTogglerDemo02'
            aria-expanded='false'
            aria-label='Toggle navigation'
            onClick={() => setOpenNavNoTogglerSecond(!openNavNoTogglerSecond)}
          >
            <MDBIcon icon='bars' fas />
          </MDBNavbarToggler>
          <MDBCollapse navbar open={openNavNoTogglerSecond}>
            <MDBNavbarNav className='mx-4 mr-auto mb-2 mb-lg-0'>
              <MDBNavbarItem>
                <MDBNavbarLink active aria-current='page' href='#'>
                  Home
                </MDBNavbarLink>
              </MDBNavbarItem>
              <MDBNavbarItem>
                <MDBNavbarLink href='/authors'>Explore Authors</MDBNavbarLink>
              </MDBNavbarItem>
              
              <MDBNavbarItem>
                <MDBNavbarLink href='/about'>About LitSoc</MDBNavbarLink>
              </MDBNavbarItem>
             
              
              <MDBNavbarItem>
              <MDBNavbarLink href='/login'>Login</MDBNavbarLink>

              </MDBNavbarItem>
              <MDBNavbarItem>
              <MDBNavbarLink href='/signup'>Sign Up</MDBNavbarLink>

              </MDBNavbarItem>

              <MDBNavbarItem>
              <MDBNavbarLink href='/developers'>For Developers</MDBNavbarLink>

              </MDBNavbarItem>

            </MDBNavbarNav>
            
            {/* <div className='d-flex flex-row'>
            <MDBBtn color='primary' size='md' href='/login'>Login</MDBBtn>
              <MDBBtn color='primary' size='md' href='/dashboard'>Dashboard</MDBBtn>
            </div> */}
          </MDBCollapse>
        </MDBContainer>
      </MDBNavbar>
    </>
  );
}