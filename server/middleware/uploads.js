import multer from 'multer';
import path from 'node:path';

// Configure storage logic
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Files will land in your server/uploads folder
    },
    filename: (req, file, cb) => {
        // We add a timestamp to prevent duplicate filenames
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// Create the middleware instance
export const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        // Only allow PDFs for this specific project
        if (file.mimetype === "application/pdf") {
            cb(null, true);
        } else {
            cb(new Error("Only PDF files are supported!"), false);
        }
    }
});