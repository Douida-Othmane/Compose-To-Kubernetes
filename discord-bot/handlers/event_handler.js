const fs = require('fs');

module.exports = (client) => {
	const loadDir = (dirs) => {
		fs.readdir(`./events/${dirs}`, (err, files) => {
			if (err) {
				console.log(err);
				return;
			}
			files.filter(file => file.endsWith('.js'))
				.map((file) => {
					const event = require(`../events/${dirs}/${file}`);
					const eventName = file.split('.')[0];
					client.on(eventName, event.bind(null, client));
				});


		});
	};
	['client', 'guild'].forEach(e => loadDir(e));
};