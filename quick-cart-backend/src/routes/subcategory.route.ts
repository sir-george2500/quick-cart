import express, { Router } from "express";
import { createSubcategory, deleteSubcategory, getSubcategories } from "../controllers/subcategory.controller.js";
import upload from "../middleware/upload.js";


const router: Router = express.Router();

// Get all subcategories
router.get("/", getSubcategories);

// Create a new subcategory
router.post("/create", upload.single('file'), createSubcategory);

// Delete subcategory by ID
router.delete("/:id", deleteSubcategory);

export default router;
