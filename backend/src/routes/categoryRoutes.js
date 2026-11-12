const express = require("express");
const router = express.Router();

const authenticateToken = require("../middleware/authMiddleware");

const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");

router.get("/", authenticateToken, getCategories);
router.post("/", authenticateToken, createCategory);
router.put("/:id", authenticateToken, updateCategory);
router.delete("/:id", authenticateToken, deleteCategory);

module.exports = router;
