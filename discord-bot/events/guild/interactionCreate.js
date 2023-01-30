const cooldowns = new Map();
const Discord = require('discord.js');
module.exports = async (client, interaction) => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!cooldowns.has(interaction.commandName)) {
		cooldowns.set(interaction.commandName, new Discord.Collection());
	}
	const current_time = Date.now();
	const time_stamps = cooldowns.get(interaction.commandName);
	const cooldown_amount = (command.cooldown) * 1000;
	const specialId = interaction.user.id + '-' + interaction.commandName;
	if (time_stamps.has(specialId)) {
		const expiration_time = time_stamps.get(specialId) + cooldown_amount;

		if (current_time < expiration_time) {
			const time_left = (expiration_time - current_time) / 1000;
			const minutes = Math.floor(time_left / 60);
			const seconds = time_left - minutes * 60;
			return interaction.reply(`Please wait ${minutes} minutes and ${seconds.toFixed(0)} seconds before using the ${command.data.name} command.`);
		}
	}

	time_stamps.set(specialId, current_time);
	setTimeout(() => time_stamps.delete(specialId), cooldown_amount);

	if (!command) return;

	try {
		await command.execute(interaction, client);
	} catch (error) {
		console.error(error);
		await interaction.editReply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
};