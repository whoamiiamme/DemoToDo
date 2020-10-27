const Joi = require('joi');
const passwordComplexity = require("joi-password-complexity");

const complexityOptions = {
    min: 8,
    max: 30,
    lowerCase: 1,
    upperCase: 1,
    numeric: 1,
    symbol: 1,
    requirementCount: 4,
  };

const inputSchema = Joi.object({
    // username: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string(),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    base64Image: Joi.string().allow(null, '')
});

module.exports.validateInput = async (req, res, next) => {
    const {body} = req;
    const validation = await inputSchema.validate(body);
    const valid = await passwordComplexity(complexityOptions).validate(body.password);
    if(!validation.error && !valid.error) {
        next()
    }
    if(validation.error && !valid.error) {
            return res.status(400).send({
                Message: "INPUT INVALID",
                Error: validation.error.details
            })
        }
    if(!validation.error && valid.error) {
            return res.status(400).send({
                Message: "INPUT INVALID",
                Error: valid.error.details
            })
        }
    if(validation.error && valid.error) {
        return res.status(400).send({
            Message: "INPUT INVALID",
            Error: validation.error.details,
            Errorpass: valid.error.details
        })
    }
            
};


