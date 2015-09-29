'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * City Schema
 */
var CitySchema = new Schema({
	country: {
		type: Schema.ObjectId,
		ref: 'Country'
	},
	state: {
		type: Schema.ObjectId,
		ref: 'State'
	},
	name: {
		type: String,
		default: '',
		required: 'Please fill City name',
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

mongoose.model('City', CitySchema);