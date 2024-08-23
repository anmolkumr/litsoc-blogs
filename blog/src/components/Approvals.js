import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { MDBBtn, MDBIcon, MDBTable, MDBTableBody, MDBTableHead, MDBTooltip } from "mdb-react-ui-kit";
import { Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

function Approvals() {

    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API}/approval/blogs`, {
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

    const handleStatus = async (id) => {
        try {
            await axios.patch(`${process.env.REACT_APP_API}/blogs/${id}`, {
                club_secy_approval: true,
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
                    blog.club_secy_approval = 'true';
                }
                return blog;
            }));
        } catch (error) {
            console.error('Error updating status:', error);
        }
    }
    //re_91tV953D_9kuxJ6MCsSK3o5VXEb3LXVa5
    return (
        <>
            <Navbar />
            <div className="container">
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


                                    {blog.club_secy_approval === "true" ? (
                                        <><MDBTooltip tag='span' wrapperClass='d-inline-block' title='Already Approved!!'>
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



                                </td>
                            </tr>
                        ))}
                    </MDBTableBody>
                </MDBTable>

            </div>

        </>
    );
}
export default Approvals;