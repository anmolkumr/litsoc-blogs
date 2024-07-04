import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MDBContainer, MDBBtn, MDBCardTitle, MDBCardText, MDBListGroup, MDBListGroupItem, MDBIcon, MDBTable, MDBTableHead, MDBTableBody, MDBBtnGroup } from 'mdb-react-ui-kit';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Navbar from './Navbar';
import cookie from 'react-cookies';
import { jwtDecode } from "jwt-decode";


function Dashboard() {
    const { user, logout } = useAuth();
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const name = localStorage.getItem('username');
    const token = cookie.load('token');
    if(token){
        const decoded = jwtDecode(token);
        console.log(decoded);
        var userid = decoded._id;
    }

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await axios.get(`https://litsoc-blogs.vercel.app/blogs`, {
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
            await axios.delete(`https://litsoc-blogs.vercel.app/blogs/${id}`, {
                // headers: {
                //     'Authorization': `Bearer ${localStorage.getItem('token')}`
                // }
            });
            setBlogs(blogs.filter(blog => blog._id !== id));
        } catch (error) {
            console.error('Error deleting blog:', error);
        }
    };
    const regex = /(<([^>]+)>)/gi;
    blogs.forEach((blog) => {
        blog.content = blog.content.replace(regex, '');
    });

    return (
        <>
      <Navbar />
<MDBContainer className="my-3">
    <h2 className="mb-4">Dashboard</h2>
    <h5>Welcome {name}</h5>
    <MDBBtn tag={Link} to="/create-blog" color="success" className="mb-3 me-1"><MDBIcon fas icon="plus" /> Create New Blog</MDBBtn>
    <MDBBtn color="danger" onClick={logout} className="mb-3 me-1">Logout</MDBBtn>
    
    {loading ? (
        <p>Loading blogs...</p>
    ) : (
        <MDBTable responsive>
            <MDBTableHead>
                <tr className='text-center'>
                    <th>Title</th>
                    <th>Content</th>
                    <th>Actions</th>
                </tr>
            </MDBTableHead>
            <MDBTableBody>
                {blogs.map((blog) => (
                    <tr key={blog._id}>
                        <td>
                          {blog.title}
                        </td>
                        <td>
                        {blog.content.length > 100 ? blog.content.substring(0, 100) + '...' : blog.content}
                        </td>
                        <td>
                        <MDBBtn tag={Link} to={`/post/${blog._id}`} color="info" className="mx-2">
                            Send for Approval
                            </MDBBtn>
                            <MDBBtn tag={Link} to={`/update-blog/${blog._id}`} color="warning" className="mx-2">
                                <MDBIcon fas icon="edit" />
                            </MDBBtn>
                            <MDBBtn color="danger" onClick={() => handleDelete(blog._id)}>
                                <MDBIcon fas icon="trash" />
                            </MDBBtn>
                            
                        </td>
                    </tr>
                ))}
            </MDBTableBody>
        </MDBTable>
    )}
</MDBContainer>

                </>
    );
}

export default Dashboard;
