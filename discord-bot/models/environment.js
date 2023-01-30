const mongoose = require('mongoose');

const environmentSchema = new mongoose.Schema({
	name : { type: String, required: true },
	value : { type: String, required: true },
});

const Environment = mongoose.model('Environment', environmentSchema);

module.exports = Environment;