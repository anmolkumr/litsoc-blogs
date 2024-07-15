import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MDBContainer, MDBRow, MDBCol, MDBBtn, MDBInput, MDBTextArea, MDBCardImage, MDBCard } from 'mdb-react-ui-kit';
import Navbar from './Navbar';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)

const UpdateProfile = () => {
  const { id } = useParams();
  const [image, setImage] = useState('');
  const [bio, setBio] = useState('Hey there! I am using LitSoc Blog.');
  const [instagram, setInstagram] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetch(`${process.env.REACT_APP_API}/users/${id}`)
        .then(response => response.json())
        .then(data => {
          setImage(data.image);
          setBio(data.bio);
          setInstagram(data.instagram);
          setWhatsapp(data.whatsapp);
        })
        .catch(error => console.error('Error fetching user data:', error));
    }
  }, [id]);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('image', file);

    // Example POST request to upload the image
    // fetch(`${process.env.REACT_APP_API}/upload-image`, {
    //   method: 'POST',
    //   body: formData,
    // })
    //   .then(response => response.json())
    //   .then(data => {
    //     setImage(data.url); // Assuming the response contains the image URL
    //   })
    //   .catch(error => {
    //     console.error('Error uploading image:', error);
    //   });

    fetch('https://api.imgbb.com/1/upload?key=986224ae6ff92821fe7351451654422d', {
      method: 'POST',

      body: formData,
    })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
        setImage(data.data.url);
      })
      .catch(error => {
        console.error('Error uploading image:', error);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      image,
      bio,
      instagram,
      whatsapp,
    };

    const url = `${process.env.REACT_APP_API}/users/${id}`;
    const method = 'PATCH';

    fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData),
    })
      .then(response => response.json())
      .then(data => {
        MySwal.fire({
          title: <p>Profile Updated</p>,
          icon: 'success',
          showConfirmButton: true,
          confirmButtonText: "Go to Dashboard",
        }).then((result) => {
          
          if (result.isConfirmed) {
            navigate('/dashboard');
          }
        })
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  return (
    <>
      <Navbar />
      <MDBContainer>
        <MDBRow>
          <MDBCard className='p-4 mt-5'>


            <MDBCol md="6" className="offset-md-3">
              <form onSubmit={handleSubmit}>
                <div className="mb-4 d-flex flex-column">
                  {image && <MDBCardImage className='img-fluid text-center rounded-circle' style={{width:'200px', height:'200px', margin:'auto'}} src={`${image}`} alt="Profile" />}<br />
                  <label className="form-label mt-3">Profile Image URL:</label>
                  <small className='fs-7'>(*We are storing images to external services)</small>
                  <div className="input-group mt-2">
                    <MDBInput
                      type="text"
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                    />
                    <input
                      type="file"
                      className="form-control"
                      onChange={handleImageUpload}
                      style={{ display: 'none' }}
                      id="fileInput"
                    />
                    <MDBBtn style={{width:'200px' }}
                      onClick={() => document.getElementById('fileInput').click()}
                    >
                      Upload
                    </MDBBtn>
                    
                  </div>
                </div>
                <div className="mb-4">
                  <MDBTextArea
                    label="Bio"
                    rows="4"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                  />
                </div>
                <div className="mb-4">
                  <MDBInput
                    label="Instagram"
                    type="text"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                  /><small>(Will be accessible from Author Profile Page)</small>
                </div>
                <div className="mb-4">
                  <MDBInput
                    label="WhatsApp"
                    type="text"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                  /><small>(Will be accessible from Author Profile Page)</small>
                </div>
                <MDBBtn type="submit" color="primary">
                  {id ? 'Update Info' : 'Create User'}
                </MDBBtn>
              </form>
            </MDBCol>
          </MDBCard>
        </MDBRow>
      </MDBContainer >
    </>
  );
};

export default UpdateProfile;
