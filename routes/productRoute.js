import express from "express";
import {
  createProductController,
  deleteProductController,
  getAllProductController,
  getProduct,
  productPhotoController,
  updateProductController,
} from "../controllers/productController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import formidable from "express-formidable";

const router = express.Router();

//routes
//create product
router.post(
  "/create-product",
  requireSignIn,
  isAdmin,
  formidable(),
  createProductController
);

//update product
router.put(
  "/update-product/:pid",
  requireSignIn,
  isAdmin,
  formidable(),
  updateProductController
);

//get all products
router.get("/get-allProduct", requireSignIn, isAdmin, getAllProductController);

//get a product
router.get("/getProduct/:slug", requireSignIn, isAdmin, getProduct);

//get photo
router.get(
  "/product-photo/:pid",
  requireSignIn,
  isAdmin,
  productPhotoController
);

//delete product
router.delete(
  "/deleteProduct/:pid",
  requireSignIn,
  isAdmin,
  deleteProductController
);
export default router;