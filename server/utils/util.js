const nanoid = require('../node_modules/nanoid');
const generate = require('../node_modules/nanoid/generate');
module.exports = {
    getRandomId() {
        return generate("1234abcd", 8);
    }
}