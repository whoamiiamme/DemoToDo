const service = require("./../services/token.service")
const constant = require("./../constant")

module.exports.getNewToken = async (req, res, next) => {
    try {
        const newAccessToken = await service.getNewToken(req);
        return res.status(200).send({
            message: constant.NEW_ACCESS_TOKEN,
            accessToken: newAccessToken
        }) 
    } catch (error) {
        next(error)
    }
}