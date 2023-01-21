const { SlashCommandBuilder } = require('@discordjs/builders');
const Compose = require('../models/compose');
const Service = require('../models/service');
const Volume = require('../models/volume');
const Port = require('../models/port');
const Environment = require('../models/environment');
const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();
// initiate axios api
const api = axios.create({
	baseURL: `${process.env.API_URL}`,
});

const fillFlexmi = async (compose) => {
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
		const flexmi = '<?nsuri compose?>\n' +
			`<compose version="${compose.version}">\n` +
			`${services.map(service => `<service name="${service.name}" image="${service.image}">\n` +
				`${service.ports.map(port => `<port host="${port.host}" container="${port.container}" />\n`)}` +
				`${service.volumes.map(volume => `<volume name="${volume.name}" container="${volume.container}" />\n`)}` +
				`${service.environment.map(env => `<environment name="${env.name}" value="${env.value}" />\n`)}` +
				'</service>\n')}` +
			'</compose>';
		return flexmi;
	} catch (err) {
		console.log(err);
	}
};

module.exports = {
	data: new SlashCommandBuilder()
		.setName('transform')
		.setDescription('transforms the compose file to manifest file.'),
	async execute(interaction) {
		await interaction.deferReply();

		const compose = await Compose.findOne({});
		if (!compose) return await interaction.editReply('You don\'t have a compose file! Use /init to create one!');

		await fillFlexmi(compose)
			.then(async (flexmi) => {
				// send flexmi to api
				await api.post('/transform', { dockerCompose: flexmi })
					.then(async (res) => {
						const manifest = res.data;
						await Compose.deleteMany({});
						await Service.deleteMany({});
						await Volume.deleteMany({});
						await Port.deleteMany({});
						await Environment.deleteMany({});
						return await interaction.editReply('```yml\n' + manifest + '\n```');
					})
					.catch((err) => {
						console.log(err);
						return interaction.editReply('Something went wrong!');
					});
			})
			.catch((err) => {
				console.log(err);
				return interaction.editReply('Something went wrong!');
			});

	},
};