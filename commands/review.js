const { SlashCommandBuilder } = require('@discordjs/builders');
const Compose = require('../models/compose');
const Service = require('../models/service');
const Volume = require('../models/volume');
const Port = require('../models/port');
const Environment = require('../models/environment');

const fillCompose = async (compose) => {
	try {
		// fill services array
		const services = [];
		for (const service of compose.services) {
			const serviceData = await Service.findOne({ _id: service });
			const ports = [];
			for (const port of serviceData.ports) {
				const portData = await Port.findOne({ _id: port });
				ports.push({ host: portData.host, container: portData.container });
			}
			const volumes = [];
			for (const volume of serviceData.volumes) {
				const volumeData = await Volume.findOne({ _id: volume });
				volumes.push({ name: volumeData.name, container: volumeData.container });
			}
			const environment = [];
			for (const env of serviceData.environment) {
				const envData = await Environment.findOne({ _id: env });
				environment.push({ name: envData.name, value: envData.value });
			}
			services.push({ name: serviceData.name, image: serviceData.image, ports: ports, volumes: volumes, environment: environment });
		}
		// write it to a string in the form of a docker-compose.yml file
		let composeFile = `version: ${compose.version}\n` +
		'services:\n';
		for (const service of services) {
			composeFile += `  ${service.name}:\n` +
			`    image: ${service.image}\n`;
			if (service.ports.length > 0) {
				composeFile += '    ports:\n';
				for (const port of service.ports) {
					composeFile += `      - "${port.host}:${port.container}"\n`;
				}
			}
			if (service.volumes.length > 0) {
				composeFile += '    volumes:\n';
				for (const volume of service.volumes) {
					composeFile += `      - ${volume.name}:${volume.container}\n`;
				}
			}
			if (service.environment.length > 0) {
				composeFile += '    environment:\n';
				for (const env of service.environment) {
					composeFile += `      - ${env.name}=${env.value}\n`;
				}
			}
		}
		return composeFile;
	} catch (err) {
		console.log(err);
	}
};

module.exports = {
	data: new SlashCommandBuilder()
		.setName('review')
		.setDescription('Review the docker-compose.yml file'),
	async execute(interaction) {
		await interaction.deferReply();
		const compose = await Compose.findOne({});
		if (!compose) return await interaction.editReply('No compose file found!');

		// write it to a string in the form of a docker-compose.yml file
		await fillCompose(compose)
			.then(composeFile => {
				return interaction.editReply({ content: `\`\`\`yaml\n${composeFile}\`\`\`` });
			})
			.catch(err => {
				console.log(err);
				return interaction.editReply('Something went wrong!');
			});

	},
};
