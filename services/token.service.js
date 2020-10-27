const jwt = require("jsonwebtoken");
const AWS = require("aws-sdk");
const util = require('util');
require('dotenv').config()
const constant = require("./../constant")

// AWS.config.update({
//     region: "us-west-1",
//     endpoint: "http://localhost:8000"
//   });

// const docClient = new AWS.DynamoDB.DocumentClient();

module.exports.generateToken = async (user) => {
    return await jwt.sign(user, process.env.TOKEN_SECRET, {expiresIn: "1h"})
};

module.exports.getNewToken = async (req) => {

    const { refreshToken } = req.body;
    
    const payload = await jwt.verify(refreshToken, process.env.TOKEN_SECRET);
    
    delete payload.iat;
    delete payload.exp;
   
    if(!payload) {
        throw ({status: 404, message: constant.NO_PAYLOAD});
    }
    if(payload) {
        return this.generateToken(payload);
    }
}