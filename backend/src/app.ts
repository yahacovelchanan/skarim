import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./modules/auth/auth.routes";
import surveyRoutes from "./modules/survey/survey.routes";
import responseRoutes from "./modules/response/response.routes";
const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/surveys",surveyRoutes);
app.use("/api/responses", responseRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

export default app;