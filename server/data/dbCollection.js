const {dbConnection} = require('./dbConnection');


const getCollectionFn = (collection) => {
  let _col = undefined;

  return async () => {
    if (!_col) {
      const db = await dbConnection();
      _col = await db.collection(collection);
    }

    return _col;
  };
};
const users = getCollectionFn('users');
const models = getCollectionFn('models');
module.exports = { users,models };
