import { Router } from "express";
import { isAuthenticated } from "../../../middleware/auth.middleware.js";
import { isAdmin } from "./../../../middleware/author.middleware.js";
import { globalCatch } from "../../../utils/catchError.js";
import { multerUpload } from "../../../utils/Files/multerUpload.js";
import { isValid } from "./../../../middleware/validation.middelware.js";
import {
  addBook,
  updateBook,
  deleteBook,
  getAllBooks,
  getBook,
  updateBookThumbnail,
  updateBookpdf,
  getAdminBooks,
  borrowBook,
  returnBook,
} from "./book.controller.js";
import { addBookSchema, updateBookSchema } from "./book.validation.js";

const router = Router();

// add book // admin
router.post(
  "/",
  isAuthenticated,
  isAdmin,
  multerUpload().fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "pdf", maxCount: 1 },
  ]),
  isValid(addBookSchema),
  globalCatch(addBook)
);

// update book details
router.patch(
  "/:id",
  isAuthenticated,
  isAdmin,
  isValid(updateBookSchema),
  globalCatch(updateBook)
);

// update book thumbnail
router.patch(
  "/thumbnail/:id",
  isAuthenticated,
  isAdmin,
  multerUpload().single('thumbnail'),
  isValid(addBookSchema),
  globalCatch(updateBookThumbnail)
);

// update book pdf
router.patch(
  "/pdf/:id",
  isAuthenticated,
  isAdmin,
  multerUpload().single("pdf"),
  globalCatch(updateBookpdf)
);

// delete book
router.delete("/:id", isAuthenticated, isAdmin, globalCatch(deleteBook));

// get all books
router.get("/", isAuthenticated, globalCatch(getAllBooks));

// get admin books
router.get("/all/admin", isAuthenticated, isAdmin, globalCatch(getAdminBooks));

// get book with id
router.get("/:id", isAuthenticated, globalCatch(getBook));

// borrow book
router.post("/borrow/:id", isAuthenticated, globalCatch(borrowBook));

// return book
router.patch("/return/:id", isAuthenticated, globalCatch(returnBook));
export default router;
