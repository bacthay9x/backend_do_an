import Product from "../models/productModel.js";
import fs, { copyFileSync } from "fs";
import slugify from "slugify";

//create product
export const createProductController = async (req, res) => {
  try {
    const { name, slug, description, price, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;
    //alidation
    switch (true) {
      case !name:
        return res.status(500).send({ error: "Trường này là bắt buộc" });
      case !description:
        return res.status(500).send({ error: "Trường này là bắt buộc" });
      case !price:
        return res.status(500).send({ error: "Trường này là bắt buộc" });
      case !category:
        return res.status(500).send({ error: "Trường này là bắt buộc" });
      case !quantity:
        return res.status(500).send({ error: "Trường này là bắt buộc" });
      case !photo && photo.size > 1000000:
        return res
          .status(500)
          .send({ error: "ảnh này là bắt buộc và phải nhỏ hơn 1Mb" });
    }

    const product = new Product({ ...req.fields, slug: slugify(name) });
    if (photo) {
      product.photo.data = fs.readFileSync(photo.path);
      product.photo.contentType = photo.type;
    }
    await product.save();
    res.status(201).send({
      success: true,
      message: "Sản phẩm đã được tạo",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Tạo mới sản phẩm thất bại",
    });
  }
};

//get all products
export const getAllProductController = async (req, res) => {
  try {
    const allProduct = await Product.find({})
      .populate("category")
      .select("-photo")
      .limit(12)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      countTotal: allProduct.length,
      message: "Hiển thị danh sách thành công",
      allProduct,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Hiển thị danh sách sản phẩm thất bại",
      error,
    });
  }
};

//get a product
export const getProduct = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug })
      .select("-photo")
      .populate("category");
    res.status(201).send({
      success: true,
      message: "Tìm kiếm sản phẩm thành công",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Tìm kiếm sản phẩm thất bại",
      error,
    });
  }
};

//get product photo
export const productPhotoController = async (req, res) => {
  try {
    const product = await Product.findById(req.params.pid).select("photo");
    if (product.photo.data) {
      res.set("Content-type", product.photo.contentType);
      return res.status(200).send(product.photo.data);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Tìm kiếm thất bại",
      error,
    });
  }
};

//delete product
export const deleteProductController = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.pid).select("-photo");
    res.status(200).send({
      success: true,
      message: "Sản phẩm được xóa thành công",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: true,
      message: "Xóa không thành công",
      error,
    });
  }
};

//update protuct
export const updateProductController = async (req, res) => {
  try {
    const { name, slug, description, price, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;
    //alidation;
    switch (true) {
      case !name:
        return res.status(500).send({ error: "Trường này là bắt buộc" });
      case !description:
        return res.status(500).send({ error: "Trường này là bắt buộc" });
      case !price:
        return res.status(500).send({ error: "Trường này là bắt buộc" });
      case !category:
        return res.status(500).send({ error: "Trường này là bắt buộc" });
      case !quantity:
        return res.status(500).send({ error: "Trường này là bắt buộc" });
      case !photo && photo.size > 1000000:
        return res
          .status(500)
          .send({ error: "ảnh này là bắt buộc và phải nhỏ hơn 1Mb" });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.pid,
      { ...req.fields, slug: slugify(name) },
      { new: true }
    );
    if (photo) {
      product.photo.data = fs.readFileSync(photo.path);
      product.photo.contentType = photo.type;
    }
    await product.save();
    res.status(201).send({
      success: true,
      message: "Sản phẩm đã được cập nhật thành công",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Sản phẩm cập nhật thất bại",
    });
  }
};

//product filters
export const productFiltersController = async (req, res) => {
  try {
    const { checked, radio } = req.body;
    let args = {};
    if (checked.length > 0) args.category = checked;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
    const products = await Product.find(args);
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Có lỗi khi lọc",
      error,
    });
  }
};
