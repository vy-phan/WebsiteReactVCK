import axios from "axios";
import { useEffect, useState } from "react";

const useCRUDPost = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const getAuthHeaders = () => {
        const token = localStorage.getItem('user-course');
        return {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };
    };

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`/api/post/`, getAuthHeaders());
                if (response.data.success) {
                    setPosts(response.data.data);
                } else {
                    setError('Failed to fetch posts');
                }
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    const createPost = async (data) => {
        try {
            const response = await axios.post(`/api/post/`, data,   getAuthHeaders());
            if (response.data.success) {
                setPosts([...posts, response.data.data]);
            } else {
                setError('Failed to create post');
            }
        } catch (error) {
            setError(error.message);
        }
    };

    const updatePost = async (id, data) => {
        try {
            const response = await axios.put(`/api/post/${id}`, data , getAuthHeaders());
            if (response.data.success) {
                setPosts(posts.map(post => post._id === id ? response.data.data : post));
            } else {
                setError('Failed to update post');
            }
        } catch (error) {
            setError(error.message);
        }
    };

    const deletePost = async (id) => {
        try {
            const response = await axios.delete(`/api/post/${id}`, getAuthHeaders());
            if (response.data.success) {
                setPosts(posts.filter(post => post._id !== id));
            } else {
                setError('Failed to delete post');
            }
        } catch (error) {
            setError(error.message);
        }
    };

    const getPost = async (id) => {
        try {
            const response = await axios.get(`/api/post/${id}`, getAuthHeaders());
            if (response.data.success) {
                return response.data.data;
            } else {
                setError('Failed to get post');
            }
        } catch (error) {
            setError(error.message);
        }
    };

    return { posts, loading, error, createPost, updatePost, deletePost, getPost };
};

export default useCRUDPost;