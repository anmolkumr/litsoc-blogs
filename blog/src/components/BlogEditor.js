import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { MDBContainer, MDBInput, MDBBtn } from 'mdb-react-ui-kit';
import axios from 'axios';

function BlogEditor({ existingBlog }) {

    const [title, setTitle] = useState(existingBlog ? existingBlog.title : '');
    const [content, setContent] = useState(existingBlog ? existingBlog.content : '');
    const [featuredImage, setFeaturedImage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const userId = localStorage.getItem('userId');

    useEffect(() => {
      if (existingBlog && existingBlog.featured_img) {
        setFeaturedImage(existingBlog.featured_img);
      }
    }, [existingBlog]);

    const handleSave = async () => {

      setIsLoading(true);
      const blogData = {
        title,
        content,
        added_by: userId,
        featured_img: featuredImage
      };
  
    
      try {
        if (existingBlog) {
          await axios.patch(`http://localhost:4000/blogs/${existingBlog._id}`, blogData, {
         
          });
        } else {
          // new blog code
          await axios.post('http://localhost:4000/blogs', blogData, {
            // headers: {
            //   'Authorization': `Bearer ${localStorage.getItem('token')}`,
            //   'Content-Type': 'multipart/form-data'
            // }
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
            ['link', 'image', 'video'],
            ['clean']
        ],
    };

    const formats = [
        'header', 'font', 'size',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image', 'video'
    ];



    return (
      <MDBContainer className="my-5">
      <h2>{existingBlog ? 'Update Blog' : 'Create Blog'}</h2>
      <MDBInput label="Title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="mb-3" />
      <MDBInput type="file" accept="image/*" onChange={handleImageChange} className="mb-3" />
      <ReactQuill
        value={content}
        onChange={setContent}
        modules={modules}
        formats={formats}
        className="mb-3"
      />
      <MDBBtn color="primary" onClick={handleSave} disabled={isLoading}>
        {isLoading ? 'Saving...' : 'Save'}
      </MDBBtn>
    </MDBContainer>
    );
}

export default BlogEditor;
