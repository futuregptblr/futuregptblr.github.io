const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const authRoutes = require("./src/routes/auth");
const userRoutes = require("./src/routes/user");
const paymentRoutes = require("./src/routes/payment");
const companyRoutes = require("./src/routes/company");
const waitlistRoutes = require("./src/routes/waitlist");
const cloudinaryRoutes = require("./src/routes/cloudinary");
const teamRoutes = require("./src/routes/team");
const eventRoutes = require("./src/routes/events");
const statsRoutes = require("./src/routes/stats");
const connectToDatabase = require("./src/lib/db");
const communityRoutes = require("./src/routes/community");

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
app.use("/api/waitlist", waitlistRoutes);
app.use("/api/cloudinary", cloudinaryRoutes);
app.use("/api/team", teamRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/community", communityRoutes);

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
