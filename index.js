const express = require("express");
const morgan = require("morgan");
const cors = require("cors")

morgan.token("body", (req, res) => JSON.stringify(req.body));

const app = express();

app.use(express.json());
app.use(
	morgan((tokens, req, res) => {
		return [
			tokens.method(req, res),
			tokens.url(req, res),
			tokens.status(req, res),
			tokens.res(req, res, "content-length"),
			"-",
			tokens["response-time"](req, res),
			"ms",
			tokens.body(req, res),
		].join(" ");
	})
);
app.use(cors());

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

const generateId = () => {
	const generatedId = Math.floor(Math.random() * 1000);
	return generatedId;
};

const date = new Date();

app.get("/", (request, response) => {
	response.send("<h1>Phonebook</h1>");
});

app.get("/info", (request, response) => {
	response.send(
		`<p>Phonebook had info for ${persons.length} people</p>
    <p>${date.toString()}</p>`
	);
});

app.get("/api/persons", (request, response) => {
	response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
	const id = Number(request.params.id);
	if (id > persons.length)
		return response.status(404).json({ error: "content not found" });

	response.send(persons[id - 1]);
});

app.post("/api/persons", (request, response) => {
	const body = request.body;

	if (!body.name || !body.number)
		return response.status(400).json({ error: "content missing" });

	for (const person of persons) {
		if (body.name.toLowerCase() === person.name.toLowerCase())
			return response.status(406).json({ error: "name must be unique" });
	}

	const person = {
		id: generateId(),
		name: body.name,
		number: body.number,
	};

	persons.concat(person);

	response.json(person);
});

app.delete("/api/persons/:id", (request, response) => {
	const id = Number(request.params.id);
	persons = persons.filter((n) => n.id !== id);

	response.status(204).end();
});

const PORT = 3000;
app.listen(PORT, () => {
	console.log("Server running on port", PORT);
});
