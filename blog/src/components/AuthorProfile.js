import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams } from "react-router-dom";
import { MDBCard, MDBCardBody, MDBCardImage, MDBCardTitle, MDBCardText, MDBIcon, MDBBtn, MDBContainer, MDBRow, MDBCol, MDBSpinner } from 'mdb-react-ui-kit';
import Navbar from "./Navbar";

function AuthorProfile() {
    const { id } = useParams();
    const [author, setAuthor] = useState(null);
    const [poems, setPoems] = useState([]);
    const [loadingAuthor, setLoadingAuthor] = useState(true);
    const [loadingPoems, setLoadingPoems] = useState(true);

    useEffect(() => {
        // Fetch author details
        axios.get(`${process.env.REACT_APP_API}/users/${id}`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        })
            .then(response => {
                console.log(response.data);
                setAuthor(response.data);
                setLoadingAuthor(false);
            })
            .catch(error => {
                console.error('Error fetching author data:', error);
                setLoadingAuthor(false);
            });

        // Fetch poems by the author
        axios.get(`${process.env.REACT_APP_API}/blogs/user/${id}`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        })
            .then(response => {
                setPoems(response.data);
                setLoadingPoems(false);
            })
            .catch(error => {
                console.error('Error fetching poems data:', error);
                setLoadingPoems(false);
            });
    }, [id]);

    return (
        <>
            <Navbar />
            <div className="author-card-container">
                {loadingAuthor ? (
                    <div className="d-flex justify-content-center mt-5">
                        <MDBSpinner role="status" size="lg">
                            <span className="visually-hidden">Loading...</span>
                        </MDBSpinner>
                    </div>
                ) : (
                    author && (
                        <div className="filter">
                            <div background="transparent" className="author-card">
                                <div className="d-flex flex-column flex-xl-row">
                                    <MDBCardImage
                                        src={author.image ? `${author.image}` : 'https://i.ibb.co/FzKQpb2/Lit-Soc-logo-modified.png'}
                                        alt="Author"
                                        className="author-image"
                                    />

                                    <MDBCardBody className="author-info sahitya-regular">
                                        <MDBCardTitle className="author-name">{author.name}</MDBCardTitle>
                                        <div className="author-details">
                                            <MDBCardText className="author-description">
                                                {author.bio}
                                            </MDBCardText>
                                            <div className="author-social-icons">
                                                <Link to={author.instagram}>
                                                    <MDBIcon fab icon="instagram" className="text-white" />
                                                </Link>
                                                <Link to={author.whatsapp}>
                                                    <MDBIcon fab icon="whatsapp" className="text-white" />
                                                </Link>
                                            </div>
                                        </div>
                                    </MDBCardBody>
                                </div>
                            </div>
                        </div>
                    )
                )}
            </div>
            <MDBContainer>
                <MDBRow>
                    <MDBCol sm='12' md='9'>
                        <div className="poem-list-container">
                            <h3 className="mt-5 roboto-regular">Blogs</h3>
                            {loadingPoems ? (
                                <div className="d-flex justify-content-center mt-5">
                                    <MDBSpinner role="status" size="lg">
                                        <span className="visually-hidden">Loading...</span>
                                    </MDBSpinner>
                                </div>
                            ) : (
                                poems.map((poem, index) => (
                                    <div className="poem-item" key={index}>
                                        <MDBIcon fas icon="angle-right" className="poem-icon" />
                                        <div className="poem-text">
                                            <Link to={`/post/${poem._id}`}>
                                                <h5 className="poem-title roboto-regular text-dark">{poem.title}</h5>
                                            </Link>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </MDBCol>
                    <MDBCol sm='12' md='3'>
                        <div className="poem-list-container">
                            <h3 className="mt-5 roboto-regular">Popular Posts</h3>
                            {/* Add content for popular posts here */}
                        </div>
                    </MDBCol>
                </MDBRow>
            </MDBContainer>
        </>
    );
}

export default AuthorProfile;
