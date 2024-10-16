"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const inv_schema_storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, `./assets/inv_series_schema/`);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "--" + file.originalname);
    }
});
const fileFilter = (req, file, cb) => {
    if ((file.mimetype).includes('jpeg') || (file.mimetype).includes('png') || (file.mimetype).includes('jpg')) {
        cb(null, true);
    }
    else {
        cb(null, false);
    }
};
let upload_inv_schema = (0, multer_1.default)({ storage: inv_schema_storage, fileFilter: fileFilter, });
exports.default = upload_inv_schema.single('file');
