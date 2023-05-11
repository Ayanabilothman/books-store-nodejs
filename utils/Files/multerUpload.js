import multer, { diskStorage } from "multer";

// filefilter
const configureFilter = () => {
  // executed for each file
  return (req, file, cb) => {
    if (
      (file.fieldname === "pdf" && file.mimetype === "application/pdf") || // book
      (file.fieldname === "thumbnail" && file.mimetype === "image/png") || // book
      (file.fieldname === "profile picture" && file.mimetype === "image/png") // user
    ) {
      return cb(null, true);
    }
    return cb(new Error("invalid format!"), false);
  };
};

// storage
const storageFilter = () => {
  return diskStorage({}); // temp
};

export const multerUpload = () => {
  const fileFilter = configureFilter();
  const storage = storageFilter();
  // const limits = {
  //   fileSize: 1 * 1000 * 1000,
  // };
  return multer({ fileFilter, storage });
};
