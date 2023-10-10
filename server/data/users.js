const {users} = require ('./dbCollection.js');
const {ObjectId} = require('mongodb');



const getUserById = async (id) => {
  if (!id) throw 'You must provide an id to search for';
  if (typeof id !== 'string') throw 'Id must be a string';
  if (id.trim().length === 0)
    throw 'Id cannot be an empty string or just spaces';
  id = id.trim();
  if (!ObjectId.isValid(id)) throw 'invalid object ID';
  const userCollection = await users();
  const user = await userCollection.findOne({_id: new ObjectId(id)});
  if (user === null) throw 'No User with that id';
  user._id = user._id.toString();

  return user;
}
const addUser = async (name, sqaureID) =>{
  //todo add error checking, willdo onc
  let newUser = {
    name: name,
    sqaureID: sqaureID
  };
  const UserCollection = await users();
  const insertInfo = await UserCollection.insertOne(newUser);
  if (!insertInfo.acknowledged || !insertInfo.insertedId){
      throw 'Could not add User';
  }
  const newId = insertInfo.insertedId.toString();
  const user = await getUserById(newId);
  console.log(user)

  return user;
}
const updateUser= async (id, name, sqaureID)=> {
  const updatedUser = {
    name: name,
    sqaureID: sqaureID
  };
  const userCollection = await users();
  const updatedInfo = await userCollection.findOneAndUpdate(
    {_id: new ObjectId(id)},
    {$set: updatedUser},
    {returnDocument: 'after'}
  );
  if (!updatedInfo) {
    throw 'could not update User successfully';
  }
  updatedInfo._id = updatedInfo._id.toString();
  return updatedInfo;
}
const getAllUsers = async () =>{
  const UserCollection = await users();
  let userList = await UserCollection.find({}).toArray();
  if (!userList) throw 'Could not get all Users';
  userList = userList.map((element) => {
    element._id = element._id.toString();
    return element;
  });
  return userList;
}
const removeUser = async (id) => {
  if (!id) throw 'You must provide an id to search for';
  if (typeof id !== 'string') throw 'Id must be a string';
  if (id.trim().length === 0)
    throw 'id cannot be an empty string or just spaces';
  id = id.trim();
  if (!ObjectId.isValid(id)) throw 'invalid object ID';
  const userCollection = await users();
  const deletionInfo = await userCollection.findOneAndDelete({
    _id: new ObjectId(id)
  });

  if (!deletionInfo) {
    throw `Could not delete User with id of ${id}`;
  }
  return `${deletionInfo.name} has been deleted.`;
}

module.exports = {getUserById,addUser,updateUser,removeUser,getAllUsers}