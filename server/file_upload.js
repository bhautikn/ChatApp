const multer = require('multer');

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    req.body.storeFileName = Date.now() + '-' + file.originalname
    cb(null, req.body.storeFileName);
  }
});

// Create the multer instance
const upload = multer({
  storage: storage,
  // limits: {
  //   fileSize: 1048576 // Defined in bytes (1 Mb)
  // },
});

module.exports = upload;

