// import multer from "multer";
// import path from "path";

// // Configure Storage
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "./uploads"); // Store files in 'uploads/' directory
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
//   },
// });

// // File Filter: Allow only images
// const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
//   if (file.mimetype.startsWith("image/")) {
//     cb(null, true);
//   } else {
//     cb(new Error("Only image files are allowed!"), false);
//   }
// };

// // Multer Middleware (Allow up to 20 images, max 5MB each)
// export const UploadFiles = multer({
//   storage: storage,
//   fileFilter: fileFilter,
//   limits: { fileSize: 5 * 1024 * 1024 }, // 5MB per file
// });

import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads"); 
  },
  filename: (req, file, cb) => {
    const filename = `img-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, filename); // Save only the filename
  },
});

export const UploadFiles = multer({ storage }).any();