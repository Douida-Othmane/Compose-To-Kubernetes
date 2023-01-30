const mongoose = require('mongoose');

const portSchema = new mongoose.Schema({
	host : { type: String, required: true },
	container : { type: String, required: true },
});

const Port = mongoose.model('Port', portSchema);

module.exports = Port;