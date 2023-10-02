import { Component } from 'react';

class Test extends Component {
    componentDidMount() {
        fetch('http://localhost:9000/api/trainModel', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                datasetId: '2964407593298034688', // Needs to be the id of the dataset used. Given when database is created in 'name' field
                bucketName: 'testbucket',
                modelName: 'testmodel',
                pipelineName: 'testpipeline',
            }),
        })
            .then((res) => {
                //console.log(res); // Log the response to verify the request method
                return res.json();
            })
            .then((data) => {
                this.setState({ urls: data });
                console.log(data);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    render() {
        return (
            <div>
                <h1>Test trainModelL</h1>
            </div>
        );
    }
}

export default Test;
