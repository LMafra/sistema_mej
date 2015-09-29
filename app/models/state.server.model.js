'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * State Schema
 */
var StateSchema = new Schema({
	country: {
		type: Schema.ObjectId,
		ref: 'Country'
	},
	name: {
		type: String,
		default: '',
		required: 'Please fill State name',
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

mongoose.model('State', StateSchema);