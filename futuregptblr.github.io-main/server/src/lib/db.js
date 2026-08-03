const mongoose = require("mongoose");

async function connectToDatabase() {
  let mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error("MONGODB_URI is not set in environment");
  }

  const url = new URL(mongoUri);

  if (url.pathname !== "/test") {
    console.log(`Original DB in URI: '${url.pathname}'. Switching to '/test'.`);
    url.pathname = "/test";
    mongoUri = url.toString();
  }

  mongoose.set("strictQuery", true);

  await mongoose.connect(mongoUri, {
    autoIndex: true,
  });

  console.log("Connected to MongoDB");
  console.log("Connected DB:", mongoose.connection.name);
  console.log("Connected Host:", mongoose.connection.host);

  const collections = await mongoose.connection.db.listCollections().toArray();
  console.log("Collections:", collections.map(c => c.name));
}

module.exports = connectToDatabase;