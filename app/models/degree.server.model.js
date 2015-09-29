'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Degree Schema
 */
var DegreeSchema = new Schema({
	university: {
		type: Schema.ObjectId,
		ref: 'University'
	},
	name: {
		type: String,
		default: '',
		required: 'Please fill Degree name',
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

mongoose.model('Degree', DegreeSchema);