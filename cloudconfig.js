if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
//cloudinary is used for putting files/videos on cloud instead of saving them in database because of their larg size
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});


const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'roainfolder',// roainfolder will be set up in cloudstorage. and all of the files
// will be stored un roainfolder.

    allowed_formats:["jpg","png","jpeg"], // allowed formats for files to be uploaded


    // public_id: (req, file) => 'computed-filename-using-request',// it tells how the cloudinary is going
    // to name our uploaded files in cloud.
  },
});

module.exports={
    cloudinary,
    storage
}