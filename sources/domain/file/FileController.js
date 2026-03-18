const fs = require("fs");
const path = require("path");
const FileManager = require("./FileManager");
const AuthManager = require("../authentification/AuthManager");

const FileType = {
    IMAGE: "image",
    VIDEO: "video"
};

class FileController {

    async getFile(req, res) {
        try {
            const userId = req.query.userId;
            const fileId = req.query.fileId;
            const fileType = req.query.fileType;

            if (!userId) return res.status(400).send("No User ID provided.");
            if (!fileId) return res.status(400).send("No File ID provided.");
            if (!fileType || ![FileType.IMAGE, FileType.VIDEO].includes(fileType)) {
                return res.status(400).send("Wrong or no File Type.");
            }

            console.log(`${userId} ${fileId}`)

            //TODO add logic if more present
            const klass = "Profile"
            const file = await FileManager.getFile(userId, fileId, fileType, klass);

            if (fs.existsSync(file)) {
                const fileBuffer = fs.readFileSync(file);

                res.setHeader('Content-Type', 'application/octet-stream');
                res.setHeader('Content-Disposition', 'attachment; filename=sample.jpg');
                res.send(fileBuffer);
            } else {
                res.status(404).send("File not found.");
            }
        } catch (err) {
            res.status(500).send("Internal Server Error");
        }
    };

    async postFile(req, res) {
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

            const userId = req.query.userId;
            const fileId = req.query.fileId;
            const fileType = req.query.fileType;

            if (!userId) return res.status(400).send("No User ID provided.");
            if (!fileId) return res.status(400).send("No File ID provided.");
            if (!fileType || ![FileType.IMAGE, FileType.VIDEO].includes(fileType))
                return res.status(400).send("Wrong or no File Type.");

            const file = req.file;
            const fileBytes = file.buffer;
            const maxSize = fileType === FileType.IMAGE ? 10 * 1024 * 1024 : 20 * 1024 * 1024;

            if (fileBytes.length > maxSize) {
                return res.status(406).send("File size must be under 5 MB.");
            }

            //TODO add logic if more present
            const klass = "Profile"
            const result = await FileManager.saveFile(userId, fileId, fileType, fileBytes, klass);

            if (!result) return res.status(500).send("Failed to save file.");

            res.sendStatus(200);
        } catch (err) {
            console.log(err)
            res.status(500).send("Internal Server Error");
        }
    };

    async deleteFile(req, res) {
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

            const userId = req.query.userId;
            const fileId = req.query.fileId;
            const fileType = req.query.fileType;

            if (!userId) return res.status(400).send("No User ID provided.");
            if (!fileId) return res.status(400).send("No File ID provided.");
            if (!fileType || ![FileType.IMAGE, FileType.VIDEO].includes(fileType))
                return res.status(400).send("Wrong or no File Type.");

            //TODO add logic if more present
            const klass = "Profile"

            const result = await FileManager.deleteFile(userId, fileId, fileType, klass);

            if (!result) return res.status(500).send("Failed to delete file.");

            res.sendStatus(200);
        } catch (err) {
            res.status(500).send("Internal Server Error");
        }
    };

}

module.exports = new FileController();