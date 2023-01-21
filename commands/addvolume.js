const { SlashCommandBuilder } = require('@discordjs/builders');
const Service = require('../models/service');
const Volume = require('../models/volume');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('addvolume')
		.setDescription('Add a volume to a service')
		.addStringOption(option =>
			option
				.setName('service-name')
				.setDescription('The service to which the volume belongs.')
				.setRequired(true))
		.addStringOption(option =>
			option
				.setName('name')
				.setDescription('The volume name.')
				.setRequired(true))
		.addStringOption(option =>
			option
				.setName('container')
				.setDescription('The volume container.')
				.setRequired(true)),
	async execute(interaction) {
		await interaction.deferReply();
		const serviceName = interaction.options.getString('service-name');
		const name = interaction.options.getString('name');
		const container = interaction.options.getString('container');

		const service = await Service.findOne({ name : serviceName });
		if (!service) return await interaction.editReply('Service not found!');

		const volume = {
			name: name,
			container: container,
		};

		const newVolume = new Volume(volume);
		await newVolume.save();

		service.volumes.push(newVolume._id);
		const updatedService = await Service.findByIdAndUpdate(service._id, service, { new: true });
		if (!updatedService) return await interaction.editReply('Something went wrong!');
		return await interaction.editReply(`Volume added to Service: **${service.name}** successfully!`);
	},
};
