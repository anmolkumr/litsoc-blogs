import React from 'react';
import BlogCards from './BlogCards';

function AllBlogs() {
    return (
        <div className="container-xxl mt-5">
        <h3 className='literata-regular'>All Blogs</h3>
        <BlogCards />
        </div>
    );
}

export default AllBlogs;