module.exports = async (client, message) => {
	const prefix = '!';

	if (message.author.bot) return;

	if (!message.content.startsWith(prefix)) return;

	const args = message.content.slice(prefix.length).split(' ');

	let command = args.shift().toLowerCase();

	command = client.commands.get(command);

	if (!command) return;
	try {
		await command.execute(message, args, client);
	} catch (error) {
		console.error(error);
		await message.channel.send({ content: 'There was an error while executing this command!', ephemeral: true });
	}
};