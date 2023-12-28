const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('Give password');
  process.exit(1);
};

const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];

const url =
  `mongodb+srv://Joel:${password}@fullstack3cluster.y7a5wjx.mongodb.net/phoneBook?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const contactSchema = new mongoose.Schema({
  name: String,
  num: Number
})

const Contact = mongoose.model('Note', contactSchema)

const contact = new Contact({
    name: name,
    num: number
})

if (process.argv.length<4) {
    Contact.find({}).then(result => {
        result.forEach(contact => {
            console.log(contact.name, contact.num);
        });
        mongoose.connection.close();
    });
  }else
  {
    contact.save().then(result => {
        console.log(`Added ${contact.name} ${contact.num} to phonebook`)
        mongoose.connection.close()
      })
  };