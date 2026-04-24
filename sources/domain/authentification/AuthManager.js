const jwt = require("jsonwebtoken");
const User = require("../../model/dataModels/User");
const ACCESS_SECRET = process.env.ACCESS_SECRET;

class AuthManager {

    async authMiddleware(req, res, next) {
        try {
            const authHeader = req.headers.authorization;

            if (!authHeader) {
                return res.status(401).json({ message: 'No token' });
            }

            const token = authHeader.split(' ')[1];

            const decodedUser = jwt.verify(token, ACCESS_SECRET);

            const user = await User.findByPk(decodedUser.id);

            if (!user) {
                return res.status(401).json({ message: 'User not found' });
            }

            req.user = { id: user.id };

            next();
        } catch (e) {
            return res.status(401).json({ message: "Invalid token" });
        }
    }
}

module.exports = new AuthManager();