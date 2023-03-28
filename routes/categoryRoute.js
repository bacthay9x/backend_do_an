import expess from "express";
import {
  createCategoryController,
  updateCategoryController,
  getAllCategory,
  getCategory,
  deleteCategory,
} from "../controllers/categoryController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";

const router = expess.Router();
//routes

//create new category
router.post(
  "/create-category",
  requireSignIn,
  isAdmin,
  createCategoryController
);

//update category
router.put(
  "/update-category/:id",
  requireSignIn,
  isAdmin,
  updateCategoryController
);
export default router;

//get All Category
router.get("/getAllCategory", getAllCategory);

//get a category
router.get("/get-category/:slug", getCategory);

//delete a category
router.delete("/delete-category/:id", deleteCategory);
