import express from "express";
import studyRoute from "./routes/studyRoute.js";

const app = express();

app.use(express.json());
app.use("/", studyRoute);

export default app;
