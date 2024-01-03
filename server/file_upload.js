const multer = require('multer');

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    if(checkMimetype(file.mimetype)){
      req.body.storeFileName = Date.now()+Math.random()+ '-' + file.originalname
      req.body.mimetype = file.mimetype;
      cb(null, req.body.storeFileName);
    }
  }
});

// Create the multer instance
const upload = multer({
  storage: storage,
  // limits: {
  //   fileSize: 2e+7 // Defined in bytes (20 Mb)
  // },
});
function checkMimetype(mimetype){
  if( // valid image files 
    mimetype == 'image/bmp' || 
    mimetype ==  'image/jpeg' || 
    mimetype ==  'image/x-png' || 
    mimetype == 'image/png' || 
    mimetype == 'image/gif'){
      return true;
  }
  if( // valid video files
    mimetype == 'video/mp4' ||
    mimetype == 'video/mpeg' ||
    mimetype == 'video/x-ms-wmv' ||
    mimetype == 'video/x-msvideo' ||
    mimetype == 'video/quicktime' ||
    mimetype == 'video/3gpp' ||
    mimetype == 'video/MP2T' ||
    mimetype == 'application/x-mpegURL' ||
    mimetype == 'video/x-flv'
  ){
    return true;
  }
  if( // valid audio files
    mimetype == 'audio/mpeg' ||
    mimetype == 'audio/mp4' ||
    mimetype == 'audio/vnd.wav' ||
    mimetype == 'audio/ogg' ||
    mimetype == 'audio/vnd.rn-realaudio'
  ){
    return true;
  }
  return false;
}
module.exports = upload;