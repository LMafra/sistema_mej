'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Question Schema
 */
var QuestionSchema = new Schema({
	perfomance:{
		type: Schema.ObjectId,
		ref: 'Perfomance'
	},

	dimension: {
		type: Schema.ObjectId,
		ref: 'Dimension'
	},
	name: {
		type: String,
		default: '',
		required: 'Please fill Question name',
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

mongoose.model('Question', QuestionSchema);