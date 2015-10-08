'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Area Schema
 */
var AreaSchema = new Schema({
	organogram: {
		type: Schema.ObjectId,
		ref: 'Organogram'
	},
	name: {
		type: String,
		default: '',
		required: 'Please fill Area name',
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

mongoose.model('Area', AreaSchema);