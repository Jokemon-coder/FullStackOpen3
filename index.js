//const mongoose = require("mongoose");
require("dotenv").config();
const Note = require("./models/note")
const express = require("express");
const cors = require("cors");
var morgan = require("morgan");
const note = require("./models/note");
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("dist"));

morgan.token("request", function (req, res) { return req.method })
morgan.token("data", function (req, res) { console.log(res) })

//Create a global contact and a function that returns a chosen parameter.
let contact;

function getContact(c) {
    return c;
}

app.use(morgan(function (tokens, req, res) {
    let response = [
        tokens.request(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), "-",
        tokens['response-time'](req, res), 'ms',
        tokens.data(req, res)
      ].join(' ');

      //If the request is POST, add contact to response
      if(tokens.request(req, res) === "POST")
      {
        response = response.concat(JSON.stringify(contact));
      }
      
      return response;
  }));

app.get("/", (req, res) => {
    res.send("<h1>HELLO</h1>");
});

app.get("/api/notes", (req, res) => { 
    Note.find({}).then(notes => {
        res.json(notes);
        console.log(notes);
    })
});

/*app.get("/api/notes"), (req, res) => {
    Contact.find({}).then(contacts => {
        console.log(res.json(contacts));
    })
    console.log(res); 
}*/

app.get("/api/notes/:id", (req, res) => {
    //const person = persons.find(p => p.id === id)

    //Find all notes and then define person as the specific note found comparing the request id and id found in notes
    const id = req.params.id;
    Note.findById(id).then((note) => {
        //If person exists, respond. Otherwise send a 404 error
        if(note) {
            res.json(note);
        }else {
            res.status(404).end();
        }
    }).catch(error => {
        console.log(error.message);
        res.status(404).end();
    })
})

app.get("/info", (req, res) => {
    //Get the number of contacts and date
    Note.find({}).then(notes => {
        let date = new Date;
        const numberOf = notes.length;
        //Respond with the number of contacts and current date of when the response was sent
        res.send(`
    <p>Phonebook has ${numberOf} contacts<p>
    <p>${date}</p>
    `)
    })
})

app.delete("/api/notes/:id", (req, res) => {
    //Define the id request params
    const id = req.params.id;
    
    //Delete the note based on matching id
    Note.deleteOne({_id: id}).then((deleted) => {
        console.log(deleted);
    })
    //Send 204 after deletion
    res.status(204).end();
})

app.post("/api/notes", (req, res) => {
    const body = req.body;
    
    //Give 400 error if name or number contain nothing
    if(!body.name || !body.number)
    {
        return res.status(400).json({
            error: "Missing information"
        })
    }

    //Give 400 if an already existing name is found
    /*if(persons.find(person => person.name === body.name))
    {
        return res.status(400).json({
            error: "Contact already exists"
        })
    }*/

    //Create a new id that is between the the final id of contacts and 1000
    
    const person = new Note({
        name: body.name,
        number: body.number
    })
    console.log(person);

    person.save().then((result) => {
        console.log(person);
    })

    //Set the global contact as person with the return function
    contact = getContact(person);

    //Send response
    res.json(person);

})

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`We're running on ${PORT}`);
});