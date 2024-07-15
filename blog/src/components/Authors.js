import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardTitle, MDBCardText, MDBCardBody, MDBCardImage, MDBBtn, MDBSpinner
} from 'mdb-react-ui-kit';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';

const Authors = () => {
    const [authors, setAuthors] = useState([]);
    const [loading, setLoading] = useState(true);
    const defaultImage = 'https://i.ibb.co/FzKQpb2/Lit-Soc-logo-modified.png';

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API}/authors`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }) // Replace with your API endpoint
            .then(response => {
                setAuthors(response.data);
                setLoading(false); // Set loading to false after data is loaded
                console.log(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the blog data!', error);
                setLoading(false); // Set loading to false even if there's an error
            });
    }, []);

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
        <>
            <Navbar />
            <div className="">
                <h3 className="text-center mt-5">Authors</h3>
                <MDBContainer>
                    <MDBRow className="row-cols-1 row-cols-sm-1 row-cols-md-2 row-cols-lg-3 g-4 mt-3 justify-content-center">
                        {authors.map(author => (
                            <MDBCol key={author._id}>
                                <MDBCard style={{ borderRadius: '15px' }}>
                                    <MDBCardBody className="p-4">
                                        <div className="d-flex text-black">
                                            <div className="flex-shrink-0">
                                                <MDBCardImage src={author.image ? `${author.image}` : 'https://i.ibb.co/FzKQpb2/Lit-Soc-logo-modified.png'}
                                                    alt="Author"
                                                    style={{ width: '150px', objectFit: 'cover' }} fluid />
                                            </div>
                                            <div className="flex-grow-1 ms-3">
                                                <MDBCardTitle>{author.name}</MDBCardTitle>
                                                <MDBCardText>
                                                    {author.bio ? author.bio : 'No bio available.'}
                                                </MDBCardText>
                                                <div className="d-flex pt-1">
                                                    <Link to={`/author/${author._id}`}>
                                                        <MDBBtn className="flex-grow-1">Visit Profile</MDBBtn>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </MDBCardBody>
                                </MDBCard>
                            </MDBCol>
                        ))}
                    </MDBRow>
                </MDBContainer>
            </div>
        </>
    );
}

export default Authors;
