import multer, { StorageEngine } from "multer";
import path from "path";

// Setup multer for handling multipart/form-data
const storage: StorageEngine = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, "uploads/");
  },
  filename: function (_req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
const upload = multer({ storage });

export default upload;
