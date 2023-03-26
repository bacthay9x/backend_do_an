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
router.get("/get-allProduct", getAllProductController);

//get a product
router.get("/getProduct/:slug", getProduct);

//get photo
router.get("/product-photo/:pid", productPhotoController);

//delete product
router.delete(
  "/deleteProduct/:pid",

  deleteProductController
);
export default router;
