import authRouter from "./src/components/auth/auth.router.js";
import userRouter from "./src/components/user/user.router.js";
import bookRouter from "./src/components/book/book.router.js";
import dotenv from "dotenv";

dotenv.config();
const baseURL = process.env.BASE_URL;
export const appRoutes = (app, express) => {
  app.use(express.json());

  app.get("/", (req, res) => res.send("Hello World!"));

  // auth
  app.use(`${baseURL}/auth`, authRouter);

  // user
  app.use(`${baseURL}/user`, userRouter);

  // book
  app.use(`${baseURL}/book`, bookRouter);

  app.all("*", (req, res) =>
    res.status(404).json({ error: "Page not found!" })
  );

  app.use((error, req, res, next) => {
    const status = error.statusCode || 500;
    const message = error.message;
    return res
      .status(status)
      .json({ success: false, error: message, stack: error.stack });
  });
};
