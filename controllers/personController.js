import { Router } from "express";
import Person from "../models/person.js";

const personsRouter = Router();

personsRouter.get("/", (request, response, next) => {
  Person.find({})
    .then((persons) => response.json(persons))
    .catch((error) => next(error));
});

personsRouter.post("/", (request, response, next) => {
  const { name, number } = request.body;

  if (!name || !number) {
    return response.status(400).json({ error: "name or number is missing" });
  }

  const person = new Person({ name, number });

  person
    .save()
    .then((savedPerson) => response.json(savedPerson))
    .catch((error) => next(error));
});

personsRouter.put("/:id", (request, response, next) => {
  const { name, number } = request.body;

  Person.findByIdAndUpdate(
    request.params.id,
    { name, number },
    { new: true, runValidators: true, context: "query" },
  )
    .then((updatedPerson) => {
      if (updatedPerson) {
        response.json(updatedPerson);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

// must stay above "/:id", or "info" would be treated as an id
personsRouter.get("/info", (request, response, next) => {
  Person.countDocuments({})
    .then((count) => {
      response.send(`
        <p>Phonebook has info for ${count} people</p>
        <p>${new Date()}</p>
      `);
    })
    .catch((error) => next(error));
});

personsRouter.get("/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

personsRouter.delete("/:id", (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => response.status(204).end())
    .catch((error) => next(error));
});

export default personsRouter;