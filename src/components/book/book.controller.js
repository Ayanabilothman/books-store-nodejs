import { Book } from "../../../DB/model/book.model.js";
import { Userbook } from "../../../DB/model/userbook.model.js";
import { ResError } from "../../../utils/errorClass.js";
import uploadCloud from "./../../../utils/Files/cloudnairyUpload.js";

//////////////////////// add book ////////////////////////
export const addBook = async (req, res, next) => {
  // check the sending of two files "thumbnail" + "pdf"
  if (!req.files.thumbnail || !req.files.pdf)
    return next(
      new ResError("Both pdf book and thumbnail for the book are required!")
    );

  const createdBy = req.decoded.id;
  const { name, description } = req.body;

  let newBook = await Book.create({
    name,
    description,
    createdBy,
  });

  // upload thumbnail
  const thumbnail = await uploadCloud.uploader.upload(
    req.files.thumbnail[0].path, // req.files.thumbnail >>
    {
      folder: `Books/${newBook._id}`,
      public_id: `${newBook._id}thumbnail`,
    }
  );

  console.log("thumbnail: ", thumbnail);

  // upload pdf
  const pdf = await uploadCloud.uploader.upload(req.files.pdf[0].path, {
    folder: `Books/${newBook._id}`,
    public_id: `${newBook._id}pdf`,
  });

  // add image and pdf to database
  newBook = await Book.findByIdAndUpdate(
    newBook._id,
    {
      thumbnailURL: thumbnail.secure_url,
      pdfURL: pdf.secure_url,
    },
    { new: true }
  );

  console.log(newBook);

  return res.status(201).json({ success: true, results: newBook });
};

//////////////////////// update book details ////////////////////////
export const updateBook = async (req, res, next) => {
  const { id } = req.params; // book id
  const createdBy = req.decoded.id; // user id

  const book = await Book.findOneAndUpdate({ createdBy, _id: id }, req.body, {
    new: true,
  });

  return book
    ? res.json({ success: true, results: book })
    : next(new ResError("Unauthorized to update the book!", 400));
};

//////////////////////// update book thumbnail ////////////////////////
export const updateBookThumbnail = async (req, res, next) => {
  const book = await Book.findById(req.params.id);
  if (book) {
    // upload thumbnail
    const thumbnail = await uploadCloud.uploader.upload(req.file.path, {
      folder: `Books/${book._id}`,
      public_id: `${book._id}thumbnail`,
    });

    // update book
    book.thumbnailURL = thumbnail.secure_url;
    book.save();

    return res.status(200).json({ success: true, results: book });
  }

  return next(new ResError("Invalid book id!", 400));
};

//////////////////////// update book pdf ////////////////////////
export const updateBookpdf = async (req, res, next) => {
  const book = await Book.findById(req.params.id);

  if (book) {
    // upload pdf
    const pdf = await uploadCloud.uploader.upload(req.file.path, {
      folder: `Books/${book._id}`,
      public_id: `${book._id}pdf`,
    });

    // update book
    book.pdfURL = pdf.secure_url;
    book.save();

    return res.status(200).json({ success: true, results: book });
  }
  return next(new ResError("Invalid book id!", 400));
};

//////////////////////// delete book ////////////////////////
export const deleteBook = async (req, res, next) => {
  const { id } = req.params; // book id
  const createdBy = req.decoded.id;

  // delete book object
  const book = await Book.findOneAndRemove({
    createdBy,
    _id: id,
  });

  if (book) {
    // delete book image
    await uploadCloud.uploader.destroy(book.thumbnailPuplicId); // Book/bookid/`${newBook._id}thumbnail`
    // delete book pdf
    await uploadCloud.uploader.destroy(book.pdfPuplicId);
    // delete folder
    await uploadCloud.api.delete_folder(`Books/${book._id}`);

    return res.json({ success: true, results: book });
  }

  return next(new ResError("invalid book or user id!", 400));
};

//////////////////////// get book with id ////////////////////////
export const getBook = async (req, res, next) => {
  const { id } = req.params;

  const book = await Book.findById(id);
  return book
    ? res.json({ success: true, results: book })
    : next(new ResError("Book not found!", 400));
};

//////////////////////// get all books ////////////////////////
export const getAllBooks = async (req, res, next) => {
  const books = await Book.find({});
  return books
    ? res.json({ success: true, results: books })
    : next(new ResError("Books not found!", 400));
};

//////////////////////// get admin books ////////////////////////
export const getAdminBooks = async (req, res, next) => {
  const books = await Book.find({ createdBy: req.decoded.id });
  return res.json({ success: true, results: { books } });
};

//////////////////////// borrow book ////////////////////////
export const borrowBook = async (req, res, next) => {
  const { id } = req.params; //book id
  const book = await Book.findById(id);
  if (book.borrowed)
    return next(
      new ResError(
        "You can't borrow this book right now, it already borrowed by other user!",
        400
      )
    );

  await Userbook.create({
    bookId: id,
    userId: req.decoded.id,
  }).then(async () => await Book.findByIdAndUpdate(id, { borrowed: true }));

  return res.json({ success: true });
};

//////////////////////// return book ////////////////////////
export const returnBook = async (req, res, next) => {
  const { id } = req.params; //book id

  await Book.findByIdAndUpdate(id, { borrowed: false });

  const bookOfUser = await Userbook.findOne({
    userId: req.decoded.id,
    bookId: id,
  });

  const fine = bookOfUser.fine;

  // delete the document
  await Userbook.findOneAndDelete({
    userId: req.decoded.id,
    bookId: id,
  });

  return res.json({ success: true, results: { fine } });
};
