import "dotenv/config";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import Person from "./models/person.js";

const app = express();

app.use(express.static("dist"));
app.use(cors());
app.use(express.json());

morgan.token("body", (req) =>
  req.method === "POST" ? JSON.stringify(req.body) : "",
);
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body"),
);

const PORT = process.env.PORT || 3001;

app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});

app.post("/api/persons", (request, response) => {
  const { name, number } = request.body;

  if (!name || !number) {
    return response.status(400).json({ error: "name or number is missing" });
  }

  const person = new Person({ name, number });

  person.save().then((savedPerson) => {
    response.json(savedPerson);
  });
});

app.get("/api/info", (request, response) => {
  Person.countDocuments({}).then((count) => {
    response.send(`
      <p>Phonebook has info for ${count} people</p>
      <p>${new Date()}</p>
    `);
  });
});

// Not converted yet (later exercises)
app.get("/api/persons/:id", (request, response) => {
  response.status(501).json({ error: "not implemented yet" });
});

app.delete("/api/persons/:id", (request, response) => {
  response.status(501).json({ error: "not implemented yet" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
