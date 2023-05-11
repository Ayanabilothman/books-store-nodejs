import express from "express";
import { appRoutes } from "./app.router.js";
import { connectDB } from "./DB/connection.js";
const app = express();
const port = 3000;

connectDB();
appRoutes(app, express);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
