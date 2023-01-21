const { SlashCommandBuilder } = require('@discordjs/builders');
const Environment = require('../models/environment');
const Service = require('../models/service');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('addenv')
		.setDescription('Add a port to a service')
		.addStringOption(option =>
			option
				.setName('service-name')
				.setDescription('The service to which the env belongs.')
				.setRequired(true))
		.addStringOption(option =>
			option
				.setName('name')
				.setDescription('The env name.')
				.setRequired(true))
		.addStringOption(option =>
			option
				.setName('value')
				.setDescription('The env value.')
				.setRequired(true)),
	async execute(interaction) {
		await interaction.deferReply();
		const serviceName = interaction.options.getString('service-name');
		const name = interaction.options.getString('name');
		const value = interaction.options.getString('value');

		const service = await Service.findOne({ name : serviceName });
		if (!service) return await interaction.editReply('Service not found!');

		const env = {
			name: name,
			value: value,
		};

		const newEnv = new Environment(env);
		await newEnv.save();
		if (!newEnv._id) return await interaction.editReply('Something went wrong!');

		service.environment.push(newEnv._id);
		const updatedService = await Service.findByIdAndUpdate(service._id, service, { new: true });
		if (!updatedService) return await interaction.editReply('Something went wrong!');

		return await interaction.editReply(`Env added to Service: **${service.name}** successfully!`);
	},
};

