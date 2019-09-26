const cloudinary = require('cloudinary');
const cloudinaryStorage = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
    cloud_name: 'ddg3ehucw',
    api_key: '913748367612555',
    api_secret: '7XVjbckJsW0b_HiUQ9keB8t7ou0'
});

var storage = cloudinaryStorage({
    cloudinary: cloudinary,
    folder: 'project2-buckit', // The name of the folder in cloudinary
    allowedFormats: ['jpg', 'png'],
    filename: function (req, file, cb) {
        cb(null, file.originalname); // The file on cloudinary would have the same name as the original file name
    }
});

const uploadCloud = multer({ storage: storage });

module.exports = uploadCloud;