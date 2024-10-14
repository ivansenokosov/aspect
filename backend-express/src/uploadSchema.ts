import express from 'express'
import multer from 'multer';


const inv_schema_storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, `./assets/inv_series_schema/`);
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

let upload_inv_schema = multer({ storage: inv_schema_storage, fileFilter: fileFilter,});

export default upload_inv_schema.single('file')
