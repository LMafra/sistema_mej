'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Perfomance Schema
 */
var PerfomanceSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Perfomance name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Perfomance', PerfomanceSchema);