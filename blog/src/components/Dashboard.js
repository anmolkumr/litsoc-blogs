import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MDBContainer, MDBBtn, MDBCardTitle, MDBCardText, MDBListGroup, MDBListGroupItem, MDBIcon, MDBTable, MDBTableHead, MDBTableBody, MDBBtnGroup, MDBTooltip, MDBSpinner } from 'mdb-react-ui-kit';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Navbar from './Navbar';
import cookie from 'react-cookies';
import { jwtDecode } from "jwt-decode";

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)

function Dashboard() {
    const { user, logout } = useAuth();
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token');
    if (token) {

        const decoded = jwtDecode(token);
        console.log(decoded);
        var name = decoded.name;
        var uid = decoded._id;

    }

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API}/admin/blogs`, {
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
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {

                try {
                    axios.delete(`${process.env.REACT_APP_API}/blogs/${id}`, {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                    });
                    Swal.fire({
                        title: "Deleted!",
                        text: "It has been deleted.",
                        icon: "success"
                    });
                    setBlogs(blogs.filter(blog => blog._id !== id));
                } catch (error) {
                    console.error('Error deleting blog:', error);
                }


            }
        });

    };
    const regex = /(<([^>]+)>)/gi;
    blogs.forEach((blog) => {
        blog.content = blog.content.replace(regex, '');
    });

    const handleStatus = async (id) => {
        try {
            await axios.patch(`${process.env.REACT_APP_API}/blogs/${id}`, {
                status: 'published'
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            }
            );
            Swal.fire({
                title: "Yayy!!",
                text: "Your Blog has been Published!",
                icon: "success"
            });

            setBlogs(blogs.map(blog => {
                if (blog._id === id) {
                    blog.status = 'published';
                }
                return blog;
            }));
        } catch (error) {
            console.error('Error updating status:', error);
        }
    }

    return (
        <>
            <Navbar />
            <MDBContainer className="my-3">
                <h2 className="mb-4">Dashboard</h2>
                <h5>Welcome {name}</h5>
            <MDBBtn tag={Link} to={`update/${uid}`}color="primary" className="mb-3 me-1"><MDBIcon fas icon="pencil" /> Edit Profile</MDBBtn>
                <MDBBtn tag={Link} to="/create-blog" color="success" className="mb-3 me-1"><MDBIcon fas icon="plus" /> Create New Blog</MDBBtn>
                <MDBBtn color="danger" onClick={logout} className="mb-3 me-1">Logout</MDBBtn>

                {loading ? (
                    <>
                        <div className="text-center m-5">
                            <MDBSpinner role='status' className='text-center'>
                                <span className='visually-hidden'>Loading...</span>
                            </MDBSpinner>
                        </div>
                    </>
                ) : (
                    <MDBTable responsive>
                        <MDBTableHead>
                            <tr className='text-center'>
                                <th>Title</th>
                                <th>Content</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </MDBTableHead>
                        <MDBTableBody>
                            {blogs.map((blog) => (
                                <tr key={blog._id}>
                                    <td width={100}>
                                        {blog.title}
                                    </td>
                                    <td width={600}>
                                        {blog.content.length > 100 ? blog.content.substring(0, 100) + '...' : blog.content}
                                    </td>
                                    <td width={200}>
                                        {blog.status}
                                    </td>
                                    <td className='text-center'>


                                        {blog.status === "published" ? (
                                            <><MDBTooltip tag='span' wrapperClass='d-inline-block' title='Already Published!!'>
                                                <MDBBtn color="info" disabled className="mx-2 mb-1">
                                                    <MDBIcon fas icon="check" />
                                                </MDBBtn>
                                            </MDBTooltip>

                                            </>
                                        ) : (
                                            <>
                                                <MDBTooltip tag='span' wrapperClass='d-inline-block' title='Publish Now'>

                                                    <MDBBtn onClick={() => handleStatus(blog._id)} color="info" className="mx-2 mb-1">
                                                        <MDBIcon fas icon="check" />
                                                    </MDBBtn>
                                                </MDBTooltip>

                                            </>
                                        )
                                        }


                                        <MDBBtn tag={Link} to={`/update-blog/${blog._id}`} color="warning" className="mx-2 mb-1">
                                            <MDBIcon fas icon="edit" />
                                        </MDBBtn>

                                        <MDBBtn tag={Link} to={`/post/${blog._id}`} color="primary" className="mx-2 mb-1">
                                            <MDBIcon fas icon="eye" />
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
            </MDBContainer >

        </>
    );
}

export default Dashboard;
