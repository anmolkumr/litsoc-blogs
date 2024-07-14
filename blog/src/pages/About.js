import React from 'react';
import { MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBCardImage, MDBIcon } from 'mdb-react-ui-kit';
import Navbar from '../components/Navbar';

const About = () => {
    const members = [
        { name: 'Anmol Kumar', position: 'Secretary', image: 'https://via.placeholder.com/150', bio: 'A brief bio about Anmol Kumar.' },
        // Add more members as needed
    ];

    return (
        <>
            <Navbar />
            <MDBContainer className="mt-5 mb-5">
                <MDBRow className="mb-5">
                    <MDBCol md="12">
                        <h2 className="text-center mb-4">About LitSoc</h2>
                        <MDBCard>
                            <MDBCardBody>
                                <MDBCardTitle>Welcome to LitSoc IITGN</MDBCardTitle>
                                <MDBCardText>
                                    The Literary Society (LitSoc) of IIT Gandhinagar is a vibrant community dedicated to fostering a love for literature and creative expression. Our society organizes various events such as writing competitions, book reviews, and extempore competitions to encourage students to explore their literary talents.
                                </MDBCardText>
                                <MDBCardText>
                                    <strong>Objectives:</strong>
                                    <ul>
                                        <li>Promote the appreciation of literature among students.</li>
                                        <li>Encourage creative writing and critical thinking.</li>
                                        <li>Provide a platform for students to showcase their literary skills.</li>
                                        <li>Organize engaging literary events and activities.</li>
                                    </ul>
                                </MDBCardText>
                            </MDBCardBody>
                        </MDBCard>
                    </MDBCol>
                </MDBRow>

                <MDBRow className="mb-5">
                    <MDBCol md="12">
                        <h2 className="text-center mb-4">Our Team</h2>
                        <MDBRow>
                            {members.map((member, index) => (
                                <MDBCol md="4" key={index} className="mb-4">
                                    <MDBCard>
                                        <MDBCardImage src={member.image} alt={member.name} position="top" />
                                        <MDBCardBody>
                                            <MDBCardTitle>{member.name}</MDBCardTitle>
                                            <MDBCardText>
                                                <strong>{member.position}</strong>
                                            </MDBCardText>
                                            <MDBCardText>{member.bio}</MDBCardText>
                                        </MDBCardBody>
                                    </MDBCard>
                                </MDBCol>
                            ))}
                        </MDBRow>
                    </MDBCol>
                </MDBRow>
            </MDBContainer>
        </>
    );
};

export default About;
