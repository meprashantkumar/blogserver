import express from 'express'
import { isAuth } from '../middleware/auth.js'
import { commentOnBlog, createBlog, deleteBlog, getAllBlogs, getAllComments, getSingleBlog } from '../controllers/blog.js'

const router = express.Router()

router.route("/new").post(isAuth, createBlog)
router.route("/all").get(getAllBlogs)
router.route("/blog/:id").get(getSingleBlog).delete(isAuth, deleteBlog).post(isAuth, commentOnBlog)
router.route("/comments/:id").get(getAllComments)

export default router