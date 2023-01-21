
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