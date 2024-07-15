import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MDBCard, MDBCardBody, MDBCardImage, MDBCardTitle, MDBCardText, MDBCol, MDBRow, MDBCardFooter, MDBBtn, MDBSpinner } from 'mdb-react-ui-kit';
import { Link } from 'react-router-dom';
const he = require('he');

const BlogCards = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const defaultImage = 'https://i.ibb.co/rfvhjWL/The-Lit-Soc-Blog.png';

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API}/blogs`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }) // Replace with your API endpoint
            .then(response => {
                setBlogs(response.data);
                setLoading(false); // Set loading to false after data is loaded
            })
            .catch(error => {
                console.error('There was an error fetching the blog data!', error);
                setLoading(false); // Set loading to false even if there's an error
            });
    }, []);

    const regex = /(<([^>]+)>)/gi;
    blogs.forEach((blog) => {
        blog.content = blog.content.replace(regex, '');
        blog.content = he.decode(blog.content);
    });

    const publishedBlogs = blogs.filter(blog => blog.status === 'published').sort((a, b) => new Date(b.saved_at) - new Date(a.saved_at));;

    if (loading) {
        return (
            <div className="d-flex justify-content-center mt-5">
                <MDBSpinner role="status" size="lg">
                    <span className="visually-hidden">Loading...</span>
                </MDBSpinner>
            </div>
        );
    }

    return (
        <MDBRow className="row-cols-1 row-cols-md-3 g-4 mt-3">
            {publishedBlogs.map((blog) => (
                <MDBCol key={blog.id}>
                    <MDBCard shadow='0' rounded='0' style={{ border: '1px solid #ddd' }} >
                        <Link to={`/post/${blog._id}`}>
                            <MDBCardImage height={250}
                                src={blog.featured_img && blog.featured_img.trim() ? blog.featured_img : defaultImage}
                                alt="Card image"
                                style={{ objectFit: 'cover' }}
                                position="top"
                            />
                        </Link>
                        <MDBCardBody>
                            <Link to={`/post/${blog._id}`}>
                                <MDBCardTitle className='sahitya-bold text-dark'>{blog.title}</MDBCardTitle>
                            </Link>
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
                        <MDBCardFooter className='literata-regular'>
                            <small className="text-muted">Last updated &nbsp;  
                                {new Date(blog.saved_at).toLocaleString('en-US', {
                                    hour12: true, hour: 'numeric', minute: 'numeric', year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                })}</small><br />
                            <small className="text-muted">
                               
                                Author:  <Link to={`/author/${blog.added_by._id}`}>
                                <b className='text-muted'>{blog.added_by.name}</b>
                                </Link>
                            </small>
                        </MDBCardFooter>
                    </MDBCard>
                </MDBCol>
            ))}
        </MDBRow>
    );
}

export default BlogCards;
