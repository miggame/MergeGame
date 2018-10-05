let config = require('../config');
let db = require('../db/db');
let account = require('./account')
let gameData = require('../gameData/gameData')
db.init(config.db);
gameData.initGameData();
account.start(config.account);