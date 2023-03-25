import Category from "../models/categoryModel.js";
import slugify from "slugify";

//create new category
export const createCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(401).send({ message: "Tên là bắt buộc" });
    }
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(200).send({
        success: true,
        message: "Danh mục này đã tồn tại",
      });
    }
    const newCategory = await new Category({
      name,
      slug: slugify(name),
    }).save();
    res.status(201).send({
      success: true,
      message: "Danh mục đã được tạo",
      newCategory,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Lỗi tạo danh mục",
    });
  }
};

//update category
export const updateCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;
    const updateCategory = await Category.findByIdAndUpdate(
      id,
      { name, slug: slugify(name) },
      { new: true }
    );
    if (!updateCategory) {
      res.status(401).send({
        success: false,
        message: "Không tìm thấy danh mục cần sửa",
      });
    }
    res.status(200).send({
      success: true,
      message: "Danh mục đã được sửa thành công",
      updateCategory,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Sửa danh mục thất bại",
    });
  }
};

//get All category
export const getAllCategory = async (req, res) => {
  try {
    const allCategory = await Category.find();
    res.status(200).send({
      success: true,
      message: "Hiển thị tất cả danh mục thành công",
      allCategory,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Không thể hiển thị tất cả",
      error,
    });
  }
};

//get a category
export const getCategory = async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    if (!category) {
      res.status(401).send({
        success: false,
        message: "Danh mục này có thể đã bị xóa",
      });
    }
    res.status(200).send({
      success: true,
      message: "Đã tìm được danh mục phù hợp",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Không thể hiển thị danh mục này",
    });
  }
};

//delete a category
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndDelete(id);
    if (!id) {
      res.status(500).send({
        success: false,
        error,
        message: "Không tìm thấy dnah mục cần xóa!",
      });
    }
    res.status(200).send({
      success: true,
      message: "Xóa danh mục thành công",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Lỗi không xóa được",
    });
  }
};
