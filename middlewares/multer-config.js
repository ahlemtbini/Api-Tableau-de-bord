const multer = require('multer')

const MIME_TYPES = {
    'application/pdf': 'pdf',
    'application/vnd.ms-excel': 'xls',
    'image/png': 'png',
    'image/jpeg': 'jpeg',
}
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, './documents/')
    },
    filename: (req, file, callback) => {
        let name = file.originalname.split(' ').join('_');
        name = name.split('.pdf')[0]
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + '.' + Date.now() + '.' + extension);
    }
})

module.exports = multer({ storage: storage }).array('file1', 4)