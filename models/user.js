const { Schema, model } = require('mongoose');
const Joi = require('joi');

const { handleMongooseError } = require('../helpers');

const emailRegexp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const userSchema = new Schema({
    email: {
        type: String,
        match: [emailRegexp, "Invalid email format"],
        required: [true, "Email is required"],
        unique: true,
      },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlenght: [6, "The password field must be at least 6 characters long"],
      },
    subscription: {
        type: String,
        enum: ["starter", "pro", "business"],
        default: "starter"
    },
    token: {
        type: String,
        default: ''
    },
    avatarURL: {
        type: String,
        required: true,
    },
    verify: {
        type: Boolean,
        default: false,
    },
      verificationToken: {
        type: String,
        required: [true, 'Verify token is required'],
    },
}, {versionKey: false, timestamps: true});

userSchema.post('save', handleMongooseError);

const registerSchema = Joi.object({
    email: Joi.string().pattern(emailRegexp).required(),
    password: Joi.string().min(6).required(),
    subscription: Joi.string().required(),
});

const loginSchema = Joi.object({
    email: Joi.string().pattern(emailRegexp).required(),
    password: Joi.string().required(),
    subscription: Joi.string().required(),
});

const emailSchema = Joi.object({
    email: Joi.string().pattern(emailRegexp).required(),
});


const schemas = {
    registerSchema,
    loginSchema,
    emailSchema,
};

const User = model('user', userSchema);

module.exports = {
    User,
    schemas,
}