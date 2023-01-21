const fs = require('fs');

module.exports = (client) => {
	fs.readdir('./commands', (err, files) => {
		if (err) {
			console.log(err);
			return;
		}
		files.filter(file => file.endsWith('.js'))
			.map(file => require(`../commands/${file}`))
			.forEach((command) => client.commands.set(command.data.name, command));

	});
};