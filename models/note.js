const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const url = process.env.MONGODB_URI;

console.log("Connecting to", url);

//Connect with mongoose through url defined in ENV file. 
mongoose.connect(url).then((res) => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.log("Error connecting to MongoDB occurred", err.message)
})

//Define the mongoose schema used for contacts added
const noteSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
        required: true
    },
    number: {
        type: String,
        validate: {
            validator: function(v) {
                //Validator for checking if number is in correct format
                return /\d{3}-\d{3}-\d{4}/.test(v);
            },
            message: props => `${props.value} is not a valid number. Use format 000-000-0000.`
        },
        required: true
    }
})

//Alter schema so it doesn't contain the returned._id, returned.__v
noteSchema.set("toJSON", {
    transform: (document, returned) => {
        returned.id = returned._id.toString()
        console.log(returned.id, returned._id, returned.__v);
        delete returned._id;
        delete returned.__v;
      }
})

//Export noteSchema
module.exports = mongoose.model("Note", noteSchema)