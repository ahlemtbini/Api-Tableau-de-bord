const multer = require('multer')

const MIME_TYPES = {
    'application/pdf': 'pdf',
    'application/vnd.ms-excel': 'xls',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
    'text/csv': 'csv',
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/webp': 'webp',
    'application/msword': 'doc',
    'application/msword': 'dot',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.template': 'dotx',
    'application/vnd.ms-word.document.macroEnabled.12': 'docm',
    'application/vnd.ms-word.template.macroEnabled.12': 'dotm',
    'application/vnd.ms-excel': 'xls',
    'application/vnd.ms-excel': 'xlt',
    'application/vnd.ms-excel': 'xla',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.template': 'xltx',
    'application/vnd.ms-excel.sheet.macroEnabled.12': 'xlsm',
    'application/vnd.ms-excel.template.macroEnabled.12': 'xltm',
    'application/vnd.ms-excel.addin.macroEnabled.12' : 'xlam',
    'application/vnd.ms-excel.sheet.binary.macroEnabled.12': 'xlsb',
    'application/vnd.ms-powerpoint': 'ppt',
    'application/vnd.ms-powerpoint': 'pot',
    'application/vnd.ms-powerpoint': 'pps',
    'application/vnd.ms-powerpoint': 'ppa',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx',
    'application/vnd.openxmlformats-officedocument.presentationml.template': 'potx',
    'application/vnd.openxmlformats-officedocument.presentationml.slideshow': 'ppsx',
    'application/vnd.ms-powerpoint.addin.macroEnabled.12': 'ppam',
    'application/vnd.ms-powerpoint.presentation.macroEnabled.12': 'pptm',
    'application/vnd.ms-powerpoint.template.macroEnabled.12': 'potm',
    'application/vnd.ms-powerpoint.slideshow.macroEnabled.12': 'ppsm',
    'application/vnd.ms-access': 'mdb'
}
console.log('multer')
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, './documents/')
    },
    filename: (req, file, callback) => {
        console.log(file,'f')
        let name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        name = name.split('.pdf')[0]
        // name = name.split('.pdf')[0]
        callback(null, name + '.' + Date.now() + '.' + extension);
    }
})

module.exports = multer({ storage: storage }).array('file1',10)