const mongoose = require('mongoose');

const composeSchema = new mongoose.Schema({
	version: {
		type: String,
		required: true,
	},
	services : [{ type: mongoose.Schema.Types.ObjectId, ref: 'Service' }],
});

const Compose = mongoose.model('Compose', composeSchema);

module.exports = Compose;