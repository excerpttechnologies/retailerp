const path = require('path');
const fs = require('fs');
const multer = require('multer');

// Build a multer instance that stores files under backend/uploads/<folder>
const makeUploader = (folder, allowedExtRegex = /jpeg|jpg|png|webp|pdf|doc|docx|xls|xlsx|zip|mp4/) => {
  const uploadDir = path.join(__dirname, '..', '..', 'uploads', folder);
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
      const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      cb(null, `${unique}${path.extname(file.originalname)}`);
    },
  });

  const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
    if (allowedExtRegex.test(ext)) return cb(null, true);
    cb(new Error(`File type .${ext} is not allowed`));
  };

  return multer({
    storage,
    fileFilter,
    limits: { fileSize: 15 * 1024 * 1024 }, // 15MB
  });
};

// Returns the public-facing relative path to store in MongoDB
const toPublicPath = (folder, filename) => `/uploads/${folder}/${filename}`;

module.exports = { makeUploader, toPublicPath };
