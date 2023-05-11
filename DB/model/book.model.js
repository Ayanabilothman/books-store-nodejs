import { Schema, model } from "mongoose";

const bookSchema = new Schema(
  {
    name: { type: String, min: 10, max: 100, required: true },
    description: { type: String, min: 20, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    borrowed: { type: Boolean, default: false },
    thumbnailURL: String,
    pdfURL: String,
  },
  { timestamps: true }
);

bookSchema.virtual("thumbnailPuplicId").get(function () {
  return `Books/${this._id}/${this._id}thumbnail`;
});

bookSchema.virtual("pdfPuplicId").get(function () {
  return `Books/${this._id}/${this._id}pdf`;
});

export const Book = model("Book", bookSchema);
