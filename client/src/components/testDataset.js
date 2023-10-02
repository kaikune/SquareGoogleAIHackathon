import { Component } from 'react';

class Test extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [],
        };
    }

    componentDidMount() {
        fetch('http://localhost:9000/api/createDataset', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                bucketName: 'testbucket',
                datasetName: 'testdataset',
            }),
        })
            .then((res) => {
                console.log(res); // Log the response to verify the request method
                return res.json();
            })
            .then((data) => {
                console.log(data);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    render() {
        return (
            <div>
                <h1>Test createDataset</h1>
            </div>
        );
    }
}

export default Test;
