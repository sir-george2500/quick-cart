import express, { Router } from "express";
import { createCategory, deleteCategory, getCategories } from "../controllers/category.controller.js";
import upload from "../middleware/upload.js";

const router: Router = express.Router();

// Get all categories
router.get("/", getCategories);

// Create a new category
router.post("/create", upload.single('file'), createCategory);

// Delete category by ID
router.delete("/:id", deleteCategory);

export default router;
