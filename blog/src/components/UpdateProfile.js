import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { MDBContainer, MDBRow, MDBCol, MDBBtn, MDBInput, MDBTextArea, MDBCardImage } from 'mdb-react-ui-kit';
import Navbar from './Navbar';

const UpdateProfile = () => {
  const { id } = useParams(); 
  const [image, setImage] = useState('');
  const [bio, setBio] = useState('Hey there! I am using LitSoc Blog.');
  const [instagram, setInstagram] = useState('');
  const [whatsapp, setWhatsapp] = useState('');

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
    fetch(`${process.env.REACT_APP_API}/upload-image`, {
      method: 'POST',
      body: formData,
    })
      .then(response => response.json())
      .then(data => {
        setImage(data.url); // Assuming the response contains the image URL
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

    const url =`${process.env.REACT_APP_API}/users/${id}`;
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
        console.log('Success:', data);
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
          <MDBCol md="6" className="offset-md-3">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
              {image && <MDBCardImage src={`${process.env.REACT_APP_API}/${image}`} alt="Profile" />}<br />
                <label className="form-label">Profile Image URL:</label>
                <div className="input-group">
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
                  <MDBBtn
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
                />
              </div>
              <div className="mb-4">
                <MDBInput
                  label="WhatsApp"
                  type="text"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                />
              </div>
              <MDBBtn type="submit" color="primary">
                {id ? 'Update Info' : 'Create User'}
              </MDBBtn>
            </form>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </>
  );
};

export default UpdateProfile;
