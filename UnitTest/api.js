const axios = require("axios");

module.exports.register = async () => {
    try {
        return await axios.post("http://localhost:3000/user/register",{
            password: "1234",
            email: "email3@email.com"
        })
    } catch (error) {
        return error;
    }
}