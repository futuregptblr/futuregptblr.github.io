const dotenv = require("dotenv");
const mongoose = require("mongoose");
const Job = require("../src/models/Job");
const connectToDatabase = require("../src/lib/db");

dotenv.config({ override: true });

const TEST_JOB_FILTERS = [
  {
    title: "Intern ",
    companyName: "Bennett University",
    description: "Best Hacker",
    "salary.currency": "INR",
    "salary.min": 1,
    "salary.max": 10,
    requirements: "All kindaaa ",
  },
  {
    title: "trt",
    companyName: "Future GPT",
    description: "t",
    location: "h",
  },
];

async function main() {
  const shouldDelete = process.argv.includes("--delete");

  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not configured");
  }

  await connectToDatabase();

  const filter = { $or: TEST_JOB_FILTERS };
  const matches = await Job.find(filter)
    .select("_id title companyName description location salary requirements isActive createdAt")
    .lean();
  const broadMatches = await Job.find({
    $or: [
      { title: /Intern/i },
      { companyName: /Bennett University/i },
      { description: /Best Hacker/i },
      { requirements: /All kindaaa/i },
      { title: /^trt$/i },
      { companyName: /Future GPT/i },
      { location: /^h$/i },
    ],
  })
    .select("_id title companyName description location salary requirements isActive createdAt")
    .lean();

  console.log("Exact matches:");
  console.log(JSON.stringify(matches, null, 2));
  console.log(`Matched ${matches.length} test job(s).`);
  console.log("Broad search matches:");
  console.log(JSON.stringify(broadMatches, null, 2));

  if (!shouldDelete) {
    console.log("Dry run only. Re-run with --delete to remove these jobs.");
    return;
  }

  const result = await Job.deleteMany({
    _id: { $in: matches.map((job) => job._id) },
  });

  console.log(`Deleted ${result.deletedCount} test job(s).`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
