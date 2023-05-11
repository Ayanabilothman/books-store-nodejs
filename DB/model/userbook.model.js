import moment from "moment";
import { Schema, model } from "mongoose";

const userBookSchema = new Schema({
  bookId: { type: Schema.Types.ObjectId, ref: "Book", required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  borrowAt: { type: Date, default: Date.now },
});

userBookSchema.virtual("fine").get(function () {
  const returnAt = Date.now();
  const diffTime = Math.abs(returnAt - this.borrowAt);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  return diffDays > 7 // diffDays 9 // 2
    ? (diffDays - 7) * 10 // 10 LE fine for each additional day
    : 0;
});

export const Userbook = model("Userbook", userBookSchema);
