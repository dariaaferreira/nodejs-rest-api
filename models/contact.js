const { Schema, model } = require('mongoose');
const Joi = require('joi');

const { handleMongooseError } = require('../helpers');

const phoneRegexp = /^\(\d{3}\) \d{3}-\d{4}$/;

const contactSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Set name for contact'],
  },
  email: {
    type: String,
    required: [true, 'Set name for contact'],
  },
  phone: {
    type: String,
    match: [
      phoneRegexp,
      "Invalid phone number format. Expected format is (000) 000-0000. Please fill a valid phone number"
    ],
    required: [true, 'Set name for contact'],
  },
  favorite: {
    type: Boolean,
    default: false,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  }
}, {versionKey: false, timestamps: true});

contactSchema.post('save', handleMongooseError);

const addSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().regex(/@/).required(),
  phone: Joi.string().pattern(phoneRegexp).required(),
  favorite: Joi.boolean(),
});

const updateFavoriteSchema = Joi.object({
  favorite: Joi.boolean().required(),
});

const schemas = {
  addSchema,
  updateFavoriteSchema,
}

const Contact = model('contact', contactSchema);

module.exports = {
  Contact,
  schemas,
};