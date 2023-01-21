# discord-js-init
A discord.js bot environment setup for you to use in all your Discord Bot projects based on Slash Commands!


# Environment setup
1. pull the repository to your local workplace.
2. execute the command `npm install`
3. cerate a `.env` file with all the credentials you need.
4. execute `node deploy-commands.js` each time you make a new command file in the commands folder
5. you are ready to go, invite your bot to your server and have fun with your slash commands!

# Notes

* In case you want to work with mongoose, it's already built in, if not just replace the index.js file with the following:
```js
const { Client, Collection, Intents } = require('discord.js');
const mongoose = require('mongoose');
require('dotenv').config();

const myIntents = new Intents(32767);

const client = new Client({ intents: myIntents, partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });

client.commands = new Collection();
client.events = new Collection();

['command_handler', 'event_handler'].forEach(handler => {
	require(`./handlers/${handler}`)(client);
});

client.login(process.env.BOT_TOKEN);
```

* For any command you would like to create, create a new file with the name of the command example: `ping.js` and place it in the commands folder. Make sure each command file has this same code structure:

```js
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction) {
		await interaction.reply('Pong!');
	},
};
```
That's it, good luck and have fun!