import React from 'react';
import { MDBFooter, MDBContainer, MDBRow, MDBCol, MDBIcon } from 'mdb-react-ui-kit';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <MDBFooter bgColor='light' className='mt-5 text-center text-lg-start text-muted'>
      <section className='d-flex justify-content-center justify-content-lg-between p-4 border-bottom'>
        {/* <div className='me-5 d-none d-lg-block'>
          <span>Get connected with LitSoc</span>
        </div>

        <div>
          <a href='' className='me-4 text-reset'>
            <MDBIcon fab icon="facebook-f" />
          </a>
          <a href='' className='me-4 text-reset'>
            <MDBIcon fab icon="twitter" />
          </a>
          <a href='' className='me-4 text-reset'>
            <MDBIcon fab icon="google" />
          </a>
          <a href='' className='me-4 text-reset'>
            <MDBIcon fab icon="instagram" />
          </a>
          <a href='' className='me-4 text-reset'>
            <MDBIcon fab icon="linkedin" />
          </a>
          <a href='' className='me-4 text-reset'>
            <MDBIcon fab icon="github" />
          </a>
        </div>
      </section> */}
      </section>

      <section className=''>
        <MDBContainer className='text-center text-md-start mt-5'>
          <MDBRow className='mt-3'>
            <MDBCol md="3" lg="4" xl="3" className='mx-auto mb-4'>
              
                {/* <MDBIcon icon="gem" className="me-3" /> */}
                <img className='text-center' style={{height: 200, width:200,}} src={`${process.env.PUBLIC_URL}/logo.png`} alt="Logo" /> <br />
                <h6 className='text-uppercase fw-bold mb-4'>
                LitSoc IITGN
              </h6> 
              <p>
               The Language and Literature Club of IIT Gandhinagar
              </p>
            </MDBCol>

            <MDBCol md="2" lg="2" xl="2" className='mx-auto mb-4'>
                <h6 className='text-uppercase fw-bold mb-4'>Club Secretary</h6>
                <p>
                  <span href='#!' className='text-reset'>Anmol Kumar</span><br/>
                <Link className='text-dark' to={'tel:8409467165'}> +91 8409467165 </Link>
                </p>
                

                </MDBCol>

            
            <MDBCol md="4" lg="3" xl="3" className='mx-auto mb-md-0 mb-4'>
              <h6 className='text-uppercase fw-bold mb-4'>Contact</h6>
              <p>
                <MDBIcon icon="home" className="me-2" />
                IIT Gandhinagar, Palaj
              </p>
              <p>
                <MDBIcon icon="envelope" className="me-3" />
                <Link className='text-dark' to={'mailto:litsoc@iitgn.ac.in'}>litsoc[at]iitgn.ac.in</Link>
                
              </p>
              <p>
                <MDBIcon icon="phone" className="me-3" /><Link className='text-dark' to={'tel:8409467165'}> +91 8409467165 </Link>
              </p>
             
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </section>

      <div className='text-center p-4' style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}>
        © {new Date().getFullYear()}{' '}
        <a className='text-reset fw-bold' href='https://mdbootstrap.com/'>
         LitSoc Club | Cultural Council | IIT Gandhinagar
        </a>
      </div>
    </MDBFooter>
  );
}