import express, { Request, Response, NextFunction } from "express";
import dotenv from 'dotenv';
import sessionRoutes from "./routes/SessionRoute";


dotenv.config();
const cors = require("cors");

const app = express();
app.use(cors());
const PORT = process.env.PORT || 5000;

//const caseSheetRoutes = require("./routes/caseSheetRoutes");
console.log("Registering routes...");


app.use(express.json());
app.use("/auth", sessionRoutes);


app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err); // Logs error to console

  res.status(err.status || 500).json({
    message: err.message || "Something went wrong",
  });
});

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});