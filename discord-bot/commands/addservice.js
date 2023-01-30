const { SlashCommandBuilder } = require('@discordjs/builders');
const Compose = require('../models/compose');
const Service = require('../models/service');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('addservice')
		.setDescription('add a new service to your compose file.')
		.addStringOption(option =>
			option
				.setName('name')
				.setDescription('The name of the service.')
				.setRequired(true))
		.addStringOption(option =>
			option
				.setName('image')
				.setDescription('The image of the service.')
				.setRequired(true)),
	async execute(interaction) {
		await interaction.deferReply();
		const name = interaction.options.getString('name');
		const image = interaction.options.getString('image');
		const compose = await Compose.findOne({});
		const service = {
			name: name,
			image: image,
			ports: [],
			volumes: [],
			environment: [],
		};

		const newService = new Service(service);
		await newService.save();

		compose.services.push(newService._id);
		const updatedCompose = await Compose.findOneAndUpdate(compose._id, compose, { new: true });
		if (!updatedCompose) return await interaction.editReply('Something went wrong!');


		return await interaction.editReply('Service added successfully!');
	},
};