import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import userRoutes from "../routes/userRoutes";

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use("/api", userRoutes);



const listRoutes = (app: express.Application) => {
  console.log("\n📌 List of registered routes:");
  app._router.stack.forEach((middleware: any) => {
    if (middleware.route) {
      console.log(`➡️ ${Object.keys(middleware.route.methods)[0].toUpperCase()} ${middleware.route.path}`);
    } else if (middleware.name === "router") {
      middleware.handle.stack.forEach((handler: any) => {
        if (handler.route) {
          console.log(`➡️ ${Object.keys(handler.route.methods)[0].toUpperCase()} ${handler.route.path}`);
        }
      });
    }
  });
};

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error", error: err.message });
});

const PORT = process.env.PORT || 5179;

app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
  listRoutes(app);
});
