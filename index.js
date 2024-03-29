const express = require("express");
const cors = require("cors");
var morgan = require("morgan");
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


let persons = [
    {
        id: 1,
        name: "Jacob Newman",
        number: "123456"
      },
      {
        id: 2,
        name: "Petri Kallio",
        number: "808080"
      },
      {
        id: 3,
        name: "Liisa Suo",
        number: "676767"
      }
]


app.get("/", (req, res) => {
    res.send("<h1>HELLO</h1>");
});

app.get("/api/notes", (req, res) => {
    res.json(persons);
});

app.get("/api/notes/:id", (req, res) => {
    //Define the id from request parameters
    const id = Number(req.params.id);
    //Person is found using matching id
    const person = persons.find(p => p.id === id)
    //If person exists, respond. Otherwise send a 404 error
    if(person) {
        res.json(person); 
        res.on("finish", () => contact=person)
    }
    else {
        res.status(404).end();
    }
})

app.get("/info", (req, res) => {
    //Get the number of contacts and date
    const numberOf = persons.length;
    let date = new Date;
    //Respond with the number of contacts and current date of when the response was sent
    res.send(`
    <p>Phonebook has ${numberOf} contacts<p>
    <p>${date}</p>
    `)
})

app.delete("/api/notes/:id", (req, res) => {
    //Define the id and remember to make it an actual number and not a string
    const id = Number(req.params.id);
    //Set new persons as filtered where the id does not match the selected contact
    persons = persons.filter(p => p.id !== id);
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
    if(persons.find(person => person.name === body.name))
    {
        return res.status(400).json({
            error: "Contact already exists"
        })
    }

    //Create a new id that is between the the final id of contacts and 1000
    const newId = Math.floor(Math.random(persons.length+1) * 1000);
    
    const person = {
        id: newId,
        name: body.name,
        number: body.number
    }

    //Set the global contact as person with the return function
    contact = getContact(person);

    //Set persons as persons with new contact added to it
    persons = persons.concat(person);

    //Send response
    res.json(person);

})

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`We're running on ${PORT}`);
});