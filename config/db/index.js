const mongoose = require("mongoose");

async function connect() {
  try {
    await mongoose.connect("mongodb://localhost:27017/ChatAppLan1", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connect successfully!!!!");
  } catch (error) {
    console.log("Connect fail!!!!");
  }
}
module.exports = { connect };
