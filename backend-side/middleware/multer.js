import multer from "multer";

// Store files in memory for Firebase upload
const storage = multer.memoryStorage();
const upload = multer({ storage });

export default upload;
