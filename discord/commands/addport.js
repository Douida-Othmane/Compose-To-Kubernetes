const { SlashCommandBuilder } = require('@discordjs/builders');
const Port = require('../models/port');
const Service = require('../models/service');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('addport')
		.setDescription('Add a port to a service')
		.addStringOption(option =>
			option
				.setName('service-name')
				.setDescription('The service to which the port belongs.')
				.setRequired(true))
		.addStringOption(option =>
			option
				.setName('host')
				.setDescription('The port host.')
				.setRequired(true))
		.addStringOption(option =>
			option
				.setName('container')
				.setDescription('The port container.')
				.setRequired(true)),
	async execute(interaction) {
		await interaction.deferReply();
		const serviceName = interaction.options.getString('service-name');
		const host = interaction.options.getString('host');
		const container = interaction.options.getString('container');

		const service = await Service.findOne({ name : serviceName });
		if (!service) return await interaction.editReply('Service not found!');

		const port = {
			host: host,
			container: container,
		};

		const newPort = new Port(port);
		await newPort.save();

		service.ports.push(newPort._id);
		const updatedService = await Service.findByIdAndUpdate(service._id, service, { new: true });
		if (!updatedService) return await interaction.editReply('Something went wrong!');

		return await interaction.editReply(`Port added to Service: **${service.name}** successfully!`);
	},
};