const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const url = process.env.MONGODB_URI;

console.log("Connecting to", url);

mongoose.connect(url).then((res) => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.log("Error connecting to MongoDB occurred", err.message)
})

const noteSchema = new mongoose.Schema({
    name: String,
    number: String
})

noteSchema.set("toJSON", {
    transform: (document, returned) => {
        returned.id = returned._id.toString()
        console.log(returned.id, returned._id, returned.__v);
        delete returned._id;
        delete returned.__v;
      }
})

module.exports = mongoose.model("Note", noteSchema)