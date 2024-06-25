const Joi = require("joi");

module.exports.contactSchema = Joi.object({
    contact: Joi.object({
        name: Joi.string().required(),
        phone: Joi.string().required().length(10).pattern(/^\d+$/),
        email: Joi.string().allow("", null)
    }).required()
});
