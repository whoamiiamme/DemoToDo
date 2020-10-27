const { Service } = require("aws-sdk")

const service = require("./../services/user.service");
const constant = require("./../constant")

module.exports.register = async (req, res, next) => {
    try {
        await service.register(req);
        return res.status(200).send({
            Message: constant.REGISTER,
        })
    } catch (error) {
        next(error);
    }
};

module.exports.login = async (req, res, next) => {
    try {
        const info = await service.authenticate(req);
        return res.status(200).send({
            message: constant.LOGIN,
            info: info
        })
    } catch (error) {
        next(error)
    }
};

module.exports.getProfile = async (req, res, next) => {
    try {
        const info = await service.getProfile(req);
        return res.status(200).send({
            message: constant.RETRIEVED_SUCCESSFUL,
            info: info
        })
    } catch (error) {
        
    }
}