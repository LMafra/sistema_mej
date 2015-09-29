'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Junior company Schema
 */
var JuniorCompanySchema = new Schema({
	federation: {
		type: Schema.ObjectId,
		ref: 'Federation'
	},
	name: {
		type: String,
		default: '',
		required: 'Please fill Junior company name',
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

mongoose.model('JuniorCompany', JuniorCompanySchema);