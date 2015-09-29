'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Dimension Schema
 */
var DimensionSchema = new Schema({
	perfomance: {
		type: Schema.ObjectId,
		ref: 'Perfomance'
	},
	name: {
		type: String,
		default: '',
		required: 'Please fill Dimension name',
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

mongoose.model('Dimension', DimensionSchema);