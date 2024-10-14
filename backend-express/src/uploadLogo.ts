import express from 'express'
import multer from 'multer';


const logo_storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, `./assets/logos/`);
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

let upload_logo = multer({ storage: logo_storage, fileFilter: fileFilter,});

export default upload_logo.single('file')
