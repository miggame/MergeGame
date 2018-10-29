const DB_HOST = '127.0.0.1';
const DB_PORT = 27017;
const DB_NAME = 'mergeGame';

const ACCOUNT_HOST = '192.168.1.114';
const ACCOUNT_PORT = 9001;


module.exports = {
    db: {
        host: DB_HOST,
        port: DB_PORT,
        dbName: DB_NAME
    },
    account: {
        host: ACCOUNT_HOST,
        port: ACCOUNT_PORT
    }

}