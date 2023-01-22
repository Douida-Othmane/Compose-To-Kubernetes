const { SlashCommandBuilder } = require('@discordjs/builders');
const Compose = require('../models/compose');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('launch')
		.setDescription('Launches the process of filling up your compose file.'),
	async execute(interaction) {
		await interaction.deferReply();

		const compose = await Compose.findOne({});
		if (compose) return await interaction.editReply('You already have a compose file! Until you finish it, you can\'t create a new one!');
		const newCompose = new Compose({
			version: '1',
			services: [],
		});

		await newCompose.save();
		return await interaction.editReply('Compose file initiated!');
	},
};