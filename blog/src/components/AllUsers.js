import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { MDBBtn, MDBIcon, MDBTable, MDBTableBody, MDBTableHead, MDBTooltip } from "mdb-react-ui-kit";
import { Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

function AllUsers() {

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    var count = 1;

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API}/users`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
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
                    axios.delete(`${process.env.REACT_APP_API}/users/${id}`, {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                    });
                    Swal.fire({
                        title: "Deleted!",
                        text: "It has been deleted.",
                        icon: "success"
                    });
                    setUsers(users.filter(user => user._id !== id));
                } catch (error) {
                    console.error('Error deleting blog:', error);
                }


            }
        });

    };


    return (
        <>
            <Navbar />
            <div className="container">
                <MDBTable responsive>
                    <MDBTableHead>
                        <tr className='text-center'>
                            <th>#</th>
                            <th>Roll</th>
                            <th>Email</th>
                            <th>Name</th>
                            <th>Action</th>
                        </tr>
                    </MDBTableHead>
                    <MDBTableBody>
                        {users.map((user) => (
                            <tr key={user._id}>
                                <td width={100}>
                                    {count++}
                                </td>

                                <td width={100}>
                                    {user.roll}
                                </td>
                                
                                <td width={400}>
                                    {user.email}
                                </td>
                                <td width={400}>
                                    {user.name}
                                </td>
                                <td className='text-center'>


                                   



                                    <MDBBtn tag={Link} to={`/author/${user._id}`} color="primary" className="mx-2 mb-1">
                                        <MDBIcon fas icon="eye" />
                                    </MDBBtn>
                                    <MDBBtn color="danger" onClick={() => handleDelete(user._id)}>
                                            <MDBIcon fas icon="trash" />
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
export default AllUsers;

