const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://futuregpt:futuregpt@futuregpt.oxhektv.mongodb.net/futuregpt?retryWrites=true&w=majority&appName=futuregpt")
  .then(() => {
    console.log("✅ Connected");
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });