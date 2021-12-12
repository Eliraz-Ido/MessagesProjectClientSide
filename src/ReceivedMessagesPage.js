import './App.css';
import React from "react";
import Cookies from "universal-cookie/lib";
import axios from "axios";
import MessageComponent from "./MessageComponent";

class ReceivedMessagesPage extends React.Component {
    state = {
        token: "",
        receivedMessages: []
    }

    componentWillMount() {
        this.getReceivedMessages();
        const cookies = new Cookies();
        this.setState({
            token: cookies.get("myWebsiteToken")
        })
    }

    getReceivedMessages = () => {
        const cookies = new Cookies();
        axios.get("http://localhost:8989/get-received-messages", {
            params: {
                token: cookies.get("myWebsiteToken")
            }
        })
            .then((response) => {
                this.setState({
                    receivedMessages: response.data
                })
            })
    }

    deleteMessage = (id) => {
        const cookies = new Cookies();
        axios.get("http://localhost:8989/delete-message", {
            params: {
                messageId: id,
                token: cookies.get("myWebsiteToken")
            }
        })
            .then(() => {
                this.getReceivedMessages()
            })
    }

    readMessage = (id) => {
        const cookies = new Cookies();
        axios.get("http://localhost:8989/read-message", {
            params: {
                messageId: id,
                token: cookies.get("myWebsiteToken")
            }
        })
            .then(() => {
                this.getReceivedMessages()
            })
    }


    render() {
        return (
            <div>
                <div>Messages that was sent to you</div><br/>
                {
                    this.state.receivedMessages.length !== 0 ?
                        this.state.receivedMessages.map((object) => {
                            return(
                           <MessageComponent message={object}
                                             delete={this.deleteMessage}
                                             readMessage={this.readMessage}/>
                            );
                        })
                        :
                        <div>
                            There are no messages for you:(
                        </div>
                }
            </div>
        );
    }
}
export default ReceivedMessagesPage;