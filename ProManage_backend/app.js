const express = require("express");
const app = express();

const dotenv = require("dotenv");
dotenv.config();

const PORT = process.env.PORT || 4000;

const cors = require("cors");
app.use(cors());

const authRoute = require("./Routes/auth");
const taskRoute = require("./Routes/task");

// express parser
app.use(express.json());

const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("DB Connected!"))
  .catch((err) => console.log("DB Failed to Connect!", err));

app.get("/api/health", (req, res) => {
  console.log("hey health!");
  res.json({
    service: "ProManage Server",
    status: "active",
    time: new Date(),
  });
});

// Middleware
app.use("/api/auth", authRoute);
app.use("/api/task", taskRoute);

// Middleware for Error
app.use((error, req, res, next) => {
  console.log(error);
  res.status(500).json({ errorMessage: "Something went wrong!" });
});

app.listen(PORT, () => {
  console.log(`ProManage Server is running on port ${PORT}`);
});
