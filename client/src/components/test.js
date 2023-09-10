import { Component } from "react";

class Test extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: []
        }
    }

    componentDidMount() {
        fetch('/testServer')
            .then(res => res.json())
            .then(users => {
                console.log(users)
                this.setState({ users: users })
            });
    }

    render() {
        return(
            <div>
            <h1>
                hello world
            </h1>
            <ul> 
                {
                    this.state.users.forEach(user => {
                        <li>
                            message {user.test}
                        </li>
                    }
                    )
                }
            </ul>
            </div>

        );
    }
}

export default Test;