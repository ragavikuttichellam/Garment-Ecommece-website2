const Product = require("../models/Product");

const parseArray = (value) => {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value !== "string") return [];

  const trimmed = value.trim();
  if (!trimmed) return [];

  try {
    const parsed = JSON.parse(trimmed);
    if (Array.isArray(parsed)) return parsed.filter(Boolean);
  } catch (_) {
    return trimmed
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};

const parseNumber = (value, fallback = 0) => {
  if (value === undefined || value === null || value === "") return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const parseBoolean = (value, fallback = false) => {
  if (value === undefined || value === null || value === "") return fallback;
  if (typeof value === "boolean") return value;
  return ["true", "1", "yes", "on"].includes(String(value).toLowerCase());
};

const getUploadedImageUrl = (file) =>
  file?.cloudinaryUrl ||
  file?.cloudinary?.secure_url ||
  file?.path ||
  file?.secure_url ||
  file?.url ||
  file?.location ||
  "";

const normalizeProduct = (product) => {
  const obj = product.toObject ? product.toObject() : product;
  const images = Array.isArray(obj.images) ? obj.images.filter(Boolean) : [];
  const image = obj.image || images[0] || "";

  return {
    ...obj,
    id: obj._id?.toString(),
    image,
    images: image && !images.includes(image) ? [image, ...images] : images,
    originalPrice: obj.originalPrice || obj.price,
    rating: obj.rating || 0,
    reviews: obj.reviews || 0,
    discount: obj.discount || 0,
    isNew: Boolean(obj.isNewArrival ?? obj.isNew),
    isOffer: Boolean(obj.isOffer || obj.discount > 0),
  };
};

const buildProductPayload = (body, file, existingProduct = null) => {
  const uploadedImageUrl = getUploadedImageUrl(file);
  const bodyImages = parseArray(body.images);
  const image =
    uploadedImageUrl ||
    body.image ||
    bodyImages[0] ||
    existingProduct?.image ||
    "";
  const images = [
    image,
    ...bodyImages,
    ...(Array.isArray(existingProduct?.images) ? existingProduct.images : []),
  ].filter((url, index, arr) => url && arr.indexOf(url) === index);

  return {
    name: body.name,
    description: body.description,
    price: parseNumber(body.price, existingProduct?.price),
    originalPrice: parseNumber(
      body.originalPrice,
      body.price || existingProduct?.originalPrice,
    ),
    category: body.category?.toLowerCase(),
    subcategory: body.subcategory,
    brand: body.brand,
    image,
    images,
    sizes: parseArray(body.sizes),
    colors: parseArray(body.colors),
    stock: parseNumber(body.stock, existingProduct?.stock),
    discount: parseNumber(body.discount, existingProduct?.discount || 0),
    rating: parseNumber(body.rating, existingProduct?.rating || 0),
    reviews: parseNumber(body.reviews, existingProduct?.reviews || 0),
    isNewArrival: parseBoolean(
      body.isNew ?? body.isNewArrival,
      existingProduct?.isNewArrival ?? existingProduct?.isNew ?? false,
    ),
    isOffer: parseBoolean(body.isOffer, existingProduct?.isOffer || false),
    tags: parseArray(body.tags),
  };
};

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const pageSize = 10;
    const page = Number(req.query.pageNumber) || 1;
    const keyword = req.query.keyword
      ? {
          name: {
            $regex: req.query.keyword,
            $options: "i",
          },
        }
      : {};

    const filter = { ...keyword, isActive: true };
    const count = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({
      success: true,
      products: products.map(normalizeProduct),
      page,
      pages: Math.ceil(count / pageSize),
      count,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(normalizeProduct(product));
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a product
// @desc    Create a product
// @route   POST /api/products
// @access  Private (authenticated users)
const createProduct = async (req, res) => {
  try {
    console.log("\n[📦 CREATE PRODUCT - START]");
    console.log("Authenticated user:", req.user?.email);
    console.log("User role:", req.user?.role);

    const { name, description, price, category, stock } = req.body;

    console.log("\n[📦 CREATE PRODUCT - STEP 1: Validate Input]");
    console.log("Received fields:");
    console.log("  name:", name);
    console.log("  description:", description?.substring(0, 50));
    console.log("  price:", price);
    console.log("  category:", category);
    console.log("  stock:", stock);
    console.log(
      "  image file:",
      req.file ? `${req.file.fieldname} (${req.file.size} bytes)` : "NO FILE",
    );

    // Validate required fields
    if (!name || !description || !price || !category || stock === undefined) {
      console.log("❌ VALIDATION ERROR: Missing required fields");
      return res.status(400).json({
        message:
          "Missing required fields: name, description, price, category, stock",
        received: { name, description, price, category, stock },
      });
    }

    if (isNaN(price) || price < 0) {
      console.log("❌ VALIDATION ERROR: Invalid price");
      return res
        .status(400)
        .json({ message: "Price must be a valid positive number" });
    }

    if (isNaN(stock) || stock < 0) {
      console.log("❌ VALIDATION ERROR: Invalid stock");
      return res
        .status(400)
        .json({ message: "Stock must be a valid non-negative number" });
    }

    console.log("✅ All validations passed");

    console.log("\n[📦 CREATE PRODUCT - STEP 2: Build Payload]");
    const payload = buildProductPayload(req.body, req.file);
    console.log("Payload created:");
    console.log("  Product name:", payload.name);
    console.log("  Price: ₹", payload.price);
    console.log(
      "  Image URL:",
      payload.image ? `${payload.image.substring(0, 50)}...` : "NONE",
    );
    console.log("  Stock:", payload.stock);
    console.log("  Category:", payload.category);

    console.log("\n[📦 CREATE PRODUCT - STEP 3: Save to MongoDB]");
    const product = new Product(payload);
    const createdProduct = await product.save();

    console.log("✅ Product saved successfully");
    console.log("Product ID:", createdProduct._id);
    console.log("Product name:", createdProduct.name);

    console.log("\n[✅ CREATE PRODUCT - SUCCESS]");
    console.log("Response status: 201 Created\n");

    res.status(201).json(normalizeProduct(createdProduct));
  } catch (error) {
    console.error("\n[❌ CREATE PRODUCT - ERROR]");
    console.error("Error message:", error.message);
    console.error("Error type:", error.name);
    console.error("Full error:", error);
    console.error("");

    res.status(500).json({
      message: error.message,
      error: error.toString(),
      details: error.errors
        ? Object.keys(error.errors).map(
            (k) => `${k}: ${error.errors[k].message}`,
          )
        : undefined,
    });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock, isActive } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      const payload = buildProductPayload(req.body, req.file, product);

      product.name = name || product.name;
      product.description = description || product.description;
      product.price = payload.price;
      product.originalPrice = payload.originalPrice;
      product.category = payload.category || product.category;
      product.subcategory = payload.subcategory || product.subcategory;
      product.brand = payload.brand || product.brand;
      product.image = payload.image || product.image;
      product.images = payload.images.length ? payload.images : product.images;
      product.sizes = payload.sizes.length ? payload.sizes : product.sizes;
      product.colors = payload.colors.length ? payload.colors : product.colors;
      product.stock = payload.stock;
      product.discount = payload.discount;
      product.rating = payload.rating;
      product.reviews = payload.reviews;
      product.isNewArrival = payload.isNewArrival;
      product.isOffer = payload.isOffer;
      product.tags = payload.tags.length ? payload.tags : product.tags;
      product.isActive = isActive !== undefined ? isActive : product.isActive;

      const updatedProduct = await product.save();
      res.json(normalizeProduct(updatedProduct));
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await Product.deleteOne({ _id: req.params.id });
      res.json({ message: "Product removed" });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
