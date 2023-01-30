const { Client, Collection, Intents } = require('discord.js');
const mongoose = require('mongoose');
require('dotenv').config();


const myIntents = new Intents(32767);

const client = new Client({ intents: myIntents, partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });


client.commands = new Collection();
client.events = new Collection();

mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(async () => {
		['command_handler', 'event_handler'].forEach(handler => {
			require(`./handlers/${handler}`)(client);
		});
		console.log('Connected to Database.');
		client.login(process.env.BOT_TOKEN);

	})
	.catch((err) => console.log(err));
