let config = require('../config');
let db = require('../db/db');
let account = require('./account')

db.init(config.db);

account.start(config.account);