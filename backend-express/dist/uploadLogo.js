"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const logo_storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, `./assets/logos/`);
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
let upload_logo = (0, multer_1.default)({ storage: logo_storage, fileFilter: fileFilter, });
exports.default = upload_logo.single('file');
