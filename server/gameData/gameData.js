let fs = require('fs');
let path = require('path')
let dayjs = require('../node_modules/dayjs')
let jsonFilePath = path.join(__dirname, '../json/boatData.json');

module.exports = {
    readJsonFile(filePath) {
        let jsonData = null;
        if (filePath === undefined) {
            jsonData = fs.readFileSync(jsonFilePath, 'utf-8');
        } else {
            jsonData = fs.readFileSync(filePath);
        }
        return jsonData;
    },
    data: null,
    initGameData() {
        this.data = JSON.parse(this.readJsonFile());
    },
}