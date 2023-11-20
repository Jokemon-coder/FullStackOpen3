const express = require("express");
const app = express();
app.use(express.json());

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

app.get("/api/persons", (req, res) => {
    res.json(persons);
});

app.get("/api/persons/:id", (req, res) => {
    //Define the id from request parameters
    const id = Number(req.params.id);
    //Person is found using matching id
    const person = persons.find(p => p.id === id)
    //If person exists, respond. Otherwise send a 404 error
    if(person) {
        res.json(person); 
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

app.delete("/api/persons/:id", (req, res) => {
    //Define the id and remember to make it an actual number and not a string
    const id = Number(req.params.id);
    //Set new persons as filtered where the id does not match the selected contact
    persons = persons.filter(p => p.id !== id);
    //Send 204 after deletion
    res.status(204).end();
})

app.post("/api/persons", (req, res) => {
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

    //Set persons as persons with new contact added to it
    persons = persons.concat(person);

    //Send response
    res.json(person);

})

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`We're running on ${PORT}`);
});