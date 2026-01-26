/**
 * UPLOAD MIDDLEWARE
 * Handles temporary storage of PDFs. 
 * Updated to support large research papers (up to 50MB).
 */

import multer from 'multer';
import path from 'path';
import fs from 'fs';

// 1. Ensure the uploads directory exists
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// 2. Configure Storage Engine
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Timestamp + Original Name to ensure uniqueness
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

/**
 * upload: Named export for use in routes.
 * Limits increased to accommodate large research documents.
 */
export const upload = multer({ 
    storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === "application/pdf") {
            cb(null, true);
        } else {
            cb(new Error("Only PDFs are allowed!"), false);
        }
    },
    limits: {
        // Increased to 50MB to handle high-res research papers
        fileSize: 50 * 1024 * 1024 
    }
});