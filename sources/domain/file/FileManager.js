const fs = require('fs');
const path = require('path');
const {v4: uuidv4} = require('uuid');

const File = require('../../model/dataModels/File');
const ProfileFile = require('../../model/dataModels/ProfileFile');

const FILE_ROOT_PATH = "C:\\HealthyFiles";

const PROFILE_FILE_TYPE = "Profile"

const fileExtensions = {
    "image": '.jpg',
    "video": '.mp4'
};

function smallHash(str) {
    return require('crypto').createHash('md5').update(str).digest('hex').substring(0, 8);
}

function getDirPath(userId, klass) {
    const userHash = smallHash(userId);
    if (klass === PROFILE_FILE_TYPE) {
        return path.join(FILE_ROOT_PATH, `user_${userHash}`, 'profile');
    }
    return FILE_ROOT_PATH;
}

async function saveFile(userId, fileId, type, buffer, klass) {
    try {
        const dirPath = getDirPath(userId, klass);
        fs.mkdirSync(dirPath, { recursive: true });

        const extension = fileExtensions[type] || '.txt';
        const filePath = path.join(dirPath, `${fileId}${extension}`);
        fs.writeFileSync(filePath, buffer);

        const existing = await File.findByPk(fileId);
        if (existing) {
            await File.update({ type }, { where: { id: fileId } });
        } else {
            await File.create({ id: fileId, type });

            if (klass === PROFILE_FILE_TYPE) {
                await ProfileFile.create({ id: uuidv4(), userId: userId, fileId: fileId })
            }
        }

        return true;
    } catch (err) {
        console.error(err);
        return false;
    }
}

async function getFile(userId, fileId, type, klass) {
    try {
        const fileRecord = await File.findByPk(fileId);
        if (!fileRecord) return null;

        const dirPath = getDirPath(userId, klass);
        fs.mkdirSync(dirPath, { recursive: true });

        const extension = fileExtensions[type] || '.txt';
        const filePath = path.join(dirPath, `${fileId}${extension}`);
        return fs.existsSync(filePath) ? filePath : null;
    } catch (err) {
        console.error(err);
        return null;
    }
}

async function deleteFile(userId, fileId, type, klass) {
    try {
        const dirPath = getDirPath(userId, klass);
        const extension = fileExtensions[type] || '.txt';
        const filePath = path.join(dirPath, `${fileId}${extension}`);

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        await File.destroy({ where: { id: fileId } });

        if (klass === PROFILE_FILE_TYPE) {
            await ProfileFile.destroy({ where: { fileId } })
        }

        return true;
    } catch (err) {
        console.error(err);
        return false;
    }
}

module.exports = {
    saveFile,
    getFile,
    deleteFile
};