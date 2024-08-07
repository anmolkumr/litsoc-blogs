import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { MDBContainer, MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBRow, MDBCol, MDBIcon, MDBBtn, MDBSpinner } from 'mdb-react-ui-kit';
import DOMPurify from 'dompurify';
import Navbar from './Navbar';
import Footer from './Footer';
import { RWebShare } from "react-web-share";
import { Link } from 'react-router-dom';
import { ShimmerPostDetails } from "react-shimmer-effects";

const SinglePost = () => {
    const { id } = useParams();
    const [blog, setBlog] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [recent, setRecent] = useState([]);

    useEffect(() => {
        // Fetch blog details
        axios.get(`${process.env.REACT_APP_API}/blogs/${id}`)
            .then(response => {
                console.log('Blog fetched successfully:', response.data);
                setBlog(response.data);
                document.title = response.data.title + " | " + response.data.added_by.name + " | LitSoc IITGN";
                var usersid = response.data.added_by._id;
                axios.get(`${process.env.REACT_APP_API}/blogs/user/${usersid}`, {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                })
                    .then(response => {
                        console.log('Fetched by Users successfully:', response.data);
                        setRecent(response.data);
                        setLoading(false); // Set loading to false once the data is fetched
                    })
                    .catch(error => {
                        console.error('There was an error fetching the comments data!', error);
                        setLoading(false); // Set loading to false even if there's an error
                    });
            })
            .catch(error => {
                console.error('There was an error fetching the blog data!', error);
                setLoading(false); // Set loading to false even if there's an error
            });

        axios.get(`${process.env.REACT_APP_API}/blogs/${id}/comments`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        })
            .then(response => {
                console.log('Comments fetched successfully:', response.data);
                setComments(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the comments data!', error);
            });
    }, [id]);

    const handleCommentSubmit = () => {
        if (newComment.trim() === '') return;

        axios.post(`${process.env.REACT_APP_API}/blogs/${id}/comments`, { content: newComment }, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        })
            .then(response => {
                setComments([...comments, response.data]);
                setNewComment('');
            })
            .catch(error => {
                console.error('There was an error submitting the comment!', error);
            });
    };

    const checkLogin = () => {
        if (!localStorage.getItem('token')) {
            alert('Please login to comment');
            document.getElementById('commentbox').disabled = true;
        }
    };

    const defaultImage = 'https://i.ibb.co/rfvhjWL/The-Lit-Soc-Blog.png';

    return (
        <>
            <Navbar />
            <MDBContainer className="mt-5">
                <MDBRow>
                    {loading ? (
                            <ShimmerPostDetails card cta variant="EDITOR" />
                    ) : (
                        <>
                            <img className='blog-hero'
                                src={blog.featured_img && blog.featured_img.trim() ? blog.featured_img : defaultImage}
                                alt="blog"
                            />
                            <div shadow='0' className='blog-author ms-2 mt-4'>
                                <span>Author : <Link to={`/author/${blog.added_by._id}`}>{blog.added_by.name}</Link>
                                </span><br></br>
                                <span>
                                    <MDBIcon far icon="calendar-alt" /> {
                                        new Date(blog.saved_at).toLocaleString('en-US', {
                                            hour12: true, hour: 'numeric', minute: 'numeric', year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                        })}

                                </span>
                                <br />
                                <RWebShare
                                    data={{
                                        text: "Hey! Check out this blog on LitSoc IITGN",
                                        url: window.location.href,
                                        title: document.title
                                    }}
                                    onClick={() => console.info("share successful!")}
                                >
                                    <MDBBtn color='tertiary' rippleColor='light'>
                                        <MDBIcon far icon="share-square" /> Share
                                    </MDBBtn>
                                </RWebShare>
                            </div>
                            <MDBCol md="9">
                                <MDBCard shadow='0' className='mt-4 bg-secondary bg-opacity-10' >
                                    <MDBCardBody>
                                        <MDBCardTitle className='poppins-medium'>{blog.title}</MDBCardTitle><br />
                                        <MDBCardText dangerouslySetInnerHTML={{ __html: blog.content }} />
                                    </MDBCardBody>
                                </MDBCard>
                            </MDBCol>
                            <MDBCol md="3">
                                <MDBCard shadow='0' className='mt-4 bg-secondary bg-opacity-10'>
                                    <p className='pt-4 text-center poppins-medium'>More From the Author</p>
                                    {recent.map((recent, index) => (
                                        <div key={index} className="mb-3">
                                            <Link to={`/post/${recent._id}`}>
                                                <MDBCardText className='text-center text-dark'>{recent.title}</MDBCardText>
                                            </Link>
                                        </div>
                                    ))}
                                </MDBCard>
                            </MDBCol>
                        </>
                    )}
                </MDBRow>
                <MDBContainer md="9" className="mt-5">
                    <h4>Comments</h4>
                    {comments.map((comment, index) => (
                        <MDBCard key={index} className="mb-3">
                            <MDBCardBody>
                                <MDBCardText>{comment.content}</MDBCardText>
                                <small className="text-muted">By {comment.added_by.name} on {new Date(comment.created_at).toLocaleString()}</small>
                            </MDBCardBody>
                        </MDBCard>
                    ))}
                    <MDBCard className="mt-3">
                        <MDBCardBody>
                            <MDBCardTitle>Add a Comment</MDBCardTitle>
                            <MDBCardText>
                                <textarea
                                    className="form-control"
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    rows="3"
                                    onClick={checkLogin}
                                    id='commentbox'
                                    placeholder="Write your comment here..."
                                />
                            </MDBCardText>
                            <MDBBtn onClick={handleCommentSubmit}>Submit</MDBBtn>
                        </MDBCardBody>
                    </MDBCard>
                </MDBContainer>
            </MDBContainer>
            <Footer />
        </>
    );
};

export default SinglePost;
