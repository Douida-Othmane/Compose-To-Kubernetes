const mongoose = require('mongoose');

const volumeSchema = new mongoose.Schema({
	name : { type: String, required: true },
	container : { type: String, required: true },
});

const Volume = mongoose.model('Volume', volumeSchema);

module.exports = Volume;