const jwt = require("jsonwebtoken");
const {secret} = require("../../../config");
const User = require("../../model/dataModels/User");

class AuthManager {

    async checkToken(req, res, token) {
        try {
            if (!token) {
                return res.status(403).json({message: 'NO token provided'});
            }

            const decodedUser = jwt.verify(token, secret);

            const user = await User.findOne({
                where: {id: decodedUser.id}
            });

            if (!user || !user.token) {
                return res.status(401).json({message: 'User not authorized'});
            }

            if (user.tokenExpiration < Date.now()) {
                return res.status(401).json({message: 'Token expired'});
            }
        } catch (e) {
            return res.status(403).json({message: "Token expired"})
        }

        return null
    }
}

module.exports = new AuthManager()