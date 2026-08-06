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
const globalJobsRoutes = require("./src/routes/globalJobs");
const mongoose = require("mongoose");
const TeamMember = require("./src/models/TeamMember");
const Event = require("./src/models/Event");
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
app.use("/api/global-jobs", globalJobsRoutes);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectToDatabase();
    console.log("--- Database Debug ---");
    console.log("DB Name:", mongoose.connection.name);
    console.log("DB Host:", mongoose.connection.host);

    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(
      "Collections:",
      collections.map((c) => c.name)
    );

    const teamCount = await TeamMember.countDocuments();
    const eventCount = await Event.countDocuments();
    console.log("TeamMember Count:", teamCount);
    console.log("Event Count:", eventCount);
    console.log("----------------------");

    app.listen(port, console.log(`server is running on port ${port}`));
  } catch (error) {
    console.log(error);
  }
};
start();
