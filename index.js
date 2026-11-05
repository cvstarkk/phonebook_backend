import express from "express";
import morgan from "morgan";
import cors from "cors"



const app = express();

app.use(express.static('dist'))
app.use(cors())
app.use(express.json())
morgan.token('body', (req) =>
  req.method === 'POST' ? JSON.stringify(req.body) : ''
)
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

const PORT = 3001;

const persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

const generateId = () => Math.floor(Math.random() * 1000000)

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({ error: 'name or number is missing' })
  }

  if (persons.find(p => p.name === body.name)) {
    return response.status(400).json({ error: 'name must be unique' })
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number
  }

  persons = persons.concat(person)
  response.json(person)
})

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/api/info", (request, response) => {
  const time = new Date();

  response.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${time}</p>
  `);
});

app.get("/api/persons/:id", (req, res) => {
  const id = req.params.id;

  const person = persons.find((p) => {
    if (p.id == id) {
      return p;
    } else {
      return false;
    }
  });
  if (person) {
    res.json(person);
  } else {
    res.status(404).end("404 Not found");
  }
});

app.delete("/api/persons/:id", (req, res) => {
    const id = req.params.id
    persons = persons.filter(n => n.id !== id)

    res.status(204).end()
})

app.listen(PORT, () => {
  console.log("hello world");
});



