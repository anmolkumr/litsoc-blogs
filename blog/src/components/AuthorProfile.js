import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams } from "react-router-dom";
import { MDBCard, MDBCardBody, MDBCardImage, MDBCardTitle, MDBCardText, MDBIcon, MDBBtn, MDBContainer, MDBRow, MDBCol } from 'mdb-react-ui-kit';
import Navbar from "./Navbar";


function AuthorProfile() {
    const { id } = useParams();
    const [author, setAuthor] = useState(null);
    const [poems, setPoems] = useState([]);

    useEffect(() => {
        // Fetch author details
        axios.get(`${process.env.REACT_APP_API}/users/${id}`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        })
            .then(response => {
                console.log(response.data);
                setAuthor(response.data);
            })
            .catch(error => {
                console.error('Error fetching author data:', error);
            });

        // Fetch poems by the author
        axios.get(`${process.env.REACT_APP_API}/blogs/user/${id}`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        })
            .then(response => {
                setPoems(response.data);
            })
            .catch(error => {
                console.error('Error fetching poems data:', error);
            });
    }, [id]);

    return (
        <>
            <Navbar />
            <div className="author-card-container">
            {author && (
                <div className="filter">
                    <div background="transparent" className="author-card">
                        <div className="d-flex flex-column flex-xl-row">
                            <MDBCardImage
                                src={author.name}
                                alt="Author"
                                className="author-image"
                            />

                            <MDBCardBody className="author-info sahitya-regular">
                                <MDBCardTitle className="author-name ">{author.name}</MDBCardTitle>
                                <div className="author-details">
                                    <MDBCardText className="author-description">
                                        {author.description}
                                    </MDBCardText>
                                </div>
                            </MDBCardBody>
                        </div>
                    </div>
                </div>
            )}
        </div>
            <MDBContainer>
                <MDBRow>
                    <MDBCol sm='12' md='9'>
                        <div className="poem-list-container">
                            <h3 className="mt-5 roboto-regular">Blogs</h3>
                            {poems.map((poem, index) => (
                                <div className="poem-item" key={index}>
                                    <MDBIcon fas icon="angle-right" className="poem-icon" />
                                    <div className="poem-text">
                                        <h5 className="poem-title roboto-regular">{poem.title}</h5>
                                        <p className="poem-description roboto-regular mt-1">{poem.description}</p>
                                    </div>

                                </div>
                            ))}
                        </div>
                    </MDBCol>
                    <MDBCol sm='12' md='3' >
                        <div className="poem-list-container">
                            <h3 className="mt-5 roboto-regular">Popular Posts</h3>
                        </div>


                    </MDBCol>
                </MDBRow>
            </MDBContainer>

        </>

    );
}
export default AuthorProfile;