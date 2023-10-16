var express = require('express');
var router = express.Router();

// Imports images from dataset into ai
async function prepareDataset(datasetId, bucketName) {
    const project = process.env.PROJECT_ID;
    const location = process.env.LOCATION;
    console.log('Importing dataset from storage...');
    const { DatasetServiceClient } = require('@google-cloud/aiplatform'); //.v1beta1
    const aiplatformClient = new DatasetServiceClient({
        projectId: project,
        keyFilename: process.env.SECRET_KEY,
        apiEndpoint: 'us-central1-aiplatform.googleapis.com',
    });

    const name = aiplatformClient.datasetPath(project, location, datasetId);

    //console.log(name);

    async function callImportData() {
        // Contruct importConfigs
        const importConfigs = [
            {
                gcsSource: { uris: [`gs://${bucketName}/images.csv`] }, // Hopefully this imports everything correctly
                importSchemaUri: 'gs://google-cloud-aiplatform/schema/dataset/ioformat/image_classification_single_label_io_format_1.0.0.yaml',
            },
        ];

        // Construct request
        const request = {
            name,
            importConfigs,
        };

        // Run request
        const [operation] = await aiplatformClient.importData(request);
        //TODO: Add code to get progress % with operation.metadata
        const [response] = await operation.promise();
        console.log(response);
    }

    await callImportData();
}

async function exportModel(bucketName, modelId) {
    const project = process.env.PROJECT_ID;
    const location = process.env.LOCATION;
    console.log('Exporting model');

    // Imports the Google Cloud Model Service Client library
    const { ModelServiceClient } = require('@google-cloud/aiplatform');

    // Specifies the location of the api endpoint
    const clientOptions = {
        projectId: project,
        keyFilename: process.env.SECRET_KEY,
        apiEndpoint: 'us-central1-aiplatform.googleapis.com',
    };

    // Instantiates a client
    const modelServiceClient = new ModelServiceClient(clientOptions);

    // Configure the name resources
    const name = `projects/${project}/locations/${location}/models/abcd${modelId}`;
    // Configure the outputConfig resources
    const outputConfig = {
        exportFormatId: 'tf-js',
        artifactDestination: {
            outputUriPrefix: `gs://${bucketName}/models`,
        },
    };
    const request = {
        name,
        outputConfig,
    };

    // Export Model request
    const [response] = await modelServiceClient.exportModel(request);
    console.log(`Long running operation : ${response.name}`);
    console.log(response);

    // Wait for operation to complete
    await response.promise();
    return response;
}

// res in the form of {datasetId: 'dataset id (number)', bucketName: 'bucket name', modelName: 'model name', pipelineName, 'pipeline name'}
router.post('/', async function (req, res) {
    const project = process.env.PROJECT_ID;
    const location = process.env.LOCATION;
    const datasetId = req.body.datasetId;
    const bucketName = `${project}-${req.body.bucketName}`;
    const modelDisplayName = req.body.modelName;
    const trainingPipelineDisplayName = req.body.pipelineName;

    console.log(
        `trainModel request recieved: {datasetId: ${datasetId}, bucketName: ${bucketName}, modelName: ${modelDisplayName}, pipelineName: ${trainingPipelineDisplayName}}\n`
    );

    // Imports the Google Cloud Pipeline Service Client library
    const aiplatform = require('@google-cloud/aiplatform');

    const { definition } = aiplatform.protos.google.cloud.aiplatform.v1.schema.trainingjob;
    const ModelType = definition.AutoMlImageClassificationInputs.ModelType;

    // Specifies the location of the api endpoint
    const clientOptions = {
        projectId: project,
        keyFilename: process.env.SECRET_KEY,
        apiEndpoint: 'us-central1-aiplatform.googleapis.com',
    };

    // Instantiates a client
    const { PipelineServiceClient } = aiplatform.v1;
    const pipelineServiceClient = new PipelineServiceClient(clientOptions);

    async function createTrainingPipelineImageClassification() {
        // Configure the parent resource
        const parent = `projects/${project}/locations/${location}`;

        // Instantiates training params
        const trainingTaskInputsMessage = new definition.AutoMlImageClassificationInputs({
            multiLabel: false,
            modelType: ModelType.MOBILE_TF_LOW_LATENCY_1,
            budgetMilliNodeHours: 2 * 1000, // 2 Hours DO NOT GO TOO HIGH
            disableEarlyStopping: false,
        });

        const trainingTaskInputs = trainingTaskInputsMessage.toValue();

        const trainingTaskDefinition = 'gs://google-cloud-aiplatform/schema/trainingjob/definition/automl_image_classification_1.0.0.yaml';

        const modelToUpload = { displayName: 'wp' };
        const inputDataConfig = { datasetId };
        const trainingPipeline = {
            displayName: 'wmo',
            trainingTaskDefinition,
            trainingTaskInputs,
            inputDataConfig,
            modelToUpload,
            modelId: 'we',
        };
        const request = { parent, trainingPipeline };

        console.log('Creating training pipeling request...');

        // Create training pipeline request
        const [response] = await pipelineServiceClient.createTrainingPipeline(request);

        console.log('Create training pipeline image classification response');
        console.log(`Name : ${response.name}`);
        console.log('Raw response:');
        console.log(JSON.stringify(response, null, 2));

        return response;
    }

    // Get dataset ready for training
    try {
        await prepareDataset(datasetId, bucketName);

        // Wait for model to be created
        const modelResponse = await createTrainingPipelineImageClassification(); // COMMENT OUT UNLESS ACTUALLY TRAINING MODEL

        // Export model
        const exportResponse = await exportModel(bucketName, modelResponse.modelId);
        //const exportResponse = await exportModel(bucketName, '6898483287224745984'); //DEBUG

        //console.log(exportResponse);

        // Storage is in exportResponse.metadata.outputInfo.artifactOutputUri

        // Sends the response of the training to the frontend
        // TODO: Save model uri to database
        res.status(200).json(exportResponse.metadata.outputInfo.artifactOutputUri);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

module.exports = router;
