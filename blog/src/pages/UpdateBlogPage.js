import React, { useEffect, useState } from 'react';
import BlogEditor from '../components/BlogEditor';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function UpdateBlogPage() {
  const { id } = useParams();
  const [existingBlog, setExistingBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(`https://litsoc-blogs.vercel.app/blogs/${id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        setExistingBlog(response.data);
      } catch (error) {
        console.error('Error fetching blog:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  if (loading) {
    return <p>plz waiyt.. Loading blog...</p>;
  }

  if (!existingBlog) {
    return <p>Blog not found.</p>;
  }

  return <BlogEditor existingBlog={existingBlog} />;
}

export default UpdateBlogPage;
