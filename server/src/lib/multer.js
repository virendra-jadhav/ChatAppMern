// middlewares/multer.js
import multer from "multer";

// Memory storage keeps file in memory (not saved locally)
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Only JPG, JPEG, PNG, and WEBP formats are allowed!"), false);
    }
    cb(null, true);
  },
});

export default upload;
