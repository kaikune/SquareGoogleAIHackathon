var express = require('express');
var router = express.Router();
const project = process.env.PROJECT_ID;
const location = process.env.LOCATION;

// Imports images from dataset into ai
async function prepareDataset(datasetId, bucketName) {
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

// res in the form of {datasetId: 'dataset id (number)', bucketName: 'bucket name', modelName: 'model name', pipelineName, 'pipeline name'}
router.post('/', async function (req, res) {
    const datasetId = req.body.datasetId;
    const bucketName = `${project}-${req.body.bucketName}`;
    const modelDisplayName = req.body.modelName;
    const trainingPipelineDisplayName = req.body.pipelineName;

    console.log(`trainModel request recieved: {datasetId: ${datasetId}, bucketName: ${bucketName}, modelName: ${modelDisplayName}, pipelineName: ${trainingPipelineDisplayName}}\n`);

    // Imports the Google Cloud Pipeline Service Client library
    const aiplatform = require('@google-cloud/aiplatform');

    // Get dataset ready for training
    await prepareDataset(datasetId, bucketName);

    const { definition } = aiplatform.protos.google.cloud.aiplatform.v1.schema.trainingjob;
    const ModelType = definition.AutoMlImageClassificationInputs.ModelType;

    // Specifies the location of the api endpoint
    const clientOptions = {
        apiEndpoint: 'us-central1-aiplatform.googleapis.com',
    };

    // Instantiates a client
    const { PipelineServiceClient } = aiplatform.v1;
    const pipelineServiceClient = new PipelineServiceClient(clientOptions);

    async function createTrainingPipelineImageClassification() {
        // Configure the parent resource
        const parent = `projects/${project}/locations/${location}`;

        // Values should match the input expected by your model.
        const trainingTaskInputsMessage = new definition.AutoMlImageClassificationInputs({
            multiLabel: false,
            modelType: ModelType.CLOUD,
            budgetMilliNodeHours: 8 * 1000, // DO NOT GO TOO HIGH
            disableEarlyStopping: false,
        });

        const trainingTaskInputs = trainingTaskInputsMessage.toValue();

        const trainingTaskDefinition = 'gs://google-cloud-aiplatform/schema/trainingjob/definition/automl_image_classification_1.0.0.yaml';

        const modelToUpload = { displayName: modelDisplayName };
        const inputDataConfig = { datasetId };
        const trainingPipeline = {
            displayName: trainingPipelineDisplayName,
            trainingTaskDefinition,
            trainingTaskInputs,
            inputDataConfig,
            modelToUpload,
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

    // Sends the response of the training to the frontend
    res.status(200).json(createTrainingPipelineImageClassification());
});

module.exports = router;
