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

app.get("/api/notes", (req, res, next) => { 
    Note.find({}).then(notes => {
        res.json(notes);
        console.log(notes);
    }).catch(error => next(error));
});

/*app.get("/api/notes"), (req, res) => {
    Contact.find({}).then(contacts => {
        console.log(res.json(contacts));
    })
    console.log(res); 
}*/

app.get("/api/notes/:id", (req, res, next) => {
    //const person = persons.find(p => p.id === id)

    //Find all notes and then define person as the specific note found comparing the request id and id found in notes
    const id = req.params.id;
    Note.findById(id).then((note) => {
        //If person exists, respond. Otherwise send a 404 error
        if(note) {
            res.end(JSON.stringify(note, null, " "))
        }else {
            res.status(404).end();
        }
    }).catch(error => next(error));
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

app.post("/api/notes", (req, res, next) => {
    const body = req.body;
    
    //Give 400 error if name or number contain nothing
    /*if(!body.name || !body.number)
    {
        return res.status(400).json({
            error: "Missing information"
        })
    } */   

    const person = new Note({
        name: body.name,
        number: body.number
    })
    console.log(person);

    //Save contact and send response
    person.save().then((result) => {
        res.json(person);
    }).catch(error => next(error)/*error => next(error)*/)

    //Set the global contact as person with the return function
    contact = getContact(person);

})

app.put("/api/notes/:id", (req, res, next) => {
    const id = req.params.id;
    const {name, number} = req.body;

    Note.findByIdAndUpdate(id, {name, number}, {new: true, runValidators: true, context: "query"}).then(updated => {
        console.log(updated);
        res.json(updated);
    }).catch(error => next(error));
})

const unknownEndpoint = (req, res) => {
    res.status(404).send({error: "unknown endpoint"});
  }
  app.use(unknownEndpoint);

  const wrongId = (req, res) => {
    res.status(400).send({error: "malformatted id"});
  }
  app.use(wrongId)
  
  const errorHandler = (error, req, res, next) => {
    console.log(error.message)
    if(error.name === "castError")
    {
        res.status(400).send({error: "malformatted id"});
    }
    else if(error.name === "validationError")
    {
        res.status(400).send({error: error.message});
    }
    next(error);
  }
  app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`We're running on ${PORT}`);
});