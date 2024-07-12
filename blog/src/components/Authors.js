import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardTitle, MDBCardText, MDBCardBody, MDBCardImage, MDBBtn
} from 'mdb-react-ui-kit';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';

const Authors = () => {
    const [authors, setAuthors] = useState([]);
    const defaultImage = 'https://via.placeholder.com/150';

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API}/authors`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }) // Replace with your API endpoint
            .then(response => {
                setAuthors(response.data);
                console.log(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the blog data!', error);
            });
    }, []);

    return (
        <>
        <Navbar/>
            <div className="">
                <h3 className="text-center mt-5">Authors</h3>
                {authors.map(author => (
                    <div key={authors._id}>
                        <MDBContainer>
                            <MDBRow className="justify-content-center">
                                <MDBCol md="9" lg="7" xl="5" className="mt-5">
                                    <MDBCard style={{ borderRadius: '15px' }}>
                                        <MDBCardBody className="p-4">
                                            <div className="d-flex text-black">
                                                <div className="flex-shrink-0">

                                                    <MDBCardImage src={author.profileImage || defaultImage}
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
                            </MDBRow>
                        </MDBContainer>
                    </div>))}
            </div>
        </>
    );
}

export default Authors;
