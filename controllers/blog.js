import { Blog } from "../models/Blog.js";
import User from "../models/User.js";

export const createBlog = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user.role !== "admin")
      return res.status(403).json({
        message: "Unauthorized",
      });
    const { title, description, blog, category, image, ownername } = req.body;

    const createdBlog = await Blog.create({
      title,
      description,
      blog,
      owner: req.user._id,
      ownername,
      image,
      category,
    });

    res.status(201).json({
      message: "Blog Created",
      createdBlog,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getAllBlogs = async (req, res) => {
  try {
    const search = req.query.search || "";
    const category = req.query.category || "";

    const totalBlogs = await Blog.countDocuments();

    const blogs = await Blog.find({
      title: {
        $regex: search,
        $options: "i",
      },
      category: {
        $regex: category,
        $options: "i",
      },
    }).sort("-createdAt");

    res.status(200).json({
      blogs,
      totalBlogs,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getSingleBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    res.json({ blog });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user.role !== "admin")
      return res.status(403).json({
        message: "Unauthorized",
      });

    const blog = await Blog.findById(req.params.id);

    if (blog.owner.toString() !== req.user._id.toString())
      return res.status(403).json({
        message: "you are not owner of this blog",
      });

    await blog.deleteOne();

    res.status(200).json({
      message: "Blog deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const commentOnBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    const user = await User.findById(req.user._id);

    blog.comments.comment = req.body.comment;

    blog.comments.push({
      user: user.name,
      userid: user._id,
      comment: req.body.comment,
    });

    await blog.save();

    res.json({
      message: "Comment Added",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getAllComments = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    const comments = await blog.comments;

    res.json({
      comments: comments.reverse(),
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
