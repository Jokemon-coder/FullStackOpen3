const mongoose = require('mongoose')

//If the entry in the command line is less than 3, ask to give a password and exit
if (process.argv.length<3) {
  console.log('Give password');
  process.exit(1);
};

//Variables taken from the given argument in the command line
const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];

const url =
  `mongodb+srv://Joel:${password}@fullstack3cluster.y7a5wjx.mongodb.net/phoneBook?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)

//Connect mongoose with the given url
mongoose.connect(url)

//Schema for the entry and how it is structured
const contactSchema = new mongoose.Schema({
  name: String,
  number: Number
})

//Contact as defined by the mongoose schema
const Contact = mongoose.model('Note', contactSchema)

//New contact created
const contact = new Contact({
    name: name,
    number: number
})

//If command line argument has just the password and nothing else, show all entries
if (process.argv.length<4) {
    Contact.find({}).then(result => {
      console.log("Phonebook: ")
        result.forEach(contact => {
            //console.log(contact)
            console.log(contact.name, contact.number);
        });
        mongoose.connection.close();
    });
  }else
  {
    //Create contact based on the entered data
    contact.save().then(result => {
        console.log(`Added ${contact.name} ${contact.number} to phonebook`)
        mongoose.connection.close()
      })
  };