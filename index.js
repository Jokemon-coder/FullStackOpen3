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

app.get("/info", (req, res) => {
    const numberOf = persons.length;
    let date = new Date;
    res.send(`
    <p>Phonebook has ${numberOf} contacts<p>
    <p>${date}</p>
    `)
})

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`We're running on ${PORT}`);
});