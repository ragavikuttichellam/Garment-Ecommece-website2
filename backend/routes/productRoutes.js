const express = require("express");
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const { protect, admin } = require("../middleware/authMiddleware");
const { upload, uploadToCloudinary } = require("../middleware/upload");

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProductById);

// Allow any authenticated user to create/update products (for testing)
// Change to: protect, admin for production
router.post(
  "/",
  protect,
  upload.single("image"),
  uploadToCloudinary,
  createProduct,
);
router.put(
  "/:id",
  protect,
  upload.single("image"),
  uploadToCloudinary,
  updateProduct,
);
router.delete("/:id", protect, admin, deleteProduct);

module.exports = router;
