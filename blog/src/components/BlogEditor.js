import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { MDBContainer, MDBInput, MDBBtn, MDBInputGroup, MDBIcon, MDBCardText } from 'mdb-react-ui-kit';
import axios from 'axios';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';


import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)

function BlogEditor({ existingBlog }) {

  const [title, setTitle] = useState(existingBlog ? existingBlog.title : '');
  const [content, setContent] = useState(existingBlog ? existingBlog.content : '');
  const [featuredImage, setFeaturedImage] = useState(existingBlog ? existingBlog.featured_img : '');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const userId = localStorage.getItem('username');
  // console.log("User from local" + userId);

  useEffect(() => {
    if (existingBlog && existingBlog.featured_img) {
      setFeaturedImage(existingBlog.featured_img);
    }
  }, [existingBlog]);

  const handleSave = async () => {

    //check if title and content are empty
    if (!title || !content) {
      Swal.fire({
        title: "Empty Fields",
        text: "Please fill in the title and content fields",
        icon: "error"
      })};
      

    setIsLoading(true);
    const blogData = {
      title,
      content,
      featured_img: featuredImage
    };


    try {
      if (existingBlog) {
        await axios.patch(`${process.env.REACT_APP_API}/blogs/${existingBlog._id}`, blogData, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        Swal.fire({
          title: "Blog Updated",
          text: "Please go to the dashboard!",
          icon: "success"
        });
      } else {
        // new blog code
        await axios.post(`${process.env.REACT_APP_API}/blogs`, blogData, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          }
        });
        Swal.fire({
          title: "Draft Saved",
          text: "Do you want to go to the dashboard?",
          showDenyButton: false,
          icon: "success",
          showCancelButton: true,
          confirmButtonText: "Yes, go to dashboard",
          denyButtonText: `Stay here`,
        }).then((result) => {
          if (result.isConfirmed) {
            navigate('/dashboard');
          }
        });
      }
      console.log('Blog saved successfully');
    } catch (error) {
      console.error('Error saving blog:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFeaturedImage(e.target.files[0]);
    }
  };

  const modules = {
    toolbar: [
      [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
      [{ size: [] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' },
      { 'indent': '-1' }, { 'indent': '+1' }],
      ['link', 'image'],
      ['clean']
    ],
  };

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'video'
  ];

  function uploadImage() {

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.click();
    input.addEventListener('change', function () {
      const file = input.files[0];
      if (!file) return;


      if (!file) {
        alert('Please select an image');
        return;
      }

      const progressBar = document.querySelector('.progress');
      const progressBarText = progressBar.querySelector('.progress-bar');

      const formData = new FormData();
      formData.append('image', file);

      axios.post('https://api.imgbb.com/1/upload?key=986224ae6ff92821fe7351451654422d', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: function (progressEvent) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          progressBar.style.display = 'none';
          progressBarText.style.width = progress + '%';
          progressBarText.textContent = progress + '%';
        }
      })
        .then(response => {
          const imageUrl = response.data.data.url;
          const outputDiv = document.getElementById('eventPosterUrlInput');
          outputDiv.value = imageUrl;
          setFeaturedImage(imageUrl);
        })
        .catch(error => {
          console.error('Error uploading image:', error);
          const outputDiv = document.getElementById('eventPosterUrlInput');
          outputDiv.value = `
                        Error uploading image. Please try again.
                  
                `;
        });
    });
  }



  return (
    <>
      <Navbar />
      <MDBContainer className="my-5">
        <h4>{existingBlog ? 'Update Blog' : 'New Blog'}</h4><br/>
        
        <MDBInput size='lg' label="Title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="mb-3" /><br/>

        <span>Upload Featured Image</span>
        <MDBInputGroup className="mb-3 mt-3">
          <MDBBtn color="primary" style={{minWidth:'200px' }} onClick={uploadImage} id="uploadImageButton"><MDBIcon fas icon='upload'></MDBIcon> Upload Image</MDBBtn>
          <MDBInput type="text" size='lg' disabled id="eventPosterUrlInput" value={featuredImage} onChange={(e) => setFeaturedImage(e.target.value)} />
        </MDBInputGroup>
        <div class="progress mt-3" style={{ display: 'none' }}>
          <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar"
            style={{ width: "0%" }} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">0%</div>
        </div>
        <br />
        {/* <div class="input-group">
        <input type="url" class="form-control"  required>
                    <button type="button" class="btn btn-primary" onclick="uploadImage()" id="uploadImageButton">Upload
                    Image</button>
                  </div> */}
        <span>Blog Content</span>
        <ReactQuill
          value={content}
          onChange={setContent}
          modules={modules}
          formats={formats}
          className="mb-3"
          placeholder='Write your amazing content here...'
          style={{ height: '200px' }}
        />
        <br/>
        <MDBBtn color="primary" onClick={handleSave} disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save'}
        </MDBBtn>
      </MDBContainer>
    </>
  );
}

export default BlogEditor;
