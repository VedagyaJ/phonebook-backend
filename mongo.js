const mongoose = require("mongoose");

if (process.argv.length < 3) {
	console.log("Please give a password, a  name and a number");
	process.exit(1);
}
const password = process.argv[2];

const url = `mongodb+srv://Vedagya:${password}@phonebook.qod43id.mongodb.net/phonebookApp?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const contactSchema = new mongoose.Schema({
	name: String,
	number: String,
});

const Contact = mongoose.model("Contact", contactSchema);

if (process.argv.length === 3) {
	Contact.find({}).then((result) => {
		result.forEach((note) => {
			console.log(note);
		});
		mongoose.connection.close();
	});
} else {
	const name = process.argv[3];
	const number = process.argv[4];

	const contact = new Contact({
		name,
		number,
	});

	contact.save().then((result) => {
		console.log(
			`added ${result.name} number ${result.number} to phonebook`
		);
		mongoose.connection.close();
	});
}
