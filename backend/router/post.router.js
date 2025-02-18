import express from "express";
import { createPost, getPosts, updatePost, deletePost, getPostById } from "../controllers/post.controllers.js";
import protectRoute from "../middleware/protectRoute.js";


const router = express.Router();

router.post('/',protectRoute, createPost);
router.get('/', getPosts);
router.get('/:id', getPostById);
router.put('/:id', protectRoute, updatePost);
router.delete('/:id', protectRoute, deletePost);  

export default router;