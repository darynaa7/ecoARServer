const jwt = require("jsonwebtoken");
const { secret } = require("../../../config");
const User = require("../../model/dataModels/User");

class AuthManager {

    async checkToken(req, res, token) {
        try {
            if (!token) {
                return res.status(403).json({ message: 'No token provided' });
            }

            const decodedUser = jwt.verify(token, secret);

            const user = await User.findOne({
                where: { id: decodedUser.id }
            });

            if (!user || !user.token) {
                return res.status(401).json({ message: 'User not authorized' });
            }

            if (user.tokenExpiration < Date.now()) {
                return res.status(401).json({ message: 'Token expired' });
            }

            return user;
        } catch (e) {
            return res.status(403).json({ message: "Token error" });
        }
    }

    async authMiddleware(req, res, next) {
        try {
            const authHeader = req.headers.authorization;

            if (!authHeader) {
                return res.status(403).json({ message: 'No token provided' });
            }

            const token = authHeader.split(' ')[1];

            const decodedUser = jwt.verify(token, secret);

            const user = await User.findOne({
                where: { id: decodedUser.id }
            });

            if (!user || !user.token) {
                return res.status(401).json({ message: 'User not authorized' });
            }

            if (user.tokenExpiration < Date.now()) {
                return res.status(401).json({ message: 'Token expired' });
            }

            req.user = {
                id: user.id
            };

            next();

        } catch (e) {
            return res.status(403).json({ message: "Token error" });
        }
    }
}

module.exports = new AuthManager();