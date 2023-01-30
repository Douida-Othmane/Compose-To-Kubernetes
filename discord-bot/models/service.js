const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
	name : { type: String, required: true },
	image : { type: String, required: true },
	ports : [{ type: mongoose.Schema.Types.ObjectId, ref: 'Port' }],
	volumes : [{ type: mongoose.Schema.Types.ObjectId, ref: 'Volume' }],
	environment : [{ type: mongoose.Schema.Types.ObjectId, ref: 'Environment' }],
});

const Service = mongoose.model('Service', serviceSchema);

module.exports = Service;
