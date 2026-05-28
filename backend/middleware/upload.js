const { Readable } = require('stream');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY || process.env.API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET || process.env.API_SECRET,
});

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith('image/')) {
    return cb(new Error('Only image files are allowed'));
  }
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

const uploadBufferToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'products',
        resource_type: 'image',
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    Readable.from(fileBuffer).pipe(uploadStream);
  });
};

const uploadToCloudinary = async (req, res, next) => {
  try {
    if (!req.file) {
      return next();
    }

    if (!cloudinary.config().cloud_name || !cloudinary.config().api_key || !cloudinary.config().api_secret) {
      return res.status(500).json({
        message: 'Cloudinary credentials are missing',
      });
    }

    const result = await uploadBufferToCloudinary(req.file.buffer);

    req.file.cloudinary = result;
    req.file.cloudinaryUrl = result.secure_url;
    req.file.publicId = result.public_id;

    console.log('Cloudinary upload success:', {
      fieldname: req.file.fieldname,
      publicId: result.public_id,
      url: result.secure_url,
    });

    next();
  } catch (error) {
    console.error('Cloudinary upload failed:', error);
    res.status(500).json({
      message: 'Image upload to Cloudinary failed',
      error: error.message,
    });
  }
};

module.exports = { upload, uploadToCloudinary };
