const dotenv = require("dotenv");
const mongoose = require("mongoose");
const connectToDatabase = require("../src/lib/db");

dotenv.config({ override: true });

const TERMS = [
  "Intern",
  "Best Hacker",
  "trt",
  "All kindaaa",
  "Bennett University",
  "Future GPT",
];

async function main() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not configured");
  }

  await connectToDatabase();

  const collections = await mongoose.connection.db.listCollections().toArray();
  const matches = [];

  for (const collectionInfo of collections) {
    const collection = mongoose.connection.db.collection(collectionInfo.name);
    const docs = await collection.find({}).toArray();

    for (const doc of docs) {
      const text = JSON.stringify(doc);
      const terms = TERMS.filter((term) => text.includes(term));
      if (terms.length > 0) {
        matches.push({
          collection: collectionInfo.name,
          id: doc._id,
          terms,
        });
      }
    }
  }

  console.log(JSON.stringify(matches, null, 2));
  console.log(`Matched ${matches.length} document(s).`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
