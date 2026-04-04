const User = require('../../model/dataModels/User')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {secret} = require("../../../config")
const {v4: uuidv4} = require('uuid');
const moment = require("moment");
const AuthManager = require("./AuthManager")

const generateAccessToken = (id, roles) => {
    const payload = {
        id,
        roles
    }
    return jwt.sign(payload, secret, {expiresIn: "24h"})
}

class AuthController {

    async register(req, res) {
        try {
            const username = req.body.username;
            const email = req.body.email;
            const password = req.body.password;

            const candidate = await User.findOne({where: {username}});
            if (candidate) {
                return res.status(409).json();
            }

            const hashPassword = bcrypt.hashSync(password, 7);
            const newUser = await User.create({
                id: uuidv4(),
                username,
                password: hashPassword,
                email,
                tokenExpiration: moment().add(30, 'days').valueOf()
            });

            const token = generateAccessToken(newUser.id, newUser.roles);

            newUser.token = token;
            await newUser.save();

            return res.json({
                token: token,
                user: {
                    login: newUser.username,
                    id: newUser.id,
                    email: newUser.email
                }
            });
        } catch (e) {
            console.log(`ERROR: ${e}`);
            res.status(400).json({message: 'Registration error'});
        }
    }

    async login(req, res) {
        try {
            const username = req.body.username;
            const password = req.body.password;
            console.log("1")
            const user = await User.findOne({where: {username}});

            if (!user) {
                return res.status(404).json();
            }

            const validPassword = bcrypt.compareSync(password, user.password);
            if (!validPassword) {
                return res.status(409).json();
            }
            console.log("2")

            const token = generateAccessToken(user.id, user.roles);
            user.token = token;
            user.tokenExpiration = moment().add(1, 'days').valueOf();
            await user.save();

            return res.json({
                token: token,
                user: {
                    login: user.username,
                    id: user.id,
                    email: user.email
                }
            });
        } catch (e) {
            console.log(e);
            res.status(400).json({message: 'Login error'});
        }
    }

    async check(req, res) {
        try {
            const authorizationHeader = req.headers["authorization"];

            if (!authorizationHeader) {
                return res.status(403).json({message: 'User not authorized, no token, no header'});
            }

            const token = authorizationHeader.split(' ')[1];

            const tokenCheckResult = await AuthManager.checkToken(req, res, token)

            if (tokenCheckResult != null) {
                return tokenCheckResult
            }

            const user = await User.findOne({where: {token}});

            return res.json({
                token: token,
                user: {
                    login: user.username,
                    id: user.id,
                    email: user.email

                }
            });
        } catch (error) {
            console.error(error);
            if (error.name === 'JsonWebTokenError') {
                return res.status(401).json({message: "Invalid token"});
            } else {
                return res.status(500).json({message: "Internal Server Error"});
            }
        }

    }

    async logout(req, res) {
        try {
            const authorizationHeader = req.headers["authorization"];

            if (!authorizationHeader) {
                return res.status(403).json({message: 'User not authorized, no token, no header'});
            }

            const token = authorizationHeader.split(' ')[1];

            const user = await User.findOne({ where: { token } });

            if (!user) {
                return res.status(400).json({message: `There's no user with token ${token}`});
            }

            const currentTimeInMillis = Date.now();
            await User.update({ tokenExpiration: currentTimeInMillis }, { where: { token } });

            res.status(200).json({ message: 'Token expiration updated successfully' });
        } catch (e) {
            console.log(e);
            res.status(400).json({message: 'Login error'});
        }
    }

    async updateUserData(req, res) {
        try {
            const authorizationHeader = req.headers["authorization"];

            if (!authorizationHeader) {
                return res.status(403).json({ message: 'User not authorized, no token, no header' });
            }

            const token = authorizationHeader.split(' ')[1];

            const thisUser = await User.findOne({ where: { token } });

            if (!thisUser) {
                return res.status(400).json({ message: `There's no user with token ${token}` });
            }

            const { username, email, password } = req.body;

            if (username !== undefined && username !== null) {
                thisUser.username = username;
            }

            if (email !== undefined && email !== null) {
                thisUser.email = email;
            }

            if (password !== undefined && password !== null && password !== '') {
                const hashPassword = bcrypt.hashSync(password, 7);
                thisUser.password = hashPassword;
            }

            await thisUser.save();

            return res.status(200).json({ message: 'User updated successfully' });

        } catch (e) {
            console.log(e);
            res.status(400).json({ message: 'Error' });
        }
    }
}

module.exports = new AuthController();