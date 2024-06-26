import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MDBContainer, MDBBtn, MDBCardTitle, MDBCardText, MDBListGroup, MDBListGroupItem, MDBIcon } from 'mdb-react-ui-kit';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

function Dashboard() {
    const { user, logout } = useAuth();
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await axios.get('http://localhost:4000/blogs', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setBlogs(response.data);
            } catch (error) {
                console.error('Error fetching blogs:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:4000/blogs/${id}`, {
                // headers: {
                //     'Authorization': `Bearer ${localStorage.getItem('token')}`
                // }
            });
            setBlogs(blogs.filter(blog => blog._id !== id));
        } catch (error) {
            console.error('Error deleting blog:', error);
        }
    };

    return (
        <MDBContainer className="my-5">
            <h2 className="mb-4">Dashboard</h2>
            <h5>Welcome, {user.name}</h5>
            <MDBBtn color="danger" onClick={logout} className="mb-3">Logout</MDBBtn>
            <MDBBtn tag={Link} to="/create-blog" color="success" className="mb-3">Create New Blog</MDBBtn>
            {loading ? (
                <p>Loading blogs...</p>
            ) : (
                <MDBListGroup>
                    {blogs.map((blog) => (
                        <MDBListGroupItem key={blog._id} className="d-flex justify-content-between align-items-center">
                            <div>
                                <MDBCardTitle>{blog.title}</MDBCardTitle>
                                <MDBCardText>{blog.content}</MDBCardText>
                            </div>
                            <div>
                                <MDBBtn tag={Link} to={`/update-blog/${blog._id}`} color="warning" className="mx-2">
                                    <MDBIcon fas icon="edit" />
                                </MDBBtn>
                                <MDBBtn color="danger" onClick={() => handleDelete(blog._id)}>
                                    <MDBIcon fas icon="trash" />
                                </MDBBtn>
                            </div>
                        </MDBListGroupItem>
                    ))}
                </MDBListGroup>
            )}
        </MDBContainer>
    );
}

export default Dashboard;
