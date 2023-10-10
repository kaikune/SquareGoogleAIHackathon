const {products} = require ('./dbCollection.js');
const {ObjectId} = require('mongodb');



const getProductById = async (id) => {
  if (!id) throw 'You must provide an id to search for';
  if (typeof id !== 'string') throw 'Id must be a string';
  if (id.trim().length === 0)
    throw 'Id cannot be an empty string or just spaces';
  id = id.trim();
  if (!ObjectId.isValid(id)) throw 'invalid object ID';
  const productCollection = await products();
  const product = await productCollection.findOne({_id: new ObjectId(id)});
  if (product === null) throw 'No product with that id';
  product._id = product._id.toString();

  return product;
}
const addProduct = async (name, price, datasetID) =>{
  //todo add error checking, willdo onc
  let newProduct = {
    name: name,
    price: price,
    datasetID: datasetID
  };
  const productCollection = await products();
  const insertInfo = await productCollection.insertOne(newProduct);
  if (!insertInfo.acknowledged || !insertInfo.insertedId){
      throw 'Could not add product';
  }
  const newId = insertInfo.insertedId.toString();
  const product = await getProductById(newId);
  console.log(product)

  return product;
}
const updateProduct= async (id, name, price, datasetID)=> {
  const updatedProduct = {
    name: name,
    price: price,
    datasetID: datasetID
  };
  const productCollection = await products();
  const updatedInfo = await ProductCollection.findOneAndUpdate(
    {_id: new ObjectId(id)},
    {$set: updatedProduct},
    {returnDocument: 'after'}
  );
  if (!updatedInfo) {
    throw 'could not update Product successfully';
  }
  updatedInfo._id = updatedInfo._id.toString();
  return updatedInfo;
}
const getAllProducts = async () =>{
  const ProductCollection = await products();
  let productList = await ProductCollection.find({}).toArray();
  if (!productList) throw 'Could not get all Products';
  productList = productList.map((element) => {
    element._id = element._id.toString();
    return element;
  });
  return productList;
}
const removeProduct = async (id) => {
  if (!id) throw 'You must provide an id to search for';
  if (typeof id !== 'string') throw 'Id must be a string';
  if (id.trim().length === 0)
    throw 'id cannot be an empty string or just spaces';
  id = id.trim();
  if (!ObjectId.isValid(id)) throw 'invalid object ID';
  const productCollection = await products();
  const deletionInfo = await productCollection.findOneAndDelete({
    _id: new ObjectId(id)
  });

  if (!deletionInfo) {
    throw `Could not delete Product with id of ${id}`;
  }
  return `${deletionInfo.name} has been deleted.`;
}

module.exports = {getProductById,addProduct,updateProduct,removeProduct,getAllProducts}