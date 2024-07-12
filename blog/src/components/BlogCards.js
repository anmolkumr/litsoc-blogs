import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MDBCard, MDBCardBody, MDBCardImage, MDBCardTitle, MDBCardText, MDBCol, MDBRow, MDBCardFooter, MDBBtn } from 'mdb-react-ui-kit';
import { Link } from 'react-router-dom';
const he = require('he');

const BlogCards = () => {
    const [blogs, setBlogs] = useState([]);
    const defaultImage = 'https://via.placeholder.com/150';
    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API}/blogs`,{
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` 
        } 
        }) // Replace with your API endpoint
            .then(response => {
                setBlogs(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the blog data!', error);
            });
    }, []);
    const regex = /(<([^>]+)>)/gi ;
    blogs.forEach((blog) => {
        blog.content = blog.content.replace(regex, '');
        blog.content = he.decode(blog.content);
    });

    const publishedBlogs = blogs.filter(blog => blog.status === 'published');

    return (
        <MDBRow className="row-cols-1 row-cols-md-3 g-4 mt-3">
            {publishedBlogs.map((blog) => (
                <MDBCol key={blog.id}>
                    <MDBCard shadow='0' rounded='0' style={{border:'1px solid #ddd'}} >
                        <MDBCardImage height={250}
                            src={blog.featured_img && blog.featured_img.trim() ? blog.featured_img : defaultImage}
                            alt="Card image"
                            style={{ objectFit: 'cover' }}
                            position="top"
                        />
                        <MDBCardBody>
                            <MDBCardTitle  className='sahitya-bold'>{blog.title}</MDBCardTitle>
                            <MDBCardText className='literata-regular'>
                                {blog.content.length > 100 ? blog.content.substring(0, 100) + '...' : blog.content}
                            </MDBCardText>
                            <Link to={`/post/${blog._id}`}>
                                <MDBBtn outline rounded className='mt-4 literata-regular'>
                                   <span className='literata-regular text-capitalize'>
                                    Read More
                                    </span> 
                                </MDBBtn>
                            </Link>
                        </MDBCardBody>
                        <MDBCardFooter  className='literata-regular'>
                            <small className="text-muted">Last updated {new Date(blog.saved_at).toLocaleString()}</small><br />
                            <small className="text-muted">
                                Author: <b>
                                {blog.added_by.name}</b></small>
                        </MDBCardFooter>
                    </MDBCard>
                </MDBCol>
            ))}
        </MDBRow>
    );
}


export default BlogCards;
