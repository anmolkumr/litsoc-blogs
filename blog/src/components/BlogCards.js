import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MDBCard, MDBCardBody, MDBCardImage, MDBCardTitle, MDBCardText, MDBCol, MDBRow, MDBCardFooter, MDBBtn } from 'mdb-react-ui-kit';
import { Link } from 'react-router-dom';
const he = require('he');

const BlogCards = () => {
    const [blogs, setBlogs] = useState([]);
    const defaultImage = 'https://via.placeholder.com/150';
    useEffect(() => {
        axios.get('http://localhost:4000/blogs') // Replace with your API endpoint
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

    return (
        <MDBRow className="row-cols-1 row-cols-md-3 g-4 mt-3">
            {blogs.map((blog) => (
                <MDBCol key={blog.id}>
                    <MDBCard shadow='0' border='secondary' >
                        <MDBCardImage height={250}
                            src={blog.featured_img && blog.featured_img.trim() ? blog.featured_img : defaultImage}
                            alt="Card image"
                            style={{ objectFit: 'cover' }}
                            position="top"
                        />
                        <MDBCardBody>
                            <MDBCardTitle className='poppins-regular'>{blog.title}</MDBCardTitle>
                            <MDBCardText className='dm-regular'>
                                {blog.content.length > 100 ? blog.content.substring(0, 100) + '...' : blog.content}
                            </MDBCardText>
                            <Link to={`/post/${blog._id}`}>
                                <MDBBtn outline rounded className='mt-4 dm-regular'>
                                    Read More
                                </MDBBtn>
                            </Link>
                        </MDBCardBody>
                        <MDBCardFooter  className='dm-regular'>
                            <small className="text-muted">Last updated {new Date(blog.saved_at).toLocaleString()}</small><br />
                            <small className="text-muted">
                                Author: <b>
                                {blog.added_by}</b></small>
                        </MDBCardFooter>
                    </MDBCard>
                </MDBCol>
            ))}
        </MDBRow>
    );
}


export default BlogCards;
