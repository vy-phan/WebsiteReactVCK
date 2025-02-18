import Course from "./../models/courese.models.js";
import mongoose from "mongoose";

export const getCourseById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ success: false, message: "No such course with this ID" });
  }

  try {
    const courese = await Course.findById(id);

    if (!courese) {
      return res
        .status(404)
        .json({ success: false, message: "Courese not found" });
    }

    res.status(200).json({ success: true, data: courese });
  } catch (error) {
    console.error("Error in GET Course by ID", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getCourse = async (req, res) => {
  try {
    const courese = await Course.find();
    res.status(200).json({ success: true, data: courese });
  } catch (error) {
    console.log("Error in GET courses:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const postCourse = async (req, res) => {
  const { nameCourse, description, imageCourse, author } = req.body;
  // || !courese.listCourse || !courese.author
  if (!nameCourse || !description || !imageCourse) {
    return res
      .status(400)
      .json({ success: false, message: "Please input all fields" });
  }

  const newCourse = new Course({
    nameCourse,
    description,
    imageCourse,
    author: author || null, // Nếu không truyền, mặc định null
  });
  try {
    await newCourse.save();
    res.status(201).json({ success: true, data: newCourse });
  } catch (error) {
    console.error("Error in POST Course:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

export const deleteCourse = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "No such course" });
  }
  try {
    await Course.findByIdAndDelete(id);
    res
      .status(200)
      .json({ success: true, message: "Course deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const updateCourse = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "No such course" });
  }
  try {
    const updatedCourse = await Course.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true }
    );
    res.status(200).json({ success: true, data: updatedCourse });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const searchCourse = async (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.status(200).json({ success: true, data: [] });
  }

  try {
    // Tạo regex pattern linh hoạt hơn
    const searchRegex = new RegExp(q.replace(/\s+/g, ".*"), "i");

    const courses = await Course.find({
      $or: [{ nameCourse: searchRegex }, { description: searchRegex }],
    }).limit(10);

    console.log("Search query:", q);
    console.log("Found courses:", courses);

    res.status(200).json({ success: true, data: courses });
  } catch (error) {
    console.error("Error in SEARCH courses:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
