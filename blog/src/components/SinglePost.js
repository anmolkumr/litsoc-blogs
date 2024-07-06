import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { MDBContainer, MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBCardImage, MDBRow, MDBCol } from 'mdb-react-ui-kit';
import DOMPurify from 'dompurify';
import Navbar from './Navbar';
import Footer from './Footer';
import { FacebookSelector } from '@charkour/react-reactions';



const SinglePost = () => {
    const { id } = useParams();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API}/blogs/${id}`)
            .then(response => {
                console.log('Blog fetched successfully:', response.data);
                setBlog(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the blog data!', error);
            });
    }, [id]);

    const defaultImage = 'https://via.placeholder.com/150';
    // const sanitizedContent = DOMPurify.sanitize(blog.content);

    if (!blog) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <Navbar />
            <MDBContainer className="mt-5">
                <MDBRow>
                    <img className='img-fluid'
                        src={blog.featured_img && blog.featured_img.trim() ? blog.featured_img : defaultImage}
                        alt="blog" style={{ height: '300px', width: '100%', objectFit: 'cover' }}
                    />
                    <MDBCol md="9">
                        <MDBCard shadow='0' className='mt-4 bg-secondary bg-opacity-10' >
                            <MDBCardBody>

                                <MDBCardTitle className='poppins-medium'>{blog.title}</MDBCardTitle><br />
                                <MDBCardText dangerouslySetInnerHTML={{ __html: blog.content }}>

                                </MDBCardText>
                            </MDBCardBody>
                        </MDBCard>
                    </MDBCol>
                    <MDBCol md="3">
                        <MDBCard  shadow='0' className='mt-4 bg-secondary bg-opacity-10'>
                            <MDBCardBody>
                                <MDBCardText>Author: {blog.added_by}</MDBCardText>
                                <MDBCardText>
                                    Last updated: {
                                        new Date(blog.saved_at).toLocaleString('en-US', { hour12: true, hour: 'numeric', minute: 'numeric' })}

                                </MDBCardText>
                            </MDBCardBody>
                        </MDBCard>
                    </MDBCol>

                </MDBRow>
                <MDBContainer md="9" className="mt-5">
                    <h4>Reactions</h4>
                    <p>Click on the emojis to react to this post</p>

                    <FacebookSelector />
                </MDBContainer>
            </MDBContainer>
            <Footer />
        </>
    );
};

export default SinglePost;
