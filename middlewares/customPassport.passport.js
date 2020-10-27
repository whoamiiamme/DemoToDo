const passport = require("passport");
require("./../middlewares/passport");

module.exports.customPassport = (req , res, next) => {
    passport.authenticate('jwt', {session: false}, (err, user, info) => {
        if(err) {
            throw ({status: 401, message: err})
        };
        if(!user) {
            throw ({status: 401, message: info.message})
        }
        req.user = user;
        next()
    })(req, res, next)
}

