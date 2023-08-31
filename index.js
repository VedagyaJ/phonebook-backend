const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

const errorHandler = (error, request, response, next) => {
	console.log(error.message);

	if (error.name === "CastError") {
		return response.status(400).json({ error: "malformatted id" });
	}

	next(error);
};

const Contact = require("./models/contact");

app.use(express.json());
app.use(cors());
app.use(express.static("dist"));

let persons = [
	{
		id: 1,
		name: "Arto Hellas",
		number: "040-123456",
	},
	{
		id: 2,
		name: "Ada Lovelace",
		number: "39-44-5323523",
	},
	{
		id: 3,
		name: "Dan Abramov",
		number: "12-43-234345",
	},
	{
		id: 4,
		name: "Mary Poppendieck",
		number: "39-23-6423122",
	},
];

const date = new Date();

app.get("/", (request, response) => {
	response.send("<h1>Phonebook</h1>");
});

app.get("/info", (request, response) => {
	Contact.find({}).then((contacts) => {
		response.send(
			`<p>Phonebook has info for ${
				contacts.length
			} people</p> <p>${date.toString()}</p>`
		);
	});
});

app.get("/api/persons", (request, response) => {
	Contact.find({}).then((contacts) => {
		response.send(contacts);
	});
});

app.get("/api/persons/:id", (request, response, next) => {
	Contact.findById(request.params.id)
		.then((note) => {
			if (note) {
				response.json(note);
			} else {
				response.status(404).end();
			}
		})
		.catch((error) => next(error));
});

app.post("/api/persons", (request, response) => {
	const body = request.body;

	if (!body.name || !body.number)
		return response.status(400).json({ error: "content missing" });

	const contact = new Contact({
		name: body.name,
		number: body.number,
	});

	contact.save().then((savedContact) => {
		response.json(savedContact);
	});
});

app.delete("/api/persons/:id", (request, response, next) => {
	Contact.findByIdAndDelete(request.params.id)
		.then((result) => {
			response.status(204).end();
		})
		.catch((error) => next(error));
});

app.put("/api/persons/:id", (request, response, next) => {
	const body = request.body;

	const contact = {
		name: body.name,
		number: body.number,
	};

	Contact.findByIdAndUpdate(request.params.id, contact, { new: true })
		.then((updatedNote) => {
			response.json(updatedNote);
		})
		.catch((error) => next(error));
});

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
	console.log("Server running on port", PORT);
});
