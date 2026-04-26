const User = require('../../model/dataModels/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { Op } = require('sequelize');

const ACCESS_SECRET = process.env.ACCESS_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;

const generateTokens = (user) => {
    const payload = {
        id: user.id,
        email: user.email
    };

    const accessToken = jwt.sign(payload, ACCESS_SECRET, { expiresIn: "15m" });
    const refreshToken = jwt.sign(payload, REFRESH_SECRET, { expiresIn: "30d" });

    return { accessToken, refreshToken };
};

class AuthController {

    async register(req, res) {
        try {
            const { username, email, password } = req.body;

            if (!username || !email || !password) {
                return res.status(400).json({ message: "All fields required" });
            }

            const candidate = await User.findOne({
                where: {
                    [Op.or]: [{ username }, { email }]
                }
            });

            if (candidate) {
                return res.status(409).json({ message: "User already exists" });
            }

            const hashPassword = bcrypt.hashSync(password, 7);

            const user = await User.create({
                id: uuidv4(),
                username,
                email,
                password: hashPassword
            });

            const tokens = generateTokens(user);

            user.refreshToken = tokens.refreshToken;
            await user.save();

            return res.json({
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken,
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email
                }
            });

        } catch (e) {
            console.error(e.message);
            res.status(500).json({ message: "Registration error" });
        }
    }

    async login(req, res) {
        try {
            const { username, password } = req.body;

            const user = await User.findOne({ where: { username } });

            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            const validPassword = bcrypt.compareSync(password, user.password);

            if (!validPassword) {
                return res.status(401).json({ message: "Wrong password" });
            }

            const tokens = generateTokens(user);

            user.refreshToken = tokens.refreshToken;
            await user.save();

            return res.json({
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken,
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email
                }
            });

        } catch (e) {
            console.error(e.message);
            res.status(500).json({ message: "Login error" });
        }
    }

    async refresh(req, res) {
        try {
            const { refreshToken } = req.body;

            if (!refreshToken) {
                return res.status(401).json({ message: "No refresh token" });
            }

            let decoded;
            try {
                decoded = jwt.verify(refreshToken, REFRESH_SECRET);
            } catch (e) {
                return res.status(401).json({ message: "Invalid refresh token" });
            }

            const user = await User.findByPk(decoded.id);

            if (!user || user.refreshToken !== refreshToken) {
                return res.status(403).json({ message: "Token mismatch" });
            }

            const tokens = generateTokens(user);

            user.refreshToken = tokens.refreshToken;
            await user.save();

            return res.json({
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken,
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email
                }
            });
        } catch (e) {
            console.error(e.message);
            res.status(500).json({ message: "Refresh error" });
        }
    }

    async check(req, res) {
        try {
            const authHeader = req.headers.authorization;

            if (!authHeader) {
                return res.status(401).json({ message: "No token" });
            }

            const token = authHeader.split(' ')[1];

            let decoded;
            try {
                decoded = jwt.verify(token, ACCESS_SECRET);
            } catch (e) {
                return res.status(401).json({ message: "Invalid token" });
            }

            const user = await User.findByPk(decoded.id);

            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            return res.json({
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email
                }
            });

        } catch (e) {
            console.error(e.message);
            res.status(500).json({ message: "Check error" });
        }
    }

    async logout(req, res) {
        try {
            const { refreshToken } = req.body;

            if (!refreshToken) {
                return res.status(400).json({ message: "No refresh token" });
            }

            const user = await User.findOne({ where: { refreshToken } });

            if (!user) {
                return res.status(400).json({ message: "User not found" });
            }

            user.refreshToken = null;
            await user.save();

            return res.json({ message: "Logged out" });

        } catch (e) {
            console.error(e.message);
            res.status(500).json({ message: "Logout error" });
        }
    }

    async updateUserData(req, res) {
        try {
            const userId = req.user.id;

            const thisUser = await User.findByPk(userId);

            if (!thisUser) {
                return res.status(404).json({ message: 'User not found' });
            }

            const { username, email, password } = req.body;

            if (username) {
                thisUser.username = username;
            }

            if (email) {
                thisUser.email = email;
            }

            if (password) {
                const hashPassword = bcrypt.hashSync(password, 7);
                thisUser.password = hashPassword;
            }

            await thisUser.save();

            return res.status(200).json({ message: 'User updated successfully' });

        } catch (e) {
            console.error(e.message);
            res.status(500).json({ message: 'Error' });
        }
    }

}

module.exports = new AuthController();
