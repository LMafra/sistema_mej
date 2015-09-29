'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Federation Schema
 */
var FederationSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Federation name',
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

mongoose.model('Federation', FederationSchema);