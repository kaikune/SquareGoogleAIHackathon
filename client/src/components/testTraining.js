import { Component } from 'react';

class Test extends Component {
    constructor(props) {
        super(props);
        this.state = {
            urls: [],
        };
    }

    componentDidMount() {
        fetch('http://localhost:9000/api/trainModel', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                bucketName: 'testbucket',
                label: 'testproduct',
                fileName: 'thing.jpeg',
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
                <h1>Test getSignedURL</h1>
                <ul>
                    {this.state.urls.map((url, index) => (
                        <li key={index}>{url}</li>
                    ))}
                </ul>
            </div>
        );
    }
}

export default Test;
