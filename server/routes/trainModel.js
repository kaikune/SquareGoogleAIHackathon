var express = require('express');
var router = express.Router();
const project = process.env.PROJECT_ID;
const location = process.env.LOCATION;

// Imports images from dataset into ai
function prepareDataset(dataset, bucketName) {
    console.log('Importing dataset from storage...');
    const { DatasetServiceClient } = require('@google-cloud/aiplatform'); //.v1beta1
    const aiplatformClient = new DatasetServiceClient();
    const parent = `projects/${project}/locations/${location}/datasets/${dataset}`;

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
            parent,
            importConfigs,
        };

        // Run request
        const [operation] = await aiplatformClient.importData(request);
        const [response] = await operation.promise();
        console.log(response);
    }

    callImportData();
}

// res in the form of {datasetName: 'dataset name', modelName: 'model name', pipelineName, 'pipeline name'}
router.get('/', function (req, res) {
    const datasetId = req.datasetName;
    const modelDisplayName = req.modelName;
    const trainingPipelineDisplayName = res.pipelineName;

    // Imports the Google Cloud Pipeline Service Client library
    const aiplatform = require('@google-cloud/aiplatform');

    // Get dataset ready for training
    prepareDataset(datasetName);

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
            multiLabel: true,
            modelType: ModelType.CLOUD,
            budgetMilliNodeHours: 8000,
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

        // Create training pipeline request
        const [response] = await pipelineServiceClient.createTrainingPipeline(request);

        console.log('Create training pipeline image classification response');
        console.log(`Name : ${response.name}`);
        console.log('Raw response:');
        console.log(JSON.stringify(response, null, 2));

        return response;
    }

    // Sends the response of the training to the frontend
    res.json(createTrainingPipelineImageClassification());
});

module.exports = router;
