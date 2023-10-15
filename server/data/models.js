const { models } = require('./dbCollection.js');
const { ObjectId } = require('mongodb');

const getModelById = async (id) => {
    if (!id) throw 'You must provide an id to search for';
    if (typeof id !== 'string') throw 'Id must be a string';
    if (id.trim().length === 0) throw 'Id cannot be an empty string or just spaces';
    id = id.trim();
    if (!ObjectId.isValid(id)) throw 'invalid object ID';
    const modelCollection = await models();
    const model = await modelCollection.findOne({ _id: new ObjectId(id) });
    if (model === null) throw 'No model with that id';
    model._id = model._id.toString();

    return model;
};
const addModel = async (modelID, artifactOutputUri) => {
    if (!modelID || !artifactOutputUri) {
        throw 'addModel missing parameter';
    }
    if (isNaN(modelID)) {
        throw 'addModel modelID must be int';
    }
    if (typeof artifactOutputUri !== 'string') {
        throw 'addModel artifactOutputUri must be a string';
    }
    artifactOutputUri = artifactOutputUri.trim();
    if (artifactOutputUri.length === 0) {
        throw 'addModel artifactOutputUri must be a string';
    }
    let newModel = {
        modelID: modelID,
        artifactOutputUri: artifactOutputUri,
    };
    const modelCollection = await models();
    const insertInfo = await modelCollection.insertOne(newModel);
    if (!insertInfo.acknowledged || !insertInfo.insertedId) {
        throw 'Could not add model';
    }
    const newId = insertInfo.insertedId.toString();
    const model = await getModelById(newId);
    console.log(model);

    return model;
};
const updateModel = async (id, modelID, artifactOutputUri) => {
    if (!id) throw 'You must provide an id to search for';
    if (typeof id !== 'string') {
        throw 'Id must be a string';
    }
    if (id.trim().length === 0) {
        throw 'id cannot be an empty string or just spaces';
    }
    id = id.trim();
    if (!ObjectId.isValid(id)) {
        throw 'invalid object ID';
    }
    if (!modelID || !artifactOutputUri) {
        throw 'addModel missing parameter';
    }
    if (isNaN(modelID)) {
        throw 'addModel modelID must be int';
    }
    if (typeof artifactOutputUri !== 'string') {
        throw 'addModel artifactOutputUri must be a string';
    }
    artifactOutputUri = artifactOutputUri.trim();
    if (artifactOutputUri.length === 0) {
        throw 'addModel artifactOutputUri must be a string';
    }
    const updatedModel = {
        modelID: modelID,
        artifactOutputUri: artifactOutputUri,
    };
    const modelCollection = await models();
    const updatedInfo = await modelCollection.findOneAndUpdate({ _id: new ObjectId(id) }, { $set: updatedModel }, { returnDocument: 'after' });
    if (!updatedInfo) {
        throw 'could not update Model successfully';
    }
    updatedInfo._id = updatedInfo._id.toString();
    return updatedInfo;
};
const getAllModels = async () => {
    const modelCollection = await models();
    let modelList = await modelCollection.find({}).toArray();
    if (!modelList) throw 'Could not get all Models';
    modelList = modelList.map((element) => {
        element._id = element._id.toString();
        return element;
    });
    return modelList;
};
const removeModel = async (id) => {
    if (!id) throw 'You must provide an id to search for';
    if (typeof id !== 'string') throw 'Id must be a string';
    if (id.trim().length === 0) throw 'id cannot be an empty string or just spaces';
    id = id.trim();
    if (!ObjectId.isValid(id)) throw 'invalid object ID';
    const modelCollection = await models();
    const deletionInfo = await modelCollection.findOneAndDelete({
        _id: new ObjectId(id),
    });

    if (!deletionInfo) {
        throw `Could not delete Model with id of ${id}`;
    }
    return `${deletionInfo.name} has been deleted.`;
};

module.exports = { getModelById, addModel, updateModel, removeModel, getAllModels };
