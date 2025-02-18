import Post from "../models/post.models.js";
import mongoose from "mongoose";

export const createPost = async (req, res) => {
    try {
        const newPost = new Post(req.body);
        await newPost.save();
        res.status(201).json({success: true, data: newPost});
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: "Server Error"});
    }
}

export const getPosts = async (req, res) => {
    try {
        const posts = await Post.find();
        res.status(200).json({success: true, data: posts});
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: "Server Error"});
    }
}

export const getPostById = async (req, res) => {
    try {
        const {id} = req.params
        const post = await Post.findById(id);
        res.status(200).json({success: true, data: post});
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: "Server Error"});
    }
}

export const updatePost = async (req, res) => {
    try {
        const {id} = req.params
        const updatePost = await Post.findByIdAndUpdate(id, req.body, {new: true});
        res.status(200).json({success: true, data: updatePost});
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: "Server Error"});
    }
}

export const deletePost = async (req, res) => {
    try {
        const {id} = req.params
        const deletedPost = await Post.findByIdAndDelete(id);
        res.status(200).json({success: true, data: deletedPost});
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: "Server Error"});
    }
}