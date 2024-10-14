import express from 'express'
import multer from 'multer';


const inv_photo_storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, `./assets/inv_series/`);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "--" + file.originalname);
    }
});  

const fileFilter = (req:express.Request, file:any, cb:CallableFunction) => {
    if((file.mimetype).includes('jpeg') || (file.mimetype).includes('png') || (file.mimetype).includes('jpg')){
        cb(null, true);
    } else{
        cb(null, false);
    }
};

let upload_inv_photo = multer({ storage: inv_photo_storage, fileFilter: fileFilter,});

export default upload_inv_photo.single('file')
