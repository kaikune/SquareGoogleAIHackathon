
const { MongoClient} = require('mongodb');

const mongoConfig = {
  serverUrl: 'mongodb+srv://user0:user0pass@test1.zp8ibld.mongodb.net/?retryWrites=true&w=majority',
  database: 'test1'
};
let _connection = undefined;
let _db = undefined;
  
const dbConnection = async () => {
  if (!_connection) {
    
    _connection = await MongoClient.connect(mongoConfig.serverUrl);
    _db = _connection.db(mongoConfig.database);
    console.log("Connected to Database" )
  }

  return _db;
};
const closeConnection = async () => {
  if (_connection) {
    await _connection.close();
    console.log('Database Connection closed');
  }
}; 
module.exports = {dbConnection,closeConnection}