const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./src/routes/auth");
const userRoutes = require("./src/routes/user");
const paymentRoutes = require("./src/routes/payment");
const companyRoutes = require("./src/routes/company");
const connectToDatabase = require("./src/lib/db");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/company", companyRoutes);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectToDatabase();
    console.log("db connected successfully");
    app.listen(port, console.log(`server is running on port ${port}`));
  } catch (error) {
    console.log(error);
  }
};
start();
