const fs = require('fs');
const path = require('path');

const DATA_DIR = path.resolve(__dirname, '../../data');

function getFilePath(filename) {
    return path.join(DATA_DIR, filename);
}

function readData(filename) {
    const filePath = getFilePath(filename);
    try {
        if (!fs.existsSync(filePath)) {
            return [];
        }
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error reading ${filename}:`, error.message);
        return [];
    }
}

function writeData(filename, data) {
    const filePath = getFilePath(filename);
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
        return true;
    } catch (error) {
        console.error(`Error writing ${filename}:`, error.message);
        return false;
    }
}

module.exports = {
    readData,
    writeData
};
